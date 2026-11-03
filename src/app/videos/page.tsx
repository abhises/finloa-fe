import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { Hero } from "@/components/hero";
import { PageShell } from "@/components/page-shell";
import { Pricing } from "@/components/pricing";
import { VideoWork } from "@/components/video-work";
import { getPlans, getVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Video Creation — Finloa",
  description:
    "Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear monthly price. We edit, optimise and post so your channels keep growing.",
};

export default async function VideoCreationPage() {
  const [plans, videos] = await Promise.all([getPlans(), getVideos()]);

  return (
    <PageShell minimalHeader ctaLabel="Plan Your Growth" ctaHref="#contact">
      <Hero />
      <Pricing plans={plans} />
      <VideoWork videos={videos} />
      <ContactSection
        source="video-creation"
        intro="Not sure which package fits? Tell us about your channel and posting pace and we'll recommend the best option."
        fourthField={{ name: "company", placeholder: "Channel or company" }}
        messagePlaceholder="How many videos do you post per month?"
        trackPlanSelection
      />
    </PageShell>
  );
}
