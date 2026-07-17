import { NextResponse } from "next/server";
import { HOURS, type DayHours, type GoogleBusinessData } from "@/lib/business-info";

/*
  Lightweight Google Business bridge.

  With env vars set (see docs/INTEGRATIONS.md):
    GOOGLE_PLACES_API_KEY — Places API (New) key, billing enabled
    GOOGLE_PLACE_ID       — the restaurant's Place ID
  this returns live opening hours + rating + reviews from the
  Google Business Profile, cached for 6 hours.

  Without them it returns the static fallback from lib/business-info,
  so the site never breaks and needs zero configuration to run.
*/

export const revalidate = 21600; // 6 h — hours/reviews rarely change faster

const DAY_NAMES: DayHours["day"][] = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

export async function GET() {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  const fallback: GoogleBusinessData = { source: "fallback", hours: HOURS };

  if (!key || !placeId) {
    return NextResponse.json(fallback);
  }

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask":
            "rating,userRatingCount,regularOpeningHours,reviews",
        },
        next: { revalidate: 21600 },
      }
    );
    if (!res.ok) throw new Error(`Places API ${res.status}`);
    const data = await res.json();

    /* Build a full 7-day week: days without a Google period are closed days. */
    let hours: DayHours[] | undefined;
    if (data.regularOpeningHours?.periods) {
      const pad = (n: number) => String(n).padStart(2, "0");
      const byDay = new Map<string, DayHours>();
      for (const p of data.regularOpeningHours.periods as {
        open?: { day: number; hour: number; minute: number };
        close?: { day: number; hour: number; minute: number };
      }[]) {
        if (!p.open || !p.close) continue;
        byDay.set(DAY_NAMES[p.open.day], {
          day: DAY_NAMES[p.open.day],
          opens: `${pad(p.open.hour)}:${pad(p.open.minute)}`,
          closes: `${pad(p.close.hour)}:${pad(p.close.minute)}`,
        });
      }
      /* Week ordered Monday-first, matching the fallback and the UI */
      const week: DayHours["day"][] = [
        "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",
      ];
      hours = week.map((day) => byDay.get(day) ?? { day, closed: true });
    }

    const payload: GoogleBusinessData = {
      source: "google",
      rating: data.rating,
      totalRatings: data.userRatingCount,
      hours: hours && hours.length > 0 ? hours : HOURS,
      reviews: (data.reviews ?? [])
        .slice(0, 5)
        .map((r: { authorAttribution?: { displayName?: string }; rating?: number; text?: { text?: string }; relativePublishTimeDescription?: string }) => ({
          author: r.authorAttribution?.displayName ?? "Google user",
          rating: r.rating ?? 5,
          text: r.text?.text ?? "",
          time: r.relativePublishTimeDescription ?? "",
        })),
    };
    return NextResponse.json(payload);
  } catch {
    // Never break the site because of a third-party hiccup
    return NextResponse.json(fallback);
  }
}
