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
        src:     "/images/og-cover.jpg",
        sizes:   "any",
        type:    "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
