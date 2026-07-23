"use client";

import { useEffect, useRef, useState } from "react";
import { WHATSAPP_RESERVE_URL, PHONE, GOOGLE_MAPS, TEL_URL } from "@/lib/contact";
import { GOOGLE_PLACE_URL, GOOGLE_REVIEW_URL, type GoogleBusinessData } from "@/lib/business-info";
import { useLanguage } from "@/lib/i18n";

/* ════════════════════════════════════════════════════════
   TRIPADVISOR + GOOGLE REVIEWS SECTION
   TripAdvisor: static rating (5.0 / 5 · 23 reviews).
   Google: live via /api/google-business once GOOGLE_PLACES_API_KEY is
   configured (Place ID is already known — see docs/INTEGRATIONS.md);
   otherwise a safe "find us on Google" card — never fake reviews.
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

/* Google's official multi-color "G" mark, reproduced inline — same
   approach as the TripAdvisor owl above (a real, recognizable brand mark,
   not an invented icon). */
function GoogleGIcon({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.9 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6.5 29.6 4 24 4c-7.4 0-13.8 4.1-17.1 10.2z"/>
      <path fill="#4CAF50" d="M24 44c5.5 0 10.5-2.1 14.3-5.6l-6.6-5.6C29.6 34.5 26.9 35.5 24 35.5c-5.2 0-9.6-3.3-11.2-7.9l-6.5 5C9.9 39.8 16.4 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.4-2.4 4.4-4.5 5.8l6.6 5.6C40.3 36.5 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

/* Five-star row for the Google score (Google uses stars, not "bubbles") */
function StarRow({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#FBBC05" : "rgba(251,188,5,0.2)"} aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      })}
    </div>
  );
}

/* Companion card to TripAdvisor — reuses the already-built
   /api/google-business bridge (no new credentials are configured here).
   Shows live rating + real review snippets once the client connects
   Google Business; a safe, honest placeholder until then. */
function GoogleReviewsCard() {
  const { t } = useLanguage();
  const [data, setData] = useState<GoogleBusinessData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/google-business")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: GoogleBusinessData | null) => { if (!cancelled) setData(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const live = data?.source === "google" && typeof data.rating === "number";

  return (
    <div
      className="reveal rounded-3xl p-8 md:p-12 mt-6"
      style={{
        background: "linear-gradient(135deg, rgba(22,22,26,0.95) 0%, rgba(14,14,17,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-10 md:gap-16">

        {/* Left — rating block */}
        <div className="flex flex-col items-center md:items-start gap-5 flex-shrink-0">
          <GoogleGIcon size={44} />

          {live ? (
            <>
              <div className="text-center md:text-left">
                <div
                  className="font-display font-black leading-none text-white"
                  style={{ fontSize: "clamp(3.5rem, 8vw, 5.5rem)" }}
                >
                  {data!.rating!.toFixed(1)}
                </div>
                <div className="text-white/40 text-sm mt-1">{t.googleReviews.outOf5}</div>
              </div>
              <StarRow rating={data!.rating!} />
              {typeof data!.totalRatings === "number" && (
                <p className="text-white/70 text-sm font-medium">
                  {data!.totalRatings} {t.googleReviews.reviewsSuffix}
                </p>
              )}
            </>
          ) : (
            <p className="font-display text-white text-2xl">{t.googleReviews.title}</p>
          )}
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px self-stretch" style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.15), transparent)" }} />
        <div className="md:hidden h-px w-full" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)" }} />

        {/* Right — real snippets (live) or safe placeholder + CTA */}
        <div className="flex-1">
          {live && data!.reviews && data!.reviews.length > 0 ? (
            <div className="flex flex-col gap-4 mb-7">
              {data!.reviews.slice(0, 2).map((r, i) => (
                <div key={i}>
                  <p className="text-white/60 text-sm md:text-base leading-relaxed">&ldquo;{r.text}&rdquo;</p>
                  <p className="text-white/30 text-xs mt-1">— {r.author}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm md:text-base leading-relaxed mb-7 max-w-lg">
              {t.googleReviews.comingSoonBody}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={GOOGLE_PLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
              style={{ background: "white", color: "#1a1a1a", boxShadow: "0 6px 28px rgba(255,255,255,0.15)" }}
            >
              <GoogleGIcon size={18} />
              {live ? t.googleReviews.ctaLive : t.googleReviews.cta}
            </a>
            <a
              href={GOOGLE_REVIEW_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-white/10"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.20)",
                color: "rgba(255,255,255,0.80)",
              }}
            >
              {t.googleReviews.ctaWrite}
            </a>
          </div>
        </div>
      </div>
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
                  className="font-display font-black leading-none"
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
                className="font-display font-black text-white leading-tight mb-3"
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

        {/* Google Reviews — companion card, balanced alongside TripAdvisor */}
        <GoogleReviewsCard />

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
              style={{ background: "rgba(240,78,48,0.10)", border: "1px solid rgba(240,78,48,0.20)" }}
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
