import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import VibeSection from "@/components/VibeSection";
import FoodHighlights from "@/components/FoodHighlights";
import MenuSection from "@/components/MenuSection";
import DrinksSection from "@/components/DrinksSection";
import GallerySection from "@/components/GallerySection";
import VideoSection from "@/components/VideoSection";
import TripAdvisorSection from "@/components/TripAdvisorSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import JungleAmbience from "@/components/JungleAmbience";
import FallingLeaves from "@/components/FallingLeaves";
import ScrollAtmosphere from "@/components/ScrollAtmosphere";
import { VineDivider } from "@/components/JungleVines";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function Home() {
  return (
    <>
      {/* Skip-to-content link for keyboard / screen-reader users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-white focus:text-[#0a1a0a] focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Global atmosphere layers (decorative — hidden from assistive tech) */}
      <div aria-hidden="true">
        <ScrollAtmosphere />
        <JungleAmbience />
        <FallingLeaves count={20} />
      </div>

      {/* ── Landmark: header ── */}
      <header role="banner">
        <Navbar />
      </header>

      {/* ── Landmark: main content ── */}
      <main
        id="main-content"
        className="relative"
        style={{ background: "#020d0e" }}
        role="main"
      >
        {/* Hero */}
        <Hero />

        {/* Vine transition (decorative) */}
        <div aria-hidden="true" className="relative z-10" style={{ background: "#0a1e0a" }}>
          <VineDivider />
        </div>

        {/* Atmosphere video */}
        <VideoSection />

        {/* Food highlights */}
        <FoodHighlights />

        {/* Full menu */}
        <MenuSection />

        {/* Drinks */}
        <DrinksSection />

        {/* Gallery */}
        <GallerySection />

        {/* Experience */}
        <VibeSection />

        {/* Social proof */}
        <TripAdvisorSection />

        {/* Find us */}
        <ContactSection />
      </main>

      {/* ── Landmark: footer ── */}
      <Footer />

      {/* Floating WhatsApp CTA — mobile only, fades in after scroll */}
      <WhatsAppFloat />
    </>
  );
}
