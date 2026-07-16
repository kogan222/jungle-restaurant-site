# The Jungle Wey — Phase 2 Implementation Plan

_Date: 2026-07-14 · Based on full analysis of client materials in `TJW original/` and the existing codebase._

---

## 1. What the client materials say

### Brand Manual (`The Jungle Wey - Lineamientos de Marca.pdf`, 19 pages)

**Palette** (page 10):

| Name | HEX | Pantone | Usage |
|---|---|---|---|
| Verde | `#1D3927` | 553 C | Primary dark green |
| Mostaza | `#ce8b4d` | 722 C | Warm accent (mustard/wood) |
| Celeste | `#bed0d1` | 5455 C | Cool accent (pale blue-grey) |
| Naranja | `#f04e30` | 171 C | Hot accent / CTA |
| Marrón | `#351916` | 4975 C | Deep brown (logo line-work) |
| Blanco / Negro | `#ffffff` / `#231F20` | — | Neutrals |

**Typography** (page 11):
- **Mouse Memoirs Regular** — headlines, highlighted text, short phrases (available on Google Fonts).
- **Poppins Bold** — subtitles / emphasis in running text.
- **Poppins Regular** — body copy.
- The manual explicitly says other families *may* be used digitally, but consistency is "suggested" — we adopt the brand fonts fully.

**Logo**: playful logotype + "El Wey" tree mascot (35-year-old relaxed beach guy). May be used together or separately; single-color versions allowed. Must respect protection area (width of the "W") and legibility; use on palette-colored backgrounds.

### Menus (`תפריטים MENU/`)
- **AM (08:00–15:00) — Brunch** (`MENU AM AGO 25`, EN+ES): Saladito Mood, Toast & Sandwich, Wraps, Jungle Poke, Dulce Mood, Bowls & Co., El Apapacho (sweets), Tecito & Cafecito, Los del Brunch (brunch cocktails).
- **PM (15:01–23:00) — Dinner** (`MENU COMIDAS MARZO 2026`, EN+ES): Jungle Bites, Ñembo Fit (salads), ¡Qué Rollo! (rolls), Platos Alfa (mains), A la Burguer, Los del Comal (tacos & quekas), El Apapacho (desserts).
- **Drinks** (`BEBIDAS MARZO 26`, EN+ES — newest): Los de la Jungla (signatures), Mezcal Bar, Magic Shots, Botanical Drinks (mocktails), Lo Normalito, Técitos y Cafécitos, Chelas, Los Clásicos, Destilados & Co. (tequila, mezcal, gin, ron, vodka, whisky, licores), Vinos.
- All prices in MXN. English + Spanish variants exist for every menu → feeds our existing i18n system.

---

## 2. Brand consistency audit (current site vs. Brand Manual)

| # | Inconsistency | Where | Fix |
|---|---|---|---|
| 1 | Fonts are Playfair Display + Inter — neither is in the manual | `app/layout.tsx`, `.font-playfair` used in ~15 components | Swap to Mouse Memoirs (display) + Poppins (body) via `next/font/google`; rename utility to `.font-display` |
| 2 | Primary accent orange is `#e8562a` (and `#cc4420`, `#f4734a`) — brand orange is `#f04e30` | globals.css, Navbar, Hero, MenuSection, FoodHighlights, ContactSection, etc. | Global token + sweep |
| 3 | Gold/tan accents `#c8a855`, `#d4b483` — brand has mustard `#ce8b4d` | globals.css gradients, MenuSection, badges | Sweep to mustard |
| 4 | "Moonlight blue" `#b8d8f8` — not in palette; brand celeste is `#bed0d1` | globals.css, atmosphere layers | Sweep to celeste |
| 5 | Logo is an emoji 🌿 + text — the real logotype/mascot is never used | Navbar, Footer | Use provided logo art (white single-color version on dark surfaces) |
| 6 | Greens are `#0a1e0a/#1e461e/#3d8a3d` family — brand verde is `#1D3927` | everywhere | Anchor green tokens on `#1D3927`; keep darker shades as atmosphere derivatives (manual allows dark backgrounds/textures if legibility is kept) |
| 7 | Menu content is invented/outdated; names & prices differ from real menus | MenuSection, FoodHighlights, DrinksSection | Rebuild from client PDFs (task 3) |
| 8 | Aggregate rating/review count hardcoded (23 reviews) | layout JSON-LD, TripAdvisorSection | Move to single config; wire Google data when available |
| 9 | Hours duplicated in two places (JSON-LD + ContactSection) and inconsistent with AM/PM menu times | layout.tsx, ContactSection | Single source `lib/hours.ts` consumed by both |

**Deliberate keep**: the dark cinematic "night jungle" atmosphere. The manual allows the brand on textures/images when legibility is respected; a full light-theme redesign would discard the delivered site's identity and is out of scope. We re-anchor every accent color onto the official palette instead.

---

## 3. Work plan (order & dependencies)

1. **Brand system** — fonts + color tokens + logo assets (blocks everything visual).
2. **Menu data layer** — `lib/menu-data.ts` typed, EN/ES, AM/PM, food+drinks (blocks 3–4).
3. **`/menu` page** — premium experience: AM/PM switcher (elegant sun/moon toggle, defaults by restaurant local time, America/Cancun), category chips, food/drinks tabs, per-item WhatsApp ordering CTA, floating WhatsApp.
4. **Homepage flow** — MenuSection becomes a curated preview + big "View Full Menu" → `/menu`; FoodHighlights cards link to `/menu` (whole-card action) with WhatsApp secondary; Navbar/Footer "Menu" links point to `/menu`.
5. **Floating WhatsApp** — visible on all viewports (not just mobile), brand-consistent styling, on all pages.
6. **Google Business** — single source of truth `lib/business-info.ts`; optional server route using Places API (`GOOGLE_PLACES_API_KEY` env) with 6 h revalidation feeding hours + reviews; graceful static fallback. Documented trade-offs in `docs/INTEGRATIONS.md`.
7. **Instagram feed** — `InstagramFeed` component reading a Behold.so JSON feed URL (free, no backend, maintainable) via `NEXT_PUBLIC_INSTAGRAM_FEED_URL`; graceful fallback to curated local photos linking to the profile. Documented.
8. **`/tribe`** — Jungle Tribe registration page with embedded Google Form (URL placeholder constant — **form URL was not found in the provided materials**, flagged to client).
9. **Hidden pages** — `/book`, `/stories`, `/events`: production-quality foundations, `robots: noindex`, excluded from nav & sitemap.
10. **Copywriting** — replace "Food Worth Fighting For" (options below).
11. **Navigation multi-page request** — analysis report only (see `docs/NAVIGATION-ANALYSIS.md`), no code changes.
12. **QA** — production build, link check, responsive, reduced-motion, performance sanity.

## 4. Risks

- **Massive token sweep** could touch decorative art (SVG creatures) — mitigated by explicit hex-by-hex mapping, not wholesale.
- **Mouse Memoirs is condensed** — headings will set narrower/taller than Playfair; verified per-section during QA.
- **No Google API key / Behold account / Google Form URL provided** — implemented with env-driven config + fallbacks; client plugs values in later without code changes.
- **Menu size** (~150 items) — rendered with lightweight DOM (no per-card canvas/tilt) to protect performance.
- **OneDrive path move mid-session** — project now lives at `תומר/אתרים/TJW/`; git history intact.

## 5. Headline options (task 10)

1. **"Cravings Done the Jungle Wey"** ← selected (brand pun, natural English, marketing-forward)
2. "Wild Flavor. Zero Rules."
3. "Eat Like the Jungle Made You"
4. "Where Cravings Run Wild"
5. "Good Food, No Passport Needed"

ES counterpart: **"Puro antojo, bien hecho"** (the brand's own tagline).
