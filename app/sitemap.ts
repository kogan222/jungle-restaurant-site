import type { MetadataRoute } from "next";

/*
  Public, indexable pages only.
  /book, /stories and /events are intentionally excluded — they are
  hidden future pages (noindex) until the client launches them.
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
    {
      url:             `${BASE_URL}/menu`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.9,
    },
    {
      url:             `${BASE_URL}/tribe`,
      lastModified:    new Date(),
      changeFrequency: "monthly",
      priority:        0.6,
    },
  ];
}
