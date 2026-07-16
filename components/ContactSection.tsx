"use client";

import { useEffect, useRef, useState } from "react";
import { WHATSAPP_RESERVE_URL } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";
import {
  HOURS as FALLBACK_HOURS,
  formatHours,
  type DayHours,
  type GoogleBusinessData,
} from "@/lib/business-info";

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  /* Hours: static fallback, upgraded from the Google Business
     Profile via /api/google-business when the API is configured. */
  const [hours, setHours] = useState<DayHours[]>(FALLBACK_HOURS);
  const [google, setGoogle] = useState<GoogleBusinessData | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/google-business")
      .then((r) => (r.ok ? r.json() : null))
      .then((data: GoogleBusinessData | null) => {
        if (cancelled || !data) return;
        if (data.hours?.length === 7) setHours(data.hours);
        if (data.source === "google") setGoogle(data);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal").forEach((el, i) =>
              setTimeout(() => el.classList.add("visible"), i * 100)
            );
        }),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" ref={ref} className="relative py-24 md:py-36 bg-[#faf6ef] overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-16 fill-[#0c1f0c]">
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-8">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="reveal flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-12 bg-[#f04e30]" />
            <span className="text-[#2d6e2d] text-sm tracking-[0.2em] uppercase font-medium">
              {t.contact.eyebrow}
            </span>
            <span className="h-px w-12 bg-[#f04e30]" />
          </div>
          <h2 className="reveal font-display text-[#0c1f0c] font-black leading-tight" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            {t.contact.headlineA}<span className="gradient-text">{t.contact.headlineB}</span>
          </h2>
          <p className="reveal text-[#3a2210]/60 text-lg mt-4 max-w-md mx-auto leading-relaxed">
            {t.contact.sub}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Left: info cards */}
          <div className="flex flex-col gap-6">

            {/* Address */}
            <div className="reveal glass-dark rounded-2xl p-6 md:p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#f04e30]/20 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0">
                  &#128205;
                </div>
                <div>
                  <h3 className="font-display text-white font-bold text-xl mb-1">{t.contact.addressTitle}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Av. Paseo del Puerto 1127<br />
                    Mahahual, Quintana Roo<br />
                    M&eacute;xico 77976
                  </p>
                  <a
                    href="https://www.google.com/maps/place/The+Jungle+Wey/@18.7074,-87.7063,17z/data=!3m1!4b1!4m6!3m5!1s0x8f5b99d1b1c2e4f5:0x1!8m2!3d18.7074!4d-87.7063!16s%2Fg%2F11x1234567?hl=en&entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-[#62a062] text-sm font-medium hover:text-white transition-colors"
                  >
                    {t.contact.openMaps}
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="reveal glass-dark rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">&#128336;</span>
                <h3 className="font-display text-white font-bold text-xl">{t.contact.hoursTitle}</h3>
              </div>
              <div className="flex flex-col gap-2.5">
                {hours.map((h) => {
                  const today = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()];
                  const isToday = h.day === today;
                  return (
                    <div
                      key={h.day}
                      className={`flex justify-between items-center text-sm py-1.5 border-b border-white/5 last:border-0 ${
                        isToday ? "text-[#62a062] font-semibold" : "text-white/50"
                      }`}
                    >
                      <span>
                        {t.contact.days[h.day as keyof typeof t.contact.days]}
                        {isToday && (
                          <span className="text-xs text-[#f04e30] ml-2 font-normal">{t.contact.today}</span>
                        )}
                      </span>
                      <span>{formatHours(h)}</span>
                    </div>
                  );
                })}
              </div>
              {/* Live Google rating — only rendered when the Places API is configured */}
              {google?.rating && (
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10 text-sm text-white/60">
                  <span aria-hidden="true" style={{ color: "#ce8b4d" }}>★</span>
                  <span className="font-semibold text-white/80">{google.rating.toFixed(1)}</span>
                  <span>· {google.totalRatings} Google reviews</span>
                </div>
              )}
            </div>

            {/* Social / Contact buttons */}
            <div className="reveal flex flex-col sm:flex-row gap-4">
              <a
                href={WHATSAPP_RESERVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1aad54] text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(37,211,102,0.4)]"
              >
                <span className="text-2xl">&#128172;</span>
                <div className="text-left">
                  <div className="text-sm font-bold">{t.contact.waTitle}</div>
                  <div className="text-xs opacity-80">{t.contact.waDesc}</div>
                </div>
              </a>
              <a
                href="https://instagram.com/thejunglewey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-3 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)",
                  boxShadow: "0 4px 20px rgba(253,29,29,0.3)",
                }}
              >
                <span className="text-2xl">&#128247;</span>
                <div className="text-left">
                  <div className="text-sm font-bold">{t.contact.igTitle}</div>
                  <div className="text-xs opacity-80">{t.contact.igDesc}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right: map + walk-in card */}
          <div className="reveal flex flex-col gap-5">

            {/* Map illustration */}
            <div className="flex-1 rounded-2xl overflow-hidden min-h-[280px] relative bg-[#1e3a1e]">
              <svg viewBox="0 0 600 400" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="600" height="400" fill="#1a3a1a" />
                {/* Streets */}
                <rect x="0" y="180" width="600" height="18" fill="#2d5a2d" opacity="0.5" />
                <rect x="0" y="280" width="600" height="14" fill="#2d5a2d" opacity="0.4" />
                <rect x="120" y="0" width="14" height="400" fill="#2d5a2d" opacity="0.4" />
                <rect x="320" y="0" width="18" height="400" fill="#2d5a2d" opacity="0.5" />
                <rect x="480" y="0" width="12" height="400" fill="#2d5a2d" opacity="0.3" />
                {/* City blocks */}
                <rect x="140" y="200" width="170" height="74" rx="4" fill="#245824" opacity="0.4" />
                <rect x="340" y="200" width="130" height="74" rx="4" fill="#245824" opacity="0.35" />
                <rect x="140" y="50" width="170" height="120" rx="4" fill="#245824" opacity="0.35" />
                <rect x="340" y="50" width="130" height="120" rx="4" fill="#245824" opacity="0.3" />
                {/* Ocean */}
                <rect x="0" y="300" width="100" height="100" fill="#1a4a5a" opacity="0.6" />
                <rect x="0" y="300" width="600" height="100" fill="#1a4a5a" opacity="0.2" />
                {/* Map pin */}
                <circle cx="230" cy="240" r="28" fill="#f04e30" opacity="0.2" />
                <circle cx="230" cy="240" r="20" fill="#f04e30" opacity="0.9" />
                <circle cx="230" cy="240" r="10" fill="white" opacity="0.9" />
                <line x1="230" y1="260" x2="230" y2="278" stroke="#f04e30" strokeWidth="3" />
                {/* Label */}
                <rect x="148" y="202" width="142" height="28" rx="4" fill="#f04e30" opacity="0.9" />
                <text x="219" y="221" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold" fontFamily="Poppins, sans-serif">The Jungle Wey</text>
              </svg>

              {/* Open Maps CTA */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
                <a
                  href="https://www.google.com/maps/search/The+Jungle+Wey+Avenida+Paseo+del+Puerto+1127+Mahahual+Quintana+Roo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-white text-[#0c1f0c] text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  {t.contact.openGMaps}
                </a>
              </div>
            </div>

            {/* Walk-ins card */}
            <div
              className="rounded-2xl p-6 flex items-center gap-4"
              style={{ background: "linear-gradient(135deg, #0c1f0c, #1d3927)" }}
            >
              <span className="text-5xl">&#127807;</span>
              <div>
                <p className="font-display text-white font-bold text-lg">{t.contact.walkinsTitle}</p>
                <p className="text-white/55 text-sm mt-1 leading-relaxed">
                  {t.contact.walkinsSub}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
