/* ════════════════════════════════════════════════════════
   THE JUNGLE WEY — Business info (single source of truth)

   Opening hours strategy (see docs/INTEGRATIONS.md):
   · These static hours are the guaranteed fallback, used for
     the Contact section AND the JSON-LD structured data.
   · When GOOGLE_PLACES_API_KEY (+ GOOGLE_PLACE_ID) are set,
     /api/google-business serves live hours + reviews from the
     Google Business Profile, and the Contact section upgrades
     itself automatically. Update hours in ONE place: Google.
════════════════════════════════════════════════════════ */

export type DayHours = {
  day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
  opens?: string;   // 24 h "HH:MM" — absent when closed
  closes?: string;
  closed?: boolean;
};

/* Current hours per the Google Business / WhatsApp Business profile
   (updated 2026-07-17): open daily 08:00–23:00, closed on Mondays. */
export const HOURS: DayHours[] = [
  { day: "Monday",    closed: true },
  { day: "Tuesday",   opens: "08:00", closes: "23:00" },
  { day: "Wednesday", opens: "08:00", closes: "23:00" },
  { day: "Thursday",  opens: "08:00", closes: "23:00" },
  { day: "Friday",    opens: "08:00", closes: "23:00" },
  { day: "Saturday",  opens: "08:00", closes: "23:00" },
  { day: "Sunday",    opens: "08:00", closes: "23:00" },
];

/** "8:00 am – 11:00 pm" style label for display; null when closed */
export function formatHours(h: DayHours): string | null {
  if (h.closed || !h.opens || !h.closes) return null;
  const fmt = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    const am = hh < 12;
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${String(mm).padStart(2, "0")} ${am ? "am" : "pm"}`;
  };
  return `${fmt(h.opens)} – ${fmt(h.closes)}`;
}

/* Google Business Profile — the Place ID lives ONLY in the
   GOOGLE_PLACE_ID environment variable (read server-side in
   app/api/google-business/route.ts), never hardcoded in source.
   See docs/INTEGRATIONS.md for the exact value to set. */

/** One review as shaped for the UI by /api/google-business. */
export type GoogleReview = {
  author: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativeTime?: string;
};

/* Shape served by /api/google-business */
export type GoogleBusinessData = {
  source: "google" | "fallback";
  rating?: number;
  totalRatings?: number;
  hours?: DayHours[];
  reviews?: GoogleReview[];
  /** "Read All Reviews" — Google's own googleMapsUri when live, else a
      generic profile link built server-side from the configured Place ID. */
  mapsUri?: string;
  /** "Leave a Review" deep link, built server-side from the configured
      Place ID. Present whenever GOOGLE_PLACE_ID is set, live or not. */
  writeReviewUrl?: string;
};
