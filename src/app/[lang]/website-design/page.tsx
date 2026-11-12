import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/website-design",
    ["Website Design & Development — Finloa", "Webdesign & -ontwikkeling — Finloa"],
    [
      "Websites designed and built around your customer journey, so more visitors become leads and customers.",
      "Websites ontworpen en gebouwd rond de klantreis, zodat meer bezoekers leads en klanten worden.",
    ],
  );
}

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Defining the customer journey", "De klantreis in kaart brengen"),
    body: t(
      "We map how your buyers find you, what they need at each step and what makes them act, so the site is built around them.",
      "We brengen in kaart hoe kopers je vinden, wat ze bij elke stap nodig hebben en wat ze over de streep trekt, zodat de site om hen heen wordt gebouwd.",
    ),
  },
  {
    title: t("Prioritising user experience", "Gebruikerservaring voorop"),
    body: t(
      "We plan structure, navigation and page layouts that make it easy for visitors to find answers and take the next step.",
      "We ontwerpen structuur, navigatie en paginaopbouw zo dat bezoekers makkelijk antwoorden vinden en de volgende stap zetten.",
    ),
  },
  {
    title: t("Messaging and visual design", "Boodschap en visueel ontwerp"),
    body: t(
      "We write clear messaging and design a look that reflects your brand and builds trust from the first screen.",
      "We schrijven een heldere boodschap en ontwerpen een uitstraling die bij je merk past en vanaf het eerste scherm vertrouwen wekt.",
    ),
  },
  {
    title: t("Code, test and launch", "Bouwen, testen en livegang"),
    body: t(
      "We build a fast, secure and accessible site, test it on every device, and launch without losing your search rankings.",
      "We bouwen een snelle, veilige en toegankelijke site, testen hem op elk apparaat en gaan live zonder dat je je posities in Google verliest.",
    ),
  },
  {
    title: t("Assess and optimise", "Meten en optimaliseren"),
    body: t(
      "After launch we track behaviour and conversions, then keep testing and improving the pages that matter most.",
      "Na de livegang volgen we gedrag en conversies, en blijven we de belangrijkste pagina's testen en verbeteren.",
    ),
  },
];

const services = (t: T): NumberedItem[] => [
  {
    title: t("UI design", "UI-design"),
    body: t(
      "Clean, on-brand interfaces that guide visitors toward action.",
      "Strakke interfaces in jouw huisstijl die bezoekers naar actie leiden.",
    ),
    items: [
      t("Page and component design", "Ontwerp van pagina's en componenten"),
      t("Responsive layouts", "Responsive layouts"),
      t("Accessibility built in", "Toegankelijkheid standaard ingebouwd"),
    ],
  },
  {
    title: t("UX strategy", "UX-strategie"),
    body: t(
      "Research-led structure that makes your site easy to use.",
      "Een structuur gebaseerd op onderzoek, die je site makkelijk in gebruik maakt.",
    ),
    items: [
      t("User journeys and sitemaps", "Gebruikersreizen en sitemaps"),
      t("Wireframes and prototypes", "Wireframes en prototypes"),
      t("Conversion planning", "Conversieplanning"),
    ],
  },
  {
    title: t("Design systems", "Designsystemen"),
    body: t(
      "A shared library of components and styles for consistent, faster updates.",
      "Een gedeelde bibliotheek van componenten en stijlen voor consistente en snellere aanpassingen.",
    ),
    items: [
      t("Reusable components", "Herbruikbare componenten"),
      t("Typography and colour rules", "Afspraken over typografie en kleur"),
      t("Documentation for your team", "Documentatie voor je team"),
    ],
  },
  {
    title: t("UX copywriting", "UX-copywriting"),
    body: t(
      "Words that explain your value clearly and move people to act.",
      "Teksten die je waarde helder uitleggen en mensen in beweging brengen.",
    ),
    items: [
      t("Messaging and page copy", "Boodschap en paginateksten"),
      t("Calls to action", "Calls-to-action"),
      t("SEO-friendly structure", "SEO-vriendelijke opbouw"),
    ],
  },
  {
    title: t("Website development", "Websiteontwikkeling"),
    body: t(
      "Fast, secure sites built on the platform that suits you.",
      "Snelle, veilige sites, gebouwd op het platform dat bij je past.",
    ),
    items: [
      t("WordPress, Shopify or custom", "WordPress, Shopify of maatwerk"),
      t("Integrations with your tools", "Koppelingen met je tools"),
      t("Speed and SEO optimisation", "Optimalisatie van snelheid en SEO"),
    ],
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("How much does a website redesign cost?", "Wat kost een nieuwe website?"),
    t(
      "It depends on the number of pages, features and integrations. We offer packages, commission-based and custom plans, and give you a clear quote after a first call.",
      "Dat hangt af van het aantal pagina's, functies en koppelingen. We werken met pakketten, afspraken op commissiebasis en maatwerk, en geven je na een eerste gesprek een heldere offerte.",
    ),
  ],
  [
    t("How long does a website redesign take?", "Hoe lang duurt een redesign?"),
    t(
      "Most redesigns take 8–16 weeks from kickoff to launch, depending on scope and how quickly content is approved.",
      "De meeste redesigns duren 8 tot 16 weken van kick-off tot livegang, afhankelijk van de scope en hoe snel content wordt goedgekeurd.",
    ),
  ],
  [
    t("How do you avoid losing SEO rankings during a redesign?", "Hoe voorkomen jullie dat we posities in Google verliezen bij een redesign?"),
    t(
      "We audit your current rankings, keep or redirect every important URL, and check search performance closely after launch.",
      "We brengen je huidige posities in kaart, behouden of redirecten elke belangrijke URL en houden de zoekprestaties na de livegang nauwlettend in de gaten.",
    ),
  ],
  [
    t("Which platforms do you build on?", "Op welke platforms bouwen jullie?"),
    t(
      "WordPress, Shopify and custom builds. We recommend the platform that fits your goals, team and budget.",
      "WordPress, Shopify en maatwerk. We adviseren het platform dat past bij je doelen, team en budget.",
    ),
  ],
  [
    t("What’s included in a website redesign?", "Wat zit er in een redesign?"),
    t(
      "Strategy, UX, copy, design, development, SEO, testing and launch support. You can also add ongoing optimisation.",
      "Strategie, UX, teksten, design, development, SEO, testen en ondersteuning bij de livegang. Doorlopende optimalisatie kun je erbij nemen.",
    ),
  ],
  [
    t(
      "Can you refresh our brand and redesign the website at the same time?",
      "Kunnen jullie tegelijk ons merk opfrissen en de website vernieuwen?",
    ),
    t(
      "Yes. Doing both together keeps the brand and the site consistent and often saves time.",
      "Ja. Door het samen te doen blijven merk en site consistent, en het scheelt vaak tijd.",
    ),
  ],
  [
    t("How do you make a website generate more leads?", "Hoe zorgen jullie dat een website meer leads oplevert?"),
    t(
      "Clear messaging, simple journeys, strong calls to action and ongoing testing of the pages that drive conversions.",
      "Met een heldere boodschap, eenvoudige routes, sterke calls-to-action en doorlopend testen van de pagina's die conversies opleveren.",
    ),
  ],
];

export default async function WebsiteDesignPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("Website design & development", "Webdesign & -ontwikkeling")}
        title={[t("Turn your website into", "Maak van je website"), t("a revenue engine.", "een omzetmachine.")]}
        intro={t(
          "We design and build websites around your customer journey, with clear messaging, strong SEO and smooth development, so more visitors become leads and customers.",
          "We ontwerpen en bouwen websites rond de klantreis, met een heldere boodschap, sterke SEO en soepele development, zodat meer bezoekers leads en klanten worden.",
        )}
        signup={{ source: "website-design", cta: t("Plan my redesign →", "Plan mijn nieuwe website →") }}
      />
      <Section>
        <StepList
          eyebrow={t("How it works", "Zo werkt het")}
          title={t("Our website redesign process.", "Zo vernieuwen we je website.")}
          items={steps(t)}
        />
      </Section>
      <Section dark>
        <SectionHeading
          dark
          eyebrow={t("Why Finloa", "Waarom Finloa")}
          title={t("Website design services we provide.", "Onze diensten voor webdesign.")}
        />
        <DarkCards items={services(t)} moreLabel={t("Learn more →", "Meer weten →")} />
      </Section>
      <FaqSection title={t("Questions about website redesign.", "Vragen over een nieuwe website.")} items={faqs(t)} />
      <ContactSection
        source="website-design"
        intro={t(
          "Tell us about your current site and goals. We'll come back with ideas for a website that works harder.",
          "Vertel ons over je huidige site en je doelen. We komen terug met ideeën voor een website die harder voor je werkt.",
        )}
        messagePlaceholder={t("What should your new website do better?", "Wat moet je nieuwe website beter doen?")}
      />
    </PageShell>
  );
}
