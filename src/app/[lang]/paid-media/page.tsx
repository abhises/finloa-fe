import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/paid-media",
    ["Paid Media — Finloa", "Betaalde media — Finloa"],
    [
      "Paid search, paid social and programmatic campaigns built to bring in qualified leads and customers.",
      "Zoekmachine-advertenties, social ads en programmatic campagnes die gekwalificeerde leads en klanten opleveren.",
    ],
  );
}

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Align paid media with your business goals", "Stem betaalde media af op je bedrijfsdoelen"),
    body: t(
      "We start with your revenue targets, margins and sales cycle, then set the metrics each campaign is judged on.",
      "We beginnen bij je omzetdoelen, marges en verkoopcyclus en leggen daarna vast op welke cijfers we elke campagne beoordelen.",
    ),
  },
  {
    title: t("Audit existing campaigns", "Bestaande campagnes doorlichten"),
    body: t(
      "We review your accounts, tracking and spend to find wasted budget, missing conversions and quick wins.",
      "We lichten je accounts, tracking en uitgaven door op verspild budget, ontbrekende conversies en snelle winst.",
    ),
  },
  {
    title: t("Build data-driven campaigns", "Datagedreven campagnes bouwen"),
    body: t(
      "We plan channels, audiences, creative and budgets around who buys from you, and set up tracking from click to sale.",
      "We plannen kanalen, doelgroepen, creatives en budgetten rond de mensen die bij je kopen, en meten alles van klik tot verkoop.",
    ),
  },
  {
    title: t("Optimise and report", "Optimaliseren en rapporteren"),
    body: t(
      "We test ads, bids and landing pages every week and report on leads, cost per result and revenue each month.",
      "We testen elke week advertenties, biedingen en landingspagina's en rapporteren maandelijks over leads, kosten per resultaat en omzet.",
    ),
  },
];

const services = (t: T): NumberedItem[] => [
  {
    title: t("Paid search", "Zoekmachine-advertenties"),
    body: t(
      "Show up when people search for what you offer, on Google and Bing.",
      "Verschijn op het moment dat mensen zoeken naar wat jij aanbiedt, op Google en Bing.",
    ),
    items: [
      t("Keyword and intent research", "Onderzoek naar zoekwoorden en zoekintentie"),
      t("Search, shopping and Performance Max", "Search, Shopping en Performance Max"),
      t("Landing page testing", "Landingspagina's testen"),
    ],
  },
  {
    title: t("Paid social", "Social advertising"),
    body: t(
      "Reach the right people on LinkedIn, Meta, TikTok and YouTube.",
      "Bereik de juiste mensen op LinkedIn, Meta, TikTok en YouTube.",
    ),
    items: [
      t("Audience and lookalike targeting", "Targeting op doelgroepen en lookalikes"),
      t("Ad creative and video", "Advertentiecreatives en video"),
      t("Retargeting campaigns", "Retargetingcampagnes"),
    ],
  },
  {
    title: t("Programmatic ads", "Programmatic advertising"),
    body: t(
      "Display, video and connected TV across thousands of sites and apps.",
      "Display, video en connected tv op duizenden websites en apps.",
    ),
    items: [
      t("Account and intent-based targeting", "Targeting op accounts en koopintentie"),
      t("Brand-safe placements", "Merkveilige plaatsingen"),
      t("Frequency and budget control", "Controle over frequentie en budget"),
    ],
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("How much does paid media management cost?", "Wat kost het beheer van betaalde media?"),
    t(
      "It depends on your ad spend, channels and scope. We offer packages, performance-based and custom plans, and recommend one after a first call.",
      "Dat hangt af van je advertentiebudget, kanalen en scope. We werken met pakketten, prestatiegerichte afspraken en plannen op maat, en adviseren je na een eerste gesprek.",
    ),
  ],
  [
    t("How long before paid media produces qualified leads?", "Hoe snel levert betaalde media gekwalificeerde leads op?"),
    t(
      "Campaigns usually start bringing in leads within the first few weeks. Results improve over the first two to three months as we test and optimise.",
      "Campagnes leveren meestal binnen de eerste weken leads op. In de eerste twee à drie maanden worden de resultaten steeds beter, doordat we testen en optimaliseren.",
    ),
  ],
  [
    t("Which platforms do you manage?", "Welke platforms beheren jullie?"),
    t(
      "Google, Bing, LinkedIn, Meta, TikTok, YouTube and programmatic networks. We recommend the mix that fits your audience.",
      "Google, Bing, LinkedIn, Meta, TikTok, YouTube en programmatic netwerken. We adviseren de mix die bij jouw doelgroep past.",
    ),
  ],
  [
    t("How do you make sure our budget is spent well?", "Hoe zorgen jullie dat ons budget goed besteed wordt?"),
    t(
      "We set clear targets, track conversions properly, cut what doesn’t perform and move spend to what does, every week.",
      "We stellen heldere doelen, meten conversies goed, stoppen met wat niet werkt en verschuiven budget naar wat wél werkt. Elke week opnieuw.",
    ),
  ],
  [
    t("How do you measure success?", "Hoe meten jullie succes?"),
    t(
      "We report on leads, cost per lead, cost per customer and revenue, not just clicks and impressions.",
      "We rapporteren over leads, kosten per lead, kosten per klant en omzet, niet alleen over klikken en vertoningen.",
    ),
  ],
  [
    t("Can paid media help with long sales cycles?", "Helpt betaalde media ook bij een lange verkoopcyclus?"),
    t(
      "Yes. Retargeting, account-based targeting and nurture campaigns keep you in front of buyers until they’re ready.",
      "Ja. Met retargeting, account-based targeting en nurturingcampagnes blijf je in beeld bij kopers tot ze er klaar voor zijn.",
    ),
  ],
];

export default async function PaidMediaPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("Paid media", "Betaalde media")}
        title={[t("Make every ad dollar", "Laat elke advertentie-euro"), t("count toward growth.", "bijdragen aan groei.")]}
        intro={t(
          "Paid search, paid social and programmatic campaigns built to bring in qualified leads and customers, at a cost per result you can plan around.",
          "Zoekmachine-advertenties, social ads en programmatic campagnes die gekwalificeerde leads en klanten opleveren, tegen kosten per resultaat waar je op kunt plannen.",
        )}
        signup={{ source: "paid-media", cta: t("Plan my paid media →", "Plan mijn campagnes →") }}
      />
      <Section>
        <StepList
          eyebrow={t("How it works", "Zo werkt het")}
          title={t("From goals to results in four steps.", "Van doelen naar resultaat in vier stappen.")}
          items={steps(t)}
        />
      </Section>
      <Section dark>
        <SectionHeading
          dark
          eyebrow={t("Why Finloa", "Waarom Finloa")}
          title={t("Paid media services.", "Onze diensten voor betaalde media.")}
        />
        <DarkCards items={services(t)} moreLabel={t("Learn more →", "Meer weten →")} />
      </Section>
      <FaqSection title={t("Questions about paid media.", "Vragen over betaalde media.")} items={faqs(t)} />
      <ContactSection
        source="paid-media"
        intro={t(
          "Share your goals and current spend. We'll come back with ideas to get more from every dollar.",
          "Vertel ons over je doelen en huidige budget. We komen terug met ideeën om meer uit elke euro te halen.",
        )}
        messagePlaceholder={t("What are your paid media goals?", "Wat zijn je doelen met betaalde media?")}
      />
    </PageShell>
  );
}
