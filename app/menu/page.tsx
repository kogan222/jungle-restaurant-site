import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import MenuExperience from "@/components/menu/MenuExperience";

export const metadata: Metadata = {
  title: "Menu — Breakfast & Dinner",
  description:
    "The full menu at The Jungle Wey in Mahahual: brunch from 08:00, dinner until 23:00. Jungle bites, blue-corn tacos, burgers, poke, botanical drinks, mezcal bar and more. Prices in MXN.",
  alternates: { canonical: "https://thejunglewey.com/menu" },
  openGraph: {
    title: "The Jungle Wey — Full Menu",
    description:
      "Breakfast 08:00–15:00 · Dinner 15:00–23:00. Wild, vibrant and full of surprises — puro antojo bien hecho.",
    url: "https://thejunglewey.com/menu",
  },
};

export default function MenuPage() {
  return (
    <>
      <header role="banner">
        <Navbar />
      </header>
      <MenuExperience />
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
