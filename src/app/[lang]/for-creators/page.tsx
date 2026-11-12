import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { CreatorNetwork } from "@/components/creator-network";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { DarkStepGrid, NumberedCards, Section, SectionHeading, type NumberedItem } from "@/components/ui";
import { EmailSignup } from "@/components/email-signup";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/for-creators",
    ["For Creators — Finloa", "Voor creators — Finloa"],
    [
      "Finloa partners with creators and businesses to build or add new sources of revenue.",
      "Finloa werkt samen met creators en bedrijven om nieuwe inkomstenbronnen op te bouwen of toe te voegen.",
    ],
  );
}

const services = (t: T): NumberedItem[] => [
  {
    title: "Finloa Ventures",
    body: t(
      "Get equity in a new platform built with you and your peers, and earn a share of everything it makes, not only what your own channel brings in.",
      "Krijg aandelen in een nieuw platform dat samen met jou en andere creators wordt gebouwd, en verdien mee aan alles wat het oplevert, niet alleen aan wat je eigen kanaal binnenhaalt.",
    ),
  },
  {
    title: "Finloa Collective",
    body: t(
      "Join a private community of creators in your niche. Swap ideas, get feedback and plan collabs.",
      "Word lid van een besloten community van creators in jouw niche. Wissel ideeën uit, krijg feedback en plan samenwerkingen.",
    ),
  },
  {
    title: "Finloa Partners",
    body: t(
      "Pitch brands together with your combined reach and win bigger sponsorships than one channel could alone.",
      "Benader merken samen met jullie gezamenlijke bereik en sluit grotere sponsordeals dan één kanaal in z'n eentje zou kunnen.",
    ),
  },
];

const steps = (t: T): NumberedItem[] => [
  {
    title: t("Share your channel", "Deel je kanaal"),
    body: t("Send your channel or site. Takes two minutes.", "Stuur ons je kanaal of site. Kost je twee minuten."),
  },
  {
    title: t("Growth call", "Groeigesprek"),
    body: t("We walk through your audience, revenue and goals.", "We nemen samen je publiek, inkomsten en doelen door."),
  },
  {
    title: t("Free proposal", "Gratis voorstel"),
    body: t(
      "Site, income streams and the pricing model that fits.",
      "Site, inkomstenbronnen en het prijsmodel dat bij je past.",
    ),
  },
  {
    title: t("Build & launch", "Bouwen & lanceren"),
    body: t("We design and build. You approve every step.", "Wij ontwerpen en bouwen. Jij keurt elke stap goed."),
  },
  {
    title: t("Launch & grow", "Lanceren & groeien"),
    body: t(
      "Monthly reporting, optimisation and support after launch.",
      "Maandelijkse rapportage, optimalisatie en ondersteuning na de lancering.",
    ),
  },
];

const oldWay = (t: T) => [
  t("One-off project, then you're on your own", "Eenmalig project, daarna sta je er alleen voor"),
  t("Paid the same whether you earn or not", "Ze krijgen hetzelfde betaald, of jij nu verdient of niet"),
  t("Design first, revenue as an afterthought", "Eerst design, omzet komt later wel"),
  t("No plan for revenue beyond the homepage", "Geen plan voor omzet voorbij de homepage"),
];
const partnerWay = (t: T) => [
  t("Ongoing growth partner with a named lead", "Vaste groeipartner met één aanspreekpunt"),
  t("Commission option: we earn when you earn", "Optie op commissiebasis: wij verdienen als jij verdient"),
  t("Website, strategy and launch in one team", "Website, strategie en lancering in één team"),
  t("New income streams designed into the build", "Nieuwe inkomstenbronnen vanaf het begin ingebouwd"),
];

const faqs = (t: T): FaqItem[] => [
  [
    t("Who do you work with?", "Met wie werken jullie samen?"),
    t(
      "Creators and channels with roughly 100k+ engaged followers, and businesses that already generate revenue. If you’re earlier than that, the audit will still tell you what to focus on.",
      "Creators en kanalen met zo'n 100k+ betrokken volgers, en bedrijven die al omzet draaien. Ben je nog niet zo ver? Dan laat de audit je toch zien waar je je het best op kunt richten.",
    ),
  ],
  [
    t("How does the commission model work?", "Hoe werkt het commissiemodel?"),
    t(
      "We take no upfront fee. We build and run new income streams and receive an agreed share of the revenue they generate for a fixed term. Existing revenue is never included.",
      "We vragen geen kosten vooraf. We bouwen en beheren nieuwe inkomstenbronnen en ontvangen voor een vaste periode een afgesproken deel van de omzet die ze opleveren. Bestaande inkomsten tellen nooit mee.",
    ),
  ],
  [
    t("What kind of income streams do you build?", "Welke inkomstenbronnen bouwen jullie?"),
    t(
      "Memberships, courses, digital products, shops, affiliate programmes and licensing. The proposal recommends the ones that fit your audience best.",
      "Lidmaatschappen, cursussen, digitale producten, webshops, affiliateprogramma's en licenties. In het voorstel adviseren we welke het best bij je publiek passen.",
    ),
  ],
  [
    t("Who owns the website and the customer data?", "Van wie zijn de website en de klantgegevens?"),
    t(
      "You do. Domain, code, content and customer lists stay in your name on every pricing model.",
      "Van jou. Domein, code, content en klantenlijsten blijven bij elk prijsmodel op jouw naam.",
    ),
  ],
  [
    t("How long does a project take?", "Hoe lang duurt een project?"),
    t(
      "A Launch package typically goes live in 4–6 weeks. Growth projects with several income streams usually take 8–12 weeks.",
      "Een Launch-pakket staat meestal binnen 4 tot 6 weken live. Groeiprojecten met meerdere inkomstenbronnen duren meestal 8 tot 12 weken.",
    ),
  ],
];

export default async function ForCreatorsPage() {
  const t = await getT();
  const audiences = [
    [
      t("FOR CREATORS & CHANNELS", "VOOR CREATORS & KANALEN"),
      t("10k+ subscribers, followers or readers", "10k+ abonnees, volgers of lezers"),
      t(
        "YouTube, podcasts, newsletters and social channels with an engaged audience, but most income still depends on ads and sponsors.",
        "YouTube, podcasts, nieuwsbrieven en social kanalen met een betrokken publiek, waarvan de inkomsten nog vooral van advertenties en sponsors afhangen.",
      ),
    ],
    [
      t("FOR ESTABLISHED BUSINESSES", "VOOR GEVESTIGDE BEDRIJVEN"),
      t("Already profitable, ready for the next stage", "Al winstgevend, klaar voor de volgende stap"),
      t(
        "Brands and service companies with proven revenue whose website is holding them back, or who want new revenue beyond their core offer.",
        "Merken en dienstverleners met bewezen omzet die door hun website worden geremd, of die nieuwe omzet willen naast hun kernaanbod.",
      ),
    ],
  ];
  return (
    <PageShell ctaHref="#contact">
      <section className="bg-grid px-5 pt-[clamp(16px,calc(6vw-12px),32px)] pb-[clamp(56px,8vw,88px)]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-center gap-[clamp(32px,5vw,56px)]">
          <div className="flex flex-col gap-[26px]">
            <h1 className="flex flex-col gap-1 text-[clamp(42px,6vw,72px)] leading-[1.05] font-bold tracking-[-0.04em] text-balance">
              <span>{t("Your audience is an asset.", "Je publiek is goud waard.")}</span>
              <span className="text-brand">{t("We turn it into extra revenue.", "Wij maken er extra inkomsten van.")}</span>
            </h1>
            <p className="max-w-[540px] text-lg leading-[1.55] text-pretty text-muted">
              {t(
                "Finloa partners with creators and businesses to build or add new sources of revenue.",
                "Finloa werkt samen met creators en bedrijven om nieuwe inkomstenbronnen op te bouwen of toe te voegen.",
              )}
            </p>
            <EmailSignup source="for-creators" cta={t("Sign up for free →", "Meld je gratis aan →")} align="start" />
          </div>
          <CreatorNetwork />
        </div>
      </section>

      <section className="px-6 pt-10 pb-[72px]">
        <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] gap-4">
          {audiences.map(([eyebrow, title, body]) => (
            <div key={eyebrow} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-7">
              <div className="font-mono text-[12.5px] tracking-[0.04em] text-brand">{eyebrow}</div>
              <h2 className="text-[22px] font-semibold tracking-[-0.02em]">{title}</h2>
              <p className="text-[15px] leading-[1.55] text-muted">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <Section id="services">
        <SectionHeading
          eyebrow={t("Services", "Diensten")}
          title={t("Three ways we work with you.", "Drie manieren waarop we met je samenwerken.")}
        />
        <NumberedCards items={services(t)} min={280} titleSize="text-[21px]" />
      </Section>

      <Section>
        <SectionHeading
          eyebrow={t("Why it's different", "Waarom het anders is")}
          title={t(
            "Agencies hand over a website. Finloa builds what it earns.",
            "Bureaus leveren een website op. Finloa bouwt wat geld oplevert.",
          )}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-4">
          <div className="flex flex-col gap-[18px] rounded-2xl border border-line bg-surface p-[30px]">
            <div className="flex items-center justify-between">
              <span className="text-[17px] font-semibold">{t("A typical agency", "Een doorsnee bureau")}</span>
              <span className="font-mono text-xs text-subtle">{t("THE OLD WAY", "DE OUDE MANIER")}</span>
            </div>
            <ul className="flex flex-col gap-3 text-[15px] text-muted">
              {oldWay(t).map((x) => (
                <li key={x} className="flex gap-3">
                  <span aria-hidden>✕</span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-[18px] rounded-2xl bg-ink p-[30px] text-white">
            <div className="flex items-center justify-between">
              <span className="text-[17px] font-semibold">Finloa</span>
              <span className="font-mono text-xs text-brand-pale">{t("THE PARTNER WAY", "ALS PARTNER")}</span>
            </div>
            <ul className="flex flex-col gap-3 text-[15px] text-[oklch(0.9_0.01_265)]">
              {partnerWay(t).map((x) => (
                <li key={x} className="flex gap-3">
                  <span className="text-brand-pale" aria-hidden>
                    ✓
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section id="how" dark>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            dark
            className="max-w-[680px]"
            eyebrow={t("How it works", "Zo werkt het")}
            title={t("Five steps from audience to income.", "In vijf stappen van publiek naar inkomsten.")}
          />
          <a
            href="#contact"
            className="rounded-[10px] bg-white px-5 py-[13px] text-[15px] font-medium text-ink transition-opacity hover:opacity-90"
          >
            {t("Get your proposal →", "Vraag je voorstel aan →")}
          </a>
        </div>
        <DarkStepGrid items={steps(t)} />
      </Section>

      <FaqSection title={t("Questions creators ask us.", "Vragen die creators ons stellen.")} items={faqs(t)} />

      <ContactSection
        source="for-creators"
        title={t("Ready to earn more than views?", "Klaar om meer te verdienen dan views?")}
        intro={t(
          "Share your channel and goals. We'll come back with a free proposal for new income streams that fit your audience.",
          "Deel je kanaal en je doelen. We komen terug met een gratis voorstel voor nieuwe inkomstenbronnen die bij je publiek passen.",
        )}
        fourthField={{ name: "website", placeholder: t("Channel or website", "Kanaal of website") }}
        messagePlaceholder={t(
          "Tell us about your audience and what you'd like to earn from",
          "Vertel ons over je publiek en waarmee je graag zou willen verdienen",
        )}
      />
    </PageShell>
  );
}
