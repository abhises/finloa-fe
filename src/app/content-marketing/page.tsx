import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";

export const metadata: Metadata = {
  title: "Content Marketing — Finloa",
  description: "Articles, guides, case studies, video and email planned around your goals and distributed so people see them.",
};

const steps: NumberedItem[] = [
  { title: "Laying the foundation", body: "We get to know your brand, audience and goals, and review the content you already have, so every piece starts from a clear brief." },
  { title: "Strategy and planning", body: "We build a content plan around the questions your audience asks at each stage, with topics, formats and a realistic publishing calendar." },
  { title: "SEO-driven creation", body: "Our writers and editors create content that is useful to read and built to rank in search and be cited in AI answers." },
  { title: "Distribution and amplification", body: "We share each piece across email, social, partners and paid channels, so it reaches people instead of sitting on your blog." },
  { title: "Performance and optimisation", body: "We track traffic, engagement, leads and revenue, then update and improve what works and retire what doesn’t." },
];

const reasons: NumberedItem[] = [
  { title: "Experience and expertise", body: "Writers and strategists who learn your market and write with real subject knowledge." },
  { title: "Data-driven insights", body: "Topics chosen from search data, audience research and what your competitors miss." },
  { title: "A plan built for you", body: "No templates. Your content plan fits your goals, budget and stage." },
  { title: "Collaborative process", body: "You review and approve every brief and draft. We work as part of your team." },
  { title: "Measurable impact", body: "Clear monthly reporting on traffic, leads and revenue from content." },
];

const faqs: FaqItem[] = [
  ["How much do content marketing services cost?", "It depends on volume, formats and distribution. We offer packages, commission-based plans and custom scopes, and recommend one after a first call."],
  ["How long does content marketing take to work?", "Most clients see early engagement within the first months. Search traffic and leads usually build steadily over three to six months."],
  ["What’s included in your content marketing services?", "Strategy, topic research, writing and editing, design, SEO optimisation, distribution and reporting. You can start with all of it or the parts you need."],
  ["Should we hire an agency or a freelance writer?", "A freelancer can write. An agency also brings strategy, SEO, design, distribution and reporting under one team, so content connects to results."],
  ["Do you write content that ranks and gets cited by AI tools?", "Yes. We structure content with clear answers, strong sources and SEO best practice so it can rank in search and be quoted by AI platforms."],
  ["How do you measure content marketing success?", "We track traffic, rankings, engagement, leads and revenue, and agree the main metrics with you at the start."],
];

export default function ContentMarketingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Content marketing"
        title={["Content that builds authority", "and turns readers into fans."]}
        intro="Articles, guides, case studies, video and email, planned around your goals and written for the people you want to reach. Then distributed so they actually see it."
        actions={[{ href: "#contact", label: "Plan your content strategy →" }]}
      />
      <Section>
        <StepList eyebrow="How it works" title="From foundation to results in five steps." items={steps} />
      </Section>
      <Section dark>
        <SectionHeading dark eyebrow="Why Finloa" title="Why teams choose us for content." />
        <DarkCards items={reasons} />
      </Section>
      <FaqSection title="Questions about content marketing." items={faqs} />
      <ContactSection
        source="content-marketing"
        intro="Share your goals and challenges. We'll come back with ideas for content that moves them forward."
        messagePlaceholder="What are your content goals?"
      />
    </PageShell>
  );
}
