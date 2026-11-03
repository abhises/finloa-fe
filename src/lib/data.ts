import "server-only";
import { cacheLife } from "next/cache";
import { API_URL, type Plan, type Post } from "./api";

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
    const res = await fetch(`${API_URL}/api/plans`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    const json = (await res.json()) as { data: Plan[] };
    return json.data.length ? json.data : FALLBACK_PLANS;
  } catch (err) {
    console.warn(`[finloa] Could not load plans from ${API_URL}, using fallback.`, err);
    return FALLBACK_PLANS;
  }
}

export async function getPosts(): Promise<Post[]> {
  "use cache";
  cacheLife("minutes");
  try {
    const res = await fetch(`${API_URL}/api/posts`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error(`API responded ${res.status}`);
    return ((await res.json()) as { data: Post[] }).data;
  } catch (err) {
    console.warn(`[finloa] Could not load posts from ${API_URL}.`, err);
    return [];
  }
}
