import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { PageShell } from "@/components/page-shell";
import { DarkCards, NumberedCards, PageHero, Section, SectionHeading, type NumberedItem } from "@/components/ui";

export const metadata: Metadata = {
  title: "Why Finloa",
  description: "Strategists, writers, designers, developers and marketers working together to grow your brand or channel.",
};

const reasons: NumberedItem[] = [
  { title: "Scalable", body: "We grow with you. Start with one service and add more as your goals change, without switching partners." },
  { title: "Agile", body: "Markets, platforms and audiences move fast. We adjust plans quickly to keep your growth on track." },
  { title: "Amplified with AI", body: "We use AI where it helps: faster research, sharper insights and more output, always checked by experts." },
  { title: "Dependable", body: "Clear plans, a named lead and honest reporting. You always know what we’re doing and why." },
];

const services: NumberedItem[] = [
  { title: "Video Creation", body: "Affordable videos that grow your audience on every platform.", href: "/videos" },
  { title: "AI Marketing", body: "A marketing system built on a strong foundation, powered by AI.", href: "/ai-marketing" },
  { title: "SEO", body: "Get found on Google and cited in AI answers.", href: "/seo" },
  { title: "Content Marketing", body: "Content that builds authority and brings in leads.", href: "/content-marketing" },
  { title: "Paid Media", body: "Campaigns that make every ad dollar count.", href: "/paid-media" },
  { title: "Website Design", body: "Websites built around your customer journey.", href: "/website-design" },
];

const tools = [
  "WordPress and Shopify",
  "Google Analytics and Tag Manager",
  "Google and Meta Ads",
  "CRM and marketing automation",
  "AI tools for research and personalisation",
];

export default function WhyFinloaPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Why Finloa"
        title={["One team that sets", "the pace for your growth."]}
        intro="Strategists, writers, designers, developers and marketers working together, ready to grow your brand or channel. One joined-up approach to delivering measurable results faster."
        signup={{ source: "why-finloa", cta: "Talk to our team →" }}
      />
      <Section>
        <SectionHeading eyebrow="Why choose us" title="Why creators and businesses choose Finloa." />
        <NumberedCards items={reasons} />
      </Section>
      <Section dark>
        <SectionHeading dark eyebrow="Our services" title="Everything you need to grow, in one team." />
        <DarkCards items={services} min={240} />
      </Section>
      <Section innerClassName="flex flex-col gap-9">
        <SectionHeading
          eyebrow="Our tools"
          title="The right tech behind our work."
          intro="We work with the platforms you already use and set up the ones you need."
        />
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
          {tools.map((t) => (
            <li key={t} className="rounded-xl border border-line bg-white px-5 py-[18px] text-[15px] font-medium">
              {t}
            </li>
          ))}
        </ul>
      </Section>
      <ContactSection
        source="why-finloa"
        intro="Share your goals and challenges. We'll come back with a plan for where to start."
        fourthField={{ name: "website", placeholder: "Website" }}
      />
    </PageShell>
  );
}
