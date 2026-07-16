import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TribeContent from "@/components/tribe/TribeContent";

export const metadata: Metadata = {
  title: "Jungle Tribe — Join the Family",
  description:
    "Join the Jungle Tribe at The Jungle Wey in Mahahual: live music nights, secret menus, members-only tastings and jungle happenings. Sign up and share the flow.",
  alternates: { canonical: "https://thejunglewey.com/tribe" },
};

export default function TribePage() {
  return (
    <>
      <header role="banner">
        <Navbar />
      </header>
      <TribeContent />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
