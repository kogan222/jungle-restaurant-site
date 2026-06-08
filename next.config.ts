import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* ── Image optimisation ───────────────────────────── */
  images: {
    // Serve modern WebP / AVIF automatically
    formats: ["image/avif", "image/webp"],
    // Responsive breakpoints matching the design
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes:  [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimise re-optimisation on every deploy
    minimumCacheTTL: 86400,
  },

  /* ── HTTP headers ─────────────────────────────────── */
  async headers() {
    return [
      {
        // Static assets — long-lived cache
        source: "/images/:path*",
        headers: [
          {
            key:   "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // HTML pages — revalidate often so edits show up
        source: "/",
        headers: [
          {
            key:   "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },

  /* ── Compression ──────────────────────────────────── */
  compress: true,

  /* ── Powered-by header ────────────────────────────── */
  poweredByHeader: false,
};

export default nextConfig;
