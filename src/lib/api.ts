/**
 * Base URL the browser uses for the API. In production this is "/" (same origin, proxied by Caddy),
 * which becomes "" so requests go to "/api/...".
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000").replace(/\/+$/, "");

export type Plan = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  priceCents: number;
  description: string;
  ctaLabel: string;
  longVideos: number;
  shorts: number;
  featuresIntro: string | null;
  features: string[];
  popular: boolean;
  highlighted: boolean;
};

export const PLATFORMS = [
  { value: "YOUTUBE", label: "YouTube" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "FACEBOOK", label: "Facebook" },
] as const;

export type PlatformValue = (typeof PLATFORMS)[number]["value"];

export type LeadInput = {
  source: string;
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  website?: string;
  videosPerMonth?: string;
  platforms: PlatformValue[];
  planSlug?: string;
  message?: string;
  companyFax?: string;
};

export function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export type ApiError = { error: string; details?: Record<string, string[] | undefined> };

export async function submitLead(input: LeadInput) {
  const res = await fetch(`${API_URL}/api/leads`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: "Something went wrong" }))) as ApiError;
    throw body;
  }
  return (await res.json()) as { data: { id: string } };
}

export type Post = {
  id: string;
  slug: string;
  title: string;
  /** Category name in the page's language ("" when the post has no category) */
  topic: string;
  categorySlug: string | null;
  excerpt: string | null;
  coverImage: string | null;
  readMinutes: number;
  youtubeId: string | null;
  featured: boolean;
  publishedAt: string;
};

export type Faq = { q: string; a: string };

export type PostAuthor = {
  slug: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
  websiteUrl: string | null;
};

/** A full article from GET /api/posts/:slug?lang= */
export type PostDetail = Post & {
  /** false when Dutch was asked for but the post isn't translated yet (English is shown) */
  translated: boolean;
  /** Markdown body of older posts; empty when `html` is set */
  body: string;
  /** Article HTML (from sections or written by hand) */
  html: string;
  /** "toc": contents list beside the article; "wide": no contents list */
  layout: "toc" | "wide";
  /** Custom CSS of the post and its custom section types */
  css: string;
  videoLength: string | null;
  transcript: string | null;
  faqs: Faq[];
  tags: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  /** Extra JSON-LD from the admin */
  jsonLd: string | null;
  newsletterPopup: boolean;
  author: PostAuthor | null;
  updatedAt: string;
};

export async function subscribe(email: string, source = "blog") {
  const res = await fetch(`${API_URL}/api/subscribers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, source }),
  });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({ error: "Something went wrong" }))) as ApiError;
    throw body;
  }
}

export type VideoKind = "LONG" | "SHORT";

export type PortfolioVideo = {
  id: string;
  niche: string;
  kind: VideoKind;
  youtubeId: string;
  title: string | null;
  sortOrder: number;
};
