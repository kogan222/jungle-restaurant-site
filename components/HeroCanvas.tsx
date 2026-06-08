"use client";

import { useEffect, useRef, useCallback } from "react";

/* ================================================================
   HERO CANVAS — Dedicated cinematic atmosphere engine.

   Five simultaneous render passes on a single canvas:

   Pass 1 — Sky ambient glow          (source-over, ultra-low)
   Pass 2 — Volumetric god rays       (screen blend)
   Pass 3 — Bokeh depth-of-field      (screen blend, foreground blur)
   Pass 4 — Humidity particles        (screen blend)
   Pass 5 — Moving canopy shadows     (multiply blend)

   Renders at 55% native resolution for sustained 60fps.
   Pauses when tab is hidden or section leaves viewport.
   ================================================================ */

/* ── Types ────────────────────────────────────────────────── */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  baseOpacity: number;
  phase: number;
  phaseSpeed: number;
  wander: number;
  tier: 0 | 1 | 2;   /* 0=deep-bg dust  1=mid-air spore  2=fg bokeh */
  colorIdx: number;
}

interface ShadowBand {
  progress: number;  /* 0–1 across the canvas */
  speed: number;
  width: number;
  opacity: number;
  curve: number;
}

/* ── Deterministic seeded random ──────────────────────────── */
function sr(s: number): number {
  const x = Math.sin(s * 91.233 + 423.17) * 48271.0;
  return x - Math.floor(x);
}

/* ── Particle factory ─────────────────────────────────────── */
function mkParticle(i: number, w: number, h: number): Particle {
  const tier: 0 | 1 | 2 = sr(i * 3.1) < 0.55 ? 0 : sr(i * 5.7) < 0.75 ? 1 : 2;
  return {
    x: sr(i * 7.3) * w,
    y: sr(i * 2.9) * h,
    vx: (sr(i * 5.1) - 0.5) * (tier === 2 ? 0.04 : 0.09),
    vy: -(sr(i * 1.7) * (tier === 0 ? 0.06 : tier === 1 ? 0.12 : 0.02) + 0.015),
    r: tier === 0 ? sr(i * 4.3) * 1.2 + 0.3
       : tier === 1 ? sr(i * 6.1) * 2.5 + 1.0
       : sr(i * 8.7) * 10 + 5,
    baseOpacity: tier === 0 ? sr(i * 9.3) * 0.25 + 0.04
                 : tier === 1 ? sr(i * 11.1) * 0.45 + 0.06
                 : sr(i * 13.3) * 0.08 + 0.02,
    phase: sr(i * 15.7) * Math.PI * 2,
    phaseSpeed: sr(i * 17.3) * 0.006 + 0.002,
    wander: (sr(i * 19.1) - 0.5) * 0.25,
    tier,
    colorIdx: Math.floor(sr(i * 21.7) * 5),
  };
}

const PARTICLE_COLORS = [
  /* warm gold */  [212, 180, 131],
  /* jungle spore*/[145, 200, 120],
  /* bright mote */[255, 238, 190],
  /* amber */      [220, 165, 80],
  /* cool teal */  [160, 210, 195],
];

/* ── Main component ───────────────────────────────────────── */
export default function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf       = useRef<number>(0);
  const t0        = useRef(Date.now());
  const particles = useRef<Particle[]>([]);
  const shadows   = useRef<ShadowBand[]>([]);
  const dims      = useRef({ w: 1, h: 1 });
  const active    = useRef(true);

  /* ── Resize ─────────────────────────────────────────────── */
  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const rect = c.parentElement!.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5) * 0.55;
    c.width  = Math.round(W * ratio);
    c.height = Math.round(H * ratio);
    c.style.width  = `${W}px`;
    c.style.height = `${H}px`;
    dims.current = { w: c.width, h: c.height };

    const N = window.innerWidth < 768 ? 100 : 220;
    particles.current = Array.from({ length: N }, (_, i) =>
      mkParticle(i, c.width, c.height)
    );
    shadows.current = Array.from({ length: 3 }, (_, i) => ({
      progress: sr(i * 3.7),
      speed: sr(i * 5.1) * 0.000018 + 0.000008,
      width: (0.18 + sr(i * 7.3) * 0.22) * c.width,
      opacity: 0.055 + sr(i * 9.7) * 0.04,
      curve: (sr(i * 11.3) - 0.5) * 0.3,
    }));
  }, []);

  /* ── God ray pass ───────────────────────────────────────── */
  const drawRays = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number, h: number, ms: number
  ) => {
    const sx = w * 0.70;
    const sy = h * -0.09;
    const len = Math.hypot(w, h) * 2.8;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    /* Primary rays — warm amber */
    for (let i = 0; i < 18; i++) {
      const t     = i / 18;
      const angle = (t - 0.5) * 1.55 +
                    Math.sin(ms * 0.00022 + i * 0.88) * 0.014;
      const hw    = (18 + sr(i * 4.1) * 55) *
                    (0.78 + Math.sin(ms * 0.00028 + i * 1.3) * 0.22);
      const peak  = (0.028 + sr(i * 6.7) * 0.022) *
                    (0.75 + Math.sin(ms * 0.00032 + i * 0.7) * 0.25);

      const ex = sx + Math.sin(angle) * len;
      const ey = sy + Math.cos(angle) * len;
      const px = -Math.cos(angle), py = Math.sin(angle);

      const g = ctx.createLinearGradient(sx, sy, ex, ey);
      g.addColorStop(0,    `rgba(255,215,130,${(peak * 1.6).toFixed(4)})`);
      g.addColorStop(0.08, `rgba(212,168,90,${peak.toFixed(4)})`);
      g.addColorStop(0.4,  `rgba(200,155,80,${(peak * 0.22).toFixed(4)})`);
      g.addColorStop(1,    "rgba(180,140,60,0)");

      ctx.beginPath();
      ctx.moveTo(sx - px * 1.5, sy - py * 1.5);
      ctx.lineTo(sx + px * 1.5, sy + py * 1.5);
      ctx.lineTo(ex + px * hw,  ey + py * hw);
      ctx.lineTo(ex - px * hw,  ey - py * hw);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }

    /* Secondary haze rays — broader, softer */
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7 - 0.5) * 1.1 +
                    Math.sin(ms * 0.00014 + i * 2.3) * 0.025;
      const hw = (90 + i * 35) *
                 (0.8 + Math.sin(ms * 0.00020 + i) * 0.2);
      const peak = 0.012 * (0.7 + Math.sin(ms * 0.00025 + i * 1.7) * 0.3);

      const ex = sx + Math.sin(angle) * len;
      const ey = sy + Math.cos(angle) * len;
      const px = -Math.cos(angle), py = Math.sin(angle);

      const g = ctx.createLinearGradient(sx, sy, ex, ey);
      g.addColorStop(0,   `rgba(255,230,160,${(peak * 0.9).toFixed(4)})`);
      g.addColorStop(0.3, `rgba(220,185,100,${(peak * 0.35).toFixed(4)})`);
      g.addColorStop(1,   "rgba(200,160,80,0)");

      ctx.beginPath();
      ctx.moveTo(sx - px * 2, sy - py * 2);
      ctx.lineTo(sx + px * 2, sy + py * 2);
      ctx.lineTo(ex + px * hw, ey + py * hw);
      ctx.lineTo(ex - px * hw, ey - py * hw);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }

    /* Source bloom — double ring */
    for (const [r, a] of [[w * 0.20, 0.14], [w * 0.09, 0.22]] as [number, number][]) {
      const bloom = ctx.createRadialGradient(sx, sy, 0, sx, sy, r);
      bloom.addColorStop(0,   `rgba(255,235,160,${a})`);
      bloom.addColorStop(0.35,`rgba(220,185,100,${a * 0.35})`);
      bloom.addColorStop(1,   "rgba(200,160,60,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }, []);

  /* ── Particle pass ──────────────────────────────────────── */
  const drawParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number, h: number, ms: number
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const p of particles.current) {
      /* Animate */
      p.phase += p.phaseSpeed;
      p.x += p.vx + Math.sin(p.phase + p.wander) * 0.18;
      p.y += p.vy;

      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -30) { p.y = h + 30; p.x = Math.random() * w; }

      const life = Math.sin(p.phase * 0.5) * 0.5 + 0.5;
      const opacity = p.baseOpacity * life;
      if (opacity < 0.004) continue;

      const [r, g, b] = PARTICLE_COLORS[p.colorIdx];

      if (p.tier === 2) {
        /* Bokeh — large blurred circles (depth of field) */
        const bk = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.8);
        bk.addColorStop(0,   `rgba(${r},${g},${b},${(opacity * 0.55).toFixed(4)})`);
        bk.addColorStop(0.45,`rgba(${r},${g},${b},${(opacity * 0.18).toFixed(4)})`);
        bk.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = bk;
        ctx.fill();
      } else {
        /* Dust / spore — small glowing dot */
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.5);
        grd.addColorStop(0,   `rgba(${r},${g},${b},${opacity.toFixed(4)})`);
        grd.addColorStop(0.5, `rgba(${r},${g},${b},${(opacity * 0.3).toFixed(4)})`);
        grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        /* Core */
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r},${g},${b},${(Math.min(opacity * 1.8, 0.9)).toFixed(4)})`;
        ctx.fill();
      }
    }
    ctx.restore();
  }, []);

  /* ── Moving shadow bands (canopy movement) ───────────────── */
  const drawShadows = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number, h: number, ms: number
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";

    for (const s of shadows.current) {
      s.progress += s.speed;
      if (s.progress > 1.4) s.progress = -0.4;

      const cx = s.progress * w * 1.6 - w * 0.3;

      /* Curved soft shadow band */
      const g = ctx.createLinearGradient(cx - s.width, 0, cx + s.width, 0);
      g.addColorStop(0,   "rgba(5,12,5,0)");
      g.addColorStop(0.3, `rgba(5,12,5,${s.opacity.toFixed(4)})`);
      g.addColorStop(0.5, `rgba(5,12,5,${(s.opacity * 1.2).toFixed(4)})`);
      g.addColorStop(0.7, `rgba(5,12,5,${s.opacity.toFixed(4)})`);
      g.addColorStop(1,   "rgba(5,12,5,0)");

      /* Draw as a slightly skewed quad for naturalistic diagonal */
      const skew = s.curve * h;
      ctx.beginPath();
      ctx.moveTo(cx - s.width, 0);
      ctx.lineTo(cx + s.width, 0);
      ctx.lineTo(cx + s.width + skew, h);
      ctx.lineTo(cx - s.width + skew, h);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }
    ctx.restore();
  }, []);

  /* ── Ambient sky glow ────────────────────────────────────── */
  const drawSky = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number, h: number, ms: number
  ) => {
    const pulse = 0.9 + Math.sin(ms * 0.00018) * 0.1;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    /* Warm upper-right glow */
    const sky = ctx.createRadialGradient(w * 0.72, 0, 0, w * 0.72, 0, w * 0.65);
    sky.addColorStop(0,   `rgba(180,130,60,${(0.045 * pulse).toFixed(4)})`);
    sky.addColorStop(0.5, `rgba(120,90,40,${(0.018 * pulse).toFixed(4)})`);
    sky.addColorStop(1,   "rgba(80,60,20,0)");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    /* Cool lower-left ambient */
    const cool = ctx.createRadialGradient(0, h, 0, 0, h, w * 0.55);
    cool.addColorStop(0,   "rgba(30,60,50,0.022)");
    cool.addColorStop(1,   "rgba(10,30,25,0)");
    ctx.fillStyle = cool;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }, []);

  /* ── Main render loop ────────────────────────────────────── */
  const render = useCallback(() => {
    if (!active.current) { raf.current = requestAnimationFrame(render); return; }

    const c = canvasRef.current;
    const ctx = c?.getContext("2d", { alpha: true });
    if (!c || !ctx) return;

    const { w, h } = dims.current;
    const ms = Date.now() - t0.current;

    ctx.clearRect(0, 0, w, h);

    drawSky(ctx, w, h, ms);
    drawRays(ctx, w, h, ms);
    drawParticles(ctx, w, h, ms);
    drawShadows(ctx, w, h, ms);

    raf.current = requestAnimationFrame(render);
  }, [drawSky, drawRays, drawParticles, drawShadows]);

  /* ── Lifecycle ───────────────────────────────────────────── */
  useEffect(() => {
    resize();

    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(
      ([e]) => { active.current = e.isIntersecting; },
      { threshold: 0 }
    );

    if (canvasRef.current?.parentElement) {
      ro.observe(canvasRef.current.parentElement);
      io.observe(canvasRef.current.parentElement);
    }

    const onVisibility = () => { active.current = !document.hidden; };
    document.addEventListener("visibilitychange", onVisibility);

    raf.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [resize, render]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 6, mixBlendMode: "normal" }}
    />
  );
}
