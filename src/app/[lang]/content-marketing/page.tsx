import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/content-marketing",
    ["Content Marketing — Finloa", "Contentmarketing — Finloa"],
    [
      "Articles, guides, case studies, video and email planned around your goals and distributed so people see them.",
      "Artikelen, gidsen, cases, video en e-mail, gepland rond jouw doelen en verspreid zodat mensen ze ook echt zien.",
    ],
  );
}

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Laying the foundation", "De basis leggen"),
    body: t(
      "We get to know your brand, audience and goals, and review the content you already have, so every piece starts from a clear brief.",
      "We leren je merk, doelgroep en doelen kennen en bekijken de content die je al hebt, zodat elk stuk begint met een heldere briefing.",
    ),
  },
  {
    title: t("Strategy and planning", "Strategie en planning"),
    body: t(
      "We build a content plan around the questions your audience asks at each stage, with topics, formats and a realistic publishing calendar.",
      "We maken een contentplan rond de vragen die je doelgroep in elke fase stelt, met onderwerpen, vormen en een haalbare publicatiekalender.",
    ),
  },
  {
    title: t("SEO-driven creation", "Content met SEO als basis"),
    body: t(
      "Our writers and editors create content that is useful to read and built to rank in search and be cited in AI answers.",
      "Onze schrijvers en redacteuren maken content die prettig leest, goed rankt in zoekmachines en geciteerd wordt in AI-antwoorden.",
    ),
  },
  {
    title: t("Distribution and amplification", "Verspreiding en versterking"),
    body: t(
      "We share each piece across email, social, partners and paid channels, so it reaches people instead of sitting on your blog.",
      "We verspreiden elk stuk via e-mail, social, partners en betaalde kanalen, zodat het mensen bereikt in plaats van stof te vangen op je blog.",
    ),
  },
  {
    title: t("Performance and optimisation", "Resultaten en optimalisatie"),
    body: t(
      "We track traffic, engagement, leads and revenue, then update and improve what works and retire what doesn’t.",
      "We volgen verkeer, betrokkenheid, leads en omzet. Wat werkt, verbeteren we verder; wat niet werkt, schrappen we.",
    ),
  },
];

const reasons = (t: T): NumberedItem[] => [
  {
    title: t("Experience and expertise", "Ervaring en expertise"),
    body: t(
      "Writers and strategists who learn your market and write with real subject knowledge.",
      "Schrijvers en strategen die zich in je markt verdiepen en schrijven met echte vakkennis.",
    ),
  },
  {
    title: t("Data-driven insights", "Inzichten uit data"),
    body: t(
      "Topics chosen from search data, audience research and what your competitors miss.",
      "Onderwerpen gekozen op basis van zoekdata, doelgroeponderzoek en wat je concurrenten laten liggen.",
    ),
  },
  {
    title: t("A plan built for you", "Een plan op maat"),
    body: t(
      "No templates. Your content plan fits your goals, budget and stage.",
      "Geen standaardsjablonen. Je contentplan past bij je doelen, budget en fase.",
    ),
  },
  {
    title: t("Collaborative process", "Samen aan de slag"),
    body: t(
      "You review and approve every brief and draft. We work as part of your team.",
      "Jij beoordeelt en keurt elke briefing en elk concept goed. We werken als onderdeel van je team.",
    ),
  },
  {
    title: t("Measurable impact", "Meetbaar resultaat"),
    body: t(
      "Clear monthly reporting on traffic, leads and revenue from content.",
      "Heldere maandrapportages over verkeer, leads en omzet uit content.",
    ),
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("How much do content marketing services cost?", "Wat kost contentmarketing?"),
    t(
      "It depends on volume, formats and distribution. We offer packages, commission-based plans and custom scopes, and recommend one after a first call.",
      "Dat hangt af van volume, vormen en verspreiding. We werken met pakketten, afspraken op commissiebasis en maatwerk, en adviseren je na een eerste gesprek.",
    ),
  ],
  [
    t("How long does content marketing take to work?", "Hoe lang duurt het voordat contentmarketing werkt?"),
    t(
      "Most clients see early engagement within the first months. Search traffic and leads usually build steadily over three to six months.",
      "De meeste klanten zien binnen de eerste maanden de eerste reacties. Zoekverkeer en leads groeien meestal gestaag in drie tot zes maanden.",
    ),
  ],
  [
    t("What’s included in your content marketing services?", "Wat zit er in jullie contentmarketing?"),
    t(
      "Strategy, topic research, writing and editing, design, SEO optimisation, distribution and reporting. You can start with all of it or the parts you need.",
      "Strategie, onderwerponderzoek, schrijven en redigeren, design, SEO-optimalisatie, verspreiding en rapportage. Je kunt met alles beginnen of alleen met de onderdelen die je nodig hebt.",
    ),
  ],
  [
    t("Should we hire an agency or a freelance writer?", "Kiezen we voor een bureau of een freelance schrijver?"),
    t(
      "A freelancer can write. An agency also brings strategy, SEO, design, distribution and reporting under one team, so content connects to results.",
      "Een freelancer kan schrijven. Een bureau brengt daarnaast strategie, SEO, design, verspreiding en rapportage samen in één team, zodat content echt bijdraagt aan resultaat.",
    ),
  ],
  [
    t("Do you write content that ranks and gets cited by AI tools?", "Schrijven jullie content die rankt en door AI-tools wordt geciteerd?"),
    t(
      "Yes. We structure content with clear answers, strong sources and SEO best practice so it can rank in search and be quoted by AI platforms.",
      "Ja. We structureren content met heldere antwoorden, sterke bronnen en SEO-best practices, zodat hij kan ranken in zoekmachines en geciteerd kan worden door AI-platforms.",
    ),
  ],
  [
    t("How do you measure content marketing success?", "Hoe meten jullie het succes van contentmarketing?"),
    t(
      "We track traffic, rankings, engagement, leads and revenue, and agree the main metrics with you at the start.",
      "We volgen verkeer, posities, betrokkenheid, leads en omzet, en spreken bij de start samen de belangrijkste cijfers af.",
    ),
  ],
];

export default async function ContentMarketingPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("Content marketing", "Contentmarketing")}
        title={[
          t("Content that builds authority", "Content die autoriteit opbouwt"),
          t("and turns readers into fans.", "en lezers verandert in fans."),
        ]}
        intro={t(
          "Articles, guides, case studies, video and email, planned around your goals and written for the people you want to reach. Then distributed so they actually see it.",
          "Artikelen, gidsen, cases, video en e-mail, gepland rond jouw doelen en geschreven voor de mensen die je wilt bereiken. En daarna zo verspreid dat ze het ook echt zien.",
        )}
        signup={{ source: "content-marketing", cta: t("Plan my content →", "Plan mijn content →") }}
      />
      <Section>
        <StepList
          eyebrow={t("How it works", "Zo werkt het")}
          title={t("From foundation to results in five steps.", "Van basis tot resultaat in vijf stappen.")}
          items={steps(t)}
        />
      </Section>
      <Section dark>
        <SectionHeading
          dark
          eyebrow={t("Why Finloa", "Waarom Finloa")}
          title={t("Why teams choose us for content.", "Waarom teams voor ons kiezen voor content.")}
        />
        <DarkCards items={reasons(t)} moreLabel={t("Learn more →", "Meer weten →")} />
      </Section>
      <FaqSection title={t("Questions about content marketing.", "Vragen over contentmarketing.")} items={faqs(t)} />
      <ContactSection
        source="content-marketing"
        intro={t(
          "Share your goals and challenges. We'll come back with ideas for content that moves them forward.",
          "Vertel ons over je doelen en uitdagingen. We komen terug met ideeën voor content die je verder helpt.",
        )}
        messagePlaceholder={t("What are your content goals?", "Wat zijn je doelen met content?")}
      />
    </PageShell>
  );
}
