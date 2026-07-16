"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { WHATSAPP_RESERVE_URL } from "@/lib/contact";
import {
  FOOD_BY_SERVICE,
  DRINKS,
  SPIRITS,
  SERVICE_HOURS,
  currentService,
  type MenuCategory,
  type MenuItem,
  type ServiceKey,
} from "@/lib/menu-data";

/* ────────────────────────────────────────────────────────
   Small pieces
──────────────────────────────────────────────────────── */

function BadgePill({ badge }: { badge: NonNullable<MenuItem["badge"]> }) {
  const { t } = useLanguage();
  const label = t.menu.badges[badge];
  return (
    <span
      className="inline-block text-[0.65rem] font-semibold px-2.5 py-0.5 rounded-full align-middle"
      style={{
        color: "#ce8b4d",
        border: "1px solid rgba(206,139,77,0.45)",
        background: "rgba(206,139,77,0.10)",
      }}
    >
      {label}
    </span>
  );
}

function ItemRow({ item }: { item: MenuItem }) {
  const { lang } = useLanguage();
  const desc = lang === "es" ? item.descEs ?? item.desc : item.desc;
  const extra = lang === "es" ? item.extraEs ?? item.extra : item.extra;

  return (
    <div className="flex gap-4 py-4 border-b border-white/[0.06] last:border-0">
      {item.img && (
        <div className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
          <Image
            src={item.img}
            alt={item.name}
            fill
            sizes="64px"
            className="object-cover"
            style={{ filter: "saturate(1.1) brightness(0.9)" }}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h4 className="font-poppins font-semibold text-white text-[0.95rem] leading-snug">
            {item.name}
          </h4>
          {/* dotted leader */}
          <span
            aria-hidden="true"
            className="flex-1 border-b border-dotted border-white/15 translate-y-[-3px]"
          />
          <span className="font-display text-xl flex-shrink-0" style={{ color: "#f04e30" }}>
            {item.price}
          </span>
        </div>
        {desc && (
          <p className="text-white/45 text-[0.83rem] leading-relaxed mt-1">{desc}</p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          {item.badge && <BadgePill badge={item.badge} />}
          {extra && (
            <span className="text-[0.72rem]" style={{ color: "#bed0d1" }}>
              {extra}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CategoryBlock({ cat }: { cat: MenuCategory }) {
  const { lang } = useLanguage();
  return (
    <section id={`cat-${cat.id}`} className="scroll-mt-40">
      <div className="flex items-center gap-3 mb-2 mt-10">
        <span className="text-xl" aria-hidden="true">{cat.emoji}</span>
        <h3 className="font-display text-3xl md:text-4xl text-white">
          {lang === "es" ? cat.labelEs : cat.label}
        </h3>
        <span
          className="flex-1 h-px"
          style={{ background: "linear-gradient(90deg, rgba(206,139,77,0.4), transparent)" }}
        />
      </div>
      <div className="md:columns-2 md:gap-10">
        {cat.items.map((item) => (
          <div key={item.name} className="break-inside-avoid">
            <ItemRow item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────
   AM / PM switcher — sun & moon pill
──────────────────────────────────────────────────────── */
function ServiceSwitch({
  service,
  setService,
  live,
}: {
  service: ServiceKey;
  setService: (s: ServiceKey) => void;
  live: ServiceKey;
}) {
  const { t } = useLanguage();
  const options: { key: ServiceKey; icon: string; label: string; hours: string }[] = [
    { key: "am", icon: "☀️", label: t.menuPage.breakfast, hours: SERVICE_HOURS.am.label },
    { key: "pm", icon: "🌙", label: t.menuPage.dinner, hours: SERVICE_HOURS.pm.label },
  ];

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative flex rounded-full p-1"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.10)",
        }}
        role="tablist"
        aria-label="Menu service"
      >
        {/* sliding indicator */}
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: "calc(50% - 4px)",
            left: 4,
            transform: service === "pm" ? "translateX(100%)" : "translateX(0)",
            background: "linear-gradient(135deg, #f04e30, #d43e22)",
            boxShadow: "0 4px 18px rgba(240,78,48,0.35)",
          }}
        />
        {options.map((o) => {
          const active = service === o.key;
          return (
            <button
              key={o.key}
              role="tab"
              aria-selected={active}
              onClick={() => setService(o.key)}
              className="relative z-10 flex flex-col items-center rounded-full transition-colors duration-300"
              style={{
                padding: "0.55rem 2.2rem",
                color: active ? "white" : "rgba(255,255,255,0.45)",
                minWidth: 150,
              }}
            >
              <span className="text-sm font-semibold flex items-center gap-1.5">
                <span aria-hidden="true">{o.icon}</span> {o.label}
              </span>
              <span className="text-[0.68rem] tracking-wider opacity-80">{o.hours}</span>
            </button>
          );
        })}
      </div>
      <span className="text-[0.72rem] tracking-wide" style={{ color: "#bed0d1" }}>
        {t.menuPage.nowServing}:{" "}
        <strong className="font-semibold">
          {live === "am" ? t.menuPage.breakfast : t.menuPage.dinner}
        </strong>{" "}
        · {t.menuPage.servedDaily}
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────
   Main experience
──────────────────────────────────────────────────────── */
type Tab = "food" | "drinks";

export default function MenuExperience() {
  const { t, lang } = useLanguage();
  /* The page is statically prerendered — the "live" service must be
     computed on the client only, or the build-time value gets baked in
     and causes a hydration mismatch. */
  const [live, setLive] = useState<ServiceKey>("pm");
  const [service, setService] = useState<ServiceKey>("pm");
  const [tab, setTab] = useState<Tab>("food");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = currentService();
    setLive(s);
    setService(s);
  }, []);

  /* Re-trigger a soft fade when the visible menu changes */
  const [fadeKey, setFadeKey] = useState(0);
  useEffect(() => setFadeKey((k) => k + 1), [service, tab]);

  const categories: MenuCategory[] =
    tab === "food" ? FOOD_BY_SERVICE[service] : DRINKS;

  const scrollToCat = (id: string) => {
    document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="relative min-h-screen" style={{ background: "#0a1a0a" }}>
      {/* soft ambient glows */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 800px 500px at 15% 0%, rgba(29,57,39,0.55) 0%, transparent 70%),
            radial-gradient(ellipse 700px 600px at 90% 30%, rgba(154,101,56,0.10) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-24">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
            <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">
              {t.menuPage.eyebrow}
            </span>
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
          </div>
          <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}>
            {t.menuPage.headlineA}
            <span className="gradient-text">{t.menuPage.headlineB}</span>
          </h1>
          <p className="text-white/45 text-base max-w-lg mx-auto leading-relaxed mb-8">
            {t.menuPage.sub}
          </p>

          <ServiceSwitch service={service} setService={setService} live={live} />
        </div>

        {/* Food / Drinks tabs */}
        <div className="flex justify-center gap-8 mb-2">
          {(["food", "drinks"] as Tab[]).map((k) => {
            const active = tab === k;
            return (
              <button
                key={k}
                onClick={() => setTab(k)}
                className="relative pb-2 font-display text-2xl tracking-wide transition-colors duration-200"
                style={{ color: active ? "white" : "rgba(255,255,255,0.35)" }}
                aria-pressed={active}
              >
                {k === "food" ? t.menuPage.food : t.menuPage.drinks}
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 bottom-0 h-0.5 rounded-full transition-opacity duration-200"
                  style={{ background: "#f04e30", opacity: active ? 1 : 0 }}
                />
              </button>
            );
          })}
        </div>

        {/* Category chips — sticky */}
        <div
          className="sticky z-30 py-3 -mx-5 px-5 md:-mx-10 md:px-10"
          style={{
            top: "4rem",
            background: "rgba(10,26,10,0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
          }}
        >
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => scrollToCat(c.id)}
                className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-200 hover:text-white"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                <span aria-hidden="true">{c.emoji}</span>
                {lang === "es" ? c.labelEs : c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu content */}
        <div
          key={fadeKey}
          ref={contentRef}
          style={{ animation: "fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both" }}
        >
          {categories.map((cat) => (
            <CategoryBlock key={cat.id} cat={cat} />
          ))}

          {/* Spirits — only under drinks */}
          {tab === "drinks" && (
            <>
              <div className="flex items-center gap-3 mt-16 mb-2">
                <h2 className="font-display text-4xl text-white">{t.menuPage.spirits}</h2>
                <span className="text-white/30 text-sm">{t.menuPage.spiritsNote}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10">
                {SPIRITS.map((group) => (
                  <div key={group.id} className="mb-8">
                    <h3 className="font-display text-2xl mb-1" style={{ color: "#ce8b4d" }}>
                      {lang === "es" ? group.labelEs : group.label}
                    </h3>
                    {group.items.map((item) => (
                      <div
                        key={item.name}
                        className="flex items-baseline gap-2 py-1.5 border-b border-white/[0.05] last:border-0"
                      >
                        <span className="text-white/70 text-sm">{item.name}</span>
                        <span aria-hidden="true" className="flex-1 border-b border-dotted border-white/12 translate-y-[-3px]" />
                        <span className="text-sm font-semibold" style={{ color: "#f04e30" }}>
                          {item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* WhatsApp banner */}
        <div
          className="mt-16 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-5"
          style={{ background: "linear-gradient(135deg, #1D3927, #0e2216)", border: "1px solid rgba(206,139,77,0.2)" }}
        >
          <div className="flex items-center gap-4">
            <Image
              src="/images/logo-elwey-white.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={64}
              className="h-14 w-auto hidden sm:block"
            />
            <p className="font-display text-2xl md:text-3xl text-white text-center sm:text-left">
              {t.menu.sub}{" "}
              <span style={{ color: "#ce8b4d" }}>{t.menu.subAccent}</span>
            </p>
          </div>
          <a
            href={WHATSAPP_RESERVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2.5 text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-transform duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #25D366, #1aad54)",
              boxShadow: "0 6px 24px rgba(37,211,102,0.35)",
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: 18, height: 18 }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            {t.menuPage.orderCta}
          </a>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-white/25 text-xs mt-10 tracking-wide">
          {t.menuPage.disclaimer}
        </p>
      </div>
    </main>
  );
}
