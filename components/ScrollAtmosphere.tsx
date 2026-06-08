"use client";

import { useEffect } from "react";

/* ================================================================
   SCROLL ATMOSPHERE — Global cinematic scroll narrative system.

   As the user scrolls deeper into the site, the world changes:

   0%   Hero        — Twilight golden hour, warm sun + moon rise
   20%  Vibe        — Deeper jungle, green ambient, fireflies appear
   40%  Food        — Warm fire light, amber glow
   60%  Menu        — Night descends, cool, more fireflies
   75%  Drinks      — Full night, bioluminescent, stars
   88%  Gallery     — Darkest, most atmospheric, moonlit
   100% Contact     — Peaceful moonlit garden

   Updates CSS custom properties on <html> that components can
   read to dynamically shift their appearance.
   ================================================================ */

export default function ScrollAtmosphere() {
  useEffect(() => {
    const html = document.documentElement;

    /* Track sections by their offsetTop */
    const getSectionProgress = (): number => {
      const scrolled  = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      return maxScroll > 0 ? Math.min(1, Math.max(0, scrolled / maxScroll)) : 0;
    };

    const KEYFRAMES = [
      /* progress, bgR, bgG, bgB, overlayOpacity, warmth, cool */
      { p: 0.00, r: 3,  g: 8,  b: 8,   ov: 0.00, w: 0.90, c: 0.30 },
      { p: 0.18, r: 3,  g: 10, b: 6,   ov: 0.05, w: 0.65, c: 0.50 },
      { p: 0.38, r: 4,  g: 9,  b: 5,   ov: 0.08, w: 0.75, c: 0.40 },
      { p: 0.55, r: 2,  g: 8,  b: 10,  ov: 0.12, w: 0.35, c: 0.80 },
      { p: 0.72, r: 2,  g: 7,  b: 14,  ov: 0.18, w: 0.15, c: 1.00 },
      { p: 0.88, r: 2,  g: 6,  b: 12,  ov: 0.22, w: 0.10, c: 0.90 },
      { p: 1.00, r: 3,  g: 9,  b: 12,  ov: 0.15, w: 0.25, c: 0.75 },
    ];

    function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

    function update() {
      const p = getSectionProgress();

      /* Find surrounding keyframes */
      let lo = KEYFRAMES[0], hi = KEYFRAMES[KEYFRAMES.length - 1];
      for (let i = 0; i < KEYFRAMES.length - 1; i++) {
        if (p >= KEYFRAMES[i].p && p <= KEYFRAMES[i + 1].p) {
          lo = KEYFRAMES[i]; hi = KEYFRAMES[i + 1]; break;
        }
      }
      const range = hi.p - lo.p;
      const t = range > 0 ? (p - lo.p) / range : 0;
      const eased = t < 0.5 ? 2*t*t : 1 - Math.pow(-2*t+2,2)/2; /* ease-in-out */

      const r = Math.round(lerp(lo.r, hi.r, eased));
      const g = Math.round(lerp(lo.g, hi.g, eased));
      const b = Math.round(lerp(lo.b, hi.b, eased));

      html.style.setProperty("--atmo-bg", `${r},${g},${b}`);
      html.style.setProperty("--atmo-warmth", lerp(lo.w, hi.w, eased).toFixed(3));
      html.style.setProperty("--atmo-cool", lerp(lo.c, hi.c, eased).toFixed(3));
      html.style.setProperty("--atmo-progress", p.toFixed(4));
      html.style.setProperty("--atmo-overlay", lerp(lo.ov, hi.ov, eased).toFixed(3));

      /* Firefly density — increases as page gets darker */
      const fd = Math.max(0, (p - 0.15) / 0.85);
      html.style.setProperty("--atmo-fireflies", fd.toFixed(3));

      /* Moon strength */
      const moon = Math.min(1, p * 1.8);
      html.style.setProperty("--atmo-moon", moon.toFixed(3));
    }

    let tick = false;
    const onScroll = () => {
      if (tick) return; tick = true;
      requestAnimationFrame(() => { update(); tick = false; });
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
