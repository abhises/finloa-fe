import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { PageShell } from "@/components/page-shell";
import { DarkCards, NumberedCards, PageHero, Section, SectionHeading, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/why-finloa",
    ["Why Finloa", "Waarom Finloa"],
    [
      "Strategists, writers, designers, developers and marketers working together to grow your brand or channel.",
      "Strategen, schrijvers, designers, developers en marketeers die samen je merk of kanaal laten groeien.",
    ],
  );
}

const reasons = (t: T): NumberedItem[] => [
  {
    title: t("Scalable", "Schaalbaar"),
    body: t(
      "We grow with you. Start with one service and add more as your goals change, without switching partners.",
      "We groeien met je mee. Begin met één dienst en breid uit als je doelen veranderen, zonder van partner te wisselen.",
    ),
  },
  {
    title: t("Agile", "Wendbaar"),
    body: t(
      "Markets, platforms and audiences move fast. We adjust plans quickly to keep your growth on track.",
      "Markten, platforms en doelgroepen veranderen snel. Wij passen plannen snel aan, zodat je groei op koers blijft.",
    ),
  },
  {
    title: t("Amplified with AI", "Versterkt met AI"),
    body: t(
      "We use AI where it helps: faster research, sharper insights and more output, always checked by experts.",
      "We zetten AI in waar het helpt: sneller onderzoek, scherpere inzichten en meer output. Altijd gecontroleerd door experts.",
    ),
  },
  {
    title: t("Dependable", "Betrouwbaar"),
    body: t(
      "Clear plans, a named lead and honest reporting. You always know what we’re doing and why.",
      "Heldere plannen, een vast aanspreekpunt en eerlijke rapportages. Je weet altijd wat we doen en waarom.",
    ),
  },
];

const services = (t: T): NumberedItem[] => [
  {
    title: t("Video Creation", "Videoproductie"),
    body: t(
      "Affordable videos that grow your audience on every platform.",
      "Betaalbare video's die je publiek op elk platform laten groeien.",
    ),
    href: "/videos",
  },
  {
    title: t("AI Marketing", "AI-marketing"),
    body: t(
      "A marketing system built on a strong foundation, powered by AI.",
      "Een marketingsysteem op een sterke basis, aangedreven door AI.",
    ),
    href: "/ai-marketing",
  },
  {
    title: "SEO",
    body: t("Get found on Google and cited in AI answers.", "Word gevonden in Google en genoemd in AI-antwoorden."),
    href: "/seo",
  },
  {
    title: t("Content Marketing", "Contentmarketing"),
    body: t("Content that builds authority and brings in leads.", "Content die autoriteit opbouwt en leads oplevert."),
    href: "/content-marketing",
  },
  {
    title: t("Paid Media", "Betaalde media"),
    body: t("Campaigns that make every ad dollar count.", "Campagnes die alles uit elke advertentie-euro halen."),
    href: "/paid-media",
  },
  {
    title: t("Website Design", "Webdesign"),
    body: t("Websites built around your customer journey.", "Websites gebouwd rond de klantreis."),
    href: "/website-design",
  },
];

const tools = (t: T) => [
  t("WordPress and Shopify", "WordPress en Shopify"),
  t("Google Analytics and Tag Manager", "Google Analytics en Tag Manager"),
  t("Google and Meta Ads", "Google Ads en Meta Ads"),
  t("CRM and marketing automation", "CRM en marketingautomatisering"),
  t("AI tools for research and personalisation", "AI-tools voor onderzoek en personalisatie"),
];

export default async function WhyFinloaPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("Why Finloa", "Waarom Finloa")}
        title={[t("One team that sets", "Eén team dat het tempo"), t("the pace for your growth.", "van je groei bepaalt.")]}
        intro={t(
          "Strategists, writers, designers, developers and marketers working together, ready to grow your brand or channel. One joined-up approach to delivering measurable results faster.",
          "Strategen, schrijvers, designers, developers en marketeers die samenwerken en klaar staan om je merk of kanaal te laten groeien. Eén samenhangende aanpak die sneller meetbaar resultaat oplevert.",
        )}
        signup={{ source: "why-finloa", cta: t("Talk to our team →", "Praat met ons team →") }}
      />
      <Section>
        <SectionHeading
          eyebrow={t("Why choose us", "Waarom wij")}
          title={t("Why creators and businesses choose Finloa.", "Waarom creators en bedrijven voor Finloa kiezen.")}
        />
        <NumberedCards items={reasons(t)} />
      </Section>
      <Section dark>
        <SectionHeading
          dark
          eyebrow={t("Our services", "Onze diensten")}
          title={t("Everything you need to grow, in one team.", "Alles wat je nodig hebt om te groeien, in één team.")}
        />
        <DarkCards items={services(t)} min={240} moreLabel={t("Learn more →", "Meer weten →")} />
      </Section>
      <Section innerClassName="flex flex-col gap-9">
        <SectionHeading
          eyebrow={t("Our tools", "Onze tools")}
          title={t("The right tech behind our work.", "De juiste techniek achter ons werk.")}
          intro={t(
            "We work with the platforms you already use and set up the ones you need.",
            "We werken met de platforms die je al gebruikt en richten de platforms in die je nog nodig hebt.",
          )}
        />
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
          {tools(t).map((tool) => (
            <li key={tool} className="rounded-xl border border-line bg-white px-5 py-[18px] text-[15px] font-medium">
              {tool}
            </li>
          ))}
        </ul>
      </Section>
      <ContactSection
        source="why-finloa"
        intro={t(
          "Share your goals and challenges. We'll come back with a plan for where to start.",
          "Vertel ons over je doelen en uitdagingen. Wij komen terug met een plan voor waar je het best kunt beginnen.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
      />
    </PageShell>
  );
}
