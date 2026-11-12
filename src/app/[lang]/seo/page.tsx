import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkStepGrid, NumberedCards, PageHero, Section, SectionHeading, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/seo",
    ["SEO, GEO & AEO — Finloa", "SEO, GEO & AEO — Finloa"],
    [
      "Get found on Google and cited in ChatGPT, Perplexity and Google AI Overviews.",
      "Word gevonden in Google en genoemd in ChatGPT, Perplexity en Google AI Overviews.",
    ],
  );
}

const services = (t: T): NumberedItem[] => [
  {
    title: t("Technical optimisation", "Technische optimalisatie"),
    body: t(
      "We make your site easy for search engines and AI crawlers to read, index and quote.",
      "We zorgen dat zoekmachines en AI-crawlers je site makkelijk kunnen lezen, indexeren en citeren.",
    ),
    items: [
      t("Site speed, structure and crawlability", "Laadsnelheid, structuur en crawlbaarheid"),
      t("Structured data and schema markup", "Gestructureerde data en schema-markup"),
      t("Clean internal linking and indexing", "Heldere interne links en indexering"),
    ],
  },
  {
    title: t("Content strategy", "Contentstrategie"),
    body: t(
      "Content built around the real questions your buyers ask, written to rank and to be cited.",
      "Content rond de echte vragen van je kopers, geschreven om te ranken en geciteerd te worden.",
    ),
    items: [
      t("Question and topic research", "Onderzoek naar vragen en onderwerpen"),
      t("Clear, answer-first page formats", "Heldere pagina's met het antwoord voorop"),
      t("Expert content that builds authority", "Expertcontent die autoriteit opbouwt"),
    ],
  },
  {
    title: t("Platform-specific optimisation", "Optimalisatie per platform"),
    body: t(
      "Each AI platform finds and ranks sources differently. We tune for the ones your buyers use.",
      "Elk AI-platform vindt en weegt bronnen anders. Wij optimaliseren voor de platforms die jouw kopers gebruiken.",
    ),
    items: [
      t("Google AI Overviews and AI Mode", "Google AI Overviews en AI Mode"),
      t("ChatGPT, Perplexity and Gemini", "ChatGPT, Perplexity en Gemini"),
      t("Citation and mention tracking", "Bijhouden van citaties en vermeldingen"),
    ],
  },
];

const compareHead = (t: T) => [
  ["SEO", t("Search engine optimisation", "Zoekmachineoptimalisatie")],
  ["GEO", t("Generative engine optimisation", "Optimalisatie voor generatieve AI")],
  ["AEO", t("Answer engine optimisation", "Optimalisatie voor antwoordmachines")],
];

const compare = (t: T): [string, string, string, string][] => [
  [
    t("Goal", "Doel"),
    t("Rank pages in search results", "Pagina's laten ranken in zoekresultaten"),
    t("Get cited in AI-generated answers", "Geciteerd worden in AI-antwoorden"),
    t("Be chosen as the direct answer", "Gekozen worden als het directe antwoord"),
  ],
  [
    t("Where it shows", "Waar het verschijnt"),
    t("Google and Bing results", "Zoekresultaten van Google en Bing"),
    t("ChatGPT, Perplexity, Gemini, AI Overviews", "ChatGPT, Perplexity, Gemini, AI Overviews"),
    t("Featured snippets, voice assistants, AI answers", "Uitgelichte fragmenten, spraakassistenten, AI-antwoorden"),
  ],
  [
    t("What matters", "Wat telt"),
    t("Keywords, backlinks, technical health", "Zoekwoorden, backlinks, technische gezondheid"),
    t(
      "Authority, clear facts, being mentioned by trusted sources",
      "Autoriteit, heldere feiten, vermeldingen door betrouwbare bronnen",
    ),
    t("Concise answers, FAQ and how-to formats", "Beknopte antwoorden, FAQ's en stappenplannen"),
  ],
  [
    t("How it’s measured", "Hoe je het meet"),
    t("Rankings, traffic, conversions", "Posities, verkeer, conversies"),
    t("Citations and brand mentions in AI answers", "Citaties en merkvermeldingen in AI-antwoorden"),
    t("Snippet wins and answer share", "Gewonnen fragmenten en aandeel in antwoorden"),
  ],
  [
    t("Content format", "Contentvorm"),
    t("In-depth pages and guides", "Uitgebreide pagina's en gidsen"),
    t("Well-structured, factual, easy to quote", "Goed gestructureerd, feitelijk, makkelijk te citeren"),
    t("Short, direct answers to specific questions", "Korte, directe antwoorden op specifieke vragen"),
  ],
];

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Visibility review", "Zichtbaarheidscheck"),
    body: t(
      "We check where you appear today in search results and AI answers.",
      "We bekijken waar je nu verschijnt in zoekresultaten en AI-antwoorden.",
    ),
  },
  {
    title: t("Competitor analysis", "Concurrentieanalyse"),
    body: t("We see who gets cited instead of you, and why.", "We zoeken uit wie er in plaats van jou wordt genoemd, en waarom."),
  },
  {
    title: t("Content gaps", "Gaten in je content"),
    body: t(
      "We find the questions your buyers ask that you don’t answer yet.",
      "We vinden de vragen van je kopers die je nog niet beantwoordt.",
    ),
  },
  {
    title: t("Technical audit", "Technische audit"),
    body: t(
      "We fix what stops search engines and AI crawlers from reading your site.",
      "We lossen op wat zoekmachines en AI-crawlers tegenhoudt om je site te lezen.",
    ),
  },
  {
    title: t("Custom strategy", "Strategie op maat"),
    body: t(
      "A clear plan with priorities, timelines and the results to expect.",
      "Een helder plan met prioriteiten, planning en de resultaten die je kunt verwachten.",
    ),
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("How is AI search optimisation different from regular SEO?", "Wat is het verschil tussen AI-zoekoptimalisatie en gewone SEO?"),
    t(
      "SEO focuses on ranking pages in search results. AI search optimisation also makes sure AI platforms understand your content and cite your brand in their answers. We do both together.",
      "SEO draait om het laten ranken van pagina's in zoekresultaten. AI-zoekoptimalisatie zorgt er daarnaast voor dat AI-platforms je content begrijpen en je merk noemen in hun antwoorden. Wij doen het allebei, in samenhang.",
    ),
  ],
  [
    t("How long does it take to see results?", "Hoe snel zie ik resultaat?"),
    t(
      "Technical fixes can show impact within weeks. Content and authority work usually builds over three to six months.",
      "Technische verbeteringen kunnen binnen enkele weken effect hebben. Content en autoriteit bouwen zich meestal op in drie tot zes maanden.",
    ),
  ],
  [
    t("Can you guarantee we’ll be cited by ChatGPT or Google?", "Kunnen jullie garanderen dat ChatGPT of Google ons noemt?"),
    t(
      "No one can guarantee placement. We improve the signals these platforms rely on and track your citations so you can see progress.",
      "Niemand kan een vermelding garanderen. Wij verbeteren de signalen waar deze platforms op leunen en houden je citaties bij, zodat je de voortgang ziet.",
    ),
  ],
  [
    t("How do you measure AI search visibility?", "Hoe meten jullie zichtbaarheid in AI-zoekmachines?"),
    t(
      "We track rankings and traffic as usual, plus how often your brand is mentioned or cited across the main AI platforms.",
      "We volgen zoals gebruikelijk posities en verkeer, plus hoe vaak je merk wordt genoemd of geciteerd op de belangrijkste AI-platforms.",
    ),
  ],
  [
    t("Do I still need traditional SEO?", "Heb ik traditionele SEO dan nog nodig?"),
    t(
      "Yes. AI platforms lean heavily on pages that already rank well, so strong SEO is the foundation for AI visibility.",
      "Ja. AI-platforms leunen sterk op pagina's die al goed ranken, dus sterke SEO is de basis voor zichtbaarheid in AI.",
    ),
  ],
];

export default async function SeoPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow="SEO · GEO · AEO"
        title={[t("Stay visible wherever", "Blijf zichtbaar, waar"), t("people search.", "mensen ook zoeken.")]}
        intro={t(
          "Buyers now find answers on Google, ChatGPT, Perplexity and Google's AI Overviews. We make sure your brand is the one they find, trust and cite.",
          "Kopers vinden hun antwoorden tegenwoordig via Google, ChatGPT, Perplexity en de AI Overviews van Google. Wij zorgen dat jouw merk het merk is dat ze vinden, vertrouwen en noemen.",
        )}
        signup={{ source: "seo", cta: t("Get my visibility review →", "Vraag mijn zichtbaarheidscheck aan →") }}
      />
      <Section>
        <SectionHeading
          eyebrow={t("What's included", "Wat je krijgt")}
          title={t(
            "Search optimisation for search engines and AI answers.",
            "Zoekoptimalisatie voor zoekmachines én AI-antwoorden.",
          )}
          intro={t(
            "Classic SEO is still the foundation. On top of it, we structure your site and content so AI platforms can understand it, trust it and recommend it.",
            "Klassieke SEO blijft de basis. Daarbovenop structureren we je site en content zo dat AI-platforms die kunnen begrijpen, vertrouwen en aanbevelen.",
          )}
        />
        <NumberedCards items={services(t)} min={300} />
      </Section>
      <Section innerClassName="flex flex-col gap-9">
        <SectionHeading
          eyebrow={t("SEO, GEO and AEO", "SEO, GEO en AEO")}
          title={t("What each one covers.", "Wat elk ervan inhoudt.")}
          intro={t(
            "They work best together. SEO gets you ranked, GEO gets you cited in AI-generated answers, and AEO gets you chosen as the direct answer.",
            "Ze werken het best samen. Met SEO kom je hoog in de resultaten, met GEO word je geciteerd in AI-antwoorden en met AEO word je gekozen als het directe antwoord.",
          )}
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
                  {t("Aspect", "Aspect")}
                </th>
                {compareHead(t).map(([abbr, full]) => (
                  <th key={abbr} scope="col" className="px-[18px] py-4 align-top text-sm font-semibold">
                    {abbr}
                    <br />
                    <span className="text-[12.5px] font-normal text-[oklch(0.75_0.02_265)]">{full}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {compare(t).map(([aspect, ...cells]) => (
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
        <SectionHeading
          dark
          eyebrow={t("How it works", "Zo werkt het")}
          title={t("From audit to strategy in five steps.", "Van audit tot strategie in vijf stappen.")}
        />
        <DarkStepGrid items={steps(t)} />
      </Section>
      <FaqSection title={t("Questions about search.", "Vragen over vindbaarheid.")} items={faqs(t)} />
      <ContactSection
        source="seo"
        intro={t(
          "Tell us where you want to be found. We'll review your current visibility and come back with next steps.",
          "Vertel ons waar je gevonden wilt worden. We bekijken je huidige zichtbaarheid en komen terug met de volgende stappen.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
        messagePlaceholder={t("What would you like to improve?", "Wat wil je verbeteren?")}
      />
    </PageShell>
  );
}
