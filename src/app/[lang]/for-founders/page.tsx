import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkCards, DarkStepGrid, NumberedCards, PageHero, Section, SectionHeading, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/for-founders",
    ["For Founders — Finloa", "Voor founders — Finloa"],
    [
      "A product, brand and growth team for founders: turn your idea into a launched product with real customers.",
      "Een product-, merk- en groeiteam voor founders: maak van je idee een gelanceerd product met echte klanten.",
    ],
  );
}

const pains = (t: T): NumberedItem[] => [
  {
    title: t("You have an idea, not a tech team", "Je hebt een idee, geen techteam"),
    body: t("We act as your product and engineering team until you're ready to hire.", "Wij zijn je product- en techteam tot je klaar bent om zelf mensen aan te nemen."),
  },
  {
    title: t("You need to move fast", "Je moet snel schakelen"),
    body: t("Short sprints and weekly demos keep you close to the work.", "Korte sprints en wekelijkse demo's houden je dicht bij het werk."),
  },
  {
    title: t("You need customers, not just code", "Je hebt klanten nodig, niet alleen code"),
    body: t("We help with the brand, the website and the first marketing too.", "We helpen ook met het merk, de website en de eerste marketing."),
  },
];

const offer = (t: T): NumberedItem[] => [
  {
    title: t("Idea to product", "Van idee tot product"),
    body: t("We shape your idea into a scope, a prototype and a working MVP.", "We vormen je idee tot een scope, een prototype en een werkende MVP."),
    href: "/idea-to-product",
  },
  {
    title: t("SaaS development", "SaaS-ontwikkeling"),
    body: t("Accounts, subscriptions and integrations, built to scale.", "Accounts, abonnementen en koppelingen, gebouwd om te schalen."),
    href: "/saas-development",
  },
  {
    title: t("Launch marketing", "Marketing voor je lancering"),
    body: t("A website, launch video and search visibility to win your first users.", "Een website, lanceringsvideo en vindbaarheid om je eerste gebruikers te winnen."),
    href: "/ai-marketing",
  },
];

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Idea call", "Ideegesprek"),
    body: t("A free call to understand your idea and goals.", "Een gratis gesprek om je idee en doelen te begrijpen."),
  },
  {
    title: t("Plan", "Plan"),
    body: t("A clear scope, timeline and price for your first version.", "Een heldere scope, planning en prijs voor je eerste versie."),
  },
  {
    title: t("Build", "Bouwen"),
    body: t("Weekly demos until the product is ready to launch.", "Wekelijkse demo's tot het product klaar is voor de lancering."),
  },
  {
    title: t("Launch and learn", "Lanceren en leren"),
    body: t("We go live and improve based on real user feedback.", "We gaan live en verbeteren op basis van echte gebruikersfeedback."),
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("I'm not technical. Is that a problem?", "Ik ben niet technisch. Is dat een probleem?"),
    t(
      "Not at all. We explain every choice in plain language and you decide what gets built.",
      "Helemaal niet. We leggen elke keuze uit in gewone taal en jij beslist wat er gebouwd wordt.",
    ),
  ],
  [
    t("Can you help with investor demos?", "Kunnen jullie helpen met demo's voor investeerders?"),
    t(
      "Yes. A clickable prototype or a working MVP makes your pitch much easier to believe.",
      "Ja. Een klikbaar prototype of een werkende MVP maakt je pitch veel geloofwaardiger.",
    ),
  ],
  [
    t("Do you sign an NDA?", "Tekenen jullie een geheimhoudingsverklaring?"),
    t("Yes, happily, before you share the details of your idea.", "Ja, graag, voordat je de details van je idee deelt."),
  ],
  [
    t("What if I later hire my own developers?", "Wat als ik later zelf developers aanneem?"),
    t(
      "You own all the code and we document it, so your team can take over smoothly.",
      "Alle code is van jou en we documenteren hem, zodat je team het soepel kan overnemen.",
    ),
  ],
];

export default async function ForFoundersPage() {
  const t = await getT();
  return (
    <PageShell ctaLabel={t("Tell us your idea", "Vertel ons je idee")} ctaHref="#contact">
      <PageHero
        eyebrow={t("For Founders", "Voor founders")}
        title={[t("From idea to launch,", "Van idee tot lancering,"), t("with one team.", "met één team.")]}
        intro={t(
          "We're the product, design and growth team for founders who want to launch fast and win their first customers.",
          "Wij zijn het product-, design- en groeiteam voor founders die snel willen lanceren en hun eerste klanten willen winnen.",
        )}
        actions={[
          { href: "#contact", label: t("Tell us your idea →", "Vertel ons je idee →") },
          { href: "/idea-to-product", label: t("See how we work", "Bekijk hoe we werken"), variant: "secondary" },
        ]}
      />
      <Section first>
        <SectionHeading
          eyebrow={t("Sound familiar?", "Herkenbaar?")}
          title={t("Building a company is hard enough.", "Een bedrijf opbouwen is al lastig genoeg.")}
        />
        <NumberedCards items={pains(t)} min={300} />
      </Section>
      <Section dark>
        <SectionHeading
          dark
          eyebrow={t("What we do for founders", "Wat we doen voor founders")}
          title={t("Everything you need to launch.", "Alles wat je nodig hebt om te lanceren.")}
        />
        <DarkCards items={offer(t)} moreLabel={t("Learn more →", "Meer weten →")} />
      </Section>
      <Section>
        <SectionHeading eyebrow={t("How it works", "Zo werkt het")} title={t("Four steps to launch.", "In vier stappen naar de lancering.")} />
        <div className="rounded-[18px] bg-ink text-white">
          <DarkStepGrid items={steps(t)} />
        </div>
      </Section>
      <FaqSection title={t("Questions from founders.", "Vragen van founders.")} items={faqs(t)} />
      <ContactSection
        source="for-founders"
        title={t("Tell us your idea.", "Vertel ons je idee.")}
        intro={t(
          "Share what you want to build. We'll reply with honest feedback and a first plan.",
          "Vertel wat je wilt bouwen. We reageren met eerlijke feedback en een eerste plan.",
        )}
        messagePlaceholder={t("Describe your idea", "Beschrijf je idee")}
      />
    </PageShell>
  );
}
