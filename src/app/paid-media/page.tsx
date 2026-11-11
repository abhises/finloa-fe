import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";

export const metadata: Metadata = {
  title: "Paid Media — Finloa",
  description: "Paid search, paid social and programmatic campaigns built to bring in qualified leads and customers.",
};

const steps: NumberedItem[] = [
  { title: "Align paid media with your business goals", body: "We start with your revenue targets, margins and sales cycle, then set the metrics each campaign is judged on." },
  { title: "Audit existing campaigns", body: "We review your accounts, tracking and spend to find wasted budget, missing conversions and quick wins." },
  { title: "Build data-driven campaigns", body: "We plan channels, audiences, creative and budgets around who buys from you, and set up tracking from click to sale." },
  { title: "Optimise and report", body: "We test ads, bids and landing pages every week and report on leads, cost per result and revenue each month." },
];

const services: NumberedItem[] = [
  { title: "Paid search", body: "Show up when people search for what you offer, on Google and Bing.", items: ["Keyword and intent research", "Search, shopping and Performance Max", "Landing page testing"] },
  { title: "Paid social", body: "Reach the right people on LinkedIn, Meta, TikTok and YouTube.", items: ["Audience and lookalike targeting", "Ad creative and video", "Retargeting campaigns"] },
  { title: "Programmatic ads", body: "Display, video and connected TV across thousands of sites and apps.", items: ["Account and intent-based targeting", "Brand-safe placements", "Frequency and budget control"] },
];

const faqs: FaqItem[] = [
  ["How much does paid media management cost?", "It depends on your ad spend, channels and scope. We offer packages, performance-based and custom plans, and recommend one after a first call."],
  ["How long before paid media produces qualified leads?", "Campaigns usually start bringing in leads within the first few weeks. Results improve over the first two to three months as we test and optimise."],
  ["Which platforms do you manage?", "Google, Bing, LinkedIn, Meta, TikTok, YouTube and programmatic networks. We recommend the mix that fits your audience."],
  ["How do you make sure our budget is spent well?", "We set clear targets, track conversions properly, cut what doesn’t perform and move spend to what does, every week."],
  ["How do you measure success?", "We report on leads, cost per lead, cost per customer and revenue, not just clicks and impressions."],
  ["Can paid media help with long sales cycles?", "Yes. Retargeting, account-based targeting and nurture campaigns keep you in front of buyers until they’re ready."],
];

export default function PaidMediaPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Paid media"
        title={["Make every ad dollar", "count toward growth."]}
        intro="Paid search, paid social and programmatic campaigns built to bring in qualified leads and customers, at a cost per result you can plan around."
        signup={{ source: "paid-media", cta: "Plan my paid media →" }}
      />
      <Section>
        <StepList eyebrow="How it works" title="From goals to results in four steps." items={steps} />
      </Section>
      <Section dark>
        <SectionHeading dark eyebrow="Why Finloa" title="Paid media services." />
        <DarkCards items={services} />
      </Section>
      <FaqSection title="Questions about paid media." items={faqs} />
      <ContactSection
        source="paid-media"
        intro="Share your goals and current spend. We'll come back with ideas to get more from every dollar."
        messagePlaceholder="What are your paid media goals?"
      />
    </PageShell>
  );
}
