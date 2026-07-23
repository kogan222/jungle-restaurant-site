import { NextResponse } from "next/server";
import { HOURS, type DayHours, type GoogleBusinessData, type GoogleReview } from "@/lib/business-info";

/*
  Google Business bridge — Places API (New), server-only.

  Required env vars (see docs/INTEGRATIONS.md for exact values):
    GOOGLE_PLACES_API_KEY — Places API (New) key, billing enabled
    GOOGLE_PLACE_ID       — the restaurant's Place ID
  Neither is ever hardcoded in source; both are read from
  process.env only, on the server, inside this Route Handler.
  Route Handlers are never bundled into client JS, so the API key can
  never reach the browser.

  Caching: `revalidate` below (Next.js Data Cache) + the matching
  `next: { revalidate }` on the fetch mean ONE shared server-side cache
  entry is reused for every visitor for 7 days — Google is called at
  most once per week, never per request/visitor.

  Failure handling: missing key/place id, non-2xx responses, network
  timeouts, and malformed bodies all fall through to the same static
  fallback below — the site (and this route) never breaks.
*/

export const revalidate = 604800; // 7 days

const SEVEN_DAYS_SECONDS = 604800;
const FETCH_TIMEOUT_MS = 8000;

/* Precise field mask — only what the UI actually renders. No wildcards. */
const FIELD_MASK = [
  "rating",
  "userRatingCount",
  "googleMapsUri",
  "regularOpeningHours",
  "reviews.rating",
  "reviews.text",
  "reviews.relativePublishTimeDescription",
  "reviews.authorAttribution",
].join(",");

const DAY_NAMES: DayHours["day"][] = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

type PlacesApiPeriod = {
  open?: { day: number; hour: number; minute: number };
  close?: { day: number; hour: number; minute: number };
};

type PlacesApiReview = {
  rating?: number;
  text?: { text?: string };
  relativePublishTimeDescription?: string;
  authorAttribution?: { displayName?: string; photoUri?: string };
};

type PlacesApiResponse = {
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  regularOpeningHours?: { periods?: PlacesApiPeriod[] };
  reviews?: PlacesApiReview[];
};

/** Full Monday-first week; days with no Google period are closed. */
function buildWeekHours(periods: PlacesApiPeriod[] | undefined): DayHours[] {
  const pad = (n: number) => String(n).padStart(2, "0");
  const byDay = new Map<string, DayHours>();
  for (const p of periods ?? []) {
    if (!p.open || !p.close) continue;
    const day = DAY_NAMES[p.open.day];
    byDay.set(day, {
      day,
      opens: `${pad(p.open.hour)}:${pad(p.open.minute)}`,
      closes: `${pad(p.close.hour)}:${pad(p.close.minute)}`,
    });
  }
  const week: DayHours["day"][] = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
  ];
  return week.map((day) => byDay.get(day) ?? { day, closed: true });
}

function mapReviews(reviews: PlacesApiReview[] | undefined): GoogleReview[] {
  return (reviews ?? [])
    .filter((r): r is PlacesApiReview & { text: { text: string } } => Boolean(r.text?.text))
    .slice(0, 5)
    .map((r) => ({
      author: r.authorAttribution?.displayName ?? "Google user",
      authorPhotoUrl: r.authorAttribution?.photoUri,
      rating: typeof r.rating === "number" ? r.rating : 5,
      text: r.text.text,
      relativeTime: r.relativePublishTimeDescription,
    }));
}

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  /* Review CTAs only need the (non-secret) Place ID, not the API key —
     build them whenever it's configured, live data or not, so the
     buttons work even before billing/API key setup is finished. */
  const writeReviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : undefined;
  const fallbackMapsUri = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : undefined;

  const fallback: GoogleBusinessData = {
    source: "fallback",
    hours: HOURS,
    writeReviewUrl,
    mapsUri: fallbackMapsUri,
  };

  if (!key || !placeId) {
    return NextResponse.json(fallback);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask": FIELD_MASK,
      },
      signal: controller.signal,
      next: { revalidate: SEVEN_DAYS_SECONDS },
    });

    // Invalid key, invalid place id, billing errors, rate limits — all non-2xx
    if (!res.ok) throw new Error(`Places API responded ${res.status}`);

    const data = (await res.json()) as PlacesApiResponse;

    const hours = buildWeekHours(data.regularOpeningHours?.periods);

    const payload: GoogleBusinessData = {
      source: "google",
      rating: typeof data.rating === "number" ? data.rating : undefined,
      totalRatings: typeof data.userRatingCount === "number" ? data.userRatingCount : undefined,
      hours: hours.length > 0 ? hours : HOURS,
      reviews: mapReviews(data.reviews),
      mapsUri: data.googleMapsUri ?? fallbackMapsUri,
      writeReviewUrl,
    };
    return NextResponse.json(payload);
  } catch {
    // Timeout (AbortError), network failure, non-2xx, or malformed JSON —
    // never break the page because of a third-party hiccup.
    return NextResponse.json(fallback);
  } finally {
    clearTimeout(timeout);
  }
}
