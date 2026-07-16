import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FoundationPage from "@/components/foundation/FoundationPage";

/* Hidden future page — production-ready foundation.
   Not linked from navigation, excluded from the sitemap, noindex. */
export const metadata: Metadata = {
  title: "Jungle Stories",
  robots: { index: false, follow: false },
};

const copy = {
  en: {
    eyebrow: "Jungle Stories",
    titleA: "Tales from ",
    titleB: "the Wild",
    intro:
      "The people, the plates, and the nights that make The Jungle Wey what it is — told one story at a time.",
    sections: [
      { icon: "📖", title: "Behind the Plates", body: "Where our recipes come from and the hands that make them." },
      { icon: "🌙", title: "Nights to Remember", body: "Live music, full moons, and evenings that ran long." },
      { icon: "🐒", title: "El Wey Says", body: "Wisdom (and nonsense) from our favorite tree." },
    ],
    ctaLabel: "Say hi on WhatsApp",
    comingSoon: "Coming soon",
  },
  es: {
    eyebrow: "Jungle Stories",
    titleA: "Historias de ",
    titleB: "la Selva",
    intro:
      "La gente, los platos y las noches que hacen de The Jungle Wey lo que es — contadas una historia a la vez.",
    sections: [
      { icon: "📖", title: "Detrás de los Platos", body: "De dónde vienen nuestras recetas y las manos que las hacen." },
      { icon: "🌙", title: "Noches Inolvidables", body: "Música en vivo, lunas llenas y veladas que se alargaron." },
      { icon: "🐒", title: "Dice El Wey", body: "Sabiduría (y ocurrencias) de nuestro árbol favorito." },
    ],
    ctaLabel: "Saluda por WhatsApp",
    comingSoon: "Muy pronto",
  },
};

export default function StoriesPage() {
  return (
    <>
      <header role="banner">
        <Navbar />
      </header>
      <FoundationPage copy={copy} />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
