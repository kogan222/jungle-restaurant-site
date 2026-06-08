"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CornerBranch } from "./JungleVines";
import JungleCreatures from "./JungleCreatures";
import AtmosphereCanvas from "./AtmosphereCanvas";
import { DenseFireflies } from "./JungleCreatures";
import { useLanguage } from "@/lib/i18n";

const DRINKS = [
  { emoji: "&#127819;", img: "/images/drink-duo-mocktails.jpg",      name: "Like a Virgin",         desc: "Lime, passion fruit, mint, syrup & soda",                    price: "$90",  type: "Botanical", typeColor: "#2d6e2d" },
  { emoji: "&#127821;", img: "",                                       name: "Un Suerito con Estilo", desc: "Pineapple, cucumber, turmeric & mint",                       price: "$90",  type: "Botanical", typeColor: "#2d6e2d" },
  { emoji: "&#129362;", img: "/images/drink-red-berry.jpg",           name: "Pa' la Calors",         desc: "Blended red berries & oranges with mint",                    price: "$90",  type: "Botanical", typeColor: "#2d6e2d" },
  { emoji: "&#129381;", img: "/images/drink-pink-topdown.jpg",        name: "Pink Coco Crush",       desc: "Coconut cream, guava, grenadine & lime",                     price: "$90",  type: "Botanical", typeColor: "#2d6e2d", featured: true },
  { emoji: "&#127865;", img: "/images/drink-matcha-cocktail.jpg",     name: "Mix Tropical",          desc: "OJ, passion fruit, pineapple, basil & mint",                 price: "$90",  type: "Botanical", typeColor: "#2d6e2d" },
  { emoji: "&#127861;", img: "",                                       name: "Matcha Latte",          desc: "Ceremonial matcha with frothed milk",                        price: "$60",  type: "Coffee",    typeColor: "#a67035" },
  { emoji: "&#11088;",  img: "",                                       name: "Leche Dorada",          desc: "Turmeric, cinnamon, ginger & black pepper",                  price: "$60",  type: "Coffee",    typeColor: "#a67035" },
  { emoji: "&#127867;", img: "/images/drink-mezcal-flight.jpg",       name: "Mezcal Flight",         desc: "Espadín, jabalí, tepeztate & coyote — served on a wood board", price: "$180", type: "Mezcal",    typeColor: "#c8a855", featured: true },
  { emoji: "&#128128;", img: "/images/drink-levanta-muertos.jpg",     name: "Levanta Muertos",       desc: "Spicy Ojo Rojo, clamato, shrimp skewer & worm salt",         price: "$80",  type: "Chelas",    typeColor: "#e8562a" },
  { emoji: "&#127866;", img: "",                                       name: "Panteón Craft Beer",    desc: "Made in Mahahual — ask for today's brew",                    price: "$120", type: "Chelas",    typeColor: "#d4b483" },
  { emoji: "&#9749;",   img: "/images/drink-espresso-martini.jpg",    name: "Espresso Martini",      desc: "Vodka, espresso, coffee liqueur — silky, bold, unforgettable", price: "$130", type: "Cocktails", typeColor: "#6a4a2a", featured: true },
  { emoji: "&#127817;", img: "/images/drink-mezcalito-zen.jpg",       name: "Mezcalito Zen",         desc: "Mezcal, cucumber, lime & chili rim — smoky meets fresh",     price: "$110", type: "Cocktails", typeColor: "#5a9a5a" },
];

export default function DrinksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal, .reveal-scale").forEach((el, i) =>
              setTimeout(() => el.classList.add("visible"), i * 80)
            );
        }),
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="drinks" ref={ref} className="relative py-24 md:py-36 bg-[#0c2010] overflow-hidden">
      {/* Corner decoration */}
      <CornerBranch corner="bl" />
      <CornerBranch corner="br" />

      {/* Canvas atmosphere — cool botanical feel */}
      <AtmosphereCanvas
        className="z-[2] opacity-50"
        raySource={{ x: 0.2, y: -0.05 }}
        rayCount={7}
        rayIntensity={0.45}
        particleCount={60}
        fogIntensity={0.5}
        theme="cool"
      />

      {/* Dense fireflies — drinks section is the most atmospheric */}
      <DenseFireflies count={25} />
      <JungleCreatures section="drinks" />

      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 600px 400px at 70% 30%, rgba(98,160,98,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 400px 600px at 20% 70%, rgba(45,110,45,0.08) 0%, transparent 70%)
        `,
      }} />

      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full" style={{ height: 80 }}>
          <path d="M0,0 C360,80 1080,80 1440,0 L1440,0 L0,0 Z" fill="#0a1a0a" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="reveal flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #e8562a, transparent)" }} />
            <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">
              {t.drinks.eyebrow}
            </span>
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #e8562a, transparent)" }} />
          </div>
          <h2 className="reveal font-playfair text-white font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            {t.drinks.headlineA}<span className="gradient-text">{t.drinks.headlineB}</span>
          </h2>
          <p className="reveal text-white/40 text-base max-w-lg mx-auto leading-relaxed">
            {t.drinks.sub}
            <em className="not-italic text-[#d4b483]"> {t.drinks.subAccent}</em>
          </p>
        </div>

        {/* Drink cards — two column asymmetric layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DRINKS.map((drink, i) => (
            <DrinkCard key={drink.name} drink={drink} index={i} mustTryLabel={t.drinks.mustTry} typeLabel={t.drinks.types[drink.type as keyof typeof t.drinks.types] ?? drink.type} />
          ))}
        </div>

        {/* CTA */}
        <div className="reveal text-center mt-14">
          <a
            href="#menu"
            className="group inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:scale-105 text-sm"
            style={{
              background: "linear-gradient(135deg, rgba(10,26,10,0.9), rgba(30,70,30,0.8))",
              border: "1px solid rgba(61,138,61,0.25)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <span>&#127807;</span>
            <span>{t.drinks.cta}</span>
            <span className="text-[#62a062] group-hover:translate-x-1 transition-transform inline-block">&rarr;</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function DrinkCard({ drink, index, mustTryLabel, typeLabel }: { drink: typeof DRINKS[0]; index: number; mustTryLabel: string; typeLabel: string }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const hasImg = !!drink.img && !imgError;

  return (
    <div
      className="reveal menu-card-jungle relative rounded-2xl overflow-hidden"
      style={{ transitionDelay: `${index * 0.06}s` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Featured badge */}
      {drink.featured && (
        <div
          className="absolute top-3 right-3 text-white text-xs font-bold px-2.5 py-1 rounded-full z-20"
          style={{ backgroundColor: drink.typeColor, boxShadow: `0 2px 12px ${drink.typeColor}60` }}
        >
          &#10022; {mustTryLabel}
        </div>
      )}

      <div
        className="relative z-10"
        style={{
          background: `linear-gradient(135deg, rgba(8,20,8,0.96), rgba(14,36,14,0.88))`,
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${hovered ? `${drink.typeColor}38` : "rgba(61,138,61,0.10)"}`,
          boxShadow: hovered
            ? `0 16px 40px rgba(0,0,0,0.50), 0 0 24px ${drink.typeColor}28`
            : `0 4px 16px rgba(0,0,0,0.32)`,
          borderRadius: "1rem",
          transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
        }}
      >
        {/* Photo top — only when image exists */}
        {hasImg && (
          <div className="relative overflow-hidden" style={{ height: 160 }}>
            <Image
              src={drink.img}
              alt={`${drink.name} — craft drink at The Jungle Wey Mahahual`}
              fill
              className="object-cover transition-transform duration-700"
              style={{
                transform: hovered ? "scale(1.07)" : "scale(1)",
                filter: "saturate(1.1) brightness(0.78)",
              }}
              onError={() => setImgError(true)}
            />
            <div className="absolute inset-0" style={{
              background: "linear-gradient(180deg, transparent 40%, rgba(8,20,8,0.92) 100%)",
            }} />
          </div>
        )}

        {/* Card body */}
        <div className="p-4 md:p-5">
          {/* Accent line (only when no image) */}
          {!hasImg && (
            <div className="h-0.5 w-full mb-4 rounded-full" style={{ background: `linear-gradient(90deg, ${drink.typeColor}, transparent)` }} />
          )}

          <div className="flex items-start gap-3">
            {/* Emoji orb (only when no image) */}
            {!hasImg && (
              <div
                className="text-2xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0"
                style={{ background: `${drink.typeColor}14`, border: `1px solid ${drink.typeColor}22` }}
                dangerouslySetInnerHTML={{ __html: drink.emoji }}
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-playfair font-bold text-white text-base leading-tight">{drink.name}</h3>
                <span className="font-bold text-sm flex-shrink-0" style={{ color: drink.typeColor }}>{drink.price}</span>
              </div>
              <p className="text-white/42 text-xs leading-relaxed mb-2">{drink.desc}</p>
              <span
                className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ color: drink.typeColor, background: `${drink.typeColor}18`, border: `1px solid ${drink.typeColor}30` }}
              >
                {typeLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
