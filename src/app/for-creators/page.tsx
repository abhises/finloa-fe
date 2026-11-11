import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { CreatorNetwork } from "@/components/creator-network";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkStepGrid, NumberedCards, Section, SectionHeading, type NumberedItem } from "@/components/ui";
import { EmailSignup } from "@/components/email-signup";

export const metadata: Metadata = {
  title: "For Creators — Finloa",
  description: "Finloa partners with creators and businesses to build or add new sources of revenue.",
};

const services: NumberedItem[] = [
  { title: "Finloa Ventures", body: "Get equity in a new platform built with you and your peers, and earn a share of everything it makes, not only what your own channel brings in." },
  { title: "Finloa Collective", body: "Join a private community of creators in your niche. Swap ideas, get feedback and plan collabs." },
  { title: "Finloa Partners", body: "Pitch brands together with your combined reach and win bigger sponsorships than one channel could alone." },
];

const steps: NumberedItem[] = [
  { title: "Share your channel", body: "Send your channel or site. Takes two minutes." },
  { title: "Growth call", body: "We walk through your audience, revenue and goals." },
  { title: "Free proposal", body: "Site, income streams and the pricing model that fits." },
  { title: "Build & launch", body: "We design and build. You approve every step." },
  { title: "Launch & grow", body: "Monthly reporting, optimisation and support after launch." },
];

const oldWay = [
  "One-off project, then you're on your own",
  "Paid the same whether you earn or not",
  "Design first, revenue as an afterthought",
  "No plan for revenue beyond the homepage",
];
const partnerWay = [
  "Ongoing growth partner with a named lead",
  "Commission option: we earn when you earn",
  "Website, strategy and launch in one team",
  "New income streams designed into the build",
];

const faqs: FaqItem[] = [
  ["Who do you work with?", "Creators and channels with roughly 100k+ engaged followers, and businesses that already generate revenue. If you’re earlier than that, the audit will still tell you what to focus on."],
  ["How does the commission model work?", "We take no upfront fee. We build and run new income streams and receive an agreed share of the revenue they generate for a fixed term. Existing revenue is never included."],
  ["What kind of income streams do you build?", "Memberships, courses, digital products, shops, affiliate programmes and licensing. The proposal recommends the ones that fit your audience best."],
  ["Who owns the website and the customer data?", "You do. Domain, code, content and customer lists stay in your name on every pricing model."],
  ["How long does a project take?", "A Launch package typically goes live in 4–6 weeks. Growth projects with several income streams usually take 8–12 weeks."],
];

export default function ForCreatorsPage() {
  return (
    <PageShell ctaHref="#contact">
      <section className="bg-grid px-5 pt-[clamp(16px,calc(6vw-12px),32px)] pb-[clamp(56px,8vw,88px)]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-[clamp(32px,5vw,56px)]">
          <div className="flex flex-col gap-[26px]">
            <h1 className="flex flex-col gap-1 text-[clamp(42px,6vw,72px)] leading-[1.05] font-bold tracking-[-0.04em] text-balance">
              <span>Your audience is an asset.</span>
              <span className="text-brand">We turn it into extra revenue.</span>
            </h1>
            <p className="max-w-[540px] text-lg leading-[1.55] text-pretty text-muted">
              Finloa partners with creators and businesses to build or add new sources of revenue.
            </p>
            <EmailSignup source="for-creators" cta="Sign up for free →" align="start" />
          </div>
          <CreatorNetwork />
        </div>
      </section>

      <section className="px-6 pt-10 pb-[72px]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
          {[
            ["FOR CREATORS & CHANNELS", "10k+ subscribers, followers or readers", "YouTube, podcasts, newsletters and social channels with an engaged audience, but most income still depends on ads and sponsors."],
            ["FOR ESTABLISHED BUSINESSES", "Already profitable, ready for the next stage", "Brands and service companies with proven revenue whose website is holding them back, or who want new revenue beyond their core offer."],
          ].map(([eyebrow, title, body]) => (
            <div key={eyebrow} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-7">
              <div className="font-mono text-[12.5px] tracking-[0.04em] text-brand">{eyebrow}</div>
              <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{title}</h2>
              <p className="text-[15px] leading-[1.55] text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <Section id="services">
        <SectionHeading eyebrow="Services" title="Three ways we work with you." />
        <NumberedCards items={services} min={280} titleSize="text-[21px]" />
      </Section>

      <Section>
        <SectionHeading eyebrow="Why it's different" title="Agencies hand over a website. Finloa builds what it earns." />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-4">
          <div className="flex flex-col gap-[18px] rounded-2xl border border-line bg-surface p-[30px]">
            <div className="flex items-center justify-between">
              <span className="text-[17px] font-semibold">A typical agency</span>
              <span className="font-mono text-xs text-subtle">THE OLD WAY</span>
            </div>
            <ul className="flex flex-col gap-3 text-[15px] text-muted">
              {oldWay.map((x) => (
                <li key={x} className="flex gap-3">
                  <span aria-hidden>✕</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-[18px] rounded-2xl bg-ink p-[30px] text-white">
            <div className="flex items-center justify-between">
              <span className="text-[17px] font-semibold">Finloa</span>
              <span className="font-mono text-xs text-brand-pale">THE PARTNER WAY</span>
            </div>
            <ul className="flex flex-col gap-3 text-[15px] text-[oklch(0.9_0.01_265)]">
              {partnerWay.map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="text-brand-pale" aria-hidden>
                    ✓
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="how" dark>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading dark className="max-w-[680px]" eyebrow="How it works" title="Five steps from audience to income." />
          <a
            href="#contact"
            className="rounded-[10px] bg-white px-5 py-[13px] text-[15px] font-medium text-ink transition-opacity hover:opacity-90"
          >
            Get your proposal →
          </a>
        </div>
        <DarkStepGrid items={steps} />
      </Section>

      <FaqSection title="Questions creators ask us." items={faqs} />

      <ContactSection
        source="for-creators"
        title="Ready to earn more than views?"
        intro="Share your channel and goals. We'll come back with a free proposal for new income streams that fit your audience."
        fourthField={{ name: "website", placeholder: "Channel or website" }}
        messagePlaceholder="Tell us about your audience and what you'd like to earn from"
      />
    </PageShell>
  );
}
