import type { MetadataRoute } from "next";
import { SITE_URL } from "@/i18n/config";
import { getPages, getPosts } from "@/lib/data";

/** Every page exists in English (finloa.com) and Dutch (nl.finloa.com). */
const languages = (path: string) => ({ en: `${SITE_URL.en}${path}`, "nl-NL": `${SITE_URL.nl}${path}` });

/** Public marketing pages. Add new routes here so search engines find them. */
const PAGES: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/videos", changeFrequency: "weekly", priority: 0.9 },
  { path: "/idea-to-product", changeFrequency: "monthly", priority: 0.9 },
  { path: "/seo", changeFrequency: "monthly", priority: 0.8 },
  { path: "/paid-media", changeFrequency: "monthly", priority: 0.8 },
  { path: "/ai-marketing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/content-marketing", changeFrequency: "monthly", priority: 0.8 },
  { path: "/website-design", changeFrequency: "monthly", priority: 0.8 },
  { path: "/for-creators", changeFrequency: "monthly", priority: 0.8 },
  { path: "/saas-development", changeFrequency: "monthly", priority: 0.8 },
  { path: "/hosting-maintenance", changeFrequency: "monthly", priority: 0.8 },
  { path: "/for-founders", changeFrequency: "monthly", priority: 0.8 },
  { path: "/for-small-businesses", changeFrequency: "monthly", priority: 0.8 },
  { path: "/why-finloa", changeFrequency: "monthly", priority: 0.7 },
  { path: "/netherlands", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.5 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Cached for minutes, so new posts and pages appear without a rebuild
  const [posts, pages] = await Promise.all([getPosts(), getPages()]);

  return Object.values(SITE_URL).flatMap((site) => [
    ...PAGES.map(({ path, changeFrequency, priority }) => ({
      url: `${site}${path}`,
      changeFrequency,
      priority,
      alternates: { languages: languages(path) },
    })),
    // Content pages from Admin → Pages (Terms, Privacy, …)
    ...pages.map((page) => ({
      url: `${site}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: "yearly" as const,
      priority: 0.3,
      alternates: { languages: languages(`/${page.slug}`) },
    })),
    ...posts.map((post) => ({
      url: `${site}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      images: post.coverImage ? [post.coverImage] : undefined,
      alternates: { languages: languages(`/blog/${post.slug}`) },
    })),
  ]);
}
