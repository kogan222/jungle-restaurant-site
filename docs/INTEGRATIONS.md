# Integrations — Setup & Trade-offs

All third-party integrations are **env-driven with graceful fallbacks**: the site
runs perfectly with zero configuration, and upgrades itself when the client
provides credentials. No code changes needed.

Create a `.env.local` (or set the vars in Vercel → Project → Settings → Environment Variables):

```bash
# ── Google Business (hours + reviews) ─────────────────────
GOOGLE_PLACES_API_KEY=...                    # Places API (New) key, billing enabled
GOOGLE_PLACE_ID=ChIJAV5TM8snW48RhSLmezfw1ME  # The Jungle Wey — verified 2026-07-20

# ── Instagram feed ────────────────────────────────────────
NEXT_PUBLIC_INSTAGRAM_FEED_URL=https://feeds.behold.so/XXXXXXXX
```

Both Google vars are **server-only** (no `NEXT_PUBLIC_` prefix) — set them in
Vercel → Project → Settings → **Environment Variables**, not in any
client-reachable config. Neither is hardcoded anywhere in the source.

The Jungle Tribe form (`/tribe`) is a native form built into the site — see §3.
It needs no env var; it needs a submission-storage backend, described below.

---

## 1. Google Business — opening hours & reviews (Places API (New))

**Architecture — server-only, env-only, no hardcoded secrets or IDs.**
`app/api/google-business/route.ts` is a Next.js Route Handler (App Router).
Route Handlers run exclusively on the server and are never bundled into
client JS, so this is the only place either Google value is read:

```ts
const key     = process.env.GOOGLE_PLACES_API_KEY;
const placeId = process.env.GOOGLE_PLACE_ID;
```

Neither value appears anywhere else in the source. The real Place ID
(`ChIJAV5TM8snW48RhSLmezfw1ME`) was found via a live Places API "Find Place"
lookup and verified by matching the exact business name ("THE JUNGLE WEY"),
exact address (Av. P.º del Puerto 1127, Mahahual), and rating (4.9 / 133
reviews) against the live Google Maps listing (2026-07-20) — see §"Exact
values to set" below.

**Field mask — precise, no wildcards.** Only the fields the UI renders are
requested:
`rating,userRatingCount,googleMapsUri,regularOpeningHours,reviews.rating,reviews.text,reviews.relativePublishTimeDescription,reviews.authorAttribution`
— covers the aggregate rating/count, the official Google Maps link (for
"Read All Reviews"), opening hours, and per-review rating/text/relative
time/author name+avatar. Nothing else is fetched.

**Caching — 7 days, shared across all visitors.** `export const revalidate =
604800` (route segment config) plus a matching `next: { revalidate: 604800
}` on the `fetch()` call both key into the **Next.js Data Cache**: the first
request after the cache is empty/expired fetches from Google and the
response is cached on the server; every other visitor for the next 7 days
reads that one cached entry — no per-request or per-visitor calls to Google,
no polling. This needs no extra infrastructure (no Redis, no database, no
cron) — it's Next.js's built-in fetch cache, already part of the framework.

**Failure handling.** A single `try/catch/finally` covers every failure
mode:
- **Missing key or Place ID** → returns the static fallback immediately, no
  network call attempted.
- **Timeout** — an `AbortController` cancels the request after 8 seconds;
  the abort is caught like any other error.
- **Invalid key / invalid Place ID / billing errors / rate limits** — all
  surface as a non-2xx HTTP status, which throws before the body is parsed.
- **Malformed JSON / unexpected shape** — `res.json()` and all field access
  are inside the same `try`, and every field read is optional-chained with a
  safe default.
- **Empty reviews array** — handled in the UI (§ below), not treated as an
  error.

In every failure case the route returns the same shape as success
(`GoogleBusinessData`) with `source: "fallback"`, so the calling components
never need special-case error branches — they already branch on `source`.

**UI states (`components/TripAdvisorSection.tsx` → `GoogleReviewsCard`).**
The card distinguishes four states without any layout/style changes:
1. **Loading** — before the client-side fetch to `/api/google-business`
   resolves: a "Loading Google reviews…" message.
2. **Live with reviews** — real rating, star row, review count, and up to
   two real review snippets, each with its own star rating, reviewer name,
   avatar (`referrerPolicy="no-referrer"` `<img>`, only rendered when Google
   returns one), and relative publish time.
3. **Live with zero reviews** — rating/count still shown; a "No written
   reviews yet — be the first!" message instead of fabricating content.
4. **Not configured / Google unavailable** — the original "Live ratings
   will appear here once connected" message.

**Buttons always work.** "Read All Reviews" uses Google's own
`googleMapsUri` when live, "Leave a Review" uses
`https://search.google.com/local/writereview?placeid={GOOGLE_PLACE_ID}` —
both are built server-side in the route (whenever `GOOGLE_PLACE_ID` is set,
independent of whether the API key/live call succeeds) and sent to the
client as plain URLs in the JSON response. If `GOOGLE_PLACE_ID` itself isn't
set yet, both buttons fall back to the existing general Google Maps search
link already used elsewhere on the site (`GOOGLE_MAPS` in `lib/contact.ts`)
— never a dead link.

**Trade-offs considered**:

| Approach | Cost | Effort | Notes |
|---|---|---|---|
| **Places API (New) + 7-day cache** ✅ | Free at this volume (1 req / 7 days ≪ free tier) | Two env vars | Hours + reviews managed in one place: the Google Business profile |
| Google My Business API | Free | High — OAuth, verification, review process | Overkill for read-only data |
| Third-party widgets (Elfsight, etc.) | $5–10/mo | Low | External script, slower page, monthly fee |
| Manual static hours | Free | None | Falls out of sync — this stays as the ultimate fallback |

**Exact values to set** (Vercel → Project → Settings → Environment
Variables, Production + Preview):

| Variable | Value |
|---|---|
| `GOOGLE_PLACE_ID` | `ChIJAV5TM8snW48RhSLmezfw1ME` |
| `GOOGLE_PLACES_API_KEY` | *(create in Google Cloud Console — see below)* |

To finish setup: in Google Cloud Console, enable **Places API (New)** on a
project with billing enabled, create an API key, and restrict it to the
Places API (New) only (API restrictions), ideally also IP-restricted to
Vercel's outbound ranges or left unrestricted-by-referrer since it's called
server-side only. Set both env vars above, then redeploy.

## 2. Instagram feed

**What was built** — `components/InstagramFeed.tsx` inside the Gallery section:
- If `NEXT_PUBLIC_INSTAGRAM_FEED_URL` is set (a **Behold.so** JSON feed), the
  8-tile grid shows the live feed, each tile linking to its post.
- Until then it shows a curated grid of real restaurant photos linking to
  [@thejunglewey](https://instagram.com/thejunglewey) — never an empty section.

**Why Behold.so**: Instagram's Basic Display API was shut down (Dec 2024); the
replacement (Instagram API via Facebook Login) requires a Meta app, review, and
60-day token rotation — far too heavy for a restaurant site. Behold's free tier
mirrors the feed into a stable JSON/CDN URL and handles token refresh. Alternatives:
LightWidget ($10 one-time, iframe = slower), Elfsight (monthly fee, script embed),
official embeds (one post only, heavy iframes).

**To finish setup**: client signs up at behold.so (free), connects the Instagram
account, copies the feed URL into the env var.

## 3. Jungle Tribe — native registration form

**What was built** (2026-07-18, replacing the earlier Google Form iframe embed):
`components/tribe/TribeForm.tsx` is a fully native, brand-styled form living
directly on `/tribe`, with the exact same fields, options, and terms text as
the client's official Google Form
(`forms.gle/SvDZicthTz2Dj6av7` → title *"Registro oficial- Tribu The Jungle Wey"*):

1. Nombre completo (text) · 2. Fecha de cumpleaños (date) · 3. Telefono (text) ·
4. Correo electronico (text) · 5. Instagram (text) · 6. Dirección (text) ·
7. ¿Cómo prefieres recibir noticias, eventos y beneficios? (Whatsapp / Email /
Instagram / Todas las anteriores) · 8. ¿Que es The Jungle Wey para ti? (paragraph)
· plus the "Confirmación" terms section and its required
"He leído y acepto las condiciones" checkbox — all reproduced verbatim.

Client-side validation is complete (required fields, email/phone format, terms
checkbox) and a success state shows after submitting.

**What is NOT built yet — submission storage.** `lib/tribe-form.ts` →
`submitTribeForm()` currently just resolves locally; **no data is sent or saved
anywhere.** This was intentional per instruction (no backend/credentials without
explicit approval). To finish, replace the body of that one function with a
network call. Options, cheapest first:

| Approach | Cost | Effort | Notes |
|---|---|---|---|
| **Google Sheets via Apps Script Web App** ✅ | Free | Low — paste a short Apps Script, deploy as Web App, `fetch()` its URL | Rows land straight in a Sheet the client already knows how to use; no new account needed beyond their existing Google account |
| Serverless function + Google Sheets API | Free tier | Medium — service account, OAuth setup | More "correct" engineering, unnecessary for this volume |
| Formspree / Getform / similar form-backend service | Free tier (~50 submissions/mo), paid beyond | Low | Fastest to wire, but a third-party dependency and monthly limit |
| Airtable | Free tier | Low–Medium | Nicer views than Sheets, another account to manage |

**Recommendation**: Google Sheets via Apps Script — free, and the client already
lives in Google (Forms, Business Profile, Maps). Needs the client's approval to
create the Sheet + Apps Script deployment before wiring it up.

## 4. Known data discrepancies in client PDFs (flagged, chose the safer value)

_The AM food menu was replaced with the **JUN 26** cards (EN + ES) on 2026-07-17;
the old El Revuelto discrepancy is resolved ($190 on both new cards)._

- **Açaí Mi Amor** (AM, JUN 26): EN card says $140, ES card says $160 →
  used **$160** (matches the general price-increase pattern of the new card).
- **Fresh & Crunchy** (AM, JUN 26): EN card says $130, ES card says $140 →
  used **$140** (same reasoning).
- **La Smash vs Ramen del Mar** prices interleave in the PDF layout → read as
  La Smash **$199**, Ramen del Mar **$240** (consistent with Barba-Ramen $260).
- **Havana 7 años**: AM drinks card (2025) says $180, PM card (Marzo 26) says $130
  → used the **newer card ($130)**.
- AM drinks card (2025) and PM drinks card (2026) differ on a few prices
  (e.g. Michelada, Chelita) → the site uses the **Marzo 26 card** everywhere.

Please confirm these with the restaurant.
