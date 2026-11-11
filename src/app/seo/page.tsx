import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkStepGrid, NumberedCards, PageHero, Section, SectionHeading, type NumberedItem } from "@/components/ui";

export const metadata: Metadata = {
  title: "SEO, GEO & AEO — Finloa",
  description: "Get found on Google and cited in ChatGPT, Perplexity and Google AI Overviews.",
};

const services: NumberedItem[] = [
  {
    title: "Technical optimisation",
    body: "We make your site easy for search engines and AI crawlers to read, index and quote.",
    items: ["Site speed, structure and crawlability", "Structured data and schema markup", "Clean internal linking and indexing"],
  },
  {
    title: "Content strategy",
    body: "Content built around the real questions your buyers ask, written to rank and to be cited.",
    items: ["Question and topic research", "Clear, answer-first page formats", "Expert content that builds authority"],
  },
  {
    title: "Platform-specific optimisation",
    body: "Each AI platform finds and ranks sources differently. We tune for the ones your buyers use.",
    items: ["Google AI Overviews and AI Mode", "ChatGPT, Perplexity and Gemini", "Citation and mention tracking"],
  },
];

const compareHead = [
  ["SEO", "Search engine optimisation"],
  ["GEO", "Generative engine optimisation"],
  ["AEO", "Answer engine optimisation"],
];

const compare: [string, string, string, string][] = [
  ["Goal", "Rank pages in search results", "Get cited in AI-generated answers", "Be chosen as the direct answer"],
  ["Where it shows", "Google and Bing results", "ChatGPT, Perplexity, Gemini, AI Overviews", "Featured snippets, voice assistants, AI answers"],
  ["What matters", "Keywords, backlinks, technical health", "Authority, clear facts, being mentioned by trusted sources", "Concise answers, FAQ and how-to formats"],
  ["How it’s measured", "Rankings, traffic, conversions", "Citations and brand mentions in AI answers", "Snippet wins and answer share"],
  ["Content format", "In-depth pages and guides", "Well-structured, factual, easy to quote", "Short, direct answers to specific questions"],
];

const steps: NumberedItem[] = [
  { title: "Visibility review", body: "We check where you appear today in search results and AI answers." },
  { title: "Competitor analysis", body: "We see who gets cited instead of you, and why." },
  { title: "Content gaps", body: "We find the questions your buyers ask that you don’t answer yet." },
  { title: "Technical audit", body: "We fix what stops search engines and AI crawlers from reading your site." },
  { title: "Custom strategy", body: "A clear plan with priorities, timelines and the results to expect." },
];

const faqs: FaqItem[] = [
  ["How is AI search optimisation different from regular SEO?", "SEO focuses on ranking pages in search results. AI search optimisation also makes sure AI platforms understand your content and cite your brand in their answers. We do both together."],
  ["How long does it take to see results?", "Technical fixes can show impact within weeks. Content and authority work usually builds over three to six months."],
  ["Can you guarantee we’ll be cited by ChatGPT or Google?", "No one can guarantee placement. We improve the signals these platforms rely on and track your citations so you can see progress."],
  ["How do you measure AI search visibility?", "We track rankings and traffic as usual, plus how often your brand is mentioned or cited across the main AI platforms."],
  ["Do I still need traditional SEO?", "Yes. AI platforms lean heavily on pages that already rank well, so strong SEO is the foundation for AI visibility."],
];

export default function SeoPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="SEO · GEO · AEO"
        title={["Stay visible wherever", "people search."]}
        intro="Buyers now find answers on Google, ChatGPT, Perplexity and Google's AI Overviews. We make sure your brand is the one they find, trust and cite."
        signup={{ source: "seo", cta: "Get my visibility review →" }}
      />
      <Section>
        <SectionHeading
          eyebrow="What's included"
          title="Search optimisation for search engines and AI answers."
          intro="Classic SEO is still the foundation. On top of it, we structure your site and content so AI platforms can understand it, trust it and recommend it."
        />
        <NumberedCards items={services} min={300} />
      </Section>
      <Section innerClassName="flex flex-col gap-9">
        <SectionHeading
          eyebrow="SEO, GEO and AEO"
          title="What each one covers."
          intro="They work best together. SEO gets you ranked, GEO gets you cited in AI-generated answers, and AEO gets you chosen as the direct answer."
        />
        <div className="overflow-x-auto rounded-2xl border border-line bg-white">
          <table className="w-full min-w-[760px] table-fixed border-collapse text-left">
            <colgroup>
              <col className="w-[19%]" />
              <col />
              <col />
              <col />
            </colgroup>
            <thead className="bg-ink text-white">
              <tr>
                <th scope="col" className="px-[18px] py-4 align-top text-sm font-semibold">
                  Aspect
                </th>
                {compareHead.map(([abbr, full]) => (
                  <th key={abbr} scope="col" className="px-[18px] py-4 align-top text-sm font-semibold">
                    {abbr}
                    <br />
                    <span className="text-[12.5px] font-normal text-[oklch(0.75_0.02_265)]">{full}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare.map(([aspect, ...cells]) => (
                <tr key={aspect} className="border-t border-[oklch(0.93_0.006_265)]">
                  <th scope="row" className="px-[18px] py-4 align-top text-[14.5px] font-semibold">
                    {aspect}
                  </th>
                  {cells.map((c) => (
                    <td key={c} className="px-[18px] py-4 align-top text-[14.5px] leading-normal text-[oklch(0.38_0.02_265)]">
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section dark>
        <SectionHeading dark eyebrow="How it works" title="From audit to strategy in five steps." />
        <DarkStepGrid items={steps} />
      </Section>
      <FaqSection title="Questions about search." items={faqs} />
      <ContactSection
        source="seo"
        intro="Tell us where you want to be found. We'll review your current visibility and come back with next steps."
        fourthField={{ name: "website", placeholder: "Website" }}
        messagePlaceholder="What would you like to improve?"
      />
    </PageShell>
  );
}
