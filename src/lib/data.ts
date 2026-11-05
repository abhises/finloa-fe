import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { API_URL, type Plan, type PortfolioVideo, type Post, type PostDetail } from "./api";

/** Server-side fetches use the internal address when running in Docker (e.g. http://backend:4000). */
export const SERVER_API_URL = process.env.API_INTERNAL_URL ?? API_URL;

/** Used when the API is unreachable (e.g. building without the backend running). */
const FALLBACK_PLANS: Plan[] = [
  {
    id: "starter",
    slug: "starter",
    name: "Starter",
    tagline: "1 video a week",
    priceCents: 29900,
    description: "For businesses starting a YouTube channel and building a steady rhythm.",
    ctaLabel: "Start with Starter",
    longVideos: 4,
    shorts: 4,
    featuresIntro: null,
    features: [
      "Editing, thumbnails, titles, descriptions and tags",
      "Uploads and scheduling on YouTube",
      "Monthly content calendar",
    ],
    popular: false,
    highlighted: false,
  },
  {
    id: "growth",
    slug: "growth",
    name: "Growth",
    tagline: "2 videos a week + social",
    priceCents: 59900,
    description: "For brands ready to grow on YouTube and reuse every Short on TikTok.",
    ctaLabel: "Get Growth",
    longVideos: 8,
    shorts: 12,
    featuresIntro: "Everything in Starter, plus:",
    features: [
      "Shorts cross-posted to TikTok",
      "Keyword and topic research for every video",
      "Monthly performance report",
    ],
    popular: true,
    highlighted: true,
  },
  {
    id: "pro",
    slug: "pro",
    name: "Pro",
    tagline: "3 videos a week + strategy",
    priceCents: 99900,
    description: "For teams that want a growth plan behind the content, not just more of it.",
    ctaLabel: "Get Pro",
    longVideos: 12,
    shorts: 24,
    featuresIntro: "Everything in Growth, plus:",
    features: ["Shorts cross-posted to Facebook", "Competitor and niche analysis"],
    popular: false,
    highlighted: false,
  },
  {
    id: "premium",
    slug: "premium",
    name: "Premium",
    tagline: "Every weekday, fully managed",
    priceCents: 199900,
    description: "For companies that want a daily channel without managing a single step.",
    ctaLabel: "Get started",
    longVideos: 20,
    shorts: 40,
    featuresIntro: "Everything in Pro, plus:",
    features: [
      "Dedicated channel manager",
      "Comment and community management",
      "Priority turnaround",
      "Quarterly channel audit",
    ],
    popular: false,
    highlighted: false,
  },
];

export async function getPlans(): Promise<Plan[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${SERVER_API_URL}/api/plans`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const json = (await res.json()) as { data: Plan[] };
    return json.data.length ? json.data : FALLBACK_PLANS;
  } catch (err) {
    console.warn(`[finloa] Could not load plans from ${SERVER_API_URL}, using fallback.`, err);
    return FALLBACK_PLANS;
  }
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts");
  try {
    const res = await fetch(`${SERVER_API_URL}/api/posts`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return ((await res.json()) as { data: Post[] }).data;
  } catch (err) {
    console.warn(`[finloa] Could not load posts from ${SERVER_API_URL}.`, err);
    return [];
  }
}

export async function getVideos(): Promise<PortfolioVideo[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("videos");
  try {
    const res = await fetch(`${SERVER_API_URL}/api/videos`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return ((await res.json()) as { data: PortfolioVideo[] }).data;
  } catch (err) {
    console.warn(`[finloa] Could not load videos from ${SERVER_API_URL}.`, err);
    return [];
  }
}

/** One published article, or null when it doesn't exist (or the API is down). */
export async function getPost(slug: string): Promise<PostDetail | null> {
  "use cache";
  cacheLife("minutes");
  cacheTag("posts", `post:${slug}`);
  try {
    const res = await fetch(`${SERVER_API_URL}/api/posts/${encodeURIComponent(slug)}`, { signal: AbortSignal.timeout(4000) });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return ((await res.json()) as { data: PostDetail }).data;
  } catch (err) {
    console.warn(`[finloa] Could not load post "${slug}" from ${SERVER_API_URL}.`, err);
    return null;
  }
}
