"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n";

const EMAIL = "thejunglewey@gmail.com";

/* Turns every occurrence of the contact email in a paragraph into a mailto link. */
function withEmailLinks(text: string) {
  return text.split(EMAIL).flatMap((part, i, arr) =>
    i < arr.length - 1
      ? [
          part,
          <a
            key={i}
            href={`mailto:${EMAIL}`}
            className="underline underline-offset-2 hover:text-white transition-colors"
            style={{ color: "#ce8b4d" }}
          >
            {EMAIL}
          </a>,
        ]
      : [part]
  );
}

export default function PrivacyContent() {
  const { t } = useLanguage();
  const p = t.privacy;

  return (
    <main className="relative min-h-screen" style={{ background: "#0a1a0a" }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 50% 0%, rgba(29,57,39,0.6) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/images/logo-elwey-white.png"
            alt=""
            aria-hidden="true"
            width={62}
            height={100}
            className="h-20 w-auto mx-auto mb-6 leaf-float"
          />
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
            <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">
              {p.eyebrow}
            </span>
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
          </div>
          <h1 className="font-display text-white leading-none" style={{ fontSize: "clamp(3rem, 8vw, 5rem)" }}>
            {p.headlineA}
            <span className="gradient-text">{p.headlineB}</span>
          </h1>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-4">
          {p.sections.map((s) => (
            <section
              key={s.title}
              className="rounded-2xl p-6 md:p-8"
              style={{
                background: "linear-gradient(135deg, rgba(14,34,22,0.9), rgba(29,57,39,0.7))",
                border: "1px solid rgba(206,139,77,0.15)",
              }}
            >
              <h2 className="font-display text-2xl text-white mb-3">{s.title}</h2>
              <div className="flex flex-col gap-3">
                {s.body.map((para) => (
                  <p key={para} className="text-white/60 text-sm md:text-base leading-relaxed">
                    {withEmailLinks(para)}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <p className="text-white/35 text-xs text-center mt-8">
          {p.lastUpdated}: {p.updatedDate}
        </p>

        <div className="text-center mt-6">
          <a href="/" className="text-white/45 hover:text-white text-sm transition-colors">
            ← {p.backHome}
          </a>
        </div>
      </div>
    </main>
  );
}
