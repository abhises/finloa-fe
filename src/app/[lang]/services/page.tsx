import type { Metadata } from "next";
import Link from "next/link";
import { GoalPicker } from "@/components/goal-picker";
import { ContactSection } from "@/components/contact-section";
import { PageShell } from "@/components/page-shell";
import { CtaBand, NumberedCards, Section, SectionHeading, TagList, btn, type NumberedItem } from "@/components/ui";
import { EmailSignup } from "@/components/email-signup";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/services",
    ["Services — Finloa", "Diensten — Finloa"],
    [
      "Strategy, websites, video, marketing and new income streams from one team, for creators and businesses.",
      "Strategie, websites, video, marketing en nieuwe inkomstenbronnen van één team, voor creators en bedrijven.",
    ],
  );
}

const reasons = (t: T): NumberedItem[] => [
  {
    title: t("We know your market", "Wij kennen je markt"),
    body: t(
      "We learn your niche, your audience and what they buy before we build anything.",
      "We verdiepen ons in je niche, je doelgroep en wat zij kopen voordat we iets bouwen.",
    ),
  },
  {
    title: t("We're flexible", "Wij zijn flexibel"),
    body: t(
      "Packages, commission or a custom plan. Pick what fits your budget and stage.",
      "Pakketten, commissie of een plan op maat. Kies wat past bij je budget en fase.",
    ),
  },
  {
    title: t("We focus on results", "Wij sturen op resultaat"),
    body: t(
      "Every project starts with a revenue goal and is measured against it after launch.",
      "Elk project begint met een omzetdoel en na de lancering meten we daartegen af.",
    ),
  },
  {
    title: t("One team, together", "Eén team, samen"),
    body: t(
      "Strategy, design, build and marketing work as one team with a named lead.",
      "Strategie, design, development en marketing werken als één team, met één vast aanspreekpunt.",
    ),
  },
];

type Service = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  rows: [string, string][];
  tagWidth?: string;
};

const services = (t: T): Service[] => [
  {
    id: "video",
    eyebrow: t("Video creation", "Videoproductie"),
    title: t("Affordable videos that grow your audience.", "Betaalbare video's die je publiek laten groeien."),
    body: t(
      "Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear monthly price. We edit, optimise and post.",
      "Professionele video's voor YouTube, TikTok, Instagram en LinkedIn voor een duidelijke maandprijs. Wij monteren, optimaliseren en posten.",
    ),
    href: "/videos",
    cta: t("Explore video plans →", "Bekijk videopakketten →"),
    rows: [
      ["01", t("Editing, thumbnails, titles and descriptions", "Montage, thumbnails, titels en beschrijvingen")],
      ["02", t("Shorts cross-posted to TikTok, Reels and Facebook", "Shorts ook geplaatst op TikTok, Reels en Facebook")],
      ["03", t("Monthly reporting on views, subscribers and leads", "Maandelijkse rapportage over views, abonnees en leads")],
    ],
  },
  {
    id: "seo",
    eyebrow: "SEO",
    title: t("Get found on Google and in AI answers.", "Word gevonden in Google en in AI-antwoorden."),
    body: t(
      "People search on Google, ChatGPT and Perplexity. We make sure your brand shows up, gets cited and wins the click.",
      "Mensen zoeken via Google, ChatGPT en Perplexity. Wij zorgen dat je merk daar verschijnt, genoemd wordt en de klik krijgt.",
    ),
    href: "/seo",
    cta: t("Explore SEO →", "Bekijk SEO →"),
    rows: [
      ["SEO", t("Rank higher in Google and Bing results", "Hoger in de zoekresultaten van Google en Bing")],
      ["GEO", t("Get cited by ChatGPT, Perplexity and AI Overviews", "Genoemd worden door ChatGPT, Perplexity en AI Overviews")],
      ["AEO", t("Become the direct answer to your buyers' questions", "Het directe antwoord worden op de vragen van je kopers")],
    ],
  },
  {
    id: "content",
    eyebrow: t("Content marketing", "Contentmarketing"),
    title: t("Content that builds authority.", "Content die autoriteit opbouwt."),
    body: t(
      "We plan, create and distribute content your audience wants to read, and measure what it brings in.",
      "We plannen, maken en verspreiden content die je doelgroep wíl lezen, en meten wat het oplevert.",
    ),
    href: "/content-marketing",
    cta: t("Explore content marketing →", "Bekijk contentmarketing →"),
    rows: [
      ["01", t("Strategy and a content calendar built around your goals", "Strategie en een contentkalender rond jouw doelen")],
      ["02", t("Articles, guides, case studies, video and email", "Artikelen, gidsen, cases, video en e-mail")],
      ["03", t("Distribution and reporting on traffic, leads and revenue", "Verspreiding en rapportage over verkeer, leads en omzet")],
    ],
  },
  {
    id: "paid",
    eyebrow: t("Paid media", "Betaalde media"),
    title: t("Make every ad dollar count.", "Haal alles uit elke advertentie-euro."),
    body: t(
      "Campaigns built to bring in qualified leads and customers, with clear reporting on what each one earns.",
      "Campagnes die gekwalificeerde leads en klanten opleveren, met heldere rapportages over wat elke campagne oplevert.",
    ),
    href: "/paid-media",
    cta: t("Explore paid media →", "Bekijk betaalde media →"),
    rows: [
      ["01", t("Paid search on Google and Bing", "Zoekmachine-advertenties op Google en Bing")],
      ["02", t("Paid social on LinkedIn, Meta, TikTok and YouTube", "Social ads op LinkedIn, Meta, TikTok en YouTube")],
      ["03", t("Programmatic display, video and connected TV", "Programmatic display, video en connected tv")],
    ],
  },
  {
    id: "ai",
    eyebrow: t("AI marketing", "AI-marketing"),
    title: t("An AI marketing system that drives revenue.", "Een AI-marketingsysteem dat omzet oplevert."),
    body: t(
      "We fix the foundation first, then set up AI tools that scale what works and make growth easier to forecast.",
      "We zetten eerst de basis neer en richten daarna AI-tools in die opschalen wat werkt en groei beter voorspelbaar maken.",
    ),
    href: "/ai-marketing",
    cta: t("Explore AI marketing →", "Bekijk AI-marketing →"),
    tagWidth: "w-[60px]",
    rows: [
      [t("BUILD", "BASIS"), t("Customer profile, messaging, data and tool setup", "Klantprofiel, boodschap, data en inrichting van tools")],
      [t("LAUNCH", "START"), t("AI-assisted campaigns that bring in pipeline", "Campagnes met AI die pipeline opleveren")],
      [t("GROW", "GROEI"), t("A full growth team, optimisation and forecasting", "Een volledig groeiteam, optimalisatie en prognoses")],
    ],
  },
];

const paths = (t: T) => [
  {
    href: "/for-creators",
    eyebrow: t("FOR CREATORS", "VOOR CREATORS"),
    title: t("Turn your audience into income", "Maak van je publiek een inkomen"),
    body: t(
      "For YouTube channels, podcasts, newsletters and social accounts that want to earn more than ad and sponsor revenue.",
      "Voor YouTube-kanalen, podcasts, nieuwsbrieven en social accounts die meer willen verdienen dan advertentie- en sponsorinkomsten.",
    ),
  },
  {
    href: "/videos",
    eyebrow: t("FOR BUSINESSES", "VOOR BEDRIJVEN"),
    title: t("Grow what already works", "Laat groeien wat al werkt"),
    body: t(
      "For small, mid-size and established companies ready for consistent video, a better website and new revenue beyond their core offer.",
      "Voor kleine, middelgrote en gevestigde bedrijven die klaar zijn voor consistente video, een betere website en nieuwe omzet naast hun kernaanbod.",
    ),
  },
];

export default async function ServicesPage() {
  const t = await getT();
  return (
    <PageShell ctaHref="#contact">
      <section className="bg-grid px-6 pt-[clamp(28px,5vw,64px)] pb-[clamp(56px,8vw,96px)]">
        <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-[26px] text-center">
          <div className="font-mono text-[13px] tracking-[0.08em] text-brand">
            {t("SIMPLE · FLEXIBLE · REVENUE-DRIVEN", "SIMPEL · FLEXIBEL · GERICHT OP OMZET")}
          </div>
          <h1 className="flex max-w-[980px] flex-col items-center gap-1 text-[clamp(44px,7vw,84px)] leading-[1.03] font-bold tracking-[-0.045em] text-balance">
            <span>{t("We grow brands and audiences.", "Wij laten merken en publiek groeien.")}</span>
            <span className="text-brand">{t("Built to deliver revenue.", "Gebouwd om omzet op te leveren.")}</span>
          </h1>
          <p className="max-w-[600px] text-lg leading-[1.55] text-balance text-muted">
            {t(
              "Strategy, websites, video, marketing and new income streams from one team working together, for creators and businesses of every size.",
              "Strategie, websites, video, marketing en nieuwe inkomstenbronnen van één team dat samenwerkt, voor creators en bedrijven van elke omvang.",
            )}
          </p>
          <EmailSignup source="services" cta={t("Get started →", "Aan de slag →")} />
        </div>
      </section>

      <Section id="goals" innerClassName="flex flex-col gap-8">
        <SectionHeading
          eyebrow={t("Your goal", "Jouw doel")}
          title={t(
            "Tell us where you want to go. We'll map the route.",
            "Vertel ons waar je naartoe wilt. Wij stippelen de route uit.",
          )}
        />
        <GoalPicker />
      </Section>

      <Section>
        <SectionHeading eyebrow={t("Why Finloa", "Waarom Finloa")} title={t("What sets us apart.", "Wat ons onderscheidt.")} />
        <NumberedCards items={reasons(t)} titleSize="text-[19px]" />
      </Section>

      {services(t).map((s) => (
        <Section
          key={s.id}
          id={s.id}
          innerClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(32px,5vw,56px)]"
        >
          <div className="flex flex-col gap-4">
            <SectionHeading className="max-w-[520px]" eyebrow={s.eyebrow} title={s.title} intro={s.body} />
            <Link href={s.href} className={btn.dark}>
              {s.cta}
            </Link>
          </div>
          <TagList rows={s.rows} tagWidth={s.tagWidth} />
        </Section>
      ))}

      <Section id="paths" className="pb-24">
        <SectionHeading
          eyebrow={t("Solutions", "Oplossingen")}
          title={t("Growth that scales with you.", "Groei die met je meeschaalt.")}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
          {paths(t).map((p) => (
            <Link
              key={p.eyebrow}
              href={p.href}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-8 text-ink transition-colors hover:border-brand"
            >
              <div className="font-mono text-[12.5px] tracking-[0.04em] text-brand">{p.eyebrow}</div>
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">{p.title}</h3>
              <p className="text-[15px] leading-[1.55] text-muted">{p.body}</p>
              <span className="mt-2 text-[15px] font-medium text-brand">{t("Explore →", "Ontdek →")}</span>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand
        title={t(
          "You have the vision. We have the team to get you there.",
          "Jij hebt de visie. Wij hebben het team om je daar te krijgen.",
        )}
        actions={[{ href: "#contact", label: t("Contact Us →", "Neem contact op →") }]}
      />
      <ContactSection
        source="services"
        intro={t(
          "Share your goals and challenges. We'll come back with a plan for where to start.",
          "Vertel ons over je doelen en uitdagingen. Wij komen terug met een plan voor waar je het best kunt beginnen.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
      />
    </PageShell>
  );
}
