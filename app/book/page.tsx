import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import FoundationPage from "@/components/foundation/FoundationPage";

/* Hidden future page — production-ready foundation.
   Not linked from navigation, excluded from the sitemap, noindex. */
export const metadata: Metadata = {
  title: "Book Your Experience",
  robots: { index: false, follow: false },
};

const copy = {
  en: {
    eyebrow: "Book Your Experience",
    titleA: "Your Table in ",
    titleB: "the Jungle",
    intro:
      "Private dinners, celebrations, and experiences under the trees — crafted around you.",
    sections: [
      { icon: "🌿", title: "Garden Dinners", body: "A private corner of the garden, set just for your group." },
      { icon: "🎉", title: "Celebrations", body: "Birthdays, proposals, or no reason at all — we set the stage." },
      { icon: "🍽️", title: "Chef's Experience", body: "A tasting journey through the jungle, guided by our kitchen." },
    ],
    ctaLabel: "Ask us on WhatsApp",
    comingSoon: "Coming soon",
  },
  es: {
    eyebrow: "Reserva Tu Experiencia",
    titleA: "Tu Mesa en ",
    titleB: "la Selva",
    intro:
      "Cenas privadas, celebraciones y experiencias bajo los árboles — hechas a tu medida.",
    sections: [
      { icon: "🌿", title: "Cenas en el Jardín", body: "Un rincón privado del jardín, montado solo para tu grupo." },
      { icon: "🎉", title: "Celebraciones", body: "Cumpleaños, propuestas o sin razón alguna — nosotros ponemos el escenario." },
      { icon: "🍽️", title: "Experiencia del Chef", body: "Un viaje de degustación por la selva, guiado por nuestra cocina." },
    ],
    ctaLabel: "Pregúntanos por WhatsApp",
    comingSoon: "Muy pronto",
  },
};

export default function BookPage() {
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
