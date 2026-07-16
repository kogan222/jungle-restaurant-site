"use client";

/*
  Shared foundation for the hidden future pages
  (/book, /stories, /events).

  These routes are production-ready but intentionally NOT exposed:
  · no navigation links point to them
  · they are excluded from sitemap.xml
  · robots meta = noindex (set in each page.tsx)
  When the client is ready, add the nav link + sitemap entry and
  remove the noindex — the structure below is ready for content.
*/

import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import { WHATSAPP_RESERVE_URL } from "@/lib/contact";

export type FoundationCopy = {
  eyebrow: string;
  titleA: string;
  titleB: string;
  intro: string;
  sections: { icon: string; title: string; body: string }[];
  ctaLabel: string;
  comingSoon: string;
};

export default function FoundationPage({
  copy,
}: {
  copy: { en: FoundationCopy; es: FoundationCopy };
}) {
  const { lang } = useLanguage();
  const c = copy[lang];

  return (
    <main className="relative min-h-screen" style={{ background: "#0a1a0a" }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 50% 0%, rgba(29,57,39,0.55) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-24">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
            <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">
              {c.eyebrow}
            </span>
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
          </div>
          <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}>
            {c.titleA}
            <span className="gradient-text">{c.titleB}</span>
          </h1>
          <p className="text-white/45 text-base max-w-lg mx-auto leading-relaxed">{c.intro}</p>
          <span
            className="inline-block mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full"
            style={{ color: "#ce8b4d", border: "1px solid rgba(206,139,77,0.4)", background: "rgba(206,139,77,0.08)" }}
          >
            {c.comingSoon}
          </span>
        </div>

        {/* Content foundation */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {c.sections.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl p-6 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(14,34,22,0.9), rgba(29,57,39,0.7))",
                border: "1px solid rgba(206,139,77,0.15)",
              }}
            >
              <span className="text-2xl" aria-hidden="true">{s.icon}</span>
              <h2 className="font-display text-xl text-white mt-2 mb-1">{s.title}</h2>
              <p className="text-white/45 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <a
            href={WHATSAPP_RESERVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-transform duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #25D366, #1aad54)",
              boxShadow: "0 6px 24px rgba(37,211,102,0.35)",
            }}
          >
            💬 {c.ctaLabel}
          </a>
          <div className="mt-10 opacity-60">
            <Image
              src="/images/logo-elwey-white.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={64}
              className="h-14 w-auto mx-auto"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
