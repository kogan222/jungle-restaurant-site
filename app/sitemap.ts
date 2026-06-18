import type { MetadataRoute } from "next";

/*
  Single-page app — only the root URL is a real crawlable page.
  Hash anchors (#menu, #drinks, etc.) are NOT separate URLs;
  Google ignores the fragment portion anyway.
*/
const BASE_URL = "https://thejunglewey.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:             BASE_URL,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        1.0,
    },
  ];
}
