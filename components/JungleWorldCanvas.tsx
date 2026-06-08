"use client";

import { useEffect, useRef, useCallback } from "react";

/* ================================================================
   JUNGLE WORLD CANVAS — The living atmosphere engine.

   This is a complete cinematic environment renderer.
   Six independent passes build the final image:

   1. Sky gradient          — ambient color field
   2. Dual light shafts     — sun (warm) + moon (cool)
   3. Depth fog wisps       — realistic layered fog
   4. Humidity particles    — three-tier dust/spore/pollen system
   5. Fireflies             — bioluminescent, organic movement
   6. Canopy shadows        — moving shadow bands from wind

   Runs at 60fps. Pauses when invisible. Renders at 55% DPR.
   ================================================================ */

/* ─── seeded random ────────────────────────────────────────── */
const sr = (s: number) =>
  ((Math.sin(s * 91.233 + 423.17) * 48271.0) % 1 + 1) % 1;

/* ─── Particle types ───────────────────────────────────────── */
type ParticleTier = 0 | 1 | 2 | 3; // dust | spore | pollen | bokeh

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  opacity: number;
  maxOpacity: number;
  phase: number;
  phaseSpeed: number;
  wander: number;
  tier: ParticleTier;
  R: number; G: number; B: number; // cached color
}

/* ─── Firefly ──────────────────────────────────────────────── */
interface Firefly {
  x: number; y: number;
  tx: number; ty: number;        // target
  speed: number;
  bright: number;                // 0-1 current brightness
  brightPhase: number;
  brightSpeed: number;
  r: number;
  R: number; G: number; B: number;
}

/* ─── Shadow band ──────────────────────────────────────────── */
interface Shadow {
  t: number;   // 0..1 position
  spd: number;
  w: number;
  a: number;
  sk: number;  // skew
}

/* ─── Color banks ──────────────────────────────────────────── */
const DUST_COLORS = [
  [212, 178, 120], // warm gold
  [180, 215, 160], // pale green
  [255, 238, 185], // bright mote
  [200, 240, 210], // cool mint
  [230, 195, 130], // amber
] as const;

const FIREFLY_COLORS = [
  [180, 255, 140], // warm lime bio
  [120, 255, 200], // cyan bio
  [220, 255, 120], // yellow-green
  [140, 230, 200], // teal glow
] as const;

/* ─── Factory functions ────────────────────────────────────── */
function mkParticle(i: number, w: number, h: number, density: number): Particle {
  const tier = (sr(i * 3.1) < 0.50 ? 0
    : sr(i * 5.7) < 0.70 ? 1
    : sr(i * 8.3) < 0.85 ? 2
    : 3) as ParticleTier;

  const [R, G, B] = DUST_COLORS[Math.floor(sr(i * 21.7) * DUST_COLORS.length)];
  const rBase = tier === 0 ? 0.35 : tier === 1 ? 1.2 : tier === 2 ? 2.2 : 7;

  return {
    x: sr(i * 7.3) * w,
    y: sr(i * 2.9) * h,
    vx: (sr(i * 5.1) - 0.5) * (tier === 3 ? 0.03 : 0.07),
    vy: -(sr(i * 1.7) * (tier === 0 ? 0.05 : tier === 3 ? 0.015 : 0.10) + 0.012),
    r: rBase + sr(i * 13.1) * rBase * 0.9,
    opacity: 0,
    maxOpacity: tier === 0 ? 0.04 + sr(i * 9.3) * 0.20
      : tier === 1 ? 0.07 + sr(i * 11.1) * 0.35
      : tier === 2 ? 0.08 + sr(i * 13.7) * 0.30
      : 0.03 + sr(i * 15.3) * 0.09,
    phase: sr(i * 15.7) * Math.PI * 2,
    phaseSpeed: 0.003 + sr(i * 17.3) * 0.007,
    wander: (sr(i * 19.1) - 0.5) * 0.22,
    tier, R, G, B,
  };
}

function mkFirefly(i: number, w: number, h: number): Firefly {
  const [R, G, B] = FIREFLY_COLORS[Math.floor(sr(i * 17.3) * FIREFLY_COLORS.length)];
  return {
    x: sr(i * 7.1) * w,
    y: h * (0.35 + sr(i * 3.3) * 0.65),
    tx: sr(i * 11.9) * w,
    ty: h * (0.35 + sr(i * 5.5) * 0.65),
    speed: 0.25 + sr(i * 9.3) * 0.55,
    bright: 0,
    brightPhase: sr(i * 13.7) * Math.PI * 2,
    brightSpeed: 0.008 + sr(i * 15.1) * 0.018,
    r: 1.8 + sr(i * 19.3) * 2.5,
    R, G, B,
  };
}

function mkShadow(i: number, w: number): Shadow {
  return {
    t: sr(i * 3.7),
    spd: 0.000009 + sr(i * 5.1) * 0.000012,
    w: (0.14 + sr(i * 7.3) * 0.20) * w,
    a: 0.048 + sr(i * 9.7) * 0.035,
    sk: (sr(i * 11.3) - 0.5) * 0.28,
  };
}

/* ─── Main component ───────────────────────────────────────── */
export default function JungleWorldCanvas({
  className = "",
  style = {},
  sunX = 0.72, sunY = -0.07,
  moonX = 0.18, moonY = -0.04,
  sunIntensity = 1.0,
  moonIntensity = 0.55,
  particleCount = 240,
  fireflyCount = 22,
  fogIntensity = 1.0,
}: {
  className?: string;
  style?: React.CSSProperties;
  sunX?: number; sunY?: number;
  moonX?: number; moonY?: number;
  sunIntensity?: number;
  moonIntensity?: number;
  particleCount?: number;
  fireflyCount?: number;
  fogIntensity?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf       = useRef<number>(0);
  const t0        = useRef(Date.now());
  const particles = useRef<Particle[]>([]);
  const fireflies = useRef<Firefly[]>([]);
  const shadows   = useRef<Shadow[]>([]);
  const dims      = useRef({ w: 1, h: 1 });
  const live      = useRef(true);

  /* ── Resize / init ─────────────────────────────────────── */
  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const p = c.parentElement!.getBoundingClientRect();
    const W = p.width, H = p.height;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5) * 0.55;
    c.width  = Math.round(W * ratio);
    c.height = Math.round(H * ratio);
    c.style.width  = `${W}px`;
    c.style.height = `${H}px`;
    const { width: w, height: h } = c;
    dims.current = { w, h };

    const mobile = window.innerWidth < 768;
    const pc = mobile ? Math.round(particleCount * 0.45) : particleCount;
    const fc = mobile ? Math.round(fireflyCount * 0.5) : fireflyCount;

    particles.current = Array.from({ length: pc }, (_, i) => mkParticle(i, w, h, 1));
    fireflies.current = Array.from({ length: fc }, (_, i) => mkFirefly(i, w, h));
    shadows.current   = [mkShadow(0, w), mkShadow(1, w), mkShadow(2, w)];
  }, [particleCount, fireflyCount]);

  /* ── Pass 1: Sky ambient ────────────────────────────────── */
  const drawSky = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, ms: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    const pulse = 0.92 + Math.sin(ms * 0.00015) * 0.08;

    /* Warm upper-right (sun side) */
    const sg = ctx.createRadialGradient(w * sunX, 0, 0, w * sunX, 0, w * 0.8);
    sg.addColorStop(0,   `rgba(175, 125, 45, ${(0.06 * pulse * sunIntensity).toFixed(4)})`);
    sg.addColorStop(0.6, `rgba(110, 80, 30,  ${(0.022 * pulse * sunIntensity).toFixed(4)})`);
    sg.addColorStop(1,   "rgba(60,40,15,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, w, h);

    /* Cool upper-left (moon side) */
    const mg = ctx.createRadialGradient(w * moonX, 0, 0, w * moonX, 0, w * 0.7);
    mg.addColorStop(0,   `rgba(140, 200, 255, ${(0.045 * pulse * moonIntensity).toFixed(4)})`);
    mg.addColorStop(0.5, `rgba(100, 160, 220, ${(0.015 * pulse * moonIntensity).toFixed(4)})`);
    mg.addColorStop(1,   "rgba(60,110,160,0)");
    ctx.fillStyle = mg;
    ctx.fillRect(0, 0, w, h);

    /* Ground bioluminescent ambient */
    const bg = ctx.createRadialGradient(w * 0.5, h, 0, w * 0.5, h, w * 0.7);
    bg.addColorStop(0,   `rgba(30, 90, 60, ${(0.035 * fogIntensity).toFixed(4)})`);
    bg.addColorStop(1,   "rgba(10,40,30,0)");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }, [sunX, moonX, sunIntensity, moonIntensity, fogIntensity]);

  /* ── Pass 2: Dual light shafts ──────────────────────────── */
  const drawShafts = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, ms: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const len = Math.hypot(w, h) * 3;

    /* Sun rays — warm amber */
    const ssx = w * sunX, ssy = h * sunY;
    for (let i = 0; i < 16; i++) {
      const t     = i / 16;
      const wobble = Math.sin(ms * 0.00022 + i * 0.85) * 0.013;
      const angle  = (t - 0.5) * 1.5 + wobble;
      const hw = (15 + sr(i * 4.1) * 50) * (0.78 + Math.sin(ms * 0.00029 + i * 1.2) * 0.22);
      const peak = (0.025 + sr(i * 6.7) * 0.020) *
                   (0.75 + Math.sin(ms * 0.00033 + i * 0.8) * 0.25) * sunIntensity;
      const ex = ssx + Math.sin(angle) * len;
      const ey = ssy + Math.cos(angle) * len;
      const px = -Math.cos(angle), py = Math.sin(angle);
      const g = ctx.createLinearGradient(ssx, ssy, ex, ey);
      g.addColorStop(0,    `rgba(255,210,110,${(peak*1.5).toFixed(4)})`);
      g.addColorStop(0.1,  `rgba(220,170,80,${peak.toFixed(4)})`);
      g.addColorStop(0.45, `rgba(200,150,65,${(peak*0.18).toFixed(4)})`);
      g.addColorStop(1,    "rgba(180,130,50,0)");
      ctx.beginPath();
      ctx.moveTo(ssx-px*1.5, ssy-py*1.5);
      ctx.lineTo(ssx+px*1.5, ssy+py*1.5);
      ctx.lineTo(ex+px*hw, ey+py*hw);
      ctx.lineTo(ex-px*hw, ey-py*hw);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }

    /* Sun source bloom */
    const sb = ctx.createRadialGradient(ssx, ssy, 0, ssx, ssy, w * 0.22);
    sb.addColorStop(0,   `rgba(255,230,150,${(0.20*sunIntensity).toFixed(4)})`);
    sb.addColorStop(0.4, `rgba(220,180,90,${(0.07*sunIntensity).toFixed(4)})`);
    sb.addColorStop(1,   "rgba(200,160,60,0)");
    ctx.fillStyle = sb;
    ctx.fillRect(0, 0, w, h);

    /* Moon rays — cool blue-white */
    const msx = w * moonX, msy = h * moonY;
    for (let i = 0; i < 8; i++) {
      const wobble = Math.sin(ms * 0.00014 + i * 1.3) * 0.016;
      const angle  = (i / 8 - 0.5) * 1.1 + wobble;
      const hw = (30 + sr(i * 5.3) * 70) * (0.80 + Math.sin(ms * 0.00018 + i * 0.9) * 0.20);
      const peak = (0.014 + sr(i * 7.1) * 0.012) *
                   (0.8 + Math.sin(ms * 0.00021 + i * 1.1) * 0.2) * moonIntensity;
      const ex = msx + Math.sin(angle) * len;
      const ey = msy + Math.cos(angle) * len;
      const px = -Math.cos(angle), py = Math.sin(angle);
      const g = ctx.createLinearGradient(msx, msy, ex, ey);
      g.addColorStop(0,   `rgba(180,220,255,${(peak*1.2).toFixed(4)})`);
      g.addColorStop(0.2, `rgba(150,195,240,${peak.toFixed(4)})`);
      g.addColorStop(0.6, `rgba(120,170,220,${(peak*0.15).toFixed(4)})`);
      g.addColorStop(1,   "rgba(90,140,200,0)");
      ctx.beginPath();
      ctx.moveTo(msx-px*1.5, msy-py*1.5);
      ctx.lineTo(msx+px*1.5, msy+py*1.5);
      ctx.lineTo(ex+px*hw, ey+py*hw);
      ctx.lineTo(ex-px*hw, ey-py*hw);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }

    /* Moon bloom */
    const mb = ctx.createRadialGradient(msx, msy, 0, msx, msy, w * 0.18);
    mb.addColorStop(0,   `rgba(200,230,255,${(0.12*moonIntensity).toFixed(4)})`);
    mb.addColorStop(0.5, `rgba(160,200,240,${(0.04*moonIntensity).toFixed(4)})`);
    mb.addColorStop(1,   "rgba(130,180,220,0)");
    ctx.fillStyle = mb;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }, [sunX, sunY, moonX, moonY, sunIntensity, moonIntensity]);

  /* ── Pass 3: Depth fog ──────────────────────────────────── */
  const drawFog = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number, ms: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";

    const fogBands = [
      { y: 0.78, rx: 0.90, ry: 0.08, vx: 0.000035, phase: 0,   a: 0.048 },
      { y: 0.85, rx: 1.10, ry: 0.06, vx: -0.000028, phase: 1.8, a: 0.062 },
      { y: 0.60, rx: 0.65, ry: 0.05, vx: 0.000020,  phase: 3.1, a: 0.028 },
      { y: 0.70, rx: 0.80, ry: 0.04, vx: -0.000018, phase: 0.9, a: 0.022 },
      { y: 0.92, rx: 1.30, ry: 0.07, vx: 0.000040,  phase: 2.5, a: 0.075 },
    ];

    for (const fb of fogBands) {
      const cx  = (0.5 + Math.sin(ms * fb.vx + fb.phase) * 0.12) * w;
      const cy  = fb.y * h;
      const rx  = fb.rx * w;
      const ry  = fb.ry * h;
      const pa  = fb.a * fogIntensity * (0.85 + Math.sin(ms * 0.000055 + fb.phase) * 0.15);

      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry));
      g.addColorStop(0,   `rgba(160,210,175,${pa.toFixed(4)})`);
      g.addColorStop(0.5, `rgba(130,185,150,${(pa * 0.35).toFixed(4)})`);
      g.addColorStop(1,   "rgba(100,160,120,0)");

      ctx.save();
      ctx.scale(1, ry / rx);
      ctx.beginPath();
      ctx.arc(cx, cy * rx / ry, rx, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }, [fogIntensity]);

  /* ── Pass 4: Humidity particles ─────────────────────────── */
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const p of particles.current) {
      p.phase += p.phaseSpeed;
      p.x += p.vx + Math.sin(p.phase + p.wander) * 0.15;
      p.y += p.vy;
      if (p.x < -20) p.x = w + 20;
      if (p.x > w+20) p.x = -20;
      if (p.y < -30) { p.y = h + 30; p.x = Math.random() * w; }

      const life = Math.sin(p.phase * 0.45) * 0.5 + 0.5;
      const op   = p.maxOpacity * life;
      if (op < 0.005) continue;

      const { r, R, G, B } = p;
      if (p.tier === 3) {
        /* Bokeh — large soft disc */
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.5);
        g.addColorStop(0,   `rgba(${R},${G},${B},${(op*0.5).toFixed(4)})`);
        g.addColorStop(0.5, `rgba(${R},${G},${B},${(op*0.15).toFixed(4)})`);
        g.addColorStop(1,   `rgba(${R},${G},${B},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      } else {
        /* Core glow */
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 2.8);
        g.addColorStop(0,   `rgba(${R},${G},${B},${(op*1.6).toFixed(4)})`);
        g.addColorStop(0.4, `rgba(${R},${G},${B},${(op*0.35).toFixed(4)})`);
        g.addColorStop(1,   `rgba(${R},${G},${B},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${R},${G},${B},${Math.min(op*2.2,0.95).toFixed(4)})`;
        ctx.fill();
      }
    }
    ctx.restore();
  }, []);

  /* ── Pass 5: Fireflies ───────────────────────────────────── */
  const drawFireflies = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const ff of fireflies.current) {
      /* Move toward target */
      const dx = ff.tx - ff.x, dy = ff.ty - ff.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 8) {
        /* Pick new target */
        ff.tx = sr(ff.x * 3.1 + ff.y * 1.7 + Date.now() * 0.00001) * w;
        ff.ty = h * (0.35 + sr(ff.y * 2.3 + Date.now() * 0.000012) * 0.62);
      } else {
        ff.x += (dx / dist) * Math.min(ff.speed, dist);
        ff.y += (dy / dist) * Math.min(ff.speed * 0.5, Math.abs(dy));
      }

      /* Brightness pulse — organic, not mechanical */
      ff.brightPhase += ff.brightSpeed;
      ff.bright = Math.max(0, Math.sin(ff.brightPhase) * 0.6 +
                               Math.sin(ff.brightPhase * 2.3) * 0.3 +
                               Math.sin(ff.brightPhase * 0.7) * 0.1);

      if (ff.bright < 0.04) continue;

      const { r, R, G, B } = ff;
      const bx = ff.x, by = ff.y;

      /* Outer halo */
      const halo = ctx.createRadialGradient(bx, by, 0, bx, by, r * 14);
      halo.addColorStop(0,   `rgba(${R},${G},${B},${(ff.bright*0.20).toFixed(4)})`);
      halo.addColorStop(0.3, `rgba(${R},${G},${B},${(ff.bright*0.08).toFixed(4)})`);
      halo.addColorStop(1,   `rgba(${R},${G},${B},0)`);
      ctx.beginPath();
      ctx.arc(bx, by, r * 14, 0, Math.PI * 2);
      ctx.fillStyle = halo;
      ctx.fill();

      /* Mid glow */
      const glow = ctx.createRadialGradient(bx, by, 0, bx, by, r * 5);
      glow.addColorStop(0,   `rgba(${R},${G},${B},${(ff.bright*0.65).toFixed(4)})`);
      glow.addColorStop(0.6, `rgba(${R},${G},${B},${(ff.bright*0.18).toFixed(4)})`);
      glow.addColorStop(1,   `rgba(${R},${G},${B},0)`);
      ctx.beginPath();
      ctx.arc(bx, by, r * 5, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      /* Core */
      ctx.beginPath();
      ctx.arc(bx, by, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${(ff.bright * 0.95).toFixed(4)})`;
      ctx.fill();
    }
    ctx.restore();
  }, []);

  /* ── Pass 6: Canopy shadows ──────────────────────────────── */
  const drawShadows = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "multiply";

    for (const s of shadows.current) {
      s.t += s.spd;
      if (s.t > 1.4) s.t = -0.4;
      const cx = s.t * w * 1.8 - w * 0.4;
      const skew = s.sk * h;
      const g = ctx.createLinearGradient(cx - s.w, 0, cx + s.w, 0);
      g.addColorStop(0,   "rgba(4,10,6,0)");
      g.addColorStop(0.25,`rgba(4,10,6,${s.a.toFixed(4)})`);
      g.addColorStop(0.5, `rgba(4,10,6,${(s.a*1.25).toFixed(4)})`);
      g.addColorStop(0.75,`rgba(4,10,6,${s.a.toFixed(4)})`);
      g.addColorStop(1,   "rgba(4,10,6,0)");
      ctx.beginPath();
      ctx.moveTo(cx-s.w,      0);
      ctx.lineTo(cx+s.w,      0);
      ctx.lineTo(cx+s.w+skew, h);
      ctx.lineTo(cx-s.w+skew, h);
      ctx.closePath();
      ctx.fillStyle = g;
      ctx.fill();
    }
    ctx.restore();
  }, []);

  /* ── Render loop ─────────────────────────────────────────── */
  const render = useCallback(() => {
    if (!live.current) { raf.current = requestAnimationFrame(render); return; }
    const c = canvasRef.current;
    const ctx = c?.getContext("2d", { alpha: true });
    if (!c || !ctx) return;
    const { w, h } = dims.current;
    const ms = Date.now() - t0.current;
    ctx.clearRect(0, 0, w, h);
    drawSky(ctx, w, h, ms);
    drawShafts(ctx, w, h, ms);
    drawFog(ctx, w, h, ms);
    drawParticles(ctx, w, h);
    drawFireflies(ctx, w, h);
    drawShadows(ctx, w, h);
    raf.current = requestAnimationFrame(render);
  }, [drawSky, drawShafts, drawFog, drawParticles, drawFireflies, drawShadows]);

  /* ── Lifecycle ───────────────────────────────────────────── */
  useEffect(() => {
    resize();
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([e]) => { live.current = e.isIntersecting; }, { threshold: 0 });
    const onHide = () => { live.current = !document.hidden; };
    if (canvasRef.current?.parentElement) {
      ro.observe(canvasRef.current.parentElement);
      io.observe(canvasRef.current.parentElement);
    }
    document.addEventListener("visibilitychange", onHide);
    raf.current = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf.current);
      ro.disconnect(); io.disconnect();
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [resize, render]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={style}
    />
  );
}
