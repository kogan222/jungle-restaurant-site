"use client";

import Image from "next/image";
import { WHATSAPP_RESERVE_URL, INSTAGRAM, FACEBOOK } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-[#0c1f0c] border-t border-white/5 py-12 px-5 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo-elwey-white.png"
                alt=""
                aria-hidden="true"
                width={26}
                height={38}
                className="h-9 w-auto"
              />
              <span className="font-display text-white text-2xl">
                The Jungle Wey
              </span>
            </div>
            <p className="text-white/35 text-xs max-w-xs text-center md:text-left">
              {t.footer.tagline}
            </p>
          </div>

          <nav className="flex flex-wrap justify-center gap-6">
            {[
              { label: t.nav.menu,    href: "/menu" },
              { label: t.nav.vibe,    href: "/#vibe" },
              { label: t.nav.drinks,  href: "/#drinks" },
              { label: t.nav.gallery, href: "/#gallery" },
              { label: t.nav.findUs,  href: "/#contact" },
              { label: t.nav.tribe,   href: "/tribe" },
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
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center text-lg hover:bg-white/15 transition-colors"
              aria-label="Instagram"
            >
              &#128247;
            </a>
            <a
              href={FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white/15 transition-colors"
              aria-label="Facebook"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12.06C22 6.505 17.523 2 12 2S2 6.505 2 12.06c0 5.02 3.657 9.184 8.438 9.94v-7.03H7.898v-2.91h2.54V9.845c0-2.522 1.492-3.916 3.777-3.916 1.094 0 2.238.197 2.238.197v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.888h2.773l-.443 2.91h-2.33V22c4.78-.756 8.437-4.92 8.437-9.94z" />
              </svg>
            </a>
            <a
              href={WHATSAPP_RESERVE_URL}
              target="_blank"
              rel="noopener noreferrer"
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
