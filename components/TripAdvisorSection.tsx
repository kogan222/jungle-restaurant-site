"use client";

import { useEffect, useRef } from "react";
import { WHATSAPP_RESERVE_URL, PHONE, GOOGLE_MAPS, TEL_URL } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";

/* ════════════════════════════════════════════════════════
   TRIPADVISOR SECTION
   Rating: 5.0 / 5 · 23 reviews · #23 of 102 in Mahahual
   Placed between Video and Contact sections.
════════════════════════════════════════════════════════ */

const TRIPADVISOR_URL =
  "https://www.tripadvisor.com/Restaurant_Review-g499450-d33319306-Reviews-The_Jungle_Wey-Mahahual_Costa_Maya_Yucatan_Peninsula.html";

const FEATURES_KEYS = [
  { icon: "&#127807;", key: "outdoor" as const },
  { icon: "&#127925;", key: "music"   as const },
  { icon: "&#127863;", key: "bar"     as const },
  { icon: "&#128247;", key: "wifi"    as const },
  { icon: "&#128054;", key: "dog"     as const },
  { icon: "&#129367;", key: "vegan"   as const },
];

/* TripAdvisor owl icon as inline SVG */
function OwlIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="25" cy="25" r="25" fill="#00af87" />
      <ellipse cx="17" cy="24" rx="7" ry="8" fill="white" />
      <ellipse cx="33" cy="24" rx="7" ry="8" fill="white" />
      <circle cx="17" cy="24" r="4" fill="#00af87" />
      <circle cx="33" cy="24" r="4" fill="#00af87" />
      <circle cx="17" cy="24" r="2.5" fill="white" />
      <circle cx="33" cy="24" r="2.5" fill="white" />
      <path d="M17 34 Q25 38 33 34" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M20 16 L17 13 L14 16" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30 16 L33 13 L36 16" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Five filled circles (TripAdvisor "bubbles") */
function RatingBubbles({ rating = 5, size = 22 }: { rating?: number; size?: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.floor(rating);
        return (
          <div
            key={i}
            style={{
              width: size,
              height: size,
              borderRadius: "50%",
              background: filled ? "#00af87" : "rgba(0,175,135,0.2)",
              border: `2px solid ${filled ? "#00af87" : "rgba(0,175,135,0.3)"}`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function TripAdvisorSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal").forEach((el, i) =>
              setTimeout(() => el.classList.add("visible"), i * 90)
            );
        }),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ background: "#0a1a0a" }}
    >
      {/* Subtle green glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,175,135,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-10">

        {/* Eyebrow */}
        <div className="reveal flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, rgba(0,175,135,0.6))" }} />
          <span className="text-[#00af87] text-xs tracking-[0.35em] uppercase font-medium">
            {t.tripadvisor.eyebrow}
          </span>
          <span className="h-px w-14" style={{ background: "linear-gradient(90deg, rgba(0,175,135,0.6), transparent)" }} />
        </div>

        {/* Main card */}
        <div
          className="reveal rounded-3xl p-8 md:p-12"
          style={{
            background: "linear-gradient(135deg, rgba(10,28,18,0.95) 0%, rgba(6,20,12,0.98) 100%)",
            border: "1px solid rgba(0,175,135,0.18)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.5), 0 0 60px rgba(0,175,135,0.06)",
            backdropFilter: "blur(20px)",
          }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">

            {/* Left — rating block */}
            <div className="flex flex-col items-center md:items-start gap-5 flex-shrink-0">
              <OwlIcon size={56} />

              {/* Score */}
              <div className="text-center md:text-left">
                <div
                  className="font-playfair font-black leading-none"
                  style={{
                    fontSize: "clamp(3.5rem, 8vw, 5.5rem)",
                    color: "#00af87",
                    textShadow: "0 0 60px rgba(0,175,135,0.4)",
                  }}
                >
                  5.0
                </div>
                <div className="text-white/40 text-sm mt-1">out of 5</div>
              </div>

              <RatingBubbles rating={5} size={20} />

              <div className="text-center md:text-left">
                <p className="text-white/70 text-sm font-medium">{t.tripadvisor.reviews}</p>
                <p className="text-white/35 text-xs mt-0.5">{t.tripadvisor.ranking}</p>
              </div>
            </div>

            {/* Divider */}
            <div
              className="hidden md:block w-px self-stretch"
              style={{ background: "linear-gradient(180deg, transparent, rgba(0,175,135,0.25), transparent)" }}
            />
            <div
              className="md:hidden h-px w-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(0,175,135,0.25), transparent)" }}
            />

            {/* Right — text + features + CTA */}
            <div className="flex-1">
              <h2
                className="font-playfair font-black text-white leading-tight mb-3"
                style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)" }}
              >
                {t.tripadvisor.headlineA}<span style={{ color: "#00af87" }}>{t.tripadvisor.excellent}</span><br />
                {t.tripadvisor.headlineB}
              </h2>
              <p className="text-white/50 text-sm md:text-base leading-relaxed mb-7 max-w-lg">
                {t.tripadvisor.quote}
              </p>

              {/* Feature chips */}
              <div className="flex flex-wrap gap-2 mb-8">
                {FEATURES_KEYS.map((f) => (
                  <span
                    key={f.key}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                    style={{
                      background: "rgba(0,175,135,0.10)",
                      border: "1px solid rgba(0,175,135,0.20)",
                      color: "rgba(255,255,255,0.70)",
                    }}
                  >
                    <span dangerouslySetInnerHTML={{ __html: f.icon }} />
                    {t.tripadvisor.features[f.key]}
                  </span>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={TRIPADVISOR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
                  style={{
                    background: "#00af87",
                    color: "white",
                    boxShadow: "0 6px 28px rgba(0,175,135,0.40)",
                  }}
                >
                  <OwlIcon size={20} />
                  {t.tripadvisor.cta1}
                </a>
                <a
                  href={`${TRIPADVISOR_URL}#REVIEWS`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-white/10"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(0,175,135,0.25)",
                    color: "rgba(255,255,255,0.80)",
                  }}
                >
                  {t.tripadvisor.cta2}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Phone number strip */}
        <div className="reveal mt-8 flex flex-col sm:flex-row items-center justify-center gap-6 text-center">
          <a
            href={TEL_URL}
            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm group"
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors group-hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
            >
              &#128222;
            </span>
            <span>{t.tripadvisor.callLabel}</span>
          </a>
          <span className="text-white/15 hidden sm:block">·</span>
          <a
            href={WHATSAPP_RESERVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm group"
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors group-hover:bg-white/10"
              style={{ background: "rgba(37,211,102,0.10)", border: "1px solid rgba(37,211,102,0.20)" }}
            >
              &#128172;
            </span>
            <span>{t.tripadvisor.waLabel}</span>
          </a>
          <span className="text-white/15 hidden sm:block">·</span>
          <a
            href={GOOGLE_MAPS}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-white/60 hover:text-white transition-colors text-sm group"
          >
            <span
              className="w-10 h-10 rounded-full flex items-center justify-center text-lg transition-colors group-hover:bg-white/10"
              style={{ background: "rgba(232,86,42,0.10)", border: "1px solid rgba(232,86,42,0.20)" }}
            >
              &#128205;
            </span>
            <span>{t.tripadvisor.mapsLabel}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
