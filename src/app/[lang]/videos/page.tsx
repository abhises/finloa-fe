import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { Hero } from "@/components/hero";
import { PageShell } from "@/components/page-shell";
import { Pricing } from "@/components/pricing";
import { VideoWork } from "@/components/video-work";
import { getLocale, getT, pageMetadata } from "@/i18n/server";
import { localizePlans } from "@/i18n/plans";
import { getPlans, getVideos } from "@/lib/data";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/videos",
    ["Video Creation — Finloa", "Videoproductie — Finloa"],
    [
      "Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear monthly price. We edit, optimise and post so your channels keep growing.",
      "Professionele video's voor YouTube, TikTok, Instagram en LinkedIn voor een duidelijke maandprijs. Wij monteren, optimaliseren en posten, zodat je kanalen blijven groeien.",
    ],
  );
}

export default async function VideoCreationPage() {
  const [rawPlans, videos, locale, t] = await Promise.all([getPlans(), getVideos(), getLocale(), getT()]);
  const plans = localizePlans(rawPlans, locale);

  return (
    <PageShell minimalHeader ctaLabel={t("Plan Your Growth", "Plan je groei")} ctaHref="#contact">
      <Hero />
      <Pricing plans={plans} />
      <VideoWork videos={videos} />
      <ContactSection
        source="video-creation"
        intro={t(
          "Not sure which package fits? Tell us about your channel and posting pace and we'll recommend the best option.",
          "Twijfel je welk pakket past? Vertel ons over je kanaal en hoe vaak je post, dan adviseren we de beste optie.",
        )}
        fourthField={{ name: "company", placeholder: t("Channel or company", "Kanaal of bedrijf") }}
        messagePlaceholder={t("How many videos do you post per month?", "Hoeveel video's post je per maand?")}
        trackPlanSelection
      />
    </PageShell>
  );
}
