"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { INSTAGRAM } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";

/*
  Real Instagram feed — lightweight & maintainable (see docs/INTEGRATIONS.md).

  Strategy:
  · Behold.so (or any service that mirrors the Instagram Basic Display
    API into a public JSON feed) — set NEXT_PUBLIC_INSTAGRAM_FEED_URL
    and the grid below turns into the live feed. No backend, no token
    refresh headaches, free tier is plenty for 8 images.
  · Until the client connects their account, we show a curated grid of
    real photos from the restaurant, each linking to the profile — so
    the section never looks broken or empty.
*/

type FeedPost = {
  id: string;
  permalink: string;
  src: string;
  alt: string;
  isVideo?: boolean;
  external?: boolean; // true → remote URL (live feed), false → /public asset
};

const CURATED_FALLBACK: FeedPost[] = [
  { id: "c1", permalink: INSTAGRAM, src: "/images/vibe-neon-sign.jpg",       alt: "Wild Heart, Jungle Soul neon sign at The Jungle Wey" },
  { id: "c2", permalink: INSTAGRAM, src: "/images/drink-pink-topdown.jpg",   alt: "Pink Coco Crush mocktail" },
  { id: "c3", permalink: INSTAGRAM, src: "/images/food-shrimp-tacos.jpg",    alt: "Shrimp tacos on blue corn tortillas" },
  { id: "c4", permalink: INSTAGRAM, src: "/images/vibe-live-music.jpg",      alt: "Live music night under the trees" },
  { id: "c5", permalink: INSTAGRAM, src: "/images/drink-espresso-martini.jpg", alt: "Espresso martini" },
  { id: "c6", permalink: INSTAGRAM, src: "/images/vibe-couple-toast.jpg",    alt: "Guests toasting in the jungle garden" },
  { id: "c7", permalink: INSTAGRAM, src: "/images/food-burger.jpg",          alt: "La Trufada burger" },
  { id: "c8", permalink: INSTAGRAM, src: "/images/vibe-dog.jpg",             alt: "Dog friendly — a happy guest" },
];

const FEED_URL = process.env.NEXT_PUBLIC_INSTAGRAM_FEED_URL;

export default function InstagramFeed() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState<FeedPost[]>(CURATED_FALLBACK);

  useEffect(() => {
    if (!FEED_URL) return;
    let cancelled = false;
    fetch(FEED_URL)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        // Behold JSON: { posts: [{ id, permalink, mediaUrl, thumbnailUrl, mediaType, caption }] }
        const list = (data.posts ?? data)
          ?.slice?.(0, 8)
          ?.map((p: { id: string; permalink: string; mediaUrl?: string; thumbnailUrl?: string; sizes?: { medium?: { mediaUrl?: string } }; mediaType?: string; caption?: string }) => ({
            id: p.id,
            permalink: p.permalink,
            src: p.sizes?.medium?.mediaUrl ?? p.thumbnailUrl ?? p.mediaUrl,
            alt: p.caption?.slice(0, 100) || "Instagram post from The Jungle Wey",
            isVideo: p.mediaType === "VIDEO",
            external: true,
          }))
          ?.filter((p: FeedPost) => Boolean(p.src));
        if (list?.length) setPosts(list);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="mt-14">
      {/* Section label */}
      <div className="reveal flex items-center justify-center gap-3 mb-6">
        <span className="h-px w-10" style={{ background: "linear-gradient(90deg, transparent, #ce8b4d)" }} />
        <span className="text-sm font-semibold tracking-[0.2em] uppercase" style={{ color: "#ce8b4d" }}>
          @thejunglewey
        </span>
        <span className="h-px w-10" style={{ background: "linear-gradient(90deg, #ce8b4d, transparent)" }} />
      </div>

      {/* Feed grid */}
      <div className="reveal grid grid-cols-4 gap-1.5 md:gap-2.5 rounded-2xl overflow-hidden">
        {posts.map((p) => (
          <a
            key={p.id}
            href={p.permalink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative aspect-square overflow-hidden bg-[#0e2216]"
            aria-label={p.alt}
          >
            {p.external ? (
              /* Live feed images come from Instagram's CDN — plain img keeps
                 next/image domains config untouched */
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: "saturate(1.05) brightness(0.92)" }}
              />
            ) : (
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 768px) 25vw, 200px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: "saturate(1.05) brightness(0.92)" }}
              />
            )}
            {/* hover overlay */}
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: "rgba(10,26,10,0.55)" }}
            >
              <span className="text-white text-xl" aria-hidden="true">↗</span>
            </div>
            {p.isVideo && (
              <span className="absolute top-2 right-2 text-white text-xs" aria-hidden="true">▶</span>
            )}
          </a>
        ))}
      </div>

      {/* Follow CTA */}
      <div className="reveal text-center mt-8">
        <a
          href={INSTAGRAM}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 text-white px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm"
          style={{
            background: "linear-gradient(135deg, rgba(131,58,180,0.7), rgba(253,29,29,0.7), rgba(252,176,69,0.7))",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 4px 24px rgba(253,29,29,0.25)",
          }}
        >
          <span className="text-xl" aria-hidden="true">&#128247;</span>
          <span>{t.gallery.instaCta}</span>
          <span className="opacity-50 group-hover:opacity-100 transition-opacity" aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}
