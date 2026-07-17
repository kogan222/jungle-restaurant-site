"use client";

/*
  Homepage MENU PREVIEW.
  Phase 2 UX: the homepage no longer renders the full menu.
  It teases the two daily services (breakfast / dinner) with a
  taste of each, and sends users to the dedicated /menu page.
  Flow: Homepage → Menu Preview → "View Full Menu" → /menu
*/

import { useEffect, useRef, useState } from "react";
import { SideVine } from "./JungleVines";
import Fireflies from "./Fireflies";
import { useLanguage } from "@/lib/i18n";
import {
  AM_FOOD,
  PM_FOOD,
  SERVICE_HOURS,
  currentService,
  type MenuItem,
  type ServiceKey,
} from "@/lib/menu-data";

/* A few crowd-pleasers from each service (name + price only) */
function pickTeasers(cats: typeof AM_FOOD, names: string[]): MenuItem[] {
  const all = cats.flatMap((c) => c.items);
  return names
    .map((n) => all.find((i) => i.name === n))
    .filter((i): i is MenuItem => Boolean(i));
}

const AM_TEASERS = [
  "Chilaquiles, wey",
  "Avocado Toast",
  "Chicken Crispy",
  "Los Señores Tacos — Land",
  "Açaí Mi Amor",
];

const PM_TEASERS = [
  "God Save the Queen",
  "Los Señores Tacos — Land",
  "La Trufada",
  "Filadeli Roll",
  "El Cuadrilatero",
];

function ServicePanel({
  icon,
  title,
  hours,
  items,
  live,
  categories,
}: {
  icon: string;
  title: string;
  hours: string;
  items: MenuItem[];
  live: boolean;
  categories: string;
}) {
  const { t } = useLanguage();
  return (
    <div
      className="reveal relative rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col"
      style={{
        background: "linear-gradient(135deg, rgba(14,34,22,0.92) 0%, rgba(29,57,39,0.75) 100%)",
        border: `1px solid ${live ? "rgba(240,78,48,0.35)" : "rgba(206,139,77,0.18)"}`,
        boxShadow: live
          ? "0 16px 44px rgba(0,0,0,0.45), 0 0 30px rgba(240,78,48,0.12)"
          : "0 10px 30px rgba(0,0,0,0.35)",
      }}
    >
      {live && (
        <span
          className="absolute top-4 right-4 flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider px-3 py-1 rounded-full"
          style={{ background: "rgba(240,78,48,0.15)", color: "#f56a4a", border: "1px solid rgba(240,78,48,0.4)" }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#f04e30" }} />
          {t.menuPage.nowServing}
        </span>
      )}

      <div className="flex items-center gap-3 mb-1">
        <span className="text-2xl" aria-hidden="true">{icon}</span>
        <h3 className="font-display text-3xl text-white">{title}</h3>
      </div>
      <p className="text-xs tracking-[0.18em] uppercase mb-5" style={{ color: "#bed0d1" }}>
        {hours} · {t.menuPage.servedDaily}
      </p>

      <div className="flex-1">
        {items.map((item) => (
          <div key={item.name} className="flex items-baseline gap-2 py-2 border-b border-white/[0.06] last:border-0">
            <span className="text-white/80 text-sm font-medium">{item.name}</span>
            <span aria-hidden="true" className="flex-1 border-b border-dotted border-white/15 translate-y-[-3px]" />
            <span className="font-display text-lg" style={{ color: "#f04e30" }}>{item.price}</span>
          </div>
        ))}
      </div>

      <p className="text-white/35 text-xs mt-4 leading-relaxed">{categories}</p>
    </div>
  );
}

export default function MenuSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();
  /* Client-only: avoids baking the build-time service into static HTML */
  const [live, setLive] = useState<ServiceKey | null>(null);
  useEffect(() => setLive(currentService()), []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal").forEach((el, i) =>
              setTimeout(() => el.classList.add("visible"), i * 80)
            );
        }),
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const amCats = AM_FOOD.map((c) => (lang === "es" ? c.labelEs : c.label)).join(" · ");
  const pmCats = PM_FOOD.map((c) => (lang === "es" ? c.labelEs : c.label)).join(" · ");

  return (
    <section id="menu" ref={ref} className="relative py-24 md:py-36 bg-[#0a1a0a] overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(29,57,39,0.35) 0%, transparent 70%),
            radial-gradient(ellipse 600px 800px at 80% 70%, rgba(154,101,56,0.06) 0%, transparent 70%)
          `,
        }} />
      </div>

      <Fireflies count={10} className="opacity-40" />
      <SideVine side="right" height={700} />

      {/* Top wave from vibe section */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full" style={{ height: 80 }}>
          <path d="M0,80 C240,0 480,80 720,40 C960,0 1200,60 1440,30 L1440,0 L0,0 Z" fill="#0f260f" />
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-5 md:px-10 pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="reveal flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
            <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">{t.menu.eyebrow}</span>
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
          </div>
          <h2 className="reveal font-display text-white leading-none mb-4" style={{ fontSize: "clamp(2.6rem, 6vw, 4.5rem)" }}>
            {t.menu.headlineA}<span className="gradient-text">{t.menu.headlineB}</span>
          </h2>
          <p className="reveal text-white/40 text-base max-w-lg mx-auto leading-relaxed">
            {t.menu.sub}
            <em className="not-italic text-[#ce8b4d]"> {t.menu.subAccent}</em>
          </p>
        </div>

        {/* Two services */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mb-12">
          <ServicePanel
            icon="☀️"
            title={t.menuPage.breakfast}
            hours={SERVICE_HOURS.am.label}
            items={pickTeasers(AM_FOOD, AM_TEASERS)}
            live={live === "am"}
            categories={amCats}
          />
          <ServicePanel
            icon="🌙"
            title={t.menuPage.dinner}
            hours={SERVICE_HOURS.pm.label}
            items={pickTeasers(PM_FOOD, PM_TEASERS)}
            live={live === "pm"}
            categories={pmCats}
          />
        </div>

        {/* View full menu CTA */}
        <div className="reveal text-center">
          <a
            href="/menu"
            className="inline-flex items-center gap-3 text-white font-semibold text-base px-10 py-4 rounded-full transition-[transform,box-shadow] duration-200 hover:scale-105 group"
            style={{
              background: "linear-gradient(135deg, #f04e30, #d43e22)",
              boxShadow: "0 8px 30px rgba(240,78,48,0.35)",
            }}
          >
            {t.menu.viewFullCta}
            <span className="group-hover:translate-x-1 transition-transform inline-block" aria-hidden="true">→</span>
          </a>
          <p className="text-white/25 text-xs mt-6 tracking-wide">{t.menu.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
