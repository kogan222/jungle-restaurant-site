"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { CornerBranch, SideVine } from "./JungleVines";
import Fireflies from "./Fireflies";
import InstagramFeed from "./InstagramFeed";
import { useLanguage } from "@/lib/i18n";

/* ================================================================
   PHOTO DATA — maps to /public/images/
   User should drop photos here:
     garden-1.jpg   — wide outdoor table shot
     garden-2.jpg   — garden angle with mural wall
     menu-food.jpg  — menu card photo
     menu-drinks.jpg — drinks menu
     detail-1.jpg   — any close detail / atmosphere shot
   ================================================================ */

type Photo = {
  src: string;
  fallback: string;
  label: string;
  sub: string;
  span?: string;
  aspect?: string;
};

type PhotoBase = Omit<Photo, "label" | "sub"> & { photoKey: keyof ReturnType<typeof useLanguage>["t"]["gallery"]["photos"] };

const PHOTOS_BASE: PhotoBase[] = [
  { src: "/images/vibe-neon-sign.jpg",         fallback: "#0d1a0d", photoKey: "neon",    span: "col-span-2 row-span-2", aspect: "aspect-[4/5]"  },
  { src: "/images/drink-espresso-martini.jpg",  fallback: "#0a0f0a", photoKey: "martini", span: "col-span-1 row-span-1", aspect: "aspect-square" },
  { src: "/images/food-shrimp-tacos.jpg",       fallback: "#2a1a0a", photoKey: "tacos",   span: "col-span-1 row-span-1", aspect: "aspect-square" },
  { src: "/images/drink-red-berry.jpg",         fallback: "#1a0808", photoKey: "berry",   span: "col-span-1 row-span-1", aspect: "aspect-[3/4]"  },
  { src: "/images/vibe-live-music.jpg",         fallback: "#0c1a0c", photoKey: "music",   span: "col-span-2 row-span-1", aspect: "aspect-[16/7]" },
  { src: "/images/food-burger.jpg",             fallback: "#1a0f05", photoKey: "burger",  span: "col-span-1 row-span-1", aspect: "aspect-[3/4]"  },
];

/* Scene illustrations as fallbacks */
function GardenFallback({ color, index }: { color: string; index: number }) {
  const treeXs = [30 + index * 12, 120 + index * 8, 240 - index * 5, 340 + index * 6, 440];
  const lightX = 45 + index * 18;
  const lightY = 15 + index * 6;

  return (
    <svg viewBox="0 0 500 360" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <rect width="500" height="360" fill={color} />
      <radialGradient id={`sg${index}`} cx={`${lightX}%`} cy={`${lightY}%`} r="60%">
        <stop offset="0%" stopColor="#ce8b4d" stopOpacity="0.45" />
        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
      </radialGradient>
      <rect width="500" height="360" fill={`url(#sg${index})`} />
      {/* Sun rays */}
      {[0,1,2].map((i) => (
        <polygon key={i} points={`${220 + i * 30},0 ${240 + i * 30},0 ${350 + i * 50},360 ${320 + i * 50},360`} fill="#ce8b4d" opacity="0.06" />
      ))}
      {/* Canopy blobs */}
      {treeXs.map((x, i) => (
        <ellipse key={i} cx={x} cy={30 + i * 12} rx={55 + i * 6} ry={55 + i * 3}
          fill={i % 2 === 0 ? "#2d6e2d" : "#1d3927"} opacity="0.85" />
      ))}
      {/* Trunks */}
      {treeXs.map((x, i) => (
        <rect key={i} x={x - 5} y={55 + i * 12} width={10 + i * 2} height={250} rx="5" fill="#2a1500" opacity="0.75" />
      ))}
      {/* Ground */}
      <rect x="0" y="300" width="500" height="60" fill="#2a1a0a" opacity="0.6" />
      {/* Table */}
      <rect x={130 + index * 8} y="270" width="180" height="28" rx="5" fill="#6e4420" />
      {[0,1,2,3].map((k) => (
        <line key={k} x1={135 + index * 8 + k * 40} y1="270" x2={135 + index * 8 + k * 40} y2="298" stroke="#3a2010" strokeWidth="1.2" opacity="0.4" />
      ))}
      {/* Teal chairs */}
      <rect x={108 + index * 8} y="276" width="22" height="22" rx="3" fill="#5f9ea0" opacity="0.88" />
      <rect x={320 + index * 8} y="276" width="22" height="22" rx="3" fill="#5f9ea0" opacity="0.88" />
      <rect x={160 + index * 8} y="300" width="20" height="18" rx="3" fill="#5f9ea0" opacity="0.8" />
      <rect x={258 + index * 8} y="300" width="20" height="18" rx="3" fill="#5f9ea0" opacity="0.8" />
      {/* Hammock */}
      {index % 2 === 0 && (
        <path d={`M${300 + index * 4},${180 + index} Q330,${195 + index} ${380 + index * 4},${177 + index}`} stroke="#c9b07a" strokeWidth="4" opacity="0.5" fill="none" />
      )}
      {/* Plants */}
      <ellipse cx="10" cy="345" rx="35" ry="22" fill="#1d3927" opacity="0.9" transform="rotate(-20 10 345)" />
      <ellipse cx="495" cy="340" rx="32" ry="20" fill="#245824" opacity="0.85" transform="rotate(18 495 340)" />
    </svg>
  );
}

/* Individual photo card */
function PhotoCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${photo.span ?? ""}`}
      onClick={onClick}
      style={{ minHeight: 200 }}
    >
      {/* Photo or fallback */}
      <div className="absolute inset-0">
        {!error ? (
          <Image
            src={photo.src}
            alt={photo.label}
            fill
            className={`object-cover object-center transition-all duration-700 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
            style={{ filter: "saturate(1.15) brightness(0.85)" }}
            onError={() => setError(true)}
            onLoad={() => setLoaded(true)}
          />
        ) : null}
        {(error || !loaded) && (
          <div className="absolute inset-0">
            <GardenFallback color={photo.fallback} index={index} />
          </div>
        )}
      </div>

      {/* Cinematic overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1a0a]/90 via-[#0a1a0a]/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Warm color grade on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: "linear-gradient(135deg, rgba(154,101,56,0.12), rgba(10,26,10,0.15))" }} />

      {/* Caption */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-1 group-hover:translate-y-0 transition-transform duration-400">
        <p className="font-display text-white font-bold text-lg leading-tight drop-shadow-lg">
          {photo.label}
        </p>
        <p className="text-white/60 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
          {photo.sub}
        </p>
      </div>

      {/* Expand icon */}
      <div className="absolute top-4 right-4 w-8 h-8 glass rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 5V1H5M9 1H13V5M13 9V13H9M5 13H1V9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>

      {/* Jungle leaf watermark */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-60 transition-opacity duration-300">
        <svg width="20" height="28" viewBox="0 0 20 28" fill="none">
          <path d="M10 2 C6 6,1 12,3 18 C5 22,10 24,10 24 C10 24,9 17,10 2Z" fill="#62a062" />
          <path d="M10 2 C14 6,19 12,17 18 C15 22,10 24,10 24 C10 24,11 17,10 2Z" fill="#3d8a3d" />
        </svg>
      </div>
    </div>
  );
}

/* Fullscreen lightbox */
function Lightbox({
  photo,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  photo: Photo;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const [error, setError] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Photo: ${photo.label}`}
      className="lightbox-overlay"
      onClick={onClose}
    >
      <div
        className="relative w-full h-full max-w-6xl max-h-[90vh] mx-auto flex items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full h-full max-h-[80vh] rounded-2xl overflow-hidden">
          {!error ? (
            <Image
              src={photo.src}
              alt={photo.label}
              fill
              className="object-contain"
              style={{ filter: "saturate(1.1) brightness(0.95)" }}
              onError={() => setError(true)}
            />
          ) : (
            <GardenFallback color={photo.fallback} index={index} />
          )}
          {/* Caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0a1a0a] to-transparent">
            <p className="font-display text-white font-bold text-2xl">{photo.label}</p>
            <p className="text-white/60 text-sm mt-1">{photo.sub}</p>
            <p className="text-white/30 text-xs mt-2">{index + 1} / {total}</p>
          </div>
        </div>

        {/* Prev / Next */}
        <button onClick={onPrev} className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xl">
          &#8592;
        </button>
        <button onClick={onNext} className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xl">
          &#8594;
        </button>

        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 w-10 h-10 glass rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors text-lg">
          &#10005;
        </button>
      </div>
    </div>
  );
}

export default function GallerySection() {
  const ref = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const { t } = useLanguage();
  const PHOTOS: Photo[] = PHOTOS_BASE.map((p) => ({
    ...p,
    label: t.gallery.photos[p.photoKey].label,
    sub:   t.gallery.photos[p.photoKey].sub,
  }));

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

  const handlePrev = useCallback(() =>
    setLightbox((p) => ((p ?? 0) - 1 + PHOTOS.length) % PHOTOS.length), []);
  const handleNext = useCallback(() =>
    setLightbox((p) => ((p ?? 0) + 1) % PHOTOS.length), []);

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

        {/* Masonry photo grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {PHOTOS.map((photo, i) => (
            <div
              key={i}
              className={`reveal ${photo.span ?? ""}`}
              style={{ transitionDelay: `${i * 0.1}s`, minHeight: 200 }}
            >
              <div className={`h-full ${photo.aspect ?? "aspect-square"}`}>
                <PhotoCard photo={photo} index={i} onClick={() => setLightbox(i)} />
              </div>
            </div>
          ))}
        </div>

        {/* Instagram — real feed (live when NEXT_PUBLIC_INSTAGRAM_FEED_URL is set,
            curated photos linking to the profile until then) */}
        <InstagramFeed />
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <Lightbox
          photo={PHOTOS[lightbox]}
          index={lightbox}
          total={PHOTOS.length}
          onClose={() => setLightbox(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </section>
  );
}
