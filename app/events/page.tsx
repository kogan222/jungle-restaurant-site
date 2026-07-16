import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FoundationPage from "@/components/foundation/FoundationPage";

/* Hidden future page — production-ready foundation.
   Not linked from navigation, excluded from the sitemap, noindex. */
export const metadata: Metadata = {
  title: "Events",
  robots: { index: false, follow: false },
};

const copy = {
  en: {
    eyebrow: "Events",
    titleA: "Nights in ",
    titleB: "the Jungle",
    intro:
      "Live music, tastings, and gatherings under the stars — here's what's growing in the garden.",
    sections: [
      { icon: "🎸", title: "Live Music", body: "Local artists under the trees, every week." },
      { icon: "🥃", title: "Mezcal Nights", body: "Guided tastings with Oaxacan artisanal mezcal." },
      { icon: "🌕", title: "Full Moon Dinners", body: "One night a month, the jungle glows a little brighter." },
    ],
    ctaLabel: "Ask what's on via WhatsApp",
    comingSoon: "Coming soon",
  },
  es: {
    eyebrow: "Eventos",
    titleA: "Noches en ",
    titleB: "la Selva",
    intro:
      "Música en vivo, degustaciones y encuentros bajo las estrellas — esto es lo que está creciendo en el jardín.",
    sections: [
      { icon: "🎸", title: "Música en Vivo", body: "Artistas locales bajo los árboles, cada semana." },
      { icon: "🥃", title: "Noches de Mezcal", body: "Degustaciones guiadas con mezcal artesanal oaxaqueño." },
      { icon: "🌕", title: "Cenas de Luna Llena", body: "Una noche al mes, la selva brilla un poco más." },
    ],
    ctaLabel: "Pregunta la cartelera por WhatsApp",
    comingSoon: "Muy pronto",
  },
};

export default function EventsPage() {
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
