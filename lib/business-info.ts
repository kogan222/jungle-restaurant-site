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
  opens: string;   // 24 h "HH:MM"
  closes: string;
};

export const HOURS: DayHours[] = [
  { day: "Monday",    opens: "12:00", closes: "22:00" },
  { day: "Tuesday",   opens: "12:00", closes: "22:00" },
  { day: "Wednesday", opens: "12:00", closes: "22:00" },
  { day: "Thursday",  opens: "12:00", closes: "23:00" },
  { day: "Friday",    opens: "12:00", closes: "23:00" },
  { day: "Saturday",  opens: "11:00", closes: "23:00" },
  { day: "Sunday",    opens: "11:00", closes: "22:00" },
];

/** "12:00 pm – 10:00 pm" style label for display */
export function formatHours(h: DayHours): string {
  const fmt = (t: string) => {
    const [hh, mm] = t.split(":").map(Number);
    const am = hh < 12;
    const h12 = hh % 12 === 0 ? 12 : hh % 12;
    return `${h12}:${String(mm).padStart(2, "0")} ${am ? "am" : "pm"}`;
  };
  return `${fmt(h.opens)} – ${fmt(h.closes)}`;
}

/* Google Business Profile — public links (no API needed) */
export const GOOGLE_REVIEW_URL =
  "https://search.google.com/local/writereview?placeid=" +
  (process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ?? "");
export const GOOGLE_PROFILE_SEARCH =
  "https://www.google.com/maps/search/The+Jungle+Wey+Avenida+Paseo+del+Puerto+1127+Mahahual+Quintana+Roo";

/* Shape served by /api/google-business */
export type GoogleBusinessData = {
  source: "google" | "fallback";
  rating?: number;
  totalRatings?: number;
  hours?: DayHours[];
  reviews?: { author: string; rating: number; text: string; time: string }[];
};
