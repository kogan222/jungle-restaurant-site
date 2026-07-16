"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { CornerBranch, SideVine } from "./JungleVines";
import { useLanguage } from "@/lib/i18n";
import SunRays from "./SunRays";
import Fireflies from "./Fireflies";
import JungleCreatures from "./JungleCreatures";
import AtmosphereCanvas from "./AtmosphereCanvas";

const PILLAR_META = [
  { icon: "&#127807;", accent: "#2d6e2d", key: "p1" as const },
  { icon: "&#128293;", accent: "#f04e30", key: "p2" as const },
  { icon: "&#127865;", accent: "#62a062", key: "p3" as const },
  { icon: "&#10024;",  accent: "#ce8b4d", key: "p4" as const },
];

export default function VibeSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal, .reveal-left, .reveal-scale").forEach((el, i) =>
              setTimeout(() => el.classList.add("visible"), i * 120)
            );
        });
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="vibe" ref={ref} className="relative py-24 md:py-36 overflow-hidden bg-[#0f260f]">
      {/* Canvas atmosphere — gentle god rays, cool theme */}
      <AtmosphereCanvas
        className="z-[2] opacity-60"
        raySource={{ x: 0.85, y: 0.0 }}
        rayCount={8}
        rayIntensity={0.5}
        particleCount={80}
        fogIntensity={0.6}
        theme="cool"
      />
      {/* Fireflies — ambient glow in dark section */}
      <Fireflies count={14} className="opacity-60" />
      {/* Creatures */}
      <JungleCreatures section="vibe" />

      {/* Background atmosphere */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `
          radial-gradient(ellipse 700px 500px at 85% 40%, rgba(45,110,45,0.12) 0%, transparent 70%),
          radial-gradient(ellipse 500px 700px at 10% 70%, rgba(29,57,39,0.15) 0%, transparent 70%)
        `,
      }} />

      {/* Vines */}
      <SideVine side="left" height={900} />
      <CornerBranch corner="tr" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10">

        {/* TOP: Text left + Photo right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-20 items-center mb-20 md:mb-28">
          {/* Text */}
          <div>
            <div className="reveal flex items-center gap-3 mb-6">
              <span className="h-px w-14" style={{ background: "linear-gradient(90deg, #f04e30, transparent)" }} />
              <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">{t.vibe.eyebrow}</span>
            </div>
            <h2 className="reveal font-display text-white font-black leading-[1.08] mb-6" style={{ fontSize: "clamp(2.2rem, 5vw, 3.8rem)" }}>
              {t.vibe.headlineA}<br />
              {t.vibe.headlineB} <span className="gradient-text">{t.vibe.headlineC}</span>
            </h2>
            <div className="reveal mb-8">
              <div
                className="rounded-2xl p-6 md:p-8 border-l-4 relative overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(14,36,14,0.9), rgba(20,50,20,0.7))",
                  backdropFilter: "blur(16px)",
                  borderColor: "#f04e30",
                }}
              >
                <span className="text-[#f04e30] text-5xl font-display leading-none opacity-50">&ldquo;</span>
                <p className="font-display text-white/80 text-lg md:text-xl italic leading-relaxed -mt-3">
                  {t.vibe.quote}
                </p>
                <p className="text-[#ce8b4d] mt-5 text-xs font-medium tracking-[0.3em] uppercase">
                  {t.vibe.quoteAuthor}
                </p>
              </div>
            </div>
            <p className="reveal text-white/50 text-base leading-relaxed">
              {t.vibe.body}
              <em className="not-italic text-[#62a062]">{t.vibe.bodyAccent}</em>
              {t.vibe.bodyEnd}
            </p>
          </div>

          {/* Photo panel */}
          <div className="reveal-scale relative">
            <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: "4/5", maxHeight: 580 }}>
              {!imgError ? (
                <Image
                  src="/images/vibe-couple-toast.jpg"
                  alt="Guests enjoying drinks at The Jungle Wey outdoor tropical garden"
                  fill
                  priority
                  className="object-cover object-top"
                  style={{ filter: "saturate(1.15) brightness(0.78)" }}
                  onError={() => setImgError(true)}
                />
              ) : (
                /* SVG fallback — garden scene */
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #1d3927, #0c1f0c)" }}>
                  <svg viewBox="0 0 400 500" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
                    <rect width="400" height="500" fill="#1a3a1a" />
                    <radialGradient id="vsun" cx="65%" cy="15%" r="50%">
                      <stop offset="0%" stopColor="#ce8b4d" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <rect width="400" height="500" fill="url(#vsun)" />
                    {[40,130,250,340].map((x, i) => (
                      <g key={i}>
                        <ellipse cx={x} cy={30 + i*15} rx={55+i*8} ry={65+i*5} fill={i%2===0?"#2d6e2d":"#1d3927"} opacity="0.88" />
                        <rect x={x-6} y={70+i*15} width={12+i*2} height={430} rx="6" fill="#1a0f00" opacity="0.7" />
                      </g>
                    ))}
                    <rect x="0" y="390" width="400" height="110" fill="#1a0f00" opacity="0.55" />
                    <rect x="80" y="370" width="200" height="26" rx="5" fill="#6e4420" />
                    <rect x="55" y="378" width="25" height="22" rx="3" fill="#5f9ea0" opacity="0.9" />
                    <rect x="290" y="378" width="25" height="22" rx="3" fill="#5f9ea0" opacity="0.9" />
                    <path d="M310 230 Q340 248 370 228" stroke="#c9b07a" strokeWidth="5" fill="none" opacity="0.5" />
                    <ellipse cx="10" cy="480" rx="40" ry="25" fill="#245824" opacity="0.9" transform="rotate(-20 10 480)" />
                    <ellipse cx="395" cy="470" rx="35" ry="22" fill="#1d3927" opacity="0.85" transform="rotate(18 395 470)" />
                    {[0,1,2].map((i) => (
                      <polygon key={i} points={`${230+i*25},0 ${245+i*25},0 ${340+i*40},500 ${315+i*40},500`} fill="#ce8b4d" opacity="0.05" />
                    ))}
                  </svg>
                </div>
              )}
              {/* Cinematic overlay */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(180deg, transparent 30%, rgba(10,26,10,0.7) 100%)",
              }} />
              {/* Warm grade */}
              <div className="absolute inset-0" style={{
                background: "linear-gradient(135deg, rgba(154,101,56,0.12) 0%, transparent 60%)",
              }} />
              {/* Caption */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="font-display text-white font-bold text-xl drop-shadow-lg">{t.vibe.photoCaption}</p>
                <p className="text-white/60 text-sm mt-1">{t.vibe.photoCaptionSub}</p>
              </div>
            </div>

            {/* Floating leaf accent */}
            <div className="absolute -top-8 -right-8 w-24 h-36 leaf-float-2 pointer-events-none" style={{ opacity: 0.7 }}>
              <svg viewBox="0 0 100 150" fill="none" className="w-full h-full">
                <path d="M50 5 C30 20,5 60,12 100 C20 130,46 145,50 140 C34 108,32 72,50 5Z" fill="#1d3927" opacity="0.9" />
                <path d="M50 5 C70 20,95 62,88 103 C80 130,54 144,50 140 C66 106,70 70,50 5Z" fill="#245824" opacity="0.85" />
              </svg>
            </div>
          </div>
        </div>

        {/* Pillars — glass cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {PILLAR_META.map((p, i) => {
            const titles = [t.vibe.p1title, t.vibe.p2title, t.vibe.p3title, t.vibe.p4title];
            const bodies = [t.vibe.p1body,  t.vibe.p2body,  t.vibe.p3body,  t.vibe.p4body];
            return (
              <div
                key={p.key}
                className={`reveal reveal-delay-${i + 1} menu-card-jungle rounded-2xl p-6 md:p-7`}
                style={{
                  background: "linear-gradient(135deg, rgba(10,26,10,0.9), rgba(18,45,18,0.8))",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(61,138,61,0.12)",
                }}
              >
                <span
                  className="text-4xl block mb-4 w-14 h-14 flex items-center justify-center rounded-2xl"
                  style={{ background: `${p.accent}18` }}
                  dangerouslySetInnerHTML={{ __html: p.icon }}
                />
                <h3 className="font-display text-white font-bold text-xl mb-2">{titles[i]}</h3>
                <p className="text-white/45 text-sm leading-relaxed">{bodies[i]}</p>
                <div className="mt-4 h-0.5 w-8 rounded-full" style={{ backgroundColor: p.accent }} />
              </div>
            );
          })}
        </div>

        {/* Wide cinematic banner — neon sign photo */}
        <div className="reveal mt-16 relative rounded-3xl overflow-hidden h-56 md:h-80">
          {/* Real neon sign photo */}
          <Image
            src="/images/vibe-neon-sign.jpg"
            alt="Wild Heart Jungle Soul neon sign at The Jungle Wey restaurant in Mahahual"
            fill
            className="object-cover object-top"
            style={{ filter: "saturate(1.1) brightness(0.60)" }}
          />
          {/* Cinematic gradient over photo */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(135deg, rgba(4,14,4,0.70) 0%, rgba(4,12,4,0.35) 50%, rgba(4,14,4,0.75) 100%)",
          }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 relative z-10">
            <p className="font-display text-white font-black mb-2 drop-shadow-lg" style={{ fontSize: "clamp(1.5rem, 4vw, 2.8rem)" }}>
              {t.vibe.bannerHead}<span className="gradient-text">{t.vibe.bannerAccent}</span>
            </p>
            <p className="text-white/65 text-sm md:text-base max-w-md">
              {t.vibe.bannerSub}
            </p>
            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 glass text-white text-sm font-medium px-6 py-2.5 rounded-full hover:bg-white/15 transition-colors"
            >
              {t.vibe.bannerCta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
