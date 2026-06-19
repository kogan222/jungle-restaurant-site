"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import HangingVines from "./HangingVines";
import { CornerBranch } from "./JungleVines";
import { WHATSAPP_RESERVE_URL } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";

/* ── Dynamic import — Three.js must not run on server ── */
const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      style={{ background: "radial-gradient(ellipse at 68% 30%, rgba(80,55,15,0.45) 0%, #020d0e 65%)" }}
    />
  ),
});

/* ── Cinematic word-by-word reveal ────────────────────────── */
function useCinematicReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const steps = [
      { cls: ".cr-eyebrow", delay: 700  },
      { cls: ".cr-line1",   delay: 1100 },
      { cls: ".cr-line2",   delay: 1340 },
      { cls: ".cr-line3",   delay: 1580 },
      { cls: ".cr-sub",     delay: 1950 },
      { cls: ".cr-cta",     delay: 2340 },
      { cls: ".cr-stats",   delay: 2740 },
      { cls: ".cr-scroll",  delay: 3100 },
    ];
    const timers = steps.map(({ cls, delay }) =>
      setTimeout(() => ref.current?.querySelectorAll(cls).forEach((el) => el.classList.add("cr-visible")), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);
  return ref;
}

/* ── Liquid magnetic button ───────────────────────────────── */
function LiquidBtn({
  href, label, icon, primary = false,
}: {
  href: string; label: string; icon?: string; primary?: boolean;
}) {
  const ref  = useRef<HTMLAnchorElement>(null);
  const fill = useRef<HTMLSpanElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    // Magnetic + liquid fill effect only for fine-pointer (mouse/trackpad) devices.
    // On touch devices this fires after the tap sequence and adds latency — skip it.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current, gr = fill.current;
    if (!el || !gr) return;
    const r  = el.getBoundingClientRect();
    gr.style.setProperty("--lx", `${((e.clientX - r.left) / r.width  * 100).toFixed(1)}%`);
    gr.style.setProperty("--ly", `${((e.clientY - r.top)  / r.height * 100).toFixed(1)}%`);
    el.style.transform  = `translate(${(e.clientX - r.left - r.width/2) * 0.18}px, ${(e.clientY - r.top - r.height/2) * 0.18}px) scale(1.04)`;
    el.style.transition = "transform 0.10s ease-out";
  }, []);

  const onLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform  = "translate(0,0) scale(1)";
    ref.current.style.transition = "transform 0.60s cubic-bezier(0.22,1,0.36,1)";
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      className="group relative inline-flex items-center justify-center gap-3 font-semibold rounded-full overflow-hidden select-none"
      style={{
        padding: "17px 40px",
        fontSize: "clamp(0.875rem, 1.3vw, 1rem)",
        letterSpacing: "0.015em",
        willChange: "transform",
        ...(primary ? {
          background: "linear-gradient(145deg, #f06030 0%, #c43018 100%)",
          boxShadow: "0 8px 40px rgba(232,86,42,0.48), 0 0 0 1px rgba(255,255,255,0.10) inset",
          color: "white",
        } : {
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.15)",
          color: "rgba(255,255,255,0.85)",
          boxShadow: "0 4px 28px rgba(0,0,0,0.28)",
        }),
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {/* Liquid cursor-following fill */}
      <span
        ref={fill}
        className="liquid-fill absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
        style={{
          "--lx": "50%", "--ly": "50%",
          background: primary
            ? "radial-gradient(circle at var(--lx) var(--ly), rgba(255,255,255,0.20) 0%, transparent 65%)"
            : "radial-gradient(circle at var(--lx) var(--ly), rgba(255,255,255,0.10) 0%, transparent 65%)",
          transition: "opacity 0.25s ease",
        } as React.CSSProperties}
      />
      <span className="relative z-10">{label}</span>
      {icon && (
        <span
          className="relative z-10 text-xl group-hover:rotate-[15deg] transition-transform duration-400"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      )}
    </a>
  );
}

/* ── Foreground leaf ──────────────────────────────────────── */
function FgLeaf({
  className = "", style = {}, blur = 0, flip = false, anim = "leaf-float",
}: {
  className?: string; style?: React.CSSProperties; blur?: number; flip?: boolean; anim?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none ${anim} ${className}`}
      style={{
        ...style,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 180 260" fill="none" className="w-full h-full">
        <path d="M90 6 C50 26,6 88,16 162 C26 222,76 252,90 247 C72 202,66 150,90 6Z"   fill="#0a1a0a" opacity="0.96" />
        <path d="M90 6 C130 26,172 90,162 164 C152 222,102 251,90 247 C110 200,116 148,90 6Z" fill="#142814" opacity="0.88" />
        <line x1="90" y1="10" x2="90" y2="242" stroke="#1a3a1a" strokeWidth="1.5" opacity="0.25" />
      </svg>
    </div>
  );
}

/* ── Monstera leaf ────────────────────────────────────────── */
function MonsteraLeaf({
  className = "", style = {}, blur = 0, flip = false, anim = "leaf-float-2",
}: {
  className?: string; style?: React.CSSProperties; blur?: number; flip?: boolean; anim?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none ${anim} ${className}`}
      style={{
        ...style,
        filter: blur > 0 ? `blur(${blur}px)` : undefined,
        transform: flip ? "scaleX(-1)" : undefined,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 240 260" fill="none" className="w-full h-full">
        <path d="M120 12 C175 32,215 98,205 165 C195 222,145 246,120 242 C142 212,148 182,143 158 C168 151,178 134,173 112 C168 90,148 86,143 102 C138 78,128 44,120 12Z" fill="#0a1a0a" opacity="0.92" />
        <path d="M120 12 C65 37,28 102,45 165 C62 222,108 245,120 242 C98 210,93 180,98 156 C73 149,62 131,70 110 C77 89,98 88,100 104 C102 79,112 46,120 12Z" fill="#142414" opacity="0.88" />
        <ellipse cx="156" cy="132" rx="10" ry="17" fill="#020606" opacity="0.6" transform="rotate(-22 156 132)" />
        <ellipse cx="84"  cy="129" rx="9"  ry="16" fill="#020606" opacity="0.6" transform="rotate(22 84 129)" />
      </svg>
    </div>
  );
}

/* ── Film grain ───────────────────────────────────────────── */
function FilmGrain() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        zIndex: 22,
        opacity: 0.038,
        mixBlendMode: "overlay",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize: "200px 200px",
      }}
      aria-hidden="true"
    />
  );
}

/* ── Main Hero ────────────────────────────────────────────── */
export default function Hero() {
  const contentRef = useCinematicReveal();
  const { t } = useLanguage();

  return (
    <section
      id="hero"
      aria-label="Hero — The Jungle Wey tropical outdoor restaurant"
      className="relative overflow-hidden"
      style={{ minHeight: "100svh", background: "#020d0e" }}
    >

      {/* ════════════════════════════════════
          THREE.JS SCENE — Full 3D atmosphere
          (Dynamically imported, SSR disabled)
      ════════════════════════════════════ */}
      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <HeroScene />
      </div>

      {/* ════════════════════════════════════
          CSS overlays on top of 3D scene
      ════════════════════════════════════ */}

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 5,
        background: "radial-gradient(ellipse 95% 93% at 50% 50%, transparent 16%, rgba(2,13,14,0.45) 62%, rgba(2,13,14,0.88) 100%)",
      }} />

      {/* Bottom lift — content area readability */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 6,
        background: "linear-gradient(180deg, transparent 28%, rgba(2,13,8,0.0) 48%, rgba(2,12,6,0.55) 68%, rgba(2,10,4,0.97) 100%)",
      }} />

      {/* Cinematic fog (CSS) — 4 layers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 7 }} aria-hidden="true">
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:"42%",
          background:"linear-gradient(180deg, transparent 0%, rgba(8,22,12,0.0) 14%, rgba(12,30,16,0.22) 52%, rgba(4,14,6,0.60) 100%)",
          animation:"fogDriftRight 24s ease-in-out infinite alternate" }} />
        <div style={{ position:"absolute", bottom:"26%", left:"-30%", right:"-12%", height:"20%",
          background:"radial-gradient(ellipse 80% 65% at 28% 58%, rgba(120,185,145,0.050) 0%, transparent 68%)",
          animation:"fogDriftLeft 30s ease-in-out infinite alternate", filter:"blur(35px)" }} />
        <div style={{ position:"absolute", top:0, left:0, right:0, height:"38%",
          background:"linear-gradient(180deg, rgba(2,12,6,0.58) 0%, rgba(2,14,7,0.24) 50%, transparent 100%)" }} />
        <div style={{ position:"absolute", top:"26%", left:0, right:0, height:"26%",
          background:"radial-gradient(ellipse 100% 80% at 50% 50%, rgba(10,28,16,0.12) 0%, transparent 70%)",
          filter:"blur(22px)", animation:"fogDriftLeft 40s ease-in-out 4s infinite alternate" }} />
      </div>

      {/* Film grain */}
      <FilmGrain />

      {/* ════════════════════════════════════
          SVG OVERLAYS — Vines + Leaves
          (Natural elements on top of 3D)
      ════════════════════════════════════ */}

      {/* Hanging vines */}
      <div style={{ zIndex: 20, position: "absolute", inset: 0 }}>
        <HangingVines />
      </div>

      {/* Foreground leaves — 3 blur depths */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 24 }} aria-hidden="true">
        {/* Far blurred (depth of field) — hidden on mobile: filter:blur on animated divs
            is CPU-repainted every frame; not visible on small screens anyway */}
        <FgLeaf anim="leaf-sway"   className="mobile-hide w-80"   style={{ bottom:"-35px", left:"-55px", opacity: 0.60 }}  blur={20} />
        <FgLeaf anim="leaf-sway-2" className="mobile-hide w-72"   style={{ bottom:"-25px", right:"-50px", opacity: 0.55 }} blur={16} flip />
        {/* Mid sharp */}
        <FgLeaf anim="leaf-float"  className="w-44 md:w-72"   style={{ top:"7vh", left:"-42px", opacity: 0.82 }}       blur={3} />
        <MonsteraLeaf anim="leaf-float-2" className="w-52 md:w-80" style={{ top:"4vh", right:"-52px", opacity: 0.70 }} blur={1.5} />
        {/* Small accent */}
        <FgLeaf anim="leaf-float-3" className="w-28 md:w-44"  style={{ top:"42%", right:"-16px", opacity: 0.38 }}      blur={5} flip />
        {/* Corner branches */}
        <CornerBranch corner="tl" />
        <CornerBranch corner="tr" />
      </div>

      {/* ════════════════════════════════════
          CONTENT — Text, CTAs, Stats
      ════════════════════════════════════ */}
      <div
        ref={contentRef}
        className="relative flex flex-col justify-end w-full"
        style={{ zIndex: 30, minHeight: "100svh" }}
      >
        <div
          className="max-w-7xl mx-auto px-5 md:px-10 w-full"
          style={{ paddingBottom: "clamp(80px, 11vh, 130px)", paddingTop: "7rem" }}
        >

          {/* Eyebrow */}
          <div className="cr-eyebrow cr-item flex items-center gap-3 mb-8">
            <span className="h-px w-16"
              style={{ background: "linear-gradient(90deg, rgba(200,168,85,0.90), rgba(200,168,85,0))" }} />
            <span className="text-[#c8a855]/60"
              style={{ fontSize: "0.68rem", letterSpacing: "0.42em", textTransform: "uppercase" }}>
              {t.hero.eyebrow}
            </span>
          </div>

          {/* Headline — clip-up reveal, one line at a time */}
          <h1
            className="font-playfair font-black text-white"
            style={{
              fontSize: "clamp(3.4rem, 10.5vw, 8rem)",
              lineHeight: 1.005,
              letterSpacing: "-0.018em",
              marginBottom: "1.75rem",
            }}
          >
            <span className="block overflow-hidden">
              <span className="cr-line1 cr-slide-up block"
                style={{ textShadow: "0 8px 70px rgba(0,0,0,0.75)" }}>
                {t.hero.eat}
                <em className="not-italic" style={{ color: "#6dbe6d", textShadow: "0 0 80px rgba(109,190,109,0.40)" }}>
                  {t.hero.wild}
                </em>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="cr-line2 cr-slide-up block"
                style={{ textShadow: "0 8px 70px rgba(0,0,0,0.75)" }}>
                {t.hero.drink}<span className="gradient-text">{t.hero.fresh}</span>
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="cr-line3 cr-slide-up block"
                style={{ textShadow: "0 8px 70px rgba(0,0,0,0.75)" }}>
                <span style={{ color: "rgba(255,255,255,0.78)" }}>{t.hero.feelThe}</span>
                <span className="gradient-text-green">{t.hero.jungle}</span>
              </span>
            </span>
          </h1>

          {/* Subheadline */}
          <p className="cr-sub cr-item text-white/46 font-light leading-relaxed mb-11"
            style={{
              maxWidth: "min(495px, 88vw)",
              fontSize: "clamp(1rem, 1.9vw, 1.14rem)",
              textShadow: "0 2px 28px rgba(0,0,0,0.85)",
            }}>
            {t.hero.sub}{" "}
            <em className="not-italic" style={{ color: "#c8a855" }}>
              {t.hero.subAccent}
            </em>
          </p>

          {/* CTAs */}
          <div className="cr-cta cr-item flex flex-col sm:flex-row gap-4 mb-16">
            <LiquidBtn href="#menu"              label={t.hero.cta1} icon="&#127807;" primary />
            <LiquidBtn href={WHATSAPP_RESERVE_URL} label={t.hero.cta2} icon="&#128172;" />
          </div>

          {/* Stats */}
          <div className="cr-stats cr-item flex flex-wrap gap-10 md:gap-20">
            {[
              { v: t.hero.stat1v, l: t.hero.stat1l },
              { v: t.hero.stat2v, l: t.hero.stat2l },
              { v: t.hero.stat3v, l: t.hero.stat3l },
            ].map((s) => (
              <div key={s.l} className="flex flex-col">
                <span
                  className="font-playfair font-black gradient-text-green leading-none"
                  style={{ fontSize: "clamp(1.85rem, 3.3vw, 2.4rem)", textShadow: "0 0 50px rgba(109,190,109,0.28)" }}
                >
                  {s.v}
                </span>
                <span className="text-white/25 text-xs tracking-[0.30em] uppercase mt-1.5">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="cr-scroll cr-item absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none"
        style={{ bottom: "clamp(20px, 3.5vh, 30px)", zIndex: 32 }}>
        <span className="text-white/20"
          style={{ fontSize: "0.58rem", letterSpacing: "0.45em", textTransform: "uppercase" }}>
          {t.hero.scroll}
        </span>
        <div className="relative flex justify-center pt-1.5"
          style={{ width:17, height:32, border:"1px solid rgba(255,255,255,0.09)", borderRadius:99 }}>
          <div style={{
            width:2.5, height:9, borderRadius:99,
            background:"linear-gradient(180deg, #6dbe6d, rgba(109,190,109,0))",
            animation:"leafFallDown 2.0s cubic-bezier(0.4,0,0.2,1) infinite",
          }} />
        </div>
      </div>
    </section>
  );
}
