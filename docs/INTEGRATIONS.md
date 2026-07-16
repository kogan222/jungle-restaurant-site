# Integrations — Setup & Trade-offs

All third-party integrations are **env-driven with graceful fallbacks**: the site
runs perfectly with zero configuration, and upgrades itself when the client
provides credentials. No code changes needed.

Create a `.env.local` (or set the vars in Vercel → Project → Settings → Environment Variables):

```bash
# ── Google Business (hours + reviews) ─────────────────────
GOOGLE_PLACES_API_KEY=...        # Places API (New) key, billing enabled
GOOGLE_PLACE_ID=...              # The restaurant's Place ID
NEXT_PUBLIC_GOOGLE_PLACE_ID=...  # Same ID — used for the "write a review" link

# ── Instagram feed ────────────────────────────────────────
NEXT_PUBLIC_INSTAGRAM_FEED_URL=https://feeds.behold.so/XXXXXXXX

# ── Jungle Tribe Google Form ──────────────────────────────
NEXT_PUBLIC_TRIBE_FORM_URL=https://docs.google.com/forms/d/e/XXXX/viewform
```

---

## 1. Google Business — opening hours & reviews

**What was built** — `app/api/google-business/route.ts`:
- With the two env vars set, it calls the **Places API (New)** (`places/{id}` with a
  field mask of `rating,userRatingCount,regularOpeningHours,reviews`), cached for
  **6 hours** (`revalidate = 21600`), and the Contact section's hours table +
  Google rating chip update automatically. The static hours in
  `lib/business-info.ts` remain the fallback and feed the JSON-LD.
- Without them, the route returns the static hours — nothing breaks.

**Trade-offs considered**:

| Approach | Cost | Effort | Notes |
|---|---|---|---|
| **Places API (New) + 6 h cache** ✅ | Free at this volume (1 req / 6 h ≪ free tier) | One env var + Place ID | Hours managed in one place: the Google Business profile |
| Google My Business API | Free | High — OAuth, verification, review process | Overkill for read-only hours |
| Third-party widgets (Elfsight, etc.) | $5–10/mo | Low | External script, slower page, monthly fee |
| Manual static hours | Free | None | Falls out of sync — this stays as the fallback |

**To finish setup**: find the Place ID at
<https://developers.google.com/maps/documentation/places/web-service/place-id>,
create an API key restricted to Places API, set the env vars.

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

## 3. Jungle Tribe — Google Form

`/tribe` embeds the client's Google Form (`?embedded=true`) inside a brand-styled
frame. **The form URL was not included in the delivered materials** — until
`NEXT_PUBLIC_TRIBE_FORM_URL` is set, the page shows a WhatsApp join fallback, so
it is fully functional either way.

## 4. Known data discrepancies in client PDFs (flagged, chose the safer value)

- **El Revuelto** (AM wraps): EN menu says $180, ES menu says $160 → used **$180**.
- **La Smash vs Ramen del Mar** prices interleave in the PDF layout → read as
  La Smash **$199**, Ramen del Mar **$240** (consistent with Barba-Ramen $260).
- **Havana 7 años**: AM drinks card (2025) says $180, PM card (Marzo 26) says $130
  → used the **newer card ($130)**.
- AM drinks card (2025) and PM drinks card (2026) differ on a few prices
  (e.g. Michelada, Chelita) → the site uses the **Marzo 26 card** everywhere.

Please confirm these four with the restaurant.
