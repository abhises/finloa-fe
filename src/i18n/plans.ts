import type { Plan } from "@/lib/api";
import type { T } from "./config";

type PlanCopy = Pick<Plan, "name" | "tagline" | "description" | "ctaLabel" | "featuresIntro" | "features">;

/**
 * Text of the video plans in both languages, matched by slug (prices and counts come from the API).
 * Written as t("English", "Nederlands") so every line can be edited under Admin → Pages → Video plans.
 */
const COPY = (t: T): Record<string, PlanCopy> => ({
  starter: {
    name: t("Starter", "Starter"),
    tagline: t("1 video a week", "1 video per week"),
    description: t(
      "For businesses starting a YouTube channel and building a steady rhythm.",
      "Voor bedrijven die een YouTube-kanaal starten en een vast ritme willen opbouwen.",
    ),
    ctaLabel: t("Start with Starter", "Begin met Starter"),
    featuresIntro: null,
    features: [
      t("Editing, thumbnails, titles, descriptions and tags", "Montage, thumbnails, titels, beschrijvingen en tags"),
      t("Uploads and scheduling on YouTube", "Uploaden en inplannen op YouTube"),
      t("Monthly content calendar", "Maandelijkse contentkalender"),
    ],
  },
  growth: {
    name: t("Growth", "Growth"),
    tagline: t("2 videos a week + social", "2 video's per week + social"),
    description: t(
      "For brands ready to grow on YouTube and reuse every Short on TikTok.",
      "Voor merken die klaar zijn om te groeien op YouTube en elke Short ook op TikTok willen inzetten.",
    ),
    ctaLabel: t("Get Growth", "Kies Growth"),
    featuresIntro: t("Everything in Starter, plus:", "Alles uit Starter, plus:"),
    features: [
      t("Shorts cross-posted to TikTok", "Shorts ook geplaatst op TikTok"),
      t("Keyword and topic research for every video", "Zoekwoord- en onderwerponderzoek voor elke video"),
      t("Monthly performance report", "Maandelijks prestatierapport"),
    ],
  },
  pro: {
    name: t("Pro", "Pro"),
    tagline: t("3 videos a week + strategy", "3 video's per week + strategie"),
    description: t(
      "For teams that want a growth plan behind the content, not just more of it.",
      "Voor teams die een groeiplan achter hun content willen, niet alleen méér content.",
    ),
    ctaLabel: t("Get Pro", "Kies Pro"),
    featuresIntro: t("Everything in Growth, plus:", "Alles uit Growth, plus:"),
    features: [
      t("Shorts cross-posted to Facebook", "Shorts ook geplaatst op Facebook"),
      t("Competitor and niche analysis", "Concurrentie- en nicheanalyse"),
    ],
  },
  premium: {
    name: t("Premium", "Premium"),
    tagline: t("Every weekday, fully managed", "Elke werkdag, volledig verzorgd"),
    description: t(
      "For companies that want a daily channel without managing a single step.",
      "Voor bedrijven die een dagelijks kanaal willen zonder zelf ook maar één stap te regelen.",
    ),
    ctaLabel: t("Get started", "Aan de slag"),
    featuresIntro: t("Everything in Pro, plus:", "Alles uit Pro, plus:"),
    features: [
      t("Dedicated channel manager", "Vaste channel manager"),
      t("Comment and community management", "Beheer van reacties en community"),
      t("Priority turnaround", "Voorrang bij oplevering"),
      t("Quarterly channel audit", "Kwartaalaudit van je kanaal"),
    ],
  },
});

/** The English text in the code, to tell whether the API still has the default */
const DEFAULTS = COPY((en) => en);

/**
 * Plans with the text from Admin → Pages. Dutch always uses it (the API is English only); English uses it
 * wherever the API still has the default text, so a plan changed in the database keeps its own wording.
 */
export function localizePlans(plans: Plan[], locale: "en" | "nl", t: T): Plan[] {
  const copy = COPY(t);
  return plans.map((p) => {
    const c = copy[p.slug];
    const d = DEFAULTS[p.slug];
    if (!c || !d) return p;
    if (locale === "nl") return { ...p, ...c };
    const same = <K extends keyof PlanCopy>(k: K) => (p[k] === d[k] ? c[k] : p[k]);
    return {
      ...p,
      name: same("name"),
      tagline: same("tagline"),
      description: same("description"),
      ctaLabel: same("ctaLabel"),
      featuresIntro: same("featuresIntro"),
      features: p.features.map((f, i) => (f === d.features[i] ? c.features[i] : f)),
    };
  });
}
