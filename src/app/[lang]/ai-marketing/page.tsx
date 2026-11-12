import type { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { FaqSection, type FaqItem } from "@/components/faq";
import { PageShell } from "@/components/page-shell";
import { ReadinessCheck } from "@/components/readiness-check";
import { Check, NumberedCards, PageHero, Section, SectionHeading, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/ai-marketing",
    ["AI Marketing — Finloa", "AI-marketing — Finloa"],
    [
      "Build an AI marketing system that drives revenue: fix the foundation, then scale what works.",
      "Bouw een AI-marketingsysteem dat omzet oplevert: eerst de basis op orde, dan opschalen wat werkt.",
    ],
  );
}

const phases = (t: T) => [
  {
    tag: t("BUILD · 3–6 MONTHS", "OPBOUWEN · 3–6 MAANDEN"),
    title: t("Get AI-ready", "Klaar voor AI"),
    body: t(
      "Sharpen what makes you different before you ask AI to scale it.",
      "Scherp aan wat je onderscheidt, voordat je AI vraagt om het op te schalen.",
    ),
    items: [
      t("Customer and buyer profiles", "Klant- en koperprofielen"),
      t("Brand voice and messaging", "Tone of voice en boodschap"),
      t("Positioning against competitors", "Positionering ten opzichte van concurrenten"),
      t("AI tool setup", "Inrichting van AI-tools"),
      t("CRM and lead flow design", "Inrichting van CRM en leadstroom"),
      t("Attribution and baseline reporting", "Attributie en nulmeting"),
    ],
    dark: true,
  },
  {
    tag: t("LAUNCH · 6–12 MONTHS", "LANCEREN · 6–12 MAANDEN"),
    title: t("Go to market", "De markt op"),
    body: t(
      "Turn the foundation into campaigns that bring in pipeline and revenue.",
      "Zet de basis om in campagnes die pipeline en omzet opleveren.",
    ),
    items: [
      t("AI-assisted search, social and content", "Search, social en content met hulp van AI"),
      t("Targeted outreach and sales campaigns", "Gerichte outreach en salescampagnes"),
      t("Testing messages and offers", "Boodschappen en aanbiedingen testen"),
      t("Lead scoring and automation", "Leadscoring en automatisering"),
      t("Monthly revenue reporting", "Maandelijkse omzetrapportage"),
    ],
  },
  {
    tag: t("GROW · ONGOING", "GROEIEN · DOORLOPEND"),
    title: t("Full partnership", "Volledig partnerschap"),
    body: t(
      "Hand us the whole engine. You run the business, we run the marketing.",
      "Geef ons de hele motor in handen. Jij runt het bedrijf, wij de marketing.",
    ),
    items: [
      t("Everything in Build and Launch", "Alles uit Opbouwen en Lanceren"),
      t("A dedicated growth team", "Een vast groeiteam"),
      t("Ongoing conversion optimisation", "Doorlopende conversieoptimalisatie"),
      t("Content strategy and thought leadership", "Contentstrategie en thought leadership"),
      t("Executive dashboards and forecasting", "Managementdashboards en prognoses"),
    ],
  },
];

const outcomes = (t: T): NumberedItem[] => [
  {
    title: t("Sales always knows what’s coming", "Sales weet altijd wat er aankomt"),
    body: t(
      "With a clear customer profile and connected systems, qualified leads arrive steadily and your team spends time on the right ones.",
      "Met een helder klantprofiel en gekoppelde systemen komen gekwalificeerde leads gestaag binnen en besteedt je team tijd aan de juiste.",
    ),
  },
  {
    title: t("Attribution that tells the whole story", "Attributie die het hele verhaal vertelt"),
    body: t(
      "Every deal traces back to the channels and content that created it, so you know what’s working and where to invest.",
      "Elke deal is terug te voeren op de kanalen en content die hem opleverden, zodat je weet wat werkt en waar je moet investeren.",
    ),
  },
  {
    title: t("Growth leadership can plan around", "Groei waar het management op kan plannen"),
    body: t(
      "When marketing and sales share one model, planning becomes predictable and marketing is seen as a growth driver.",
      "Als marketing en sales één model delen, wordt plannen voorspelbaar en wordt marketing gezien als groeimotor.",
    ),
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("What does an AI marketing consultant do?", "Wat doet een AI-marketingconsultant?"),
    t(
      "We help you build the foundation, choose and set up the right AI tools, and connect them to campaigns and reporting so they drive revenue.",
      "We helpen je de basis op te bouwen, de juiste AI-tools te kiezen en in te richten, en ze te koppelen aan campagnes en rapportages zodat ze omzet opleveren.",
    ),
  ],
  [
    t("How much does AI marketing consulting cost?", "Wat kost AI-marketingadvies?"),
    t(
      "It depends on the phase and scope. We offer packages, performance-based and custom plans, and recommend one after the readiness review.",
      "Dat hangt af van de fase en de scope. We werken met pakketten, prestatiegerichte afspraken en plannen op maat, en adviseren je na de AI-check.",
    ),
  ],
  [
    t("Do I have to commit to a long engagement?", "Moet ik me voor lange tijd vastleggen?"),
    t(
      "No. Many teams start with the Build phase and decide on next steps once the foundation is in place.",
      "Nee. Veel teams beginnen met de fase Opbouwen en beslissen over de volgende stappen zodra de basis staat.",
    ),
  ],
  [
    t("How is this different from a typical agency retainer?", "Wat is het verschil met een gewone bureau-retainer?"),
    t(
      "We build a system you own, with clear goals, connected data and revenue reporting, instead of just producing more output.",
      "We bouwen een systeem dat van jou is, met heldere doelen, gekoppelde data en omzetrapportage, in plaats van alleen méér output te leveren.",
    ),
  ],
  [
    t("How quickly will we see results?", "Hoe snel zien we resultaat?"),
    t(
      "Foundation work usually shows early wins within the first months. Pipeline impact builds as campaigns launch.",
      "Werk aan de basis levert meestal binnen de eerste maanden al winst op. Het effect op je pipeline groeit zodra de campagnes live gaan.",
    ),
  ],
  [
    t("Is our team ready for AI?", "Is ons team klaar voor AI?"),
    t(
      "The readiness review answers exactly that, and shows what to fix first.",
      "Dat is precies wat de AI-check beantwoordt. Je ziet ook meteen wat je als eerste moet aanpakken.",
    ),
  ],
];

export default async function AiMarketingPage() {
  const t = await getT();
  return (
    <PageShell>
      <PageHero
        eyebrow={t("AI marketing", "AI-marketing")}
        title={[t("Build an AI marketing system", "Bouw een AI-marketingsysteem"), t("that drives revenue.", "dat omzet oplevert.")]}
        intro={t(
          "Fix the foundation first. Then scale what works and forecast what comes next.",
          "Zet eerst de basis neer. Schaal daarna op wat werkt en voorspel wat er komt.",
        )}
        signup={{ source: "ai-marketing", cta: t("Get my AI review →", "Vraag mijn AI-check aan →") }}
      />
      <Section dark>
        <SectionHeading
          dark
          className="max-w-[760px]"
          eyebrow={t("Why it matters", "Waarom het ertoe doet")}
          title={
            <>
              {t("Most AI strategies scale activity.", "De meeste AI-strategieën schalen activiteit op.")}{" "}
              <span className="text-brand-pale">{t("The best ones scale revenue.", "De beste schalen omzet op.")}</span>
            </>
          }
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-8 text-[15.5px] leading-[1.6] text-on-ink-muted">
          <p className="text-pretty">
            {t(
              "Everyone has access to the same AI tools. What makes the difference is the foundation behind them. Unclear audiences and generic messaging only produce generic output faster.",
              "Iedereen heeft toegang tot dezelfde AI-tools. Het verschil zit in de basis erachter. Een onduidelijke doelgroep en een algemene boodschap leveren alleen sneller algemene output op.",
            )}
          </p>
          <p className="text-pretty">
            {t(
              "We start with your customer profile, positioning, brand voice and data. Then we set up the right tools and connect them to content, campaigns and reporting, so AI drives pipeline instead of just volume.",
              "We beginnen bij je klantprofiel, positionering, tone of voice en data. Daarna richten we de juiste tools in en koppelen we ze aan content, campagnes en rapportages, zodat AI pipeline oplevert in plaats van alleen volume.",
            )}
          </p>
        </div>
        <p className="border-l-2 border-brand pl-5 text-[clamp(20px,2.4vw,26px)] font-medium tracking-[-0.02em]">
          {t(
            "AI is a multiplier. Give it clarity and it scales clarity.",
            "AI is een versterker. Geef het helderheid, en het versterkt helderheid.",
          )}
        </p>
      </Section>
      <Section id="phases" first>
        <SectionHeading
          eyebrow={t("How it works", "Zo werkt het")}
          title={t("Three phases. One revenue system.", "Drie fases. Eén omzetsysteem.")}
          intro={t(
            "Some teams need the foundation fixed. Others are ready to launch or want a partner to run everything. We start wherever makes sense for you.",
            "Sommige teams moeten eerst de basis op orde brengen. Andere zijn klaar om te lanceren, of willen een partner die alles regelt. We beginnen waar het voor jou logisch is.",
          )}
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-4">
          {phases(t).map((ph) => (
            <div
              key={ph.tag}
              className={`flex flex-col gap-3 rounded-2xl border p-7 ${
                ph.dark ? "border-ink-line-2 bg-ink text-white" : "border-line bg-white text-ink"
              }`}
            >
              <span className={`font-mono text-[12.5px] tracking-[0.04em] ${ph.dark ? "text-brand-pale" : "text-brand"}`}>
                {ph.tag}
              </span>
              <h3 className="text-2xl font-semibold tracking-[-0.02em]">{ph.title}</h3>
              <p className={`text-[15px] leading-[1.55] ${ph.dark ? "text-[oklch(0.78_0.015_265)]" : "text-muted-2"}`}>
                {ph.body}
              </p>
              <div className={`mt-1 flex flex-col gap-[9px] border-t pt-2 ${ph.dark ? "border-ink-line-2" : "border-line"}`}>
                <span
                  className={`pt-3 font-mono text-[11.5px] tracking-[0.06em] ${
                    ph.dark ? "text-[oklch(0.78_0.015_265)]" : "text-muted-2"
                  }`}
                >
                  {t("WHAT'S INCLUDED", "WAT JE KRIJGT")}
                </span>
                {ph.items.map((it) => (
                  <Check key={it} dark={ph.dark}>
                    {it}
                  </Check>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Section>
        <SectionHeading
          eyebrow={t("What you get", "Wat je krijgt")}
          title={t("What AI marketing looks like when it works.", "Zo ziet AI-marketing eruit als het werkt.")}
        />
        <NumberedCards items={outcomes(t)} min={280} />
      </Section>
      <Section
        id="assessment"
        innerClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-center gap-[clamp(32px,5vw,56px)]"
      >
        <SectionHeading
          className="max-w-[520px]"
          eyebrow={t("Start with a free review", "Begin met een gratis check")}
          title={t("Find the gaps before AI amplifies them.", "Vind de gaten voordat AI ze groter maakt.")}
          intro={t(
            "Every engagement starts with an AI readiness review. We look at your customer profile, messaging, brand voice, data, attribution and tools, and show you where the biggest wins are. You leave with a clear plan, whether you work with us or not.",
            "Elke samenwerking begint met een AI-check. We kijken naar je klantprofiel, boodschap, tone of voice, data, attributie en tools, en laten zien waar de grootste winst zit. Je gaat weg met een helder plan, of je nu met ons verder gaat of niet.",
          )}
        />
        <ReadinessCheck />
      </Section>
      <FaqSection title={t("Questions about AI marketing.", "Vragen over AI-marketing.")} items={faqs(t)} />
      <ContactSection
        source="ai-marketing"
        title={t(
          "See what AI-powered marketing can do for your brand.",
          "Ontdek wat marketing met AI voor jouw merk kan doen.",
        )}
        intro={t(
          "Book a strategy call or your free readiness review. We'll show you where AI can drive the most revenue.",
          "Plan een strategiegesprek of je gratis AI-check. We laten je zien waar AI de meeste omzet kan opleveren.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
        messagePlaceholder={t("What would you like AI to help you grow?", "Waarmee wil je dat AI je helpt groeien?")}
      />
    </PageShell>
  );
}
