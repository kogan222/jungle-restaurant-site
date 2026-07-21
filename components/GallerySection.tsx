"use client";

import { useEffect, useRef } from "react";
import { SideVine } from "./JungleVines";
import Fireflies from "./Fireflies";
import InstagramFeed from "./InstagramFeed";
import { useLanguage } from "@/lib/i18n";

export default function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal").forEach((el, i) =>
              setTimeout(() => el.classList.add("visible"), i * 100)
            );
        }),
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="gallery" ref={ref} className="relative py-24 md:py-36 bg-[#0a1a0a] overflow-hidden">
      {/* Side vines */}
      <SideVine side="left" height={600} />
      <SideVine side="right" height={600} />

      {/* Fireflies — gallery is the most atmospheric dark section */}
      <Fireflies count={20} className="opacity-70" />

      {/* Atmospheric background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(45,110,45,0.08) 0%, transparent 70%)",
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="reveal flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
            <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">
              {t.gallery.eyebrow}
            </span>
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
          </div>
          <h2 className="reveal font-display text-white font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            {t.gallery.headlineA}<span className="gradient-text">{t.gallery.headlineB}</span>
          </h2>
          <p className="reveal text-white/45 max-w-md mx-auto text-sm leading-relaxed">
            {t.gallery.sub}
          </p>
        </div>

        {/* Instagram feed — the site's single photo gallery */}
        <InstagramFeed />
      </div>
    </section>
  );
}
