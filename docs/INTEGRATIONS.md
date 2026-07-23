# Integrations — Setup & Trade-offs

All third-party integrations are **env-driven with graceful fallbacks**: the site
runs perfectly with zero configuration, and upgrades itself when the client
provides credentials. No code changes needed.

Create a `.env.local` (or set the vars in Vercel → Project → Settings → Environment Variables):

```bash
# ── Google Business (hours + reviews) ─────────────────────
GOOGLE_PLACES_API_KEY=...   # Places API (New) key, billing enabled — the ONLY
                             # var needed now; Place ID is already known (below)

# ── Instagram feed ────────────────────────────────────────
NEXT_PUBLIC_INSTAGRAM_FEED_URL=https://feeds.behold.so/XXXXXXXX
```

The Jungle Tribe form (`/tribe`) is a native form built into the site — see §3.
It needs no env var; it needs a submission-storage backend, described below.

---

## 1. Google Business — opening hours & reviews

**Place ID — resolved (2026-07-20).** `GOOGLE_PLACE_ID = "ChIJAV5TM8snW48RhSLmezfw1ME"`
is hardcoded in `lib/business-info.ts`. It was found via a live Places API
"Find Place" lookup and verified by matching the exact business name
("THE JUNGLE WEY"), exact address (Av. P.º del Puerto 1127, Mahahual), and
rating (4.9 / 133 reviews) against the live Google Maps listing. A Place ID
is a public, non-secret identifier — same treatment as `PHONE`/`INSTAGRAM`/
`GOOGLE_MAPS` in `lib/contact.ts` — so it no longer needs an env var. It also
now powers real, working links: the "Read on Google" and "Leave a Google
Review" buttons in the Google Reviews card, and the write-review deep link
(`GOOGLE_REVIEW_URL`).

**What's still needed — only the API key.** `app/api/google-business/route.ts`
uses `GOOGLE_PLACE_ID` as its default automatically; the moment
`GOOGLE_PLACES_API_KEY` is set, it calls the **Places API (New)**
(`places/{id}` with a field mask of
`rating,userRatingCount,regularOpeningHours,reviews`), cached for **6 hours**
(`revalidate = 21600`). Two components consume it: the Contact section (hours
table + a small rating chip) and the **Google Reviews card** next to
TripAdvisor (`components/TripAdvisorSection.tsx` → `GoogleReviewsCard`),
which then shows the live rating, star row, and up to two real review
snippets. The static hours in `lib/business-info.ts` remain the fallback and
feed the JSON-LD.
- Without the API key, every consumer falls back to safe placeholder UI —
  the Google Reviews card shows a "find us on Google" CTA (now a precise,
  working link) instead of fabricated numbers or reviews, and nothing breaks.

**Trade-offs considered**:

| Approach | Cost | Effort | Notes |
|---|---|---|---|
| **Places API (New) + 6 h cache** ✅ | Free at this volume (1 req / 6 h ≪ free tier) | One env var (Place ID already resolved) | Hours managed in one place: the Google Business profile |
| Google My Business API | Free | High — OAuth, verification, review process | Overkill for read-only hours |
| Third-party widgets (Elfsight, etc.) | $5–10/mo | Low | External script, slower page, monthly fee |
| Manual static hours | Free | None | Falls out of sync — this stays as the fallback |

**To finish setup**: create an API key restricted to Places API (New) with
billing enabled, set `GOOGLE_PLACES_API_KEY`. Nothing else is required.

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
