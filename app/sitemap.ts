import type { MetadataRoute } from "next";
import { posts } from "@/lib/posts";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/blog", "/about", "/contact", "/privacy", "/terms"].map((p) => ({
    url: `${siteUrl}${p}`,
    lastModified: "2026-11-17",
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));
  const articles = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));
  return [...pages, ...articles];
}
