"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WHATSAPP_RESERVE_URL } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

/* ── Premium language toggle — minimal, elegant ─────────── */
function LangToggle({ large = false }: { large?: boolean }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className="relative flex items-center rounded-full overflow-hidden select-none"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.10)",
        padding: "3px",
      }}
    >
      {(["en", "es"] as Lang[]).map((l) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            /* transition only color+bg — not all properties */
            className="relative font-semibold uppercase rounded-full transition-[color,background-color] duration-200"
            style={{
              padding:       large ? "0.55rem 1.2rem" : "0.28rem 0.75rem",
              minHeight:     large ? 44 : undefined,
              fontSize:      "0.72rem",
              letterSpacing: "0.1em",
              color:         active ? "#0a1a0a" : "rgba(255,255,255,0.40)",
              background:    active ? "rgba(255,255,255,0.92)" : "transparent",
            }}
            aria-label={`Switch to ${l === "en" ? "English" : "Spanish"}`}
            aria-pressed={active}
          >
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

/* ── Navbar ─────────────────────────────────────────────── */
export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const onMenuPage = pathname === "/menu";
  const [scrolled,       setScrolled]       = useState(false);
  const [open,           setOpen]           = useState(false);
  const [activeSection,  setActiveSection]  = useState("hero");

  /* Route-aware links: work from the homepage and from sub-pages */
  const links = [
    { key: "menu",    label: t.nav.menu,    href: "/menu"     },
    { key: "vibe",    label: t.nav.vibe,    href: "/#vibe"    },
    { key: "drinks",  label: t.nav.drinks,  href: "/#drinks"  },
    { key: "gallery", label: t.nav.gallery, href: "/#gallery" },
    { key: "contact", label: t.nav.findUs,  href: "/#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
      const sections = ["hero", "vibe", "menu", "drinks", "gallery", "contact"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveSection(id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-[background,backdrop-filter,border-color,box-shadow] duration-300 ${
        scrolled ? "shadow-[0_4px_40px_rgba(0,0,0,0.5)]" : "bg-transparent"
      }`}
      style={
        scrolled
          ? {
              background:         "rgba(10,26,10,0.88)",
              backdropFilter:     "blur(20px) saturate(1.5)",
              WebkitBackdropFilter:"blur(20px) saturate(1.5)",
              borderBottom:       "1px solid rgba(61,138,61,0.12)",
            }
          : {}
      }
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 flex items-center justify-between h-16 md:h-20">

        {/* Logo — official "El Wey" mascot (Brand Manual single-color version) */}
        <a href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <Image
            src="/images/logo-elwey-white.png"
            alt="The Jungle Wey — El Wey mascot"
            width={31}
            height={45}
            priority
            className="h-[45px] w-auto transition-transform duration-300 group-hover:scale-105"
          />
          <span className="font-display text-white text-2xl tracking-wide group-hover:text-[#62a062] transition-colors duration-300">
            The Jungle Wey
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => {
            const isActive = l.key === "menu" ? onMenuPage : !onMenuPage && activeSection === l.key;
            return (
              <a
                key={l.key}
                href={l.href}
                className="relative text-sm font-medium tracking-wide transition-colors duration-200"
                style={{ color: isActive ? "#62a062" : "rgba(255,255,255,0.65)" }}
              >
                {l.label}
                {isActive && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 h-px rounded-full"
                    style={{ background: "#f04e30" }}
                  />
                )}
              </a>
            );
          })}

          {/* Language toggle */}
          <LangToggle />

          {/* Reserve CTA */}
          <a
            href={WHATSAPP_RESERVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative overflow-hidden ml-1 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-[transform,box-shadow] duration-200 hover:scale-105 group"
            style={{
              background:  "linear-gradient(135deg, #f04e30, #d43e22)",
              boxShadow:   "0 4px 20px rgba(240,78,48,0.35)",
            }}
          >
            <span className="relative z-10">{t.nav.reserve}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 shimmer" />
          </a>
        </nav>

        {/* Hamburger — 44×44 minimum touch target */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex items-center justify-center"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          style={{ minWidth: 44, minHeight: 44 }}
        >
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block h-0.5 rounded-full bg-white"
                style={{
                  width:     i === 1 ? (open ? 0 : 16) : 24,
                  opacity:   i === 1 && open ? 0 : 1,
                  transform: i === 0
                    ? open ? "rotate(45deg) translateY(8px)"  : "none"
                    : i === 2
                    ? open ? "rotate(-45deg) translateY(-8px)" : "none"
                    : "none",
                  /* Only transition the specific properties being animated */
                  transition: "width 200ms ease, opacity 150ms ease, transform 220ms cubic-bezier(0.4,0,0.2,1)",
                }}
              />
            ))}
          </div>
        </button>
      </div>

      {/* Mobile drawer — absolute so it doesn't push layout; GPU-only opacity+transform */}
      <div
        className="md:hidden absolute inset-x-0 top-full"
        aria-hidden={!open}
        style={{
          background:           "rgba(10,26,10,0.97)",
          backdropFilter:       "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom:         "1px solid rgba(61,138,61,0.15)",
          /* Only animate GPU-composited properties — no layout triggers */
          opacity:              open ? 1 : 0,
          transform:            open ? "translateY(0)" : "translateY(-6px)",
          pointerEvents:        open ? "auto" : "none",
          visibility:           open ? "visible" : "hidden",
          transition: open
            ? "opacity 250ms cubic-bezier(0.4,0,0.2,1), transform 250ms cubic-bezier(0.4,0,0.2,1)"
            : "opacity 200ms ease, transform 200ms ease, visibility 0s 200ms",
          willChange: "opacity, transform",
        }}
      >
        <nav className="flex flex-col px-6 py-5 gap-1">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center text-white/80 hover:text-[#62a062] text-base font-medium border-b border-white/5 transition-colors duration-150 last:border-0"
              style={{ minHeight: 52, paddingBlock: "0.75rem" }}
            >
              {l.label}
            </a>
          ))}

          {/* Language toggle — centered in mobile drawer, larger touch targets */}
          <div className="flex justify-center py-4 border-b border-white/5">
            <LangToggle large />
          </div>

          <a
            href={WHATSAPP_RESERVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-3 text-white text-center rounded-full font-semibold text-sm flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, #f04e30, #d43e22)",
              minHeight: 52,
            }}
          >
            &#128172; {t.nav.reserveMobile}
          </a>
        </nav>
      </div>
    </header>
  );
}
