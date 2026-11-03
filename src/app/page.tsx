import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { Hero } from "@/components/hero";
import { PageShell } from "@/components/page-shell";
import { Pricing } from "@/components/pricing";
import { HowItWorks, UseCases, WhyFinloa } from "@/components/sections";
import { getPlans } from "@/lib/data";

export const metadata: Metadata = {
  title: "Finloa — Affordable video creation for businesses",
};

const faqs: FaqItem[] = [
  [
    "Do I need to film the videos myself?",
    "Not necessarily. Most clients send phone or screen recordings, and we turn them into polished videos. If you have no footage, we can script videos and use stock, motion graphics or AI voice-over.",
  ],
  ["How fast is turnaround?", "First drafts arrive within 48 hours of receiving footage. Premium clients get priority turnaround."],
  ["How many revisions do I get?", "Two rounds of revisions per video are included on every plan."],
  [
    "Can I switch or cancel my plan?",
    "Yes. Plans are month to month. Upgrade, downgrade or cancel any time before your next billing date.",
  ],
  [
    "Which platforms do you publish to?",
    "YouTube, TikTok, Instagram, LinkedIn and Facebook. We adapt aspect ratio, captions and length for each one.",
  ],
];

export default async function VideoCreationPage() {
  const plans = await getPlans();

  return (
    <PageShell>
      <Hero />
      <Pricing plans={plans} />
      <HowItWorks />
      <UseCases />
      <WhyFinloa />
      <FaqSection title="Questions businesses ask us." items={faqs} />
      <ContactSection
        source="video-creation"
        intro="Not sure which package fits? Tell us about your business and posting pace and we'll recommend the best option."
        fourthField={{ name: "company", placeholder: "Company name" }}
        messagePlaceholder="Tell us about your business and goals"
        plans={plans.map(({ slug, name }) => ({ slug, name }))}
        showPlatforms
        showVideosPerMonth
      />
    </PageShell>
  );
}
