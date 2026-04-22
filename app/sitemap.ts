import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles().map((article) => ({
    url: `https://xiaoyu.io/writing/${article.slug}`,
    lastModified: new Date(article.date),
  }));

  const pages = [
    { url: "https://xiaoyu.io", lastModified: new Date() },
    { url: "https://xiaoyu.io/writing", lastModified: new Date() },
    { url: "https://xiaoyu.io/projects", lastModified: new Date() },
    { url: "https://xiaoyu.io/about", lastModified: new Date() },
    { url: "https://xiaoyu.io/play", lastModified: new Date() },
  ];

  return [...pages, ...articles];
}
