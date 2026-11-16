import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkStepGrid, NumberedCards, PageHero, Section, SectionHeading, TagList, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/saas-development",
    ["SaaS Development — Finloa", "SaaS-ontwikkeling — Finloa"],
    [
      "We design, build and launch SaaS products: from MVP to a stable platform your customers pay for.",
      "We ontwerpen, bouwen en lanceren SaaS-producten: van MVP tot een stabiel platform waar je klanten voor betalen.",
    ],
  );
}

const services = (t: T): NumberedItem[] => [
  {
    title: t("MVP development", "MVP-ontwikkeling"),
    body: t(
      "A focused first version with the features that prove your idea, built to grow rather than be thrown away.",
      "Een gerichte eerste versie met de functies die je idee bewijzen, gebouwd om te groeien in plaats van weggegooid te worden.",
    ),
    items: [
      t("Scope workshop and feature priorities", "Scope-workshop en prioriteiten"),
      t("Clickable prototype before we build", "Klikbaar prototype vóór we bouwen"),
      t("Live product in weeks, not months", "Live product in weken, niet maanden"),
    ],
  },
  {
    title: t("Full SaaS platforms", "Complete SaaS-platformen"),
    body: t(
      "Everything a real SaaS needs behind the scenes, so you can sell from day one.",
      "Alles wat een echte SaaS achter de schermen nodig heeft, zodat je vanaf dag één kunt verkopen.",
    ),
    items: [
      t("User accounts, teams and roles", "Gebruikersaccounts, teams en rollen"),
      t("Subscriptions and payments", "Abonnementen en betalingen"),
      t("Admin dashboard and analytics", "Beheeromgeving en analytics"),
    ],
  },
  {
    title: t("Integrations and AI features", "Koppelingen en AI-functies"),
    body: t(
      "Connect your product to the tools your customers already use, and add AI where it saves them time.",
      "Koppel je product aan de tools die je klanten al gebruiken, en voeg AI toe waar het ze tijd bespaart.",
    ),
    items: [
      t("APIs and third-party integrations", "API's en koppelingen met andere software"),
      t("AI assistants, search and automation", "AI-assistenten, zoeken en automatisering"),
      t("Webhooks and data exports", "Webhooks en data-exports"),
    ],
  },
];

const stack = (t: T): [string, string][] => [
  ["FE", t("Fast, accessible web apps built with React and Next.js", "Snelle, toegankelijke webapps met React en Next.js")],
  ["BE", t("Secure APIs and databases that scale with your users", "Veilige API's en databases die meegroeien met je gebruikers")],
  ["PAY", t("Stripe subscriptions, invoices and trials", "Stripe-abonnementen, facturen en proefperiodes")],
  ["AI", t("Language models connected to your own data", "Taalmodellen gekoppeld aan je eigen data")],
  ["OPS", t("Automated deployments, backups and monitoring", "Geautomatiseerde deployments, back-ups en monitoring")],
];

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Discovery", "Verkenning"),
    body: t("We learn your market, your users and what the first version must prove.", "We leren je markt, je gebruikers en wat de eerste versie moet bewijzen."),
  },
  {
    title: t("Design", "Ontwerp"),
    body: t("Wireframes and a clickable prototype you can test with real users.", "Wireframes en een klikbaar prototype dat je met echte gebruikers kunt testen."),
  },
  {
    title: t("Build", "Bouwen"),
    body: t("Short sprints with a working demo at the end of each one.", "Korte sprints met aan het eind van elke sprint een werkende demo."),
  },
  {
    title: t("Launch", "Lancering"),
    body: t("We go live, set up monitoring and make sure payments work.", "We gaan live, zetten monitoring op en zorgen dat betalingen werken."),
  },
  {
    title: t("Grow", "Groeien"),
    body: t("We keep improving the product based on what your users do.", "We blijven het product verbeteren op basis van wat je gebruikers doen."),
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("How long does it take to build a SaaS MVP?", "Hoe lang duurt het om een SaaS-MVP te bouwen?"),
    t(
      "Most MVPs take six to twelve weeks, depending on scope. We agree the scope and timeline before we start.",
      "De meeste MVP's duren zes tot twaalf weken, afhankelijk van de scope. We spreken scope en planning af voordat we beginnen.",
    ),
  ],
  [
    t("Who owns the code?", "Van wie is de code?"),
    t(
      "You do. The code, designs and accounts are yours from day one.",
      "Van jou. De code, ontwerpen en accounts zijn vanaf dag één van jou.",
    ),
  ],
  [
    t("Can you take over an existing product?", "Kunnen jullie een bestaand product overnemen?"),
    t(
      "Yes. We start with a code review, then fix what's urgent and plan the rest.",
      "Ja. We beginnen met een code-review, lossen op wat dringend is en plannen de rest.",
    ),
  ],
  [
    t("What happens after launch?", "Wat gebeurt er na de lancering?"),
    t(
      "We can host, maintain and keep developing your product, or hand it over to your own team.",
      "We kunnen je product hosten, onderhouden en verder ontwikkelen, of het overdragen aan je eigen team.",
    ),
  ],
];

export default async function SaasDevelopmentPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("SaaS Development", "SaaS-ontwikkeling")}
        title={[t("Software your customers", "Software waar je klanten"), t("are happy to pay for.", "graag voor betalen.")]}
        intro={t(
          "We design, build and launch SaaS products, from a first MVP to a platform with accounts, subscriptions and integrations.",
          "We ontwerpen, bouwen en lanceren SaaS-producten, van een eerste MVP tot een platform met accounts, abonnementen en koppelingen.",
        )}
        actions={[
          { href: "#contact", label: t("Tell us your idea →", "Vertel ons je idee →") },
          { href: "/idea-to-product", label: t("How we work", "Hoe we werken"), variant: "secondary" },
        ]}
      />
      <Section first>
        <SectionHeading
          eyebrow={t("What we build", "Wat we bouwen")}
          title={t("From first version to full platform.", "Van eerste versie tot compleet platform.")}
        />
        <NumberedCards items={services(t)} min={300} />
      </Section>
      <Section innerClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-12">
        <SectionHeading
          eyebrow={t("Our stack", "Onze techniek")}
          title={t("Proven tools, no lock-in.", "Bewezen tools, geen lock-in.")}
          intro={t(
            "We use widely adopted technology, so any good developer can work on your product later.",
            "We gebruiken breed gedragen technologie, zodat elke goede developer later aan je product kan werken.",
          )}
        />
        <TagList rows={stack(t)} tagWidth="w-12" />
      </Section>
      <Section dark>
        <SectionHeading
          dark
          eyebrow={t("How it works", "Zo werkt het")}
          title={t("From idea to paying customers in five steps.", "Van idee tot betalende klanten in vijf stappen.")}
        />
        <DarkStepGrid items={steps(t)} />
      </Section>
      <FaqSection title={t("Questions about SaaS development.", "Vragen over SaaS-ontwikkeling.")} items={faqs(t)} />
      <ContactSection
        source="saas-development"
        intro={t(
          "Tell us what you want to build. We'll come back with a scope, a timeline and a clear price.",
          "Vertel ons wat je wilt bouwen. We komen terug met een scope, een planning en een duidelijke prijs.",
        )}
        messagePlaceholder={t("What should your product do?", "Wat moet je product doen?")}
      />
    </PageShell>
  );
}
