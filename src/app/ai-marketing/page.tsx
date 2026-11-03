import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { ReadinessCheck } from "@/components/readiness-check";
import { Check, NumberedCards, PageHero, Section, SectionHeading, type NumberedItem } from "@/components/ui";

export const metadata: Metadata = {
  title: "AI Marketing — Finloa",
  description: "Build an AI marketing system that drives revenue: fix the foundation, then scale what works.",
};

const phases = [
  {
    tag: "BUILD · 3–6 MONTHS",
    title: "Get AI-ready",
    body: "Sharpen what makes you different before you ask AI to scale it.",
    items: ["Customer and buyer profiles", "Brand voice and messaging", "Positioning against competitors", "AI tool setup", "CRM and lead flow design", "Attribution and baseline reporting"],
    dark: true,
  },
  {
    tag: "LAUNCH · 6–12 MONTHS",
    title: "Go to market",
    body: "Turn the foundation into campaigns that bring in pipeline and revenue.",
    items: ["AI-assisted search, social and content", "Targeted outreach and sales campaigns", "Testing messages and offers", "Lead scoring and automation", "Monthly revenue reporting"],
  },
  {
    tag: "GROW · ONGOING",
    title: "Full partnership",
    body: "Hand us the whole engine. You run the business, we run the marketing.",
    items: ["Everything in Build and Launch", "A dedicated growth team", "Ongoing conversion optimisation", "Content strategy and thought leadership", "Executive dashboards and forecasting"],
  },
];

const outcomes: NumberedItem[] = [
  { title: "Sales always knows what’s coming", body: "With a clear customer profile and connected systems, qualified leads arrive steadily and your team spends time on the right ones." },
  { title: "Attribution that tells the whole story", body: "Every deal traces back to the channels and content that created it, so you know what’s working and where to invest." },
  { title: "Growth leadership can plan around", body: "When marketing and sales share one model, planning becomes predictable and marketing is seen as a growth driver." },
];

const faqs: FaqItem[] = [
  ["What does an AI marketing consultant do?", "We help you build the foundation, choose and set up the right AI tools, and connect them to campaigns and reporting so they drive revenue."],
  ["How much does AI marketing consulting cost?", "It depends on the phase and scope. We offer packages, performance-based and custom plans, and recommend one after the readiness review."],
  ["Do I have to commit to a long engagement?", "No. Many teams start with the Build phase and decide on next steps once the foundation is in place."],
  ["How is this different from a typical agency retainer?", "We build a system you own, with clear goals, connected data and revenue reporting, instead of just producing more output."],
  ["How quickly will we see results?", "Foundation work usually shows early wins within the first months. Pipeline impact builds as campaigns launch."],
  ["Is our team ready for AI?", "The readiness review answers exactly that, and shows what to fix first."],
];

export default function AiMarketingPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="AI marketing"
        title={["Build an AI marketing system", "that drives revenue."]}
        intro="Fix the foundation first. Then scale what works and forecast what comes next."
        actions={[
          { href: "#assessment", label: "Get your AI readiness review →" },
          { href: "#phases", label: "See how it works", variant: "secondary" },
        ]}
      />
      <Section dark>
        <SectionHeading
          dark
          className="max-w-[760px]"
          eyebrow="Why it matters"
          title={
            <>
              Most AI strategies scale activity. <span className="text-brand-pale">The best ones scale revenue.</span>
            </>
          }
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-8 text-[15.5px] leading-[1.6] text-on-ink-muted">
          <p className="text-pretty">
            Everyone has access to the same AI tools. What makes the difference is the foundation behind them. Unclear
            audiences and generic messaging only produce generic output faster.
          </p>
          <p className="text-pretty">
            We start with your customer profile, positioning, brand voice and data. Then we set up the right tools and
            connect them to content, campaigns and reporting, so AI drives pipeline instead of just volume.
          </p>
        </div>
        <p className="border-l-2 border-brand pl-5 text-[clamp(20px,2.4vw,26px)] font-medium tracking-[-0.02em]">
          AI is a multiplier. Give it clarity and it scales clarity.
        </p>
      </Section>
      <Section id="phases" first>
        <SectionHeading
          eyebrow="How it works"
          title="Three phases. One revenue system."
          intro="Some teams need the foundation fixed. Others are ready to launch or want a partner to run everything. We start wherever makes sense for you."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {phases.map((ph) => (
            <div
              key={ph.title}
              className={`flex flex-col gap-3 rounded-2xl border p-7 ${
                ph.dark ? "border-ink-line-2 bg-ink text-white" : "border-line bg-white text-ink"
              }`}
            >
              <span className={`font-mono text-[12.5px] tracking-[0.04em] ${ph.dark ? "text-brand-pale" : "text-brand"}`}>
                {ph.tag}
              </span>
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">{ph.title}</h3>
              <p className={`text-[15px] leading-[1.55] ${ph.dark ? "text-[oklch(0.78_0.015_265)]" : "text-muted-2"}`}>
                {ph.body}
              </p>
              <div className={`mt-1 flex flex-col gap-[9px] border-t pt-2 ${ph.dark ? "border-ink-line-2" : "border-line"}`}>
                <span
                  className={`pt-3 font-mono text-[11.5px] tracking-[0.06em] ${
                    ph.dark ? "text-[oklch(0.78_0.015_265)]" : "text-muted-2"
                  }`}
                >
                  WHAT&apos;S INCLUDED
                </span>
                {ph.items.map((it) => (
                  <Check key={it} dark={ph.dark}>
                    {it}
                  </Check>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeading eyebrow="What you get" title="What AI marketing looks like when it works." />
        <NumberedCards items={outcomes} min={280} />
      </Section>
      <Section
        id="assessment"
        innerClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(32px,5vw,56px)]"
      >
        <SectionHeading
          className="max-w-[520px]"
          eyebrow="Start with a free review"
          title="Find the gaps before AI amplifies them."
          intro="Every engagement starts with an AI readiness review. We look at your customer profile, messaging, brand voice, data, attribution and tools, and show you where the biggest wins are. You leave with a clear plan, whether you work with us or not."
        />
        <ReadinessCheck />
      </Section>
      <FaqSection title="Questions about AI marketing." items={faqs} />
      <ContactSection
        source="ai-marketing"
        title="See what AI-powered marketing can do for your brand."
        intro="Book a strategy call or your free readiness review. We'll show you where AI can drive the most revenue."
        fourthField={{ name: "website", placeholder: "Website" }}
        messagePlaceholder="What would you like AI to help you grow?"
      />
    </PageShell>
  );
}
