import type { Plan } from "@/lib/api";
import type { Locale } from "./config";

type PlanCopy = Pick<Plan, "name" | "tagline" | "description" | "ctaLabel" | "featuresIntro" | "features">;

/** Dutch copy for the video plans (plans come from the API in English). Matched by slug. */
const NL: Record<string, PlanCopy> = {
  starter: {
    name: "Starter",
    tagline: "1 video per week",
    description: "Voor bedrijven die een YouTube-kanaal starten en een vast ritme willen opbouwen.",
    ctaLabel: "Begin met Starter",
    featuresIntro: null,
    features: [
      "Montage, thumbnails, titels, beschrijvingen en tags",
      "Uploaden en inplannen op YouTube",
      "Maandelijkse contentkalender",
    ],
  },
  growth: {
    name: "Growth",
    tagline: "2 video's per week + social",
    description: "Voor merken die klaar zijn om te groeien op YouTube en elke Short ook op TikTok willen inzetten.",
    ctaLabel: "Kies Growth",
    featuresIntro: "Alles uit Starter, plus:",
    features: [
      "Shorts ook geplaatst op TikTok",
      "Zoekwoord- en onderwerponderzoek voor elke video",
      "Maandelijks prestatierapport",
    ],
  },
  pro: {
    name: "Pro",
    tagline: "3 video's per week + strategie",
    description: "Voor teams die een groeiplan achter hun content willen, niet alleen méér content.",
    ctaLabel: "Kies Pro",
    featuresIntro: "Alles uit Growth, plus:",
    features: ["Shorts ook geplaatst op Facebook", "Concurrentie- en nicheanalyse"],
  },
  premium: {
    name: "Premium",
    tagline: "Elke werkdag, volledig verzorgd",
    description: "Voor bedrijven die een dagelijks kanaal willen zonder zelf ook maar één stap te regelen.",
    ctaLabel: "Aan de slag",
    featuresIntro: "Alles uit Pro, plus:",
    features: [
      "Vaste channel manager",
      "Beheer van reacties en community",
      "Voorrang bij oplevering",
      "Kwartaalaudit van je kanaal",
    ],
  },
};

export function localizePlans(plans: Plan[], locale: Locale): Plan[] {
  if (locale !== "nl") return plans;
  return plans.map((p) => (NL[p.slug] ? { ...p, ...NL[p.slug] } : p));
}
