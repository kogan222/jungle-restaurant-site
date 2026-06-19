import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name:             "The Jungle Wey",
    short_name:       "Jungle Wey",
    description:      "Restaurant & Bar in Mahahual, Mexico. Fresh Mexican cuisine, botanical cocktails & jungle atmosphere.",
    start_url:        "/",
    display:          "standalone",
    orientation:      "portrait",
    background_color: "#020d0e",
    theme_color:      "#020d0e",
    categories:       ["food", "restaurants", "travel"],
    lang:             "en",
    icons: [
      {
        src:     "/icon-192x192.png",
        sizes:   "192x192",
        type:    "image/png",
        purpose: "maskable",
      },
      {
        src:     "/icon-32x32.png",
        sizes:   "32x32",
        type:    "image/png",
        purpose: "any",
      },
    ],
  };
}
