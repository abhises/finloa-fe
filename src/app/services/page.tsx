import type { Metadata } from "next";
import Link from "next/link";
import { GoalPicker } from "@/components/goal-picker";
import { PageShell } from "@/components/page-shell";
import { CtaBand, NumberedCards, Section, SectionHeading, TagList, btn, type NumberedItem } from "@/components/ui";

export const metadata: Metadata = {
  title: "Services — Finloa",
  description: "Strategy, websites, video, marketing and new income streams from one team, for creators and businesses.",
};

const reasons: NumberedItem[] = [
  { title: "We know your market", body: "We learn your niche, your audience and what they buy before we build anything." },
  { title: "We're flexible", body: "Packages, commission or a custom plan. Pick what fits your budget and stage." },
  { title: "We focus on results", body: "Every project starts with a revenue goal and is measured against it after launch." },
  { title: "One team, together", body: "Strategy, design, build and marketing work as one team with a named lead." },
];

const services: {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  rows: [string, string][];
  tagWidth?: string;
}[] = [
  {
    id: "video",
    eyebrow: "Video creation",
    title: "Affordable videos that grow your audience.",
    body: "Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear monthly price. We edit, optimise and post.",
    href: "/",
    cta: "Explore video plans →",
    rows: [
      ["01", "Editing, thumbnails, titles and descriptions"],
      ["02", "Shorts cross-posted to TikTok, Reels and Facebook"],
      ["03", "Monthly reporting on views, subscribers and leads"],
    ],
  },
  {
    id: "seo",
    eyebrow: "SEO",
    title: "Get found on Google and in AI answers.",
    body: "People search on Google, ChatGPT and Perplexity. We make sure your brand shows up, gets cited and wins the click.",
    href: "/seo",
    cta: "Explore SEO →",
    rows: [
      ["SEO", "Rank higher in Google and Bing results"],
      ["GEO", "Get cited by ChatGPT, Perplexity and AI Overviews"],
      ["AEO", "Become the direct answer to your buyers' questions"],
    ],
  },
  {
    id: "content",
    eyebrow: "Content marketing",
    title: "Content that builds authority.",
    body: "We plan, create and distribute content your audience wants to read, and measure what it brings in.",
    href: "/content-marketing",
    cta: "Explore content marketing →",
    rows: [
      ["01", "Strategy and a content calendar built around your goals"],
      ["02", "Articles, guides, case studies, video and email"],
      ["03", "Distribution and reporting on traffic, leads and revenue"],
    ],
  },
  {
    id: "paid",
    eyebrow: "Paid media",
    title: "Make every ad dollar count.",
    body: "Campaigns built to bring in qualified leads and customers, with clear reporting on what each one earns.",
    href: "/paid-media",
    cta: "Explore paid media →",
    rows: [
      ["01", "Paid search on Google and Bing"],
      ["02", "Paid social on LinkedIn, Meta, TikTok and YouTube"],
      ["03", "Programmatic display, video and connected TV"],
    ],
  },
  {
    id: "ai",
    eyebrow: "AI marketing",
    title: "An AI marketing system that drives revenue.",
    body: "We fix the foundation first, then set up AI tools that scale what works and make growth easier to forecast.",
    href: "/ai-marketing",
    cta: "Explore AI marketing →",
    tagWidth: "w-[60px]",
    rows: [
      ["BUILD", "Customer profile, messaging, data and tool setup"],
      ["LAUNCH", "AI-assisted campaigns that bring in pipeline"],
      ["GROW", "A full growth team, optimisation and forecasting"],
    ],
  },
];

const paths = [
  {
    href: "/for-creators",
    eyebrow: "FOR CREATORS",
    title: "Turn your audience into income",
    body: "For YouTube channels, podcasts, newsletters and social accounts that want to earn more than ad and sponsor revenue.",
  },
  {
    href: "/",
    eyebrow: "FOR BUSINESSES",
    title: "Grow what already works",
    body: "For small, mid-size and established companies ready for consistent video, a better website and new revenue beyond their core offer.",
  },
];

export default function ServicesPage() {
  return (
    <PageShell ctaHref="/#contact">
      <section className="bg-grid px-6 pt-[clamp(28px,5vw,64px)] pb-[clamp(56px,8vw,96px)]">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-[26px] text-center">
          <div className="font-mono text-[13px] tracking-[0.08em] text-brand">SIMPLE · FLEXIBLE · REVENUE-DRIVEN</div>
          <h1 className="flex max-w-[980px] flex-col items-center gap-1 text-[clamp(44px,7vw,84px)] leading-[1.03] font-bold tracking-[-0.045em] text-balance">
            <span>We grow brands and audiences.</span>
            <span className="text-brand">Built to deliver revenue.</span>
          </h1>
          <p className="max-w-[600px] text-lg leading-[1.55] text-balance text-muted">
            Strategy, websites, video, marketing and new income streams from one team working together, for creators and
            businesses of every size.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/#contact" className={btn.primary}>
              Contact Us →
            </Link>
            <a href="#goals" className={btn.secondary}>
              What&apos;s your goal?
            </a>
          </div>
        </div>
      </section>

      <Section id="goals" innerClassName="flex flex-col gap-8">
        <SectionHeading eyebrow="Your goal" title="Tell us where you want to go. We'll map the route." />
        <GoalPicker />
      </Section>

      <Section>
        <SectionHeading eyebrow="Why Finloa" title="What sets us apart." />
        <NumberedCards items={reasons} titleSize="text-[19px]" />
      </Section>

      {services.map((s) => (
        <Section
          key={s.id}
          id={s.id}
          innerClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(32px,5vw,56px)]"
        >
          <div className="flex flex-col gap-4">
            <SectionHeading
              className="max-w-[520px]"
              eyebrow={s.eyebrow}
              title={s.title}
              intro={s.body}
            />
            <Link href={s.href} className={btn.dark}>
              {s.cta}
            </Link>
          </div>
          <TagList rows={s.rows} tagWidth={s.tagWidth} />
        </Section>
      ))}

      <Section id="paths" className="pb-24">
        <SectionHeading eyebrow="Solutions" title="Growth that scales with you." />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
          {paths.map((p) => (
            <Link
              key={p.eyebrow}
              href={p.href}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-8 text-ink transition-colors hover:border-brand"
            >
              <div className="font-mono text-[12.5px] tracking-[0.04em] text-brand">{p.eyebrow}</div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">{p.title}</h3>
              <p className="text-[15px] leading-[1.55] text-muted">{p.body}</p>
              <span className="mt-2 text-[15px] font-medium text-brand">Explore →</span>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand
        title="You have the vision. We have the team to get you there."
        actions={[{ href: "/#contact", label: "Contact Us →" }]}
      />
    </PageShell>
  );
}
