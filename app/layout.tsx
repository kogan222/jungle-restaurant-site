import type { Metadata } from "next";
import { Mouse_Memoirs, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { HOURS } from "@/lib/business-info";

/* Brand Manual typography (Lineamientos de Marca, p.11):
   Mouse Memoirs — headlines & short highlighted phrases.
   Poppins — subtitles (Bold) and running text (Regular). */
const mouseMemoirs = Mouse_Memoirs({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

/* ═══════════════════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════════════════ */
const SITE_URL  = "https://thejunglewey.com";
const SITE_NAME = "The Jungle Wey";
const OG_IMAGE  = `${SITE_URL}/images/og-cover.jpg`;

const TITLE       = "The Jungle Wey | Jungle Restaurant & Cocktail Bar in Mahahual";
const DESCRIPTION =
  "Discover The Jungle Wey in Mahahual, Mexico — fresh Mexican cuisine, botanical cocktails, tropical jungle atmosphere, and unforgettable dining near the Caribbean coast. Reserve your table today.";
const OG_DESC =
  "Fresh Mexican cuisine, botanical cocktails and a unique jungle dining experience near the Caribbean coast in Mahahual.";

/* ═══════════════════════════════════════════════════════
   METADATA — Next.js App Router Metadata API
═══════════════════════════════════════════════════════ */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  /* ── Title ─────────────────────────────────────────── */
  title: {
    default:  TITLE,
    template: "%s | The Jungle Wey",
  },

  /* ── Description ────────────────────────────────────── */
  description: DESCRIPTION,

  /* ── Keywords ───────────────────────────────────────── */
  keywords: [
    "Mahahual restaurant",
    "best restaurant in Mahahual",
    "jungle restaurant Mexico",
    "cocktails Mahahual",
    "Mexican food Mahahual",
    "restaurante Mahahual",
    "outdoor dining Mahahual",
    "seafood restaurant Mahahual",
    "tropical restaurant Quintana Roo",
    "best restaurant Costa Maya",
    "The Jungle Wey",
    "cocktail bar Mahahual",
    "craft cocktails Mahahual",
    "botanical drinks Mahahual",
    "restaurant near cruise terminal Mahahual",
    "bar Mahahual Mexico",
    "comida Mahahual",
    "Caribbean coast restaurant Mexico",
  ],

  /* ── Canonical + hreflang ───────────────────────────── */
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en":    SITE_URL,
      "es":    SITE_URL,
      "x-default": SITE_URL,
    },
  },

  /* ── Open Graph ─────────────────────────────────────── */
  openGraph: {
    type:     "website",
    url:      SITE_URL,
    siteName: SITE_NAME,
    title:    TITLE,
    description: OG_DESC,
    locale:   "en_US",
    images: [
      {
        url:    OG_IMAGE,
        width:  1200,
        height: 630,
        alt:    "The Jungle Wey — Jungle Restaurant & Cocktail Bar in Mahahual, Mexico",
      },
    ],
  },

  /* ── Twitter / X ────────────────────────────────────── */
  twitter: {
    card:        "summary_large_image",
    site:        "@thejunglewey",
    creator:     "@thejunglewey",
    title:       TITLE,
    description: OG_DESC,
    images:      [OG_IMAGE],
  },

  /* ── Robots ─────────────────────────────────────────── */
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:                 true,
      follow:                true,
      "max-video-preview":   -1,
      "max-image-preview":   "large",
      "max-snippet":         -1,
    },
  },

  /* ── Icons ─────────────────────────────────────────────
     favicon.ico lives in app/ (auto-detected by Next.js).
     PNG icons live in public/ (referenced explicitly below).
  ── */
  icons: {
    icon: [
      { url: "/favicon.ico",       type: "image/x-icon"           },
      { url: "/icon-32x32.png",    type: "image/png", sizes: "32x32"   },
      { url: "/icon-192x192.png",  type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/favicon.ico",
    apple:  [
      { url: "/apple-touch-icon.png", type: "image/png", sizes: "180x180" },
    ],
  },

  /* ── Verification (uncomment when deploying) ────────── */
  // verification: {
  //   google: "YOUR_GOOGLE_SEARCH_CONSOLE_TOKEN",
  // },
};

/* ═══════════════════════════════════════════════════════
   RESTAURANT JSON-LD — Schema.org structured data
   Placed as a plain <script> tag so it is present in the
   initial HTML response (Googlebot reads it immediately,
   no JS execution required).
═══════════════════════════════════════════════════════ */
const WHATSAPP_URL =
  "https://wa.me/529831011061?text=" +
  encodeURIComponent(
    "*Welcome to The Jungle Wey*\n\nI would like to reserve a table.\n\n*Name:* \n*Date:* \n*Time:* \n*Guests:* \n*Special Request:* "
  );

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    /* ── Restaurant ── */
    {
      "@type":        ["Restaurant", "FoodEstablishment", "LocalBusiness"],
      "@id":          `${SITE_URL}/#restaurant`,
      name:           "The Jungle Wey",
      alternateName:  "Jungle Wey",
      description:    DESCRIPTION,
      url:            SITE_URL,
      telephone:      "+529831011061",
      email:          "info@thejunglewey.com",
      priceRange:     "$$",
      currenciesAccepted: "MXN",
      paymentAccepted:    "Cash, Credit Card",
      servesCuisine:  ["Mexican", "Seafood", "International", "Fusion", "Vegetarian"],
      menu:           `${SITE_URL}/#menu`,
      reservationUrl: WHATSAPP_URL,
      hasMap:         "https://www.google.com/maps/search/The+Jungle+Wey+Avenida+Paseo+del+Puerto+1127+Mahahual+Quintana+Roo",
      address: {
        "@type":         "PostalAddress",
        streetAddress:   "Av. Paseo del Puerto 1127",
        addressLocality: "Mahahual",
        addressRegion:   "Quintana Roo",
        postalCode:      "77976",
        addressCountry:  "MX",
      },
      geo: {
        "@type":    "GeoCoordinates",
        latitude:   18.7074,
        longitude:  -87.7063,
      },
      /* Hours come from lib/business-info.ts — single source of truth
         shared with the Contact section and /api/google-business.
         Closed days are simply omitted (schema.org convention). */
      openingHoursSpecification: HOURS.filter((h) => !h.closed).map((h) => ({
        "@type":   "OpeningHoursSpecification",
        dayOfWeek: h.day,
        opens:     h.opens,
        closes:    h.closes,
      })),
      amenityFeature: [
        { "@type": "LocationFeatureSpecification", name: "Outdoor Seating",      value: true },
        { "@type": "LocationFeatureSpecification", name: "Live Music",            value: true },
        { "@type": "LocationFeatureSpecification", name: "Full Bar",              value: true },
        { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi",            value: true },
        { "@type": "LocationFeatureSpecification", name: "Dog Friendly",          value: true },
        { "@type": "LocationFeatureSpecification", name: "Vegan Options",         value: true },
        { "@type": "LocationFeatureSpecification", name: "Wheelchair Accessible", value: true },
      ],
      sameAs: [
        "https://instagram.com/thejunglewey",
        "https://www.tripadvisor.com/Restaurant_Review-g499450-d33319306-Reviews-The_Jungle_Wey-Mahahual_Costa_Maya_Yucatan_Peninsula.html",
      ],
      image: [
        `${SITE_URL}/images/og-cover.jpg`,
        `${SITE_URL}/images/vibe-neon-sign.jpg`,
        `${SITE_URL}/images/brand-wild-soul.jpg`,
        `${SITE_URL}/images/food-burger.jpg`,
        `${SITE_URL}/images/drink-espresso-martini.jpg`,
      ],
      aggregateRating: {
        "@type":      "AggregateRating",
        ratingValue:  "5.0",
        bestRating:   "5",
        worstRating:  "1",
        reviewCount:  "23",
        ratingCount:  "23",
      },
      review: {
        "@type":  "Review",
        author:   { "@type": "Person", name: "TripAdvisor Guest" },
        reviewRating: {
          "@type":      "Rating",
          ratingValue:  "5",
          bestRating:   "5",
        },
        reviewBody:
          "An easy-going tropical paradise with food that surprises you every time. The cocktails, the atmosphere, the music — it all hits differently here.",
      },
    },

    /* ── WebSite (enables Google Sitelinks search box) ── */
    {
      "@type":   "WebSite",
      "@id":     `${SITE_URL}/#website`,
      url:       SITE_URL,
      name:      SITE_NAME,
      publisher: { "@id": `${SITE_URL}/#restaurant` },
      inLanguage: ["en", "es"],
    },

    /* ── BreadcrumbList ── */
    {
      "@type": "BreadcrumbList",
      "@id":   `${SITE_URL}/#breadcrumb`,
      itemListElement: [
        {
          "@type":    "ListItem",
          position:   1,
          name:       "Home",
          item:       SITE_URL,
        },
        {
          "@type":    "ListItem",
          position:   2,
          name:       "Menu",
          item:       `${SITE_URL}/#menu`,
        },
        {
          "@type":    "ListItem",
          position:   3,
          name:       "Drinks",
          item:       `${SITE_URL}/#drinks`,
        },
        {
          "@type":    "ListItem",
          position:   4,
          name:       "Gallery",
          item:       `${SITE_URL}/#gallery`,
        },
        {
          "@type":    "ListItem",
          position:   5,
          name:       "Find Us",
          item:       `${SITE_URL}/#contact`,
        },
      ],
    },
  ],
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
    <html lang="en" className={`${mouseMemoirs.variable} ${poppins.variable}`}>
      <head>
        {/* Preconnect — reduces font load latency */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS prefetch for third-party services */}
        <link rel="dns-prefetch" href="//wa.me" />
        <link rel="dns-prefetch" href="//www.google.com" />
        <link rel="dns-prefetch" href="//instagram.com" />

        {/* Mobile browser chrome colour */}
        <meta name="theme-color" content="#020d0e" />
        <meta name="msapplication-TileColor" content="#020d0e" />

        {/* Apple / PWA */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="The Jungle Wey" />

        {/* Local SEO geo tags */}
        <meta name="geo.region"    content="MX-ROO" />
        <meta name="geo.placename" content="Mahahual, Quintana Roo, México" />
        <meta name="geo.position"  content="18.7074;-87.7063" />
        <meta name="ICBM"          content="18.7074, -87.7063" />

        {/* Business contact */}
        <meta name="contact"  content="info@thejunglewey.com" />
        <meta name="reply-to" content="info@thejunglewey.com" />

        {/*
          JSON-LD — inline plain <script> tag so the structured data
          is present in the initial HTML byte, readable by Googlebot
          without any JavaScript execution.
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-full">
        <LanguageProvider>{children}</LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
