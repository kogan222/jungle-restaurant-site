"use client";

import { useState, useEffect } from "react";
import { WHATSAPP_RESERVE_URL } from "@/lib/contact";
import { useLanguage } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

/* ── Premium language toggle — minimal, elegant ─────────── */
function LangToggle() {
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
      {(["en", "es"] as Lang[]).map((l, i) => {
        const active = lang === l;
        return (
          <button
            key={l}
            onClick={() => setLang(l)}
            className="relative px-3 py-1 text-xs font-semibold tracking-[0.12em] uppercase rounded-full transition-all duration-300"
            style={{
              color:      active ? "#0a1a0a" : "rgba(255,255,255,0.40)",
              background: active ? "rgba(255,255,255,0.92)" : "transparent",
              letterSpacing: "0.1em",
            }}
            aria-label={`Switch to ${l === "en" ? "English" : "Spanish"}`}
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
  const [scrolled,       setScrolled]       = useState(false);
  const [open,           setOpen]           = useState(false);
  const [activeSection,  setActiveSection]  = useState("hero");

  const links = [
    { key: "menu",    label: t.nav.menu,    href: "#menu"    },
    { key: "vibe",    label: t.nav.vibe,    href: "#vibe"    },
    { key: "drinks",  label: t.nav.drinks,  href: "#drinks"  },
    { key: "gallery", label: t.nav.gallery, href: "#gallery" },
    { key: "contact", label: t.nav.findUs,  href: "#contact" },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
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

        {/* Logo */}
        <a href="#hero" className="flex items-center gap-2.5 group flex-shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
            style={{ background: "rgba(45,110,45,0.25)", border: "1px solid rgba(61,138,61,0.3)" }}
          >
            &#127807;
          </div>
          <span className="font-playfair font-bold text-white text-lg tracking-wide group-hover:text-[#62a062] transition-colors duration-300">
            The Jungle Wey
          </span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => {
            const isActive = activeSection === l.key;
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
                    style={{ background: "#e8562a" }}
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
            className="relative overflow-hidden ml-1 text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all duration-300 hover:scale-105 group"
            style={{
              background:  "linear-gradient(135deg, #e8562a, #cc4420)",
              boxShadow:   "0 4px 20px rgba(232,86,42,0.35)",
            }}
          >
            <span className="relative z-10">{t.nav.reserve}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 shimmer" />
          </a>
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-0.5 rounded-full bg-white transition-all duration-300"
              style={{
                width:     i === 1 ? (open ? 0 : 16) : 24,
                opacity:   i === 1 && open ? 0 : 1,
                transform: i === 0
                  ? open ? "rotate(45deg) translateY(8px)"  : "none"
                  : i === 2
                  ? open ? "rotate(-45deg) translateY(-8px)" : "none"
                  : "none",
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{
          maxHeight:     open ? 560 : 0,
          opacity:       open ? 1 : 0,
          background:    "rgba(10,26,10,0.96)",
          backdropFilter:"blur(20px)",
          borderBottom:  open ? "1px solid rgba(61,138,61,0.15)" : "none",
        }}
      >
        <nav className="flex flex-col px-6 py-5 gap-1">
          {links.map((l) => (
            <a
              key={l.key}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-white/80 hover:text-[#62a062] text-base font-medium py-3 border-b border-white/5 transition-colors last:border-0"
            >
              {l.label}
            </a>
          ))}

          {/* Language toggle — centered in mobile drawer */}
          <div className="flex justify-center py-4 border-b border-white/5">
            <LangToggle />
          </div>

          <a
            href={WHATSAPP_RESERVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="mt-3 text-white text-center py-3.5 rounded-full font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #e8562a, #cc4420)" }}
          >
            &#128172; {t.nav.reserveMobile}
          </a>
        </nav>
      </div>
    </header>
  );
}
