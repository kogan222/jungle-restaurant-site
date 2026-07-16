"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { WHATSAPP_RESERVE_URL } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";

/*
  Floating WhatsApp button — all pages, all viewports.
  – Homepage: appears after the user scrolls past the hero CTA (400 px).
  – Other pages (/menu, /tribe, …): appears almost immediately, so
    WhatsApp is always one tap away while browsing the menus.
  – Mobile: pill with label. Desktop: label appears on hover.
*/
export default function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const threshold = pathname === "/" ? 400 : 80;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return (
    <a
      href={WHATSAPP_RESERVE_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Reserve a table at The Jungle Wey via WhatsApp — ${t.nav.reserve}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed z-50 flex items-center gap-2.5 font-semibold text-white text-sm rounded-full shadow-2xl transition-all duration-500 select-none"
      style={{
        bottom:     "1.25rem",
        right:      "1rem",
        padding:    "0.8rem 1.1rem",
        background: "linear-gradient(135deg, #25D366, #1aad54)",
        boxShadow:  "0 8px 32px rgba(37,211,102,0.45), 0 0 0 1px rgba(255,255,255,0.08) inset",
        opacity:    visible ? 1 : 0,
        transform:  visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.92)",
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      {/* WhatsApp icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        style={{ width: 22, height: 22, flexShrink: 0 }}
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
      {/* Label: always visible on small screens, hover-expand on desktop */}
      <span className="md:hidden">{t.nav.reserve}</span>
      <span
        className="hidden md:inline-block overflow-hidden whitespace-nowrap transition-all duration-300"
        style={{ maxWidth: hovered ? 180 : 0, opacity: hovered ? 1 : 0 }}
      >
        {t.nav.reserve}
      </span>
    </a>
  );
}
