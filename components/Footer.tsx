"use client";

import { WHATSAPP_RESERVE_URL, INSTAGRAM } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0c1f0c] border-t border-white/5 py-12 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl" aria-hidden="true">&#127807;</span>
              <span className="font-playfair text-white font-bold text-xl">
                The Jungle Wey
              </span>
            </div>
            <p className="text-white/35 text-xs max-w-xs text-center md:text-left">
              {t.footer.tagline}
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {[
              { label: t.nav.menu,    href: "#menu" },
              { label: t.nav.vibe,    href: "#vibe" },
              { label: t.nav.drinks,  href: "#drinks" },
              { label: t.nav.gallery, href: "#gallery" },
              { label: t.nav.findUs,  href: "#contact" },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-white/40 hover:text-white text-sm transition-colors"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href={INSTAGRAM}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg hover:bg-white/15 transition-colors"
              aria-label="Instagram"
            >
              &#128247;
            </a>
            <a
              href={WHATSAPP_RESERVE_URL}
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg hover:bg-white/15 transition-colors"
              aria-label="WhatsApp"
            >
              &#128172;
            </a>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-xs">
          <span>{t.footer.copyright(new Date().getFullYear())}</span>
          <span>{t.footer.location} &#127796;</span>
        </div>
      </div>
    </footer>
  );
}
