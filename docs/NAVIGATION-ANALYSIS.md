# Navigation Request — Analysis Only (NOT implemented)

**Client request**: every navigation item (Menu, Vibe, Drinks, Gallery, Find Us)
becomes its own dedicated page instead of a homepage scroll-section.

Per instructions, **nothing was changed**. The only navigation-adjacent changes in
Phase 2 were sanctioned by other requests: "Menu" now points to the new `/menu`
page, and anchor links became route-aware (`/#vibe`) so they work from sub-pages.

---

## Estimated complexity — **Medium-high**

The sections are already isolated components (`VibeSection`, `DrinksSection`,
`GallerySection`, `ContactSection`), so extracting content is easy. The complexity
lives in everything around them:

1. **The one-page cinematic system.** `ScrollAtmosphere`, `JungleAmbience`,
   `FallingLeaves`, section-to-section SVG waves and the scroll-spy navbar are all
   built on the assumption of one long scroll. Each new page needs its own
   atmosphere lifecycle, entry animation, and wave-less section headers/footers.
2. **Scroll-reveal assumptions.** Every section reveals on IntersectionObserver;
   on a dedicated page the content is above the fold and must reveal on load.
3. **Sub-page identity.** A dedicated page that only contains one homepage-sized
   section feels thin. Each page needs added content (more photos, more copy,
   FAQs) to justify existence — that's content work, not just code.

## Files that would change

| Area | Files |
|---|---|
| New routes | `app/vibe/page.tsx`, `app/drinks/page.tsx`, `app/gallery/page.tsx`, `app/contact/page.tsx` (+ metadata each) |
| Nav | `components/Navbar.tsx` (links, scroll-spy removal/rework), `components/Footer.tsx` |
| Sections | `VibeSection`, `DrinksSection`, `GallerySection`, `ContactSection` (wave/reveal/atmosphere decoupling) |
| Homepage | `app/page.tsx` (what remains: hero + teasers of each page) |
| SEO | `app/sitemap.ts`, `app/layout.tsx` (BreadcrumbList JSON-LD), per-page metadata/canonicals |
| i18n | `lib/i18n/en.ts`, `es.ts` (page titles, teaser copy) |

## Estimated work

- Code: **3–5 working days** (routes, decoupling, homepage teasers, QA).
- Content: **+1–2 days** to make each page substantial enough to stand alone.

## Risks

- **SEO transition risk**: today all ranking signals concentrate on one URL that
  ranks for "restaurant Mahahual". Splitting spreads link equity across 5 URLs;
  rankings typically dip for a few weeks. Anchor URLs (`/#menu`) don't 301 cleanly
  (fragments aren't sent to servers), so old shared links keep landing on the homepage.
- **Performance regression**: heavy atmosphere components re-mount on every route
  change instead of persisting during one scroll.
- **UX regression on mobile**: restaurant visitors mostly want menu + hours + WhatsApp
  in one swipe; extra taps add friction for the majority use case.
- **Maintenance**: 5 pages × 2 languages to keep consistent instead of 1.

## SEO impact

- **Upside (long-term)**: dedicated URLs can rank for specific intents — `/menu`
  for "menu Mahahual", `/gallery` for image search, `/contact` for hours/directions.
  More sitemap entries, more specific titles/descriptions.
- **Downside (short-term)**: dilution + re-crawl period; risk of thin-content pages
  if launched without added copy (Google may deindex thin pages, which looks worse
  than the current strong single page).
- Net: positive **only if** each page ships with real added content.

## Maintainability impact

- Better separation per page, easier to grow each area independently.
- But: more surface area, more routes to test, shared atmosphere needs a proper
  layout-level abstraction first, or code duplication will creep in.

## Recommendation — **Postpone, adopt a hybrid instead**

Phase 2 already delivers the highest-value dedicated page (`/menu` — the one users
actually search for) plus `/tribe`, and hidden foundations for `/book`, `/stories`,
`/events`. My recommendation:

1. **Now**: keep the one-page experience; measure traffic to `/menu`.
2. **Next**: launch `/events` and `/book` from the ready foundations *with real
   content* — these justify dedicated pages naturally.
3. **Only if analytics show demand**: split Vibe/Gallery/Contact last. Contact
   hours/directions could ship as `/contact` relatively cheaply if Google Business
   traffic justifies it.

This gets the SEO upside where it matters without gambling the current ranking or
degrading the mobile experience.
