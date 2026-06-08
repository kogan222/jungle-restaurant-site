"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { en } from "./en";
import { es } from "./es";
import type { T } from "./en";

/* ══════════════════════════════════════════════════════
   Language types
══════════════════════════════════════════════════════ */
export type Lang = "en" | "es";

const TRANSLATIONS: Record<Lang, T> = { en, es };
const STORAGE_KEY = "jungle-wey-lang";

/* ══════════════════════════════════════════════════════
   Context
══════════════════════════════════════════════════════ */
type LangCtx = {
  lang:    Lang;
  setLang: (l: Lang) => void;
  t:       T;          // current translation object
  fading:  boolean;    // true during the 120ms cross-fade
};

const LanguageContext = createContext<LangCtx>({
  lang:    "en",
  setLang: () => {},
  t:       en,
  fading:  false,
});

/* ══════════════════════════════════════════════════════
   Provider  (wrap in layout.tsx)
══════════════════════════════════════════════════════ */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang,   setLangState] = useState<Lang>("en");
  const [fading, setFading]    = useState(false);

  /* Restore from localStorage on first mount */
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (saved === "en" || saved === "es") setLangState(saved);
  }, []);

  /* Cross-fade switch */
  const setLang = useCallback((next: Lang) => {
    if (next === lang) return;
    setFading(true);
    setTimeout(() => {
      setLangState(next);
      localStorage.setItem(STORAGE_KEY, next);
      setTimeout(() => setFading(false), 80);
    }, 120);
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{ lang, setLang, t: TRANSLATIONS[lang], fading }}
    >
      {/* Subtle opacity cross-fade on language switch */}
      <div
        style={{
          opacity:    fading ? 0 : 1,
          transition: "opacity 0.12s ease",
        }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

/* ══════════════════════════════════════════════════════
   Hook  —  import in every component
══════════════════════════════════════════════════════ */
export function useLanguage() {
  return useContext(LanguageContext);
}
