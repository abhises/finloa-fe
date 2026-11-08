import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data";

const SITE = "https://finloa.com";

/** Public marketing pages. Add new routes here so search engines find them. */
const PAGES: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/videos", changeFrequency: "weekly", priority: 0.9 },
  { path: "/seo", changeFrequency: "monthly", priority: 0.8 },
  { path: "/paid-media", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ai-marketing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/content-marketing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/website-design", changeFrequency: "monthly", priority: 0.8 },
  { path: "/for-creators", changeFrequency: "monthly", priority: 0.8 },
  { path: "/why-finloa", changeFrequency: "monthly", priority: 0.7 },
  { path: "/netherlands", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.2 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // getPosts is cached for minutes, so new posts appear without a rebuild
  const posts = await getPosts();

  return [
    ...PAGES.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE}${path}`,
      changeFrequency,
      priority,
    })),
    ...posts.map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: post.coverImage ? [post.coverImage] : undefined,
    })),
  ];
}
