"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SideVine } from "./JungleVines";
import { useTilt } from "./useTilt";
import { useLanguage } from "@/lib/i18n";

/* Real signature dishes — names and recipes from the client's PM menu (Marzo 26) */
const HIGHLIGHTS = [
  {
    emoji: "&#127967;",
    img: "/images/food-fish.jpg",
    name: "God Save the Queen",
    desc: "Fish sticks served with french fries and house tartar sauce. Our most beloved plate.",
    tagKey: "fanFav" as const,
    accent: "#f04e30",
  },
  {
    emoji: "&#127805;",
    img: "/images/food-shrimp-tacos.jpg",
    name: "Los Señores Tacos — Sea",
    desc: "Garlic shrimp on a bed of guacamole, on handmade blue corn tortillas.",
    tagKey: "mustTry" as const,
    accent: "#3d8a3d",
  },
  {
    emoji: "&#129348;",
    img: "/images/food-filadeli-roll.jpg",
    name: "Filadeli Roll",
    desc: "Rice paper, shrimp, avocado, cream cheese & chaya. A signature plate.",
    tagKey: "signature" as const,
    accent: "#62a062",
  },
  {
    emoji: "&#129361;",
    img: "/images/food-greek-salad.jpg",
    name: "Greek Salad",
    desc: "Mixed greens, black olives, goat cheese spheres, cherry tomatoes & walnuts.",
    tagKey: "nemboFit" as const,
    accent: "#3d8a3d",
  },
  {
    emoji: "&#127839;",
    img: "/images/food-burger.jpg",
    name: "La Trufada",
    desc: "Angus beef, truffle mayo, mushrooms, manchego cheese & crispy onion.",
    tagKey: "premium" as const,
    accent: "#ce8b4d",
  },
  {
    emoji: "&#129364;",
    img: "/images/food-vietnamese-rolls.jpg",
    name: "Rollos Vietnamitas",
    desc: "Fresh rice paper rolls with avocado, mint & spicy orange dipping sauce.",
    tagKey: "queRollo" as const,
    accent: "#f04e30",
  },
];

export default function FoodHighlights() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal, .reveal-scale").forEach((el, i) =>
              setTimeout(() => el.classList.add("visible"), i * 90)
            );
        }),
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative py-24 md:py-32 bg-[#0a1a0a] overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 900px 600px at 50% 60%, rgba(45,110,45,0.07) 0%, transparent 70%)",
      }} />

      {/* Side vine */}
      <SideVine side="right" height={500} />

      {/* Spiral decoration */}
      <div className="absolute top-10 left-10 opacity-10 spiral-spin w-16 h-16 pointer-events-none">
        <svg viewBox="0 0 64 64" fill="none">
          <path d="M32 6 C44 6 54 16 54 32 C54 44 44 54 32 54 C20 54 12 44 12 32 C12 24 18 18 26 18 C34 18 38 24 38 32 C38 38 34 42 32 42" stroke="#f04e30" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
          <div>
            <div className="reveal flex items-center gap-3 mb-5">
              <span className="h-px w-14" style={{ background: "linear-gradient(90deg, #f04e30, transparent)" }} />
              <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">{t.food.eyebrow}</span>
            </div>
            <h2 className="reveal font-display text-white font-black leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
              {t.food.headlineA}
              <span className="gradient-text">{t.food.headlineB}</span>
            </h2>
          </div>
          <a
            href="#menu"
            className="reveal self-start md:self-auto flex items-center gap-2 text-[#62a062] hover:text-white transition-colors text-sm font-medium group"
          >
            {t.food.cta}
            <span className="group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
          </a>
        </div>

        {/* Bento grid — varied sizes for visual interest */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HIGHLIGHTS.map((item, i) => (
            <HighlightCard key={item.name} item={item} index={i} featured={i === 0 || i === 5} tagLabel={t.food.tags[item.tagKey]} cardCta={t.food.cardCta} />
          ))}
        </div>
      </div>
    </section>
  );
}

function HighlightCard({ item, index, featured, tagLabel, cardCta }: { item: typeof HIGHLIGHTS[0]; index: number; featured: boolean; tagLabel: string; cardCta: string }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const { ref: tiltRef, onMouseMove, onMouseLeave: tiltLeave } = useTilt(9);

  return (
    <a
      href="/menu"
      aria-label={`${item.name} — ${cardCta}`}
      className={`reveal menu-card-jungle relative rounded-2xl overflow-hidden cursor-pointer block ${featured ? "sm:col-span-1" : ""}`}
      style={{ transitionDelay: `${index * 0.08}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); tiltLeave(); }}
    >
      <div
        ref={tiltRef}
        className="relative z-10 transition-all duration-500"
        onMouseMove={onMouseMove}
        style={{
          background: "linear-gradient(135deg, rgba(8,20,8,0.96) 0%, rgba(14,35,14,0.92) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: `1px solid ${hovered ? `${item.accent}45` : "rgba(61,138,61,0.12)"}`,
          boxShadow: hovered
            ? `0 24px 50px rgba(0,0,0,0.55), 0 0 35px ${item.accent}22`
            : `0 4px 20px rgba(0,0,0,0.38)`,
          borderRadius: "1rem",
        }}
      >
        {/* Photo or emoji fallback */}
        <div className="relative overflow-hidden" style={{ height: 210 }}>
          {item.img && !imgError ? (
            <>
              <Image
                src={item.img}
                alt={`${item.name} — signature dish at The Jungle Wey restaurant Mahahual`}
                fill
                className="object-cover transition-transform duration-700"
                style={{
                  transform: hovered ? "scale(1.06)" : "scale(1)",
                  filter: "saturate(1.15) brightness(0.80)",
                }}
                onError={() => setImgError(true)}
              />
              {/* Cinematic overlay on photo */}
              <div
                className="absolute inset-0 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(180deg, transparent 30%, rgba(8,20,8,0.88) 100%)`,
                  opacity: hovered ? 0.75 : 0.55,
                }}
              />
              {/* Tag badge on photo */}
              <span
                className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${item.accent}e0`,
                  color: "white",
                  backdropFilter: "blur(8px)",
                }}
              >
                {tagLabel}
              </span>
            </>
          ) : (
            /* Emoji fallback */
            <div
              className="flex items-center justify-center h-full text-8xl transition-transform duration-300"
              style={{
                background: `radial-gradient(ellipse at 60% 30%, ${item.accent}22, rgba(8,20,8,0.95))`,
                transform: hovered ? "scale(1.08)" : "scale(1)",
              }}
              dangerouslySetInnerHTML={{ __html: `<span class="drop-shadow-lg">${item.emoji}</span>` }}
            />
          )}
        </div>

        {/* Accent divider */}
        <div className="h-px" style={{ background: `linear-gradient(90deg, ${item.accent}60, transparent)` }} />

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-white text-2xl leading-tight mb-2">{item.name}</h3>
          <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
          {/* Show tag here only when no image */}
          {(imgError || !item.img) && (
            <span
              className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: `${item.accent}22`, color: item.accent, border: `1px solid ${item.accent}40` }}
            >
              {tagLabel}
            </span>
          )}
          {/* Card action — every card leads somewhere meaningful */}
          <span
            className="mt-3 flex items-center gap-1.5 text-xs font-semibold transition-colors duration-300"
            style={{ color: hovered ? item.accent : "rgba(255,255,255,0.35)" }}
          >
            {cardCta}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 inline-block"
              style={{ transform: hovered ? "translateX(4px)" : "none" }}
            >
              &rarr;
            </span>
          </span>
        </div>

        {/* Hover glow */}
        <div
          className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full pointer-events-none transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${item.accent}30, transparent 70%)`, opacity: hovered ? 1 : 0 }}
        />
      </div>
    </a>
  );
}
