import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

/* ═══════════════════════════════════════════════════════
   SEO METADATA — Full Next.js Metadata API
═══════════════════════════════════════════════════════ */

const SITE_URL   = "https://thejunglewey.com";
const SITE_NAME  = "The Jungle Wey";
const OG_IMAGE   = `${SITE_URL}/images/og-cover.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* ── Title ─────────────────────────────────────────── */
  title: {
    default:  "The Jungle Wey | Restaurant & Bar in Mahahual, Mexico",
    template: "%s | The Jungle Wey",
  },

  /* ── Description ────────────────────────────────────── */
  description:
    "Experience fresh seafood, handcrafted cocktails, and a unique jungle atmosphere at The Jungle Wey in Mahahual, Mexico.",

  /* ── Keywords (local SEO) ───────────────────────────── */
  keywords: [
    "restaurant Mahahual",
    "restaurante Mahahual",
    "outdoor dining Mahahual",
    "tropical restaurant Quintana Roo",
    "best restaurant Costa Maya",
    "jungle restaurant Mexico",
    "The Jungle Wey",
    "craft cocktails Mahahual",
    "botanical drinks Mahahual",
    "restaurant near cruise terminal Mahahual",
    "comida Mahahual",
  ],

  /* ── Canonical ─────────────────────────────────────── */
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": `${SITE_URL}/en`,
      "es-MX": `${SITE_URL}/es`,
    },
  },

  /* ── Open Graph ─────────────────────────────────────── */
  openGraph: {
    type:        "website",
    url:         SITE_URL,
    siteName:    SITE_NAME,
    title:       "The Jungle Wey | Restaurant & Bar in Mahahual, Mexico",
    description:
      "Experience fresh seafood, handcrafted cocktails, and a unique jungle atmosphere at The Jungle Wey in Mahahual, Mexico.",
    locale:      "en_US",
    images: [
      {
        url:    OG_IMAGE,
        width:  1200,
        height: 630,
        alt:    "The Jungle Wey — Restaurant & Bar in Mahahual, Mexico",
      },
    ],
  },

  /* ── Twitter / X ────────────────────────────────────── */
  twitter: {
    card:        "summary_large_image",
    site:        "@thejunglewey",
    creator:     "@thejunglewey",
    title:       "The Jungle Wey | Restaurant & Bar in Mahahual, Mexico",
    description:
      "Experience fresh seafood, handcrafted cocktails, and a unique jungle atmosphere at The Jungle Wey in Mahahual, Mexico.",
    images: [OG_IMAGE],
  },

  /* ── Robots ─────────────────────────────────────────── */
  robots: {
    index:          true,
    follow:         true,
    googleBot: {
      index:                  true,
      follow:                 true,
      "max-video-preview":    -1,
      "max-image-preview":    "large",
      "max-snippet":          -1,
    },
  },

  /* ── App & icons ─────────────────────────────────────── */
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },

  /* ── Verification (add when deploying) ──────────────── */
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  // },
};

/* ═══════════════════════════════════════════════════════
   JSON-LD Structured Data — Restaurant + LocalBusiness
═══════════════════════════════════════════════════════ */
const jsonLd = {
  "@context": "https://schema.org",
  "@type":    ["Restaurant", "FoodEstablishment"],
  name:       "The Jungle Wey",
  alternateName: "Jungle Wey",
  description:
    "A hidden tropical garden restaurant in Mahahual, Quintana Roo. 100% outdoor dining, wild ingredients, botanical drinks and zero rules. Pure jungle vibes.",
  url:        SITE_URL,
  telephone:  "+529831011061",
  email:      "info@thejunglewey.com",
  priceRange: "$$",
  currenciesAccepted: "MXN",
  paymentAccepted: "Cash, Credit Card",
  servesCuisine: ["International", "Mexican", "Fusion", "Vegetarian Options"],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Outdoor Seating",     value: true },
    { "@type": "LocationFeatureSpecification", name: "Live Music",           value: true },
    { "@type": "LocationFeatureSpecification", name: "Full Bar",             value: true },
    { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi",           value: true },
    { "@type": "LocationFeatureSpecification", name: "Dog Friendly",         value: true },
    { "@type": "LocationFeatureSpecification", name: "Vegan Options",        value: true },
    { "@type": "LocationFeatureSpecification", name: "Wheelchair Accessible",value: true },
  ],
  address: {
    "@type":           "PostalAddress",
    streetAddress:     "Av. Paseo del Puerto 1127",
    addressLocality:   "Mahahual",
    addressRegion:     "Quintana Roo",
    postalCode:        "77976",
    addressCountry:    "MX",
  },
  geo: {
    "@type":    "GeoCoordinates",
    latitude:   18.7074,
    longitude:  -87.7063,
  },
  openingHoursSpecification: [
    {
      "@type":     "OpeningHoursSpecification",
      dayOfWeek:   ["Monday", "Tuesday", "Wednesday"],
      opens:       "12:00",
      closes:      "22:00",
    },
    {
      "@type":     "OpeningHoursSpecification",
      dayOfWeek:   ["Thursday", "Friday"],
      opens:       "12:00",
      closes:      "23:00",
    },
    {
      "@type":     "OpeningHoursSpecification",
      dayOfWeek:   "Saturday",
      opens:       "11:00",
      closes:      "23:00",
    },
    {
      "@type":     "OpeningHoursSpecification",
      dayOfWeek:   "Sunday",
      opens:       "11:00",
      closes:      "22:00",
    },
  ],
  sameAs: [
    "https://instagram.com/thejunglewey",
    "https://www.tripadvisor.com/Restaurant_Review-g499450-d33319306-Reviews-The_Jungle_Wey-Mahahual_Costa_Maya_Yucatan_Peninsula.html",
  ],
  image: [
    `${SITE_URL}/images/vibe-neon-sign.jpg`,
    `${SITE_URL}/images/brand-wild-soul.jpg`,
    `${SITE_URL}/images/food-burger.jpg`,
    `${SITE_URL}/images/drink-espresso-martini.jpg`,
  ],
  hasMap: "https://www.google.com/maps/search/The+Jungle+Wey+Avenida+Paseo+del+Puerto+1127+Mahahual+Quintana+Roo",
  aggregateRating: {
    "@type":       "AggregateRating",
    ratingValue:   "5.0",
    bestRating:    "5",
    worstRating:   "1",
    reviewCount:   "23",
    ratingCount:   "23",
  },
  review: {
    "@type":  "Review",
    author:   { "@type": "Person", name: "TripAdvisor Guest" },
    reviewRating: {
      "@type":       "Rating",
      ratingValue:   "5",
      bestRating:    "5",
    },
    reviewBody:
      "An easy-going tropical paradise with food that surprises you every time. The cocktails, the atmosphere, the music — it all hits differently here.",
  },
};

/* ═══════════════════════════════════════════════════════
   ROOT LAYOUT
═══════════════════════════════════════════════════════ */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <head>
        {/* Preconnect to external origins for faster fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Theme colour for mobile browser chrome */}
        <meta name="theme-color" content="#020d0e" />
        <meta name="msapplication-TileColor" content="#020d0e" />

        {/* Mobile web-app capable */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="The Jungle Wey" />

        {/* Geo tags for local SEO */}
        <meta name="geo.region"   content="MX-ROO" />
        <meta name="geo.placename" content="Mahahual, Quintana Roo, México" />
        <meta name="geo.position" content="18.7074;-87.7063" />
        <meta name="ICBM"         content="18.7074, -87.7063" />

        {/* Business contact tags */}
        <meta name="contact"     content="info@thejunglewey.com" />
        <meta name="reply-to"    content="info@thejunglewey.com" />

        {/* JSON-LD Structured Data */}
        <Script
          id="json-ld-restaurant"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="afterInteractive"
        />
      </head>
      <body className="antialiased min-h-full">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
