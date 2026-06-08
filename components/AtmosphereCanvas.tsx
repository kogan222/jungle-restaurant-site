"use client";

import { useEffect, useRef, useCallback } from "react";

/* ================================================================
   ATMOSPHERE CANVAS — The living jungle atmosphere engine.

   Renders three visual layers via Canvas 2D:
   1. Volumetric god rays (screen blend — additive light)
   2. Atmospheric fog wisps (large blurred ellipses)
   3. Humidity particle system (dust / spores / motes)

   Runs at 60fps via rAF, pauses when off-screen.
   Renders at 0.5x DPR for performance, scaled up via CSS.
   ================================================================ */

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  opacity: number;
  targetOpacity: number;
  phase: number;       /* sine wave oscillation offset */
  speed: number;
  life: number;        /* 0–1, particle lifecycle */
  lifeSpeed: number;
  color: string;
}

interface Wisp {
  x: number; y: number;
  rx: number; ry: number;
  vx: number; vy: number;
  opacity: number;
  phase: number;
}

/* Seeded pseudo-random — same results every render */
function sr(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function initParticles(count: number, w: number, h: number): Particle[] {
  const colors = [
    "rgba(212,180,131,", /* warm gold dust */
    "rgba(180,220,130,", /* jungle green spore */
    "rgba(255,240,200,", /* bright mote */
    "rgba(200,220,180,", /* cool green */
    "rgba(230,200,150,", /* amber */
  ];
  return Array.from({ length: count }, (_, i) => ({
    x: sr(i * 7.3) * w,
    y: sr(i * 3.1) * h,
    vx: (sr(i * 5.7) - 0.5) * 0.12,
    vy: -(sr(i * 2.9) * 0.18 + 0.03),
    r: sr(i * 4.1) < 0.65 ? sr(i * 6.3) * 1.8 + 0.4 : sr(i * 8.1) * 3.5 + 1.5,
    opacity: 0,
    targetOpacity: sr(i * 1.7) * 0.65 + 0.08,
    phase: sr(i * 9.3) * Math.PI * 2,
    speed: sr(i * 11.3) * 0.008 + 0.003,
    life: sr(i * 13.7),
    lifeSpeed: sr(i * 15.1) * 0.0008 + 0.0002,
    color: colors[Math.floor(sr(i * 17.3) * colors.length)],
  }));
}

function initWisps(w: number, h: number): Wisp[] {
  return [
    { x: w * 0.1, y: h * 0.75, rx: w * 0.55, ry: h * 0.12, vx: 0.08, vy: 0, opacity: 0.06, phase: 0 },
    { x: w * 0.6, y: h * 0.82, rx: w * 0.65, ry: h * 0.09, vx: -0.06, vy: 0, opacity: 0.05, phase: 1.5 },
    { x: w * 0.3, y: h * 0.60, rx: w * 0.45, ry: h * 0.08, vx: 0.05, vy: 0, opacity: 0.04, phase: 0.8 },
    { x: w * 0.8, y: h * 0.70, rx: w * 0.4, ry: h * 0.07, vx: -0.04, vy: 0, opacity: 0.035, phase: 2.3 },
    { x: w * 0.15, y: h * 0.90, rx: w * 0.7, ry: h * 0.06, vx: 0.07, vy: 0, opacity: 0.07, phase: 0.3 },
  ];
}

export default function AtmosphereCanvas({
  className = "",
  style = {},
  raySource = { x: 0.66, y: -0.08 },
  rayCount = 14,
  rayIntensity = 1,
  particleCount = 180,
  fogIntensity = 1,
  theme = "warm",       /* "warm" | "cool" | "golden" */
}: {
  className?: string;
  style?: React.CSSProperties;
  raySource?: { x: number; y: number };
  rayCount?: number;
  rayIntensity?: number;
  particleCount?: number;
  fogIntensity?: number;
  theme?: "warm" | "cool" | "golden";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const wisps     = useRef<Wisp[]>([]);
  const dims      = useRef({ w: 0, h: 0 });
  const visible   = useRef(true);
  const startTime = useRef(Date.now());

  const rayColors: Record<string, [string, string]> = {
    warm:   ["rgba(212,180,131,", "rgba(255,220,160,"],
    cool:   ["rgba(140,200,180,", "rgba(180,230,210,"],
    golden: ["rgba(255,200,80,",  "rgba(255,230,120,"],
  };
  const [rayColorA, rayColorB] = rayColors[theme];

  const resize = useCallback(() => {
    const c = canvasRef.current;
    if (!c) return;
    const parent = c.parentElement;
    if (!parent) return;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); /* cap at 1.5x */
    c.width  = w * dpr * 0.6;  /* render at 60% res for perf */
    c.height = h * dpr * 0.6;
    c.style.width  = `${w}px`;
    c.style.height = `${h}px`;
    dims.current = { w: c.width, h: c.height };
    particles.current = initParticles(particleCount, c.width, c.height);
    wisps.current     = initWisps(c.width, c.height);
  }, [particleCount]);

  const drawGodRays = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number, h: number,
    t: number
  ) => {
    const sx = raySource.x * w;
    const sy = raySource.y * h;
    const rayLen = Math.max(w, h) * 3;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < rayCount; i++) {
      const progress = i / rayCount;
      /* Fan of rays spreading from source */
      const baseAngle = (progress - 0.5) * 1.4;
      const wobble    = Math.sin(t * 0.00025 + i * 0.7) * 0.018;
      const angle     = baseAngle + wobble;

      const halfW = (25 + sr(i * 3.7) * 60) *
                    (0.8 + Math.sin(t * 0.0003 + i * 1.1) * 0.2) *
                    rayIntensity;

      const endX = sx + Math.sin(angle) * rayLen;
      const endY = sy + Math.cos(angle) * rayLen;

      /* Perpendicular vector for ray width */
      const perpX = -Math.cos(angle);
      const perpY  =  Math.sin(angle);

      const maxAlpha = (0.035 + sr(i * 5.1) * 0.025) *
                       (0.7 + Math.sin(t * 0.0004 + i * 0.9) * 0.3) *
                       rayIntensity;

      const grad = ctx.createLinearGradient(sx, sy, endX, endY);
      grad.addColorStop(0,   `${rayColorB}${(maxAlpha * 1.4).toFixed(3)})`);
      grad.addColorStop(0.15, `${rayColorA}${maxAlpha.toFixed(3)})`);
      grad.addColorStop(0.55, `${rayColorA}${(maxAlpha * 0.3).toFixed(3)})`);
      grad.addColorStop(1,   `${rayColorA}0)`);

      ctx.beginPath();
      ctx.moveTo(sx - perpX * 2, sy - perpY * 2);
      ctx.lineTo(sx + perpX * 2, sy + perpY * 2);
      ctx.lineTo(endX + perpX * halfW, endY + perpY * halfW);
      ctx.lineTo(endX - perpX * halfW, endY - perpY * halfW);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }

    /* Source bloom */
    const bloom = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.22);
    bloom.addColorStop(0,   `${rayColorB}${(0.18 * rayIntensity).toFixed(3)})`);
    bloom.addColorStop(0.3, `${rayColorA}${(0.06 * rayIntensity).toFixed(3)})`);
    bloom.addColorStop(1,   `${rayColorA}0)`);
    ctx.fillStyle = bloom;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();
  }, [raySource, rayCount, rayIntensity, rayColorA, rayColorB]);

  const drawFog = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number, h: number,
    t: number
  ) => {
    ctx.save();
    /* CSS filter blur on canvas is expensive — use shadow as cheap glow instead */
    ctx.globalCompositeOperation = "source-over";

    for (const wisp of wisps.current) {
      const wispX = wisp.x + Math.cos(t * 0.00004 + wisp.phase) * w * 0.08;
      const pulseFactor = 0.85 + Math.sin(t * 0.00006 + wisp.phase * 2) * 0.15;
      const alpha = wisp.opacity * fogIntensity * pulseFactor;

      const grad = ctx.createRadialGradient(
        wispX, wisp.y, 0,
        wispX, wisp.y, Math.max(wisp.rx, wisp.ry)
      );
      grad.addColorStop(0,   `rgba(180,220,190,${alpha})`);
      grad.addColorStop(0.5, `rgba(160,200,170,${alpha * 0.4})`);
      grad.addColorStop(1,   "rgba(160,200,170,0)");

      ctx.save();
      ctx.scale(1, wisp.ry / wisp.rx);
      ctx.beginPath();
      ctx.arc(wispX, wisp.y * (wisp.rx / wisp.ry), wisp.rx, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }, [fogIntensity]);

  const drawParticles = useCallback((
    ctx: CanvasRenderingContext2D,
    w: number, h: number,
    t: number
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (const p of particles.current) {
      /* Update position */
      p.life += p.lifeSpeed;
      if (p.life >= 1) { p.life = 0; p.x = Math.random() * w; p.y = h + 10; }

      p.x += p.vx + Math.sin(t * p.speed + p.phase) * 0.3;
      p.y += p.vy;

      /* Wrap horizontally */
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }

      /* Lifecycle opacity */
      const lifeCurve = Math.sin(p.life * Math.PI); /* peaks at 0.5 */
      p.opacity = lifeCurve * p.targetOpacity;

      if (p.opacity < 0.005) continue;

      /* Draw with glow */
      const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
      glow.addColorStop(0,   `${p.color}${(p.opacity).toFixed(3)})`);
      glow.addColorStop(0.4, `${p.color}${(p.opacity * 0.4).toFixed(3)})`);
      glow.addColorStop(1,   `${p.color}0)`);

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = glow;
      ctx.fill();

      /* Core dot */
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `${p.color}${(p.opacity * 1.5).toFixed(3)})`;
      ctx.fill();
    }
    ctx.restore();
  }, []);

  const draw = useCallback(() => {
    const c = canvasRef.current;
    if (!c || !visible.current) { rafRef.current = requestAnimationFrame(draw); return; }
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const { w, h } = dims.current;
    const t = Date.now() - startTime.current;

    ctx.clearRect(0, 0, w, h);

    drawFog(ctx, w, h, t);
    drawGodRays(ctx, w, h, t);
    drawParticles(ctx, w, h, t);

    rafRef.current = requestAnimationFrame(draw);
  }, [drawFog, drawGodRays, drawParticles]);

  useEffect(() => {
    resize();
    const observer = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; }, { threshold: 0 });
    const ro = new ResizeObserver(resize);
    if (canvasRef.current?.parentElement) {
      observer.observe(canvasRef.current.parentElement);
      ro.observe(canvasRef.current.parentElement);
    }
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      ro.disconnect();
    };
  }, [resize, draw]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ ...style, imageRendering: "auto" }}
    />
  );
}
