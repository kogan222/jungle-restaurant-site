"use client";

import Image from "next/image";
import { useLanguage } from "@/lib/i18n";
import TribeForm from "./TribeForm";

/*
  Jungle Tribe registration — native form (see TribeForm.tsx) built to
  match the client's official Google Form field-for-field. Submission
  storage is not wired to a backend yet; see docs/INTEGRATIONS.md §3.
*/
export default function TribeContent() {
  const { t } = useLanguage();
  const perks = [t.tribe.perks.p1, t.tribe.perks.p2, t.tribe.perks.p3];

  return (
    <main className="relative min-h-screen" style={{ background: "#0a1a0a" }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 900px 500px at 50% 0%, rgba(29,57,39,0.6) 0%, transparent 70%),
            radial-gradient(ellipse 600px 500px at 85% 60%, rgba(154,101,56,0.08) 0%, transparent 70%)
          `,
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-10 pt-28 md:pt-36 pb-24">
        {/* Header */}
        <div className="text-center mb-12">
          <Image
            src="/images/logo-elwey-white.png"
            alt=""
            aria-hidden="true"
            width={62}
            height={100}
            className="h-24 w-auto mx-auto mb-6 leaf-float"
          />
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
            <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">
              {t.tribe.eyebrow}
            </span>
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #f04e30, transparent)" }} />
          </div>
          <h1 className="font-display text-white leading-none mb-4" style={{ fontSize: "clamp(3rem, 8vw, 5.5rem)" }}>
            {t.tribe.headlineA}
            <span className="gradient-text">{t.tribe.headlineB}</span>
          </h1>
          <p className="text-white/45 text-base max-w-lg mx-auto leading-relaxed">
            {t.tribe.sub}
          </p>
        </div>

        {/* Perks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {perks.map((perk, i) => (
            <div
              key={perk.title}
              className="rounded-2xl p-5 text-center"
              style={{
                background: "linear-gradient(135deg, rgba(14,34,22,0.9), rgba(29,57,39,0.7))",
                border: "1px solid rgba(206,139,77,0.15)",
              }}
            >
              <span className="text-2xl" aria-hidden="true">{["🎶", "🎁", "🌿"][i]}</span>
              <h3 className="font-display text-xl text-white mt-2 mb-1">{perk.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{perk.body}</p>
            </div>
          ))}
        </div>

        {/* Native registration form — matches the client's Google Form */}
        <TribeForm />
      </div>
    </main>
  );
}
