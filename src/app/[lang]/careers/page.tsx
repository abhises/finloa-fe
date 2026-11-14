import type { Metadata } from "next";
import { DismissibleNotice } from "@/components/dismissible-notice";
import { ContactSection } from "@/components/contact-section";
import { PageShell } from "@/components/page-shell";
import { PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/careers",
    ["Careers — Finloa", "Werken bij Finloa"],
    [
      "Join a team where your voice matters, your growth is a priority and your wins are celebrated.",
      "Kom bij een team waar je stem telt, je groei voorop staat en je successen worden gevierd.",
    ],
  );
}

const benefits = (t: T) => [
  t("Flexible and remote working", "Flexibel en op afstand werken"),
  t("Paid holidays", "Doorbetaalde vakantiedagen"),
  t("Healthcare benefits", "Vergoeding voor zorgkosten"),
  t("Learning and development budget", "Budget voor opleiding en ontwikkeling"),
  t("Latest tools and AI software", "De nieuwste tools en AI-software"),
  t("Team events and offsites", "Teamuitjes en offsites"),
];

const traits = (t: T): NumberedItem[] => [
  {
    title: t("Proactive", "Proactief"),
    body: t(
      "You see what needs doing and do it, even when it’s not in your job description. You offer ideas to improve how we work.",
      "Je ziet wat er moet gebeuren en pakt het op, ook als het niet in je functieomschrijving staat. Je komt met ideeën om onze manier van werken te verbeteren.",
    ),
  },
  {
    title: t("Team-oriented", "Teamspeler"),
    body: t(
      "You work well with others, share what you know and help the people around you do their best work.",
      "Je werkt goed samen, deelt je kennis en helpt de mensen om je heen hun beste werk te leveren.",
    ),
  },
  {
    title: t("Take ownership", "Je neemt verantwoordelijkheid"),
    body: t(
      "You own the results of your work, learn from them and take pride in what you deliver.",
      "Je staat voor de resultaten van je werk, leert ervan en bent trots op wat je oplevert.",
    ),
  },
  {
    title: t("Enjoy a fast pace", "Je houdt van tempo"),
    body: t(
      "You’re comfortable switching focus quickly and handling several deadlines at once.",
      "Je schakelt makkelijk tussen taken en houdt meerdere deadlines tegelijk in de gaten.",
    ),
  },
  {
    title: t("Self-motivated", "Zelfstandig en gemotiveerd"),
    body: t(
      "You can work independently and shape your own career path, with support from the team.",
      "Je kunt zelfstandig werken en geeft zelf richting aan je loopbaan, met steun van het team.",
    ),
  },
  {
    title: t("Adaptable", "Flexibel"),
    body: t(
      "You adjust easily when client needs and priorities change.",
      "Je past je makkelijk aan als de wensen en prioriteiten van klanten veranderen.",
    ),
  },
  {
    title: t("Want to do good", "Je wilt iets goeds doen"),
    body: t(
      "You look for ways to make a difference and want your work to help people.",
      "Je zoekt manieren om het verschil te maken en wilt dat je werk mensen helpt.",
    ),
  },
];

export default async function CareersPage() {
  const t = await getT();
  return (
    <PageShell ctaHref="#contact">
      <DismissibleNotice>
        {t(
          "Finloa will never ask candidates for personal financial information or payment as part of hiring. All genuine messages come from an @finloa.com address, and all applications go through this Careers page.",
          "Finloa vraagt kandidaten tijdens een sollicitatie nooit om persoonlijke financiële gegevens of een betaling. Echte berichten komen altijd van een @finloa.com-adres, en alle sollicitaties lopen via deze vacaturepagina.",
        )}
      </DismissibleNotice>
      <PageHero
        eyebrow={t("Careers at Finloa", "Werken bij Finloa")}
        title={[t("We invest in you.", "Wij investeren in jou."), t("You help us grow.", "Jij helpt ons groeien.")]}
        intro={t(
          "Join a team where your voice matters, your growth is a priority and your wins are celebrated.",
          "Kom bij een team waar je stem telt, je groei voorop staat en je successen worden gevierd.",
        )}
        signup={{ source: "careers", cta: t("Get new roles by email →", "Ontvang nieuwe vacatures per mail →") }}
      />
      <Section innerClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-[clamp(32px,5vw,56px)]">
        <SectionHeading
          eyebrow={t("Working at Finloa", "Werken bij Finloa")}
          title={t("What it’s like to work here.", "Zo is het om hier te werken.")}
        />
        <div className="flex flex-col gap-[18px] text-base leading-[1.6] text-[oklch(0.38_0.02_265)]">
          <p className="text-pretty">
            {t(
              "At Finloa you join a team that values who you are and the perspective you bring. Your work doesn’t just shape our results, it shapes how we work.",
              "Bij Finloa kom je in een team dat waardeert wie je bent en welke blik je meebrengt. Je werk bepaalt niet alleen onze resultaten, maar ook hoe we werken.",
            )}
          </p>
          <p className="text-pretty">
            {t(
              "Everything we do is collaborative, from the first idea to celebrating the win. What we build together drives results for our clients and for our own future.",
              "Alles wat we doen, doen we samen: van het eerste idee tot het vieren van het succes. Wat we samen bouwen, levert resultaat op voor onze klanten én voor onze eigen toekomst.",
            )}
          </p>
          <p className="text-pretty">
            {t("Working here is", "Werken bij ons is")}{" "}
            <strong className="text-ink">{t("more than a job", "meer dan een baan")}</strong>.{" "}
            {t(
              "It’s a chance to grow professionally while helping creators and businesses earn more from what they’ve built.",
              "Het is een kans om professioneel te groeien en tegelijk creators en bedrijven te helpen meer te verdienen aan wat ze hebben opgebouwd.",
            )}
          </p>
        </div>
      </Section>
      <Section innerClassName="flex flex-col gap-9">
        <SectionHeading
          eyebrow={t("Benefits", "Arbeidsvoorwaarden")}
          title={t("What we offer.", "Wat we je bieden.")}
          intro={t(
            "We believe a healthy work-life balance is part of doing great work. These are some of the benefits we offer.",
            "Een gezonde balans tussen werk en privé hoort bij goed werk leveren. Dit zijn een paar van de voordelen die we bieden.",
          )}
        />
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
          {benefits(t).map((b) => (
            <li key={b} className="flex gap-2.5 rounded-xl border border-line bg-white px-5 py-[18px] text-[15.5px] font-medium">
              <span className="text-brand" aria-hidden>
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <StepList
          stickyHeading
          eyebrow={t("Who we look for", "Wie we zoeken")}
          title={t("Is a career at Finloa right for you?", "Past een baan bij Finloa bij jou?")}
          items={traits(t)}
        />
      </Section>
      <Section id="positions" dark innerClassName="flex flex-col gap-9">
        <SectionHeading
          dark
          eyebrow={t("Join our team", "Kom bij ons team")}
          title={t("Open application.", "Open sollicitatie.")}
          intro={t(
            "At Finloa you’re building something of your own. We have no open positions right now, but we’re always happy to hear from great people.",
            "Bij Finloa bouw je aan iets van jezelf. Op dit moment hebben we geen openstaande vacatures, maar we horen altijd graag van goede mensen.",
          )}
        />
        <div className="flex flex-col border-t border-ink-line-2">
          <div className="flex flex-wrap items-center gap-5 border-b border-ink-line-2 py-[22px]">
            <div className="flex min-w-[200px] flex-1 flex-col gap-1">
              <span className="text-[19px] font-semibold">{t("Open application", "Open sollicitatie")}</span>
              <span className="text-sm text-[oklch(0.7_0.02_265)]">
                {t(
                  "No open positions right now. Send your CV and a short note to info@finloa.com.",
                  "Op dit moment geen vacatures. Stuur je cv en een korte toelichting naar info@finloa.com.",
                )}
              </span>
            </div>
            <a
              href={`mailto:${t("info@finloa.com", "info@finloa.com")}?subject=${encodeURIComponent(t("Open application", "Open sollicitatie"))}`}
              className="whitespace-nowrap rounded-full border border-brand px-5 py-[11px] text-[15px] font-medium text-white transition-colors hover:bg-brand"
            >
              {t("Apply ↗", "Solliciteer ↗")}
            </a>
          </div>
        </div>
      </Section>
      <section className="border-t border-line px-6 py-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2.5">
          <span className="text-sm font-semibold">{t("Equal opportunity employer", "Gelijke kansen voor iedereen")}</span>
          <p className="max-w-[860px] text-[13.5px] leading-[1.6] text-pretty text-muted-2">
            {t(
              "Finloa is an equal opportunity employer. We consider all applicants without regard to race, religion, gender, sexual orientation, age, disability or any other protected characteristic. If you need an adjustment during the hiring process, email",
              "Finloa biedt iedereen gelijke kansen. We beoordelen alle sollicitanten ongeacht afkomst, religie, gender, seksuele oriëntatie, leeftijd, beperking of enig ander beschermd kenmerk. Heb je tijdens de sollicitatieprocedure een aanpassing nodig? Mail dan naar",
            )}{" "}
            <a href={`mailto:${t("info@finloa.com", "info@finloa.com")}`} className="text-brand hover:text-brand-hover">
              {t("info@finloa.com", "info@finloa.com")}
            </a>
            .
          </p>
        </div>
      </section>
      <ContactSection
        source="careers"
        intro={t(
          "Looking to grow your brand or audience? Share your goals and we'll come back with a plan for where to start.",
          "Wil je je merk of publiek laten groeien? Vertel ons over je doelen, dan komen we terug met een plan voor waar je het best kunt beginnen.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
      />
    </PageShell>
  );
}
