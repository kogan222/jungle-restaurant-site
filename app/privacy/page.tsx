import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PrivacyContent from "@/components/privacy/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How The Jungle Wey in Mahahual collects and uses the personal data you share when you join the Jungle Tribe, and how to exercise your rights.",
  alternates: { canonical: "https://www.thejunglewey.com/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <header role="banner">
        <Navbar />
      </header>
      <PrivacyContent />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
