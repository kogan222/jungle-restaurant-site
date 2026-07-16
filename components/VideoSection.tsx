"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

/* ════════════════════════════════════════════════════════
   VIDEO SECTION — Full-width cinematic restaurant reel
   Placed between Gallery and Contact sections.
   Autoplay · muted · loop · playsInline
════════════════════════════════════════════════════════ */

export default function VideoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { t } = useLanguage();

  /* Play/pause based on visibility for performance */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(() => {/* autoplay blocked — ok */});
        } else {
          videoRef.current?.pause();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#020d0e]"
      style={{ minHeight: "60vh" }}
    >
      {/* ── Top wave transition from Gallery ── */}
      <div className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
          <path d="M0,0 C480,60 960,60 1440,0 L1440,0 L0,0 Z" fill="#0a1a0a" />
        </svg>
      </div>

      {/* ── The video ── */}
      {!hasError ? (
        <video
          ref={videoRef}
          src="/images/video-atmosphere.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          onError={() => setHasError(true)}
          className="w-full h-full object-cover"
          style={{
            display: "block",
            minHeight: "60vh",
            maxHeight: "90vh",
            filter: "saturate(1.15) brightness(0.88)",
          }}
        />
      ) : (
        /* Fallback if video fails to load */
        <div
          className="w-full flex items-center justify-center"
          style={{
            minHeight: "60vh",
            background: "linear-gradient(135deg, #0a1e0a, #1e3a1e)",
          }}
        >
          <p className="text-white/30 text-sm">&#127807;</p>
        </div>
      )}

      {/* ── Cinematic top & bottom fade ── */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: `
          linear-gradient(180deg,
            rgba(10,26,10,0.55) 0%,
            transparent 18%,
            transparent 78%,
            rgba(2,13,14,0.75) 100%
          )
        `,
      }} />

      {/* ── Subtle brand text overlay ── */}
      <div
        className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none select-none"
        style={{ opacity: isVisible ? 1 : 0, transition: "opacity 1.2s ease" }}
      >
        <div className="text-center px-6">
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="h-px w-16" style={{ background: "linear-gradient(90deg, transparent, rgba(206,139,77,0.6))" }} />
            <span className="text-[#ce8b4d]/60 text-xs tracking-[0.45em] uppercase">
              {t.video.eyebrow}
            </span>
            <span className="h-px w-16" style={{ background: "linear-gradient(90deg, rgba(206,139,77,0.6), transparent)" }} />
          </div>
          <p
            className="font-display font-black text-white drop-shadow-2xl"
            style={{
              fontSize: "clamp(2rem, 6vw, 4.5rem)",
              lineHeight: 1.1,
              textShadow: "0 4px 40px rgba(0,0,0,0.8)",
              letterSpacing: "-0.01em",
            }}
          >
            {t.video.headlineA}
            <span className="gradient-text-green">{t.video.headlineB}</span>
          </p>
        </div>
      </div>

      {/* ── Bottom wave transition to Contact ── */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full" style={{ height: 60 }}>
          <path d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" fill="#faf6ef" />
        </svg>
      </div>
    </section>
  );
}
