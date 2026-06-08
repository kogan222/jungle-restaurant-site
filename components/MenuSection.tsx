"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import { SideVine } from "./JungleVines";
import Fireflies from "./Fireflies";
import { useTilt } from "./useTilt";
import { useLanguage } from "@/lib/i18n";

type MenuItem = {
  name: string;
  nameEs?: string;
  desc: string;
  price: string;
  emoji: string;
  badge?: string;
};

type Category = {
  id: string;
  label: string;
  labelEs: string;
  emoji: string;
  accent: string;
  glow: string;
  items: MenuItem[];
};

const MENU: Category[] = [
  /* ── PA' PICAR — Starters & bites ──────────────────────── */
  {
    id: "bites",
    label: "Pa' Picar",
    labelEs: "Starters",
    emoji: "&#127807;",
    accent: "#2d6e2d",
    glow: "rgba(45,110,45,0.3)",
    items: [
      {
        name: "Guacamole",
        desc: "Fresh avocado, tomato, onion, lime, salt & pepper. The jungle's purest bite.",
        price: "$150", emoji: "&#129361;",
      },
      {
        name: "God Save the Queen",
        desc: "Crispy fish sticks, french fries & house tartar sauce. Our most beloved plate — the queen approves.",
        price: "$220", emoji: "&#127967;", badge: "Fan Favourite",
      },
      {
        name: "Los Anillos de la Mafia",
        nameEs: "Calamari Rings",
        desc: "Golden-battered calamari rings with house tartar sauce. Crispy, tender, dangerously good.",
        price: "$190", emoji: "&#129425;",
      },
      {
        name: "Elote con Flow",
        desc: "Roasted corn ribs in our secret marinade, served with a smoky house dipping sauce.",
        price: "$140", emoji: "&#127805;",
      },
      {
        name: "Las Mamadoras",
        desc: "Crispy fries tossed in truffle mayo and topped with shaved parmesan. Pure indulgence.",
        price: "$160", emoji: "&#127839;", badge: "Must Try",
      },
      {
        name: "Tiradito Cuadril",
        desc: "Thinly sliced grilled picanha over ponzu sauce and avocado cream. Bold flavors, elegant finish.",
        price: "$260", emoji: "&#129385;", badge: "Premium",
      },
    ],
  },

  /* ── LO FUERTE — Mains ──────────────────────────────────── */
  {
    id: "mains",
    label: "Lo Fuerte",
    labelEs: "Mains",
    emoji: "&#127859;",
    accent: "#c04820",
    glow: "rgba(192,72,32,0.3)",
    items: [
      {
        name: "Tacos de Camarón",
        desc: "Grilled shrimp on blue corn tortillas with avocado cream, lime & house salsa. Served on a wood board.",
        price: "$190", emoji: "&#127859;", badge: "Must Try",
      },
      {
        name: "La Trufada",
        desc: "Angus beef patty, truffle mayo, manchego cheese, crispy onion & camote fries on homemade bread. Anatomy: pure perfection.",
        price: "$250", emoji: "&#127828;", badge: "Signature",
      },
      {
        name: "Sandwich de Barbacoa",
        desc: "Slow-braised picaña barbacoa with manchego cheese on homemade toasted bread. Served with caldito deli on the side.",
        price: "$220", emoji: "&#129368;",
      },
    ],
  },

  /* ── ÑEMBO FIT — Salads ──────────────────────────────────── */
  {
    id: "fit",
    label: "Ñembo Fit",
    labelEs: "Ensaladas",
    emoji: "&#129367;",
    accent: "#3d8a3d",
    glow: "rgba(61,138,61,0.3)",
    items: [
      {
        name: "Caesar Salad",
        desc: "Romaine lettuce, grilled chicken, crispy bacon, house Caesar dressing & shaved parmesan.",
        price: "$220", emoji: "&#129388;",
      },
      {
        name: "Greek Salad",
        desc: "Mixed greens, kalamata olives, goat cheese, cucumber, cherry tomatoes, walnuts & vinaigrette.",
        price: "$180", emoji: "&#129386;", badge: "+$40 chicken",
      },
      {
        name: "Tropicool Salad",
        desc: "Mixed greens, cucumber, cherry tomatoes, fresh seasonal fruit and creamy tzatziki.",
        price: "$180", emoji: "&#127817;", badge: "+$40 chicken",
      },
      {
        name: "Cauli Power",
        nameEs: "Coliflor Asada",
        desc: "Whole roasted cauliflower served on a rich romesco sauce. Plant-forward and completely satisfying.",
        price: "$180", emoji: "&#129382;",
      },
    ],
  },

  /* ── ¡QUÉ ROLLO! — Rolls ────────────────────────────────── */
  {
    id: "rolls",
    label: "¡Qué Rollo!",
    labelEs: "Rolls",
    emoji: "&#127904;",
    accent: "#e8562a",
    glow: "rgba(232,86,42,0.3)",
    items: [
      {
        name: "Rollos Vietnamitas",
        desc: "Fresh rice paper rolls with lettuce, purple cabbage, rice noodles, mint, avocado & cucumber. Spicy orange dipping sauce. (3 pcs)",
        price: "$150", emoji: "&#129364;", badge: "+$30 shrimp",
      },
      {
        name: "Spring Rolls",
        desc: "Crispy fried rolls with purple cabbage, bell peppers, mushrooms, bean sprouts, onion & toasted peanuts. House salsita deli. (3 pcs)",
        price: "$160", emoji: "&#129379;", badge: "+$30 shrimp",
      },
      {
        name: "Filadeli Roll",
        desc: "Rice paper with shrimp, cucumber, avocado, Philadelphia cream cheese & chaya leaf. A house signature.",
        price: "$180", emoji: "&#129348;", badge: "Signature",
      },
    ],
  },

  /* ── BOTANICAL — Mocktails ───────────────────────────────── */
  {
    id: "botanical",
    label: "Botanical Drinks",
    labelEs: "Mocktails",
    emoji: "&#127818;",
    accent: "#62a062",
    glow: "rgba(98,160,98,0.3)",
    items: [
      {
        name: "Like a Virgin",
        desc: "Lime, passion fruit, mint, syrup & soda. Clean and refreshing as a jungle breeze.",
        price: "$90", emoji: "&#127819;",
      },
      {
        name: "Un Suerito con Estilo",
        desc: "Pineapple, cucumber, syrup, salt, mint & turmeric — a spa day in a glass.",
        price: "$90", emoji: "&#127821;",
      },
      {
        name: "Pa' la Calors",
        desc: "Blended red berries and oranges with fresh mint and syrup. Built for hot days.",
        price: "$90", emoji: "&#129362;",
      },
      {
        name: "Pink Coco Crush",
        desc: "Coconut cream, guava juice, grenadine, basil & lime. Our most photographed glass.",
        price: "$90", emoji: "&#129381;", badge: "Most Ordered",
      },
      {
        name: "Mix Tropical",
        desc: "Orange juice, lime, passion fruit, pineapple, grenadine, basil & mint. The jungle in one sip.",
        price: "$90", emoji: "&#127865;",
      },
    ],
  },

  /* ── COCTELES — Cocktails ────────────────────────────────── */
  {
    id: "cocteles",
    label: "Cocteles",
    labelEs: "Cocktails",
    emoji: "&#127864;",
    accent: "#9060c0",
    glow: "rgba(144,96,192,0.3)",
    items: [
      {
        name: "Mezcalito Zen",
        desc: "Mezcal, cucumber juice, lime & mineral water. Chili-salt rim and fresh dill. Smoky meets refreshing.",
        price: "$110", emoji: "&#127864;",
      },
      {
        name: "Espresso Martini",
        desc: "Vodka, fresh espresso & coffee liqueur. Silky, bold and completely unforgettable.",
        price: "$130", emoji: "&#9749;", badge: "Bestseller",
      },
      {
        name: "La Onda Verde",
        desc: "Té de matcha, agua mineral, cointreau & prosecco. Elegant, effervescent, distinctly ours.",
        price: "$110", emoji: "&#127867;",
      },
    ],
  },

  /* ── COFFEE & TEA ─────────────────────────────────────────── */
  {
    id: "cafe",
    label: "Técitos y Cafécitos",
    labelEs: "Coffee & Tea",
    emoji: "&#9749;",
    accent: "#a67035",
    glow: "rgba(166,112,53,0.3)",
    items: [
      {
        name: "Americano",
        desc: "Hot or iced. Clean, bold, and completely honest.",
        price: "$55", emoji: "&#9749;",
      },
      {
        name: "Espresso",
        desc: "Pure jungle fuel. Short, intense, no excuses.",
        price: "$50", emoji: "&#9889;",
      },
      {
        name: "Matcha Latte",
        desc: "Ceremonial-grade matcha with silky frothed milk. Hot or over ice.",
        price: "$60", emoji: "&#127861;", badge: "Bestseller",
      },
      {
        name: "Leche Dorada",
        desc: "Turmeric, cinnamon, ginger & black pepper in warm milk. Ancient gold in a cup.",
        price: "$60", emoji: "&#11088;",
      },
    ],
  },

  /* ── CHELAS — Beer, Mezcal & more ───────────────────────── */
  {
    id: "chelas",
    label: "Chelas & Mezcal",
    labelEs: "Beer & Spirits",
    emoji: "&#127866;",
    accent: "#d4b483",
    glow: "rgba(212,180,131,0.3)",
    items: [
      {
        name: "Panteón Craft Beer",
        desc: "Brewed right here in Mahahual. Ask your server for today's selection.",
        price: "$120", emoji: "&#127866;", badge: "Local Brew",
      },
      {
        name: "Michelada",
        desc: "The classic done right — cold beer, lime, salt and our secret blend.",
        price: "$35", emoji: "&#127819;",
      },
      {
        name: "Levanta Muertos",
        desc: "Spicy Ojo Rojo, clamato, dark sauces, shrimp skewer, worm salt & pickled cucumber. Not for the faint-hearted.",
        price: "$80", emoji: "&#128128;", badge: "Legendary",
      },
      {
        name: "Big Bottle — Indio / XX Lager",
        desc: "Ice cold. Best shared. Order another.",
        price: "$150", emoji: "&#127870;",
      },
      {
        name: "Mezcal Flight",
        nameEs: "Vuelo de Mezcal",
        desc: "Four espadín, jabalí, tepeztate & coyote mezcals served on a wood board with citrus & sal de gusano.",
        price: "$180", emoji: "&#127867;", badge: "Premium",
      },
    ],
  },
];

function MenuCard({ item, accent, glow }: { item: MenuItem; accent: string; glow: string }) {
  const [hovered, setHovered] = useState(false);
  const { ref: tiltRef, onMouseMove, onMouseLeave: tiltLeave } = useTilt(7);

  return (
    <div
      ref={tiltRef}
      className="menu-card-jungle relative rounded-2xl overflow-hidden cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); tiltLeave(); }}
      onMouseMove={onMouseMove}
      style={{
        background: hovered
          ? `linear-gradient(135deg, rgba(14,36,14,0.95) 0%, rgba(30,70,30,0.85) 100%)`
          : `linear-gradient(135deg, rgba(10,26,10,0.9) 0%, rgba(18,45,18,0.8) 100%)`,
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${hovered ? `${accent}45` : "rgba(61,138,61,0.12)"}`,
        boxShadow: hovered
          ? `0 20px 50px rgba(0,0,0,0.5), 0 0 30px ${glow}, inset 0 1px 0 rgba(255,255,255,0.06)`
          : `0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`,
        transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      {/* Accent top line */}
      <div className="h-0.5 w-full transition-all duration-300" style={{ background: hovered ? `linear-gradient(90deg, ${accent}, transparent)` : "transparent" }} />

      {/* 3D tilt shine reflection */}
      <div className="tilt-shine" />

      {/* Texture overlay — subtle noise */}
      <div className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />

      {/* Glow orb on hover */}
      <div
        className="absolute -top-10 -right-10 w-32 h-32 rounded-full pointer-events-none transition-all duration-500"
        style={{
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      <div className="relative z-10 p-5 md:p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <span
              className="text-3xl w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0 transition-all duration-300"
              style={{ background: hovered ? `${accent}20` : "rgba(61,138,61,0.08)" }}
              dangerouslySetInnerHTML={{ __html: item.emoji }}
            />
            <div>
              <h4 className="font-playfair font-bold text-white text-base leading-tight">
                {item.name}
              </h4>
              {item.nameEs && (
                <span className="text-white/30 text-xs italic">{item.nameEs}</span>
              )}
            </div>
          </div>
          <span className="font-bold text-base flex-shrink-0 transition-colors duration-300" style={{ color: accent }}>
            {item.price}
          </span>
        </div>

        <p className="text-white/45 text-sm leading-relaxed">{item.desc}</p>

        {item.badge && (
          <span
            className="inline-block mt-3 text-xs font-semibold px-3 py-1 rounded-full transition-all duration-300"
            style={{
              backgroundColor: hovered ? accent : `${accent}30`,
              color: hovered ? "white" : accent,
              border: `1px solid ${accent}50`,
            }}
          >
            {item.badge}
          </span>
        )}
      </div>
    </div>
  );
}

const BADGE_KEYS: Record<string, keyof ReturnType<typeof useLanguage>["t"]["menu"]["badges"] | null> = {
  "Fan Favourite": "fanFav",
  "Must Try":      "mustTry",
  "Signature":     "signature",
  "Premium":       "premium",
  "Local Brew":    "localBrew",
  "Legendary":     "legendary",
  "Bestseller":    "bestseller",
  "Most Ordered":  "mostOrdered",
};

export default function MenuSection() {
  const [activeTab, setActiveTab] = useState("bites");
  const ref     = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { t, lang } = useLanguage();

  /* ── Initial section-enter reveal (fires once when section scrolls into view) */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting)
            e.target.querySelectorAll(".reveal").forEach((el, i) =>
              setTimeout(() => el.classList.add("visible"), i * 80)
            );
        }),
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  /* ── BUG FIX: Re-reveal items whenever the active tab changes.
     When React swaps in new DOM nodes for the grid, those nodes
     start with `reveal` (opacity:0). The IntersectionObserver
     already fired and won't re-fire, so we manually add `visible`
     after a single frame to trigger the CSS transition.           */
  useEffect(() => {
    const timer = setTimeout(() => {
      gridRef.current
        ?.querySelectorAll<HTMLElement>(".reveal:not(.visible)")
        .forEach((el, i) => {
          setTimeout(() => el.classList.add("visible"), i * 55);
        });
    }, 16); // one animation frame — wait for React to finish rendering
    return () => clearTimeout(timer);
  }, [activeTab]);

  const active = MENU.find((c) => c.id === activeTab)!;

  return (
    <section id="menu" ref={ref} className="relative py-24 md:py-36 bg-[#0a1a0a] overflow-hidden">
      {/* Background texture — subtle jungle photo */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: `
            radial-gradient(ellipse 800px 600px at 20% 30%, rgba(45,110,45,0.06) 0%, transparent 70%),
            radial-gradient(ellipse 600px 800px at 80% 70%, rgba(166,112,53,0.04) 0%, transparent 70%)
          `,
        }} />
      </div>

      {/* Fireflies — subtle in the menu section */}
      <Fireflies count={10} className="opacity-40" />

      {/* Side vines */}
      <SideVine side="right" height={700} />

      {/* Top wave from vibe section */}
      <div className="absolute top-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full" style={{ height: 80 }}>
          <path d="M0,80 C240,0 480,80 720,40 C960,0 1200,60 1440,30 L1440,0 L0,0 Z" fill="#0f260f" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="reveal flex items-center justify-center gap-3 mb-5">
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #e8562a, transparent)" }} />
            <span className="text-[#62a062] text-xs tracking-[0.3em] uppercase font-medium">{t.menu.eyebrow}</span>
            <span className="h-px w-14" style={{ background: "linear-gradient(90deg, transparent, #e8562a, transparent)" }} />
          </div>
          <h2 className="reveal font-playfair text-white font-black leading-tight mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            {t.menu.headlineA}<span className="gradient-text">{t.menu.headlineB}</span>
          </h2>
          <p className="reveal text-white/40 text-base max-w-lg mx-auto leading-relaxed">
            {t.menu.sub}
            <em className="not-italic text-[#d4b483]"> {t.menu.subAccent}</em>
          </p>
        </div>

        {/* Category tabs — glass style */}
        <div ref={tabsRef} className="reveal flex overflow-x-auto gap-2 pb-3 mb-10 justify-start md:justify-center scrollbar-hide">
          {MENU.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden"
                style={{
                  background: isActive
                    ? `linear-gradient(135deg, ${cat.accent}, ${cat.accent}cc)`
                    : "rgba(255,255,255,0.05)",
                  color: isActive ? "white" : "rgba(255,255,255,0.45)",
                  border: `1px solid ${isActive ? cat.accent : "rgba(255,255,255,0.08)"}`,
                  boxShadow: isActive ? `0 4px 20px ${cat.glow}` : "none",
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <span dangerouslySetInnerHTML={{ __html: cat.emoji }} />
                <span className="hidden sm:inline">{lang === "es" ? cat.label : cat.labelEs}</span>
                <span className="sm:hidden">{cat.labelEs}</span>
              </button>
            );
          })}
        </div>

        {/* Active category header — no reveal class (changes on every tab, must always be visible) */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-baseline gap-2">
          <h3
            className="font-playfair font-black text-3xl md:text-4xl"
            style={{ color: active.accent }}
          >
            {lang === "es" ? active.label : active.labelEs}
          </h3>
          <span className="text-white/25 text-sm italic sm:ml-3">{lang === "es" ? active.labelEs : active.label}</span>
        </div>

        {/* Items grid — glass cards */}
        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.items.map((item, i) => {
            const badgeKey = item.badge ? BADGE_KEYS[item.badge] : null;
            const translatedBadge = badgeKey ? t.menu.badges[badgeKey] : item.badge;
            return (
              <div
                key={item.name}
                className="reveal"
                style={{ transitionDelay: `${i * 0.07}s` }}
              >
                <MenuCard item={{ ...item, badge: translatedBadge }} accent={active.accent} glow={active.glow} />
              </div>
            );
          })}
        </div>

        {/* Disclaimer */}
        <p className="reveal text-center text-white/20 text-xs mt-10 tracking-wide">
          {t.menu.disclaimer}
        </p>
      </div>
    </section>
  );
}
