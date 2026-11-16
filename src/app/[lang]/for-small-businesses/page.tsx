import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, NumberedCards, PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/for-small-businesses",
    ["For Small Businesses — Finloa", "Voor kleine bedrijven — Finloa"],
    [
      "Website, marketing and video for small businesses: get found online and win more customers, without hiring a team.",
      "Website, marketing en video voor kleine bedrijven: word online gevonden en win meer klanten, zonder een team aan te nemen.",
    ],
  );
}

const pains = (t: T): NumberedItem[] => [
  {
    title: t("No time for marketing", "Geen tijd voor marketing"),
    body: t("You run the business. We handle the website, content and ads.", "Jij runt het bedrijf. Wij regelen de website, content en advertenties."),
  },
  {
    title: t("Hard to get found", "Moeilijk vindbaar"),
    body: t("Customers search on Google and AI tools. We make sure they find you.", "Klanten zoeken via Google en AI-tools. Wij zorgen dat ze jou vinden."),
  },
  {
    title: t("Too many suppliers", "Te veel leveranciers"),
    body: t("One partner for your website, hosting, marketing and video.", "Eén partner voor je website, hosting, marketing en video."),
  },
];

const offer = (t: T): NumberedItem[] => [
  {
    title: t("A website that sells", "Een website die verkoopt"),
    body: t("Fast, clear and built to turn visitors into enquiries.", "Snel, duidelijk en gemaakt om bezoekers om te zetten in aanvragen."),
    href: "/website-design",
  },
  {
    title: t("Get found locally and online", "Lokaal en online gevonden worden"),
    body: t("SEO and AI search visibility for the questions your customers ask.", "SEO en zichtbaarheid in AI-zoekmachines voor de vragen van je klanten."),
    href: "/seo",
  },
  {
    title: t("Marketing on autopilot", "Marketing op de automatische piloot"),
    body: t("AI-assisted content, ads and email that run without daily effort.", "Content, advertenties en e-mail met AI, zonder dagelijkse moeite."),
    href: "/ai-marketing",
  },
  {
    title: t("Videos that build trust", "Video's die vertrouwen wekken"),
    body: t("Short videos for your website and social channels.", "Korte video's voor je website en sociale kanalen."),
    href: "/videos",
  },
  {
    title: t("Hosting and maintenance", "Hosting en onderhoud"),
    body: t("We keep your site online, secure and up to date.", "Wij houden je site online, veilig en up-to-date."),
    href: "/hosting-maintenance",
  },
];

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Free intro call", "Gratis kennismaking"),
    body: t("We learn about your business, customers and goals.", "We leren je bedrijf, klanten en doelen kennen."),
  },
  {
    title: t("A simple plan", "Een eenvoudig plan"),
    body: t("A short list of what will bring the most customers, with a clear price.", "Een korte lijst van wat de meeste klanten oplevert, met een duidelijke prijs."),
  },
  {
    title: t("We do the work", "Wij doen het werk"),
    body: t("You approve, we build and run it.", "Jij keurt goed, wij bouwen en voeren uit."),
  },
  {
    title: t("Monthly results", "Maandelijkse resultaten"),
    body: t("A plain-language report on visitors, enquiries and next steps.", "Een helder rapport over bezoekers, aanvragen en volgende stappen."),
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("Is this affordable for a small business?", "Is dit betaalbaar voor een klein bedrijf?"),
    t(
      "Yes. We start with what brings the most return and grow from there, with a clear price up front.",
      "Ja. We beginnen met wat het meeste oplevert en bouwen van daaruit verder, met vooraf een duidelijke prijs.",
    ),
  ],
  [
    t("Do I need to know anything about marketing?", "Moet ik verstand hebben van marketing?"),
    t("No. We explain things simply and do the work for you.", "Nee. We leggen het eenvoudig uit en doen het werk voor je."),
  ],
  [
    t("Can you work with my existing website?", "Kunnen jullie met mijn huidige website werken?"),
    t(
      "Often, yes. We'll check it first and tell you honestly whether to improve or replace it.",
      "Vaak wel. We bekijken hem eerst en zeggen eerlijk of verbeteren of vervangen beter is.",
    ),
  ],
  [
    t("How soon will I see more customers?", "Hoe snel zie ik meer klanten?"),
    t(
      "Ads and website fixes can help within weeks. Search visibility usually builds over a few months.",
      "Advertenties en verbeteringen aan je website helpen soms al binnen weken. Vindbaarheid bouwt zich meestal in een paar maanden op.",
    ),
  ],
];

export default async function ForSmallBusinessesPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("For Small Businesses", "Voor kleine bedrijven")}
        title={[t("More customers,", "Meer klanten,"), t("less hassle.", "minder gedoe.")]}
        intro={t(
          "Website, marketing, video and hosting for small businesses, from one team that speaks your language.",
          "Website, marketing, video en hosting voor kleine bedrijven, van één team dat jouw taal spreekt.",
        )}
        actions={[
          { href: "#contact", label: t("Book a free intro call →", "Plan een gratis kennismaking →") },
          { href: "/services", label: t("All services", "Alle diensten"), variant: "secondary" },
        ]}
      />
      <Section first>
        <SectionHeading
          eyebrow={t("Sound familiar?", "Herkenbaar?")}
          title={t("You're great at what you do. Marketing takes time.", "Je bent goed in je vak. Marketing kost tijd.")}
        />
        <NumberedCards items={pains(t)} min={300} />
      </Section>
      <Section dark>
        <SectionHeading
          dark
          eyebrow={t("What we do", "Wat we doen")}
          title={t("One team for everything online.", "Eén team voor alles online.")}
        />
        <DarkCards items={offer(t)} moreLabel={t("Learn more →", "Meer weten →")} />
      </Section>
      <Section>
        <StepList eyebrow={t("How it works", "Zo werkt het")} title={t("Simple from the first call.", "Eenvoudig vanaf het eerste gesprek.")} items={steps(t)} />
      </Section>
      <FaqSection title={t("Questions from business owners.", "Vragen van ondernemers.")} items={faqs(t)} />
      <ContactSection
        source="for-small-businesses"
        intro={t(
          "Tell us about your business. We'll come back with a simple plan to win more customers.",
          "Vertel ons over je bedrijf. We komen terug met een eenvoudig plan om meer klanten te winnen.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
        messagePlaceholder={t("What would you like to grow?", "Wat wil je laten groeien?")}
      />
    </PageShell>
  );
}
