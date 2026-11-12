import type { Metadata } from "next";
import Image from "next/image";
import { FaqSection, type FaqItem } from "@/components/faq";
import { IdeaContact, IdeaHeroForm } from "@/components/idea-to-product";
import { PageShell } from "@/components/page-shell";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "/idea-to-product",
    ["Idea to Product — Finloa", "Van idee tot product — Finloa"],
    [
      "An online business, a SaaS product or an internal tool. We shape the concept, design and build it, put it live and keep it running after launch.",
      "Een online bedrijf, een SaaS-product of een interne tool. Wij scherpen het concept aan, ontwerpen en bouwen het, zetten het live en houden het draaiende na de lancering.",
    ],
  );
}

const eyebrow = "font-mono text-xs tracking-[0.16em] text-brand";
const h2 = "text-[clamp(34px,4.6vw,48px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance";

const steps = (t: T) => [
  {
    title: t("Concept", "Concept"),
    body: t(
      "We sharpen the idea with you: who it is for, what the first version must do and what can wait.",
      "We scherpen samen het idee aan: voor wie het is, wat de eerste versie moet kunnen en wat kan wachten.",
    ),
    time: t("WEEK 1", "WEEK 1"),
  },
  {
    title: t("Design", "Ontwerp"),
    body: t(
      "Clickable screens you can test with real people before a single line of code is written.",
      "Klikbare schermen die je met echte mensen kunt testen voordat er één regel code is geschreven.",
    ),
    time: t("WEEK 2–3", "WEEK 2–3"),
  },
  {
    title: t("Build", "Bouwen"),
    body: t(
      "We develop the product in short sprints and show you working software every week.",
      "We ontwikkelen het product in korte sprints en laten je elke week werkende software zien.",
    ),
    time: t("WEEK 3–8", "WEEK 3–8"),
  },
  {
    title: t("Deploy", "Livegang"),
    body: t(
      "Hosting, domain, payments, email and analytics set up. Your product goes live.",
      "Hosting, domein, betalingen, e-mail en analytics ingericht. Je product gaat live.",
    ),
    time: t("LAUNCH DAY", "LANCEERDAG"),
  },
  {
    title: t("Maintain", "Onderhoud"),
    body: t(
      "Updates, monitoring, backups and new features as your users ask for them.",
      "Updates, monitoring, back-ups en nieuwe functies zodra je gebruikers erom vragen.",
    ),
    time: t("ONGOING", "DOORLOPEND"),
  },
];

const builds = (t: T) => [
  {
    title: t("SaaS products", "SaaS-producten"),
    body: t(
      "Subscription software with accounts, billing and a dashboard your customers log into.",
      "Abonnementssoftware met accounts, facturatie en een dashboard waar je klanten op inloggen.",
    ),
    eg: t("BOOKING TOOLS · CRMS · ANALYTICS", "BOEKINGSTOOLS · CRM'S · ANALYTICS"),
  },
  {
    title: t("Marketplaces", "Marktplaatsen"),
    body: t(
      "Platforms that connect buyers and sellers, with listings, search, messaging and payouts.",
      "Platforms die kopers en verkopers verbinden, met advertenties, zoeken, berichten en uitbetalingen.",
    ),
    eg: t("SERVICES · RENTALS · B2B", "DIENSTEN · VERHUUR · B2B"),
  },
  {
    title: t("Online businesses", "Online bedrijven"),
    body: t(
      "Web shops, membership sites and course platforms that take payments from day one.",
      "Webshops, ledensites en cursusplatforms die vanaf dag één betalingen ontvangen.",
    ),
    eg: t("E-COMMERCE · MEMBERSHIPS · COURSES", "E-COMMERCE · LIDMAATSCHAPPEN · CURSUSSEN"),
  },
  {
    title: t("Internal tools", "Interne tools"),
    body: t(
      "Replace the spreadsheet. Custom portals, planners and admin panels for your team.",
      "Weg met de spreadsheet. Portalen, planners en beheeromgevingen op maat voor je team.",
    ),
    eg: t("PORTALS · PLANNING · REPORTING", "PORTALEN · PLANNING · RAPPORTAGES"),
  },
];

const packages = (t: T) => [
  {
    id: "validate",
    name: "Validate",
    tag: t("Concept + clickable prototype", "Concept + klikbaar prototype"),
    price: "$1,900",
    unit: t("one-off", "eenmalig"),
    desc: t(
      "For testing an idea with users or investors before you build.",
      "Om een idee te testen bij gebruikers of investeerders voordat je gaat bouwen.",
    ),
    cta: t("Start with Validate", "Begin met Validate"),
    items: [
      t("Idea workshop", "Ideeënworkshop"),
      t("User flows & scope", "Gebruikersflows & scope"),
      t("Clickable prototype", "Klikbaar prototype"),
      t("Build roadmap & estimate", "Bouwplanning & kostenraming"),
    ],
  },
  {
    id: "mvp",
    name: "MVP",
    tag: t("First working version", "Eerste werkende versie"),
    price: "$4,900",
    unit: t("one-off", "eenmalig"),
    desc: t(
      "For getting a real product in front of your first users fast.",
      "Om snel een echt product bij je eerste gebruikers te krijgen.",
    ),
    cta: t("Get MVP", "Kies MVP"),
    items: [
      t("Everything in Validate", "Alles uit Validate"),
      t("Core features, 1 user type", "Kernfuncties, 1 type gebruiker"),
      t("Accounts & login", "Accounts & inloggen"),
      t("Deployed & live", "Online & live"),
    ],
  },
  {
    id: "launch",
    name: "Launch",
    tag: t("Ready for paying customers", "Klaar voor betalende klanten"),
    price: "$9,900",
    unit: t("one-off", "eenmalig"),
    desc: t(
      "For launching a business that takes payments from day one.",
      "Om een bedrijf te lanceren dat vanaf dag één betalingen ontvangt.",
    ),
    cta: t("Get Launch", "Kies Launch"),
    items: [
      t("Everything in MVP", "Alles uit MVP"),
      t("Payments & subscriptions", "Betalingen & abonnementen"),
      t("Admin dashboard", "Beheerdashboard"),
      t("Marketing site & SEO basics", "Marketingsite & SEO-basis"),
    ],
    featured: true,
  },
  {
    id: "care",
    name: "Care",
    tag: t("Hosting & maintenance", "Hosting & onderhoud"),
    price: "$299",
    unit: t("/ month", "/ maand"),
    desc: t(
      "For keeping your product fast, safe and growing after launch.",
      "Om je product na de lancering snel, veilig en groeiend te houden.",
    ),
    cta: t("Add Care", "Voeg Care toe"),
    items: [
      t("Hosting & monitoring", "Hosting & monitoring"),
      t("Security updates & backups", "Beveiligingsupdates & back-ups"),
      t("Monthly report", "Maandrapportage"),
    ],
  },
];

const work = (t: T) => [
  {
    type: "SAAS · MARKETPLACE",
    name: "SERPsupport",
    img: "/work/serpsupport.png",
    body: t(
      "A platform where websites connect, chat about backlinks and approve or reject link requests.",
      "Een platform waar websites met elkaar in contact komen, over backlinks chatten en linkverzoeken goedkeuren of afwijzen.",
    ),
    result: t("Accounts, chat, approvals & free trial", "Accounts, chat, goedkeuringen & gratis proefperiode"),
  },
  {
    type: "SAAS · AD LIBRARY",
    name: "Adplaylist",
    img: "/work/adplaylist.png",
    body: t(
      "An ad library that studies winning ads and turns them into original templates teams edit in Canva.",
      "Een advertentiebibliotheek die succesvolle advertenties analyseert en omzet in originele templates die teams in Canva aanpassen.",
    ),
    result: t("Searchable library, sign-up & Google login", "Doorzoekbare bibliotheek, registratie & inloggen met Google"),
  },
  {
    type: t("ONLINE BUSINESS · CONTENT", "ONLINE BEDRIJF · CONTENT"),
    name: "BrasQ",
    img: "/work/brasq.png",
    body: t(
      "An independent product testing site with buying guides, reviews and affiliate revenue.",
      "Een onafhankelijke testsite voor producten, met koopgidsen, reviews en affiliate-inkomsten.",
    ),
    result: t("Content platform, search & newsletter", "Contentplatform, zoekfunctie & nieuwsbrief"),
  },
];

const faqs = (t: T): FaqItem[] => [
  [
    t("I'm not technical. Is that a problem?", "Ik ben niet technisch. Is dat een probleem?"),
    t(
      "No. Most of our clients are not developers. We explain every decision in plain language and you approve the scope before we build.",
      "Nee. De meeste van onze klanten zijn geen developer. We leggen elke keuze in gewone taal uit en jij keurt de scope goed voordat we gaan bouwen.",
    ),
  ],
  [
    t("Who owns the code and the product?", "Van wie zijn de code en het product?"),
    t(
      "You do. The code, domain, hosting and all accounts are in your name from day one.",
      "Van jou. Code, domein, hosting en alle accounts staan vanaf dag één op jouw naam.",
    ),
  ],
  [
    t("How long does it take?", "Hoe lang duurt het?"),
    t(
      "Validate takes about two weeks. An MVP is usually live in 6 weeks, a Launch build in 8 to 10 weeks.",
      "Validate duurt ongeveer twee weken. Een MVP staat meestal binnen 6 weken live, een Launch-traject binnen 8 tot 10 weken.",
    ),
  ],
  [
    t("What if my idea needs something outside the packages?", "En als mijn idee iets nodig heeft dat niet in de pakketten zit?"),
    t(
      "Tell us about it. We combine or extend packages and give you one fixed price for the whole project.",
      "Vertel het ons. We combineren of breiden pakketten uit en geven je één vaste prijs voor het hele project.",
    ),
  ],
  [
    t("What happens after launch?", "Wat gebeurt er na de lancering?"),
    t(
      "Every build includes three months of Care. After that you can continue month to month, or take the code to another team.",
      "Bij elk bouwproject zit drie maanden Care. Daarna kun je maandelijks opzegbaar doorgaan, of de code meenemen naar een ander team.",
    ),
  ],
  [
    t("Will you keep my idea confidential?", "Houden jullie mijn idee vertrouwelijk?"),
    t(
      "Yes. We are happy to sign an NDA before you share details.",
      "Ja. We tekenen graag een geheimhoudingsverklaring (NDA) voordat je details deelt.",
    ),
  ],
];

function SplitHeading({ label, title, intro }: { label: string; title: string; intro: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-8">
      <div className="flex flex-col gap-3.5">
        <div className={eyebrow}>{label}</div>
        <h2 className={h2}>{title}</h2>
      </div>
      <p className="max-w-[380px] text-[15px] leading-[1.6] text-muted">{intro}</p>
    </div>
  );
}

export default async function IdeaToProductPage() {
  const t = await getT();
  return (
    <PageShell ctaLabel={t("Tell us your idea", "Vertel ons je idee")} ctaHref="#contact">
      {/* ---------- Hero ---------- */}
      <section className="bg-[linear-gradient(180deg,#eef1fa_0%,var(--color-canvas)_100%)] px-6 pt-[clamp(56px,9vw,96px)] pb-[clamp(56px,8vw,88px)]">
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-6 text-center">
          <div className={eyebrow}>{t("CONCEPT · BUILD · DEPLOY · MAINTAIN", "CONCEPT · BOUWEN · LIVEGANG · ONDERHOUD")}</div>
          <h1 className="text-[clamp(44px,7.4vw,84px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
            {t("You have the idea.", "Jij hebt het idee.")}
            <br />
            <span className="text-brand">{t("We make it real.", "Wij maken het echt.")}</span>
          </h1>
          <p className="max-w-[600px] text-lg leading-[1.55] text-pretty text-muted">
            {t(
              "An online business, a SaaS product or an internal tool. We shape the concept, design and build it, put it live and keep it running after launch. One team for the whole journey.",
              "Een online bedrijf, een SaaS-product of een interne tool. Wij scherpen het concept aan, ontwerpen en bouwen het, zetten het live en houden het draaiende na de lancering. Eén team voor het hele traject.",
            )}
          </p>
          <div className="mt-3 w-full">
            <IdeaHeroForm />
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3.5 text-sm text-muted">
            {[
              t("Fixed price before we start", "Vaste prijs vooraf"),
              t("You own all code and accounts", "Alle code en accounts zijn van jou"),
              t("First release in 6–10 weeks", "Eerste release binnen 6–10 weken"),
            ].map((item, i) => (
              <li key={item} className="flex gap-6">
                {i > 0 && (
                  <span className="text-[#c3c8d6]" aria-hidden>
                    •
                  </span>
                )}
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section id="process" className="scroll-mt-20 px-6 py-[clamp(64px,9vw,96px)]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-12">
          <SplitHeading
            label={t("HOW IT WORKS", "ZO WERKT HET")}
            title={t("From idea to live product.", "Van idee naar live product.")}
            intro={t(
              "Five clear stages. You always know what happens next, what it costs and when you'll see it.",
              "Vijf duidelijke fases. Je weet altijd wat er hierna gebeurt, wat het kost en wanneer je het ziet.",
            )}
          />
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
            {steps(t).map((s, i) => (
              <li key={s.title} className="flex min-h-[220px] flex-col gap-3 rounded-2xl border border-line bg-white p-6">
                <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold tracking-[-0.02em]">{s.title}</h3>
                <p className="text-sm leading-[1.55] text-muted">{s.body}</p>
                <span className="mt-auto font-mono text-[11px] tracking-[0.08em] text-subtle">{s.time}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- What we build ---------- */}
      <section id="build" className="scroll-mt-20 bg-ink px-6 py-[clamp(64px,9vw,96px)] text-white">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-12">
          <div className="flex flex-col gap-3.5">
            <div className="font-mono text-xs tracking-[0.16em] text-[#6f97ff]">{t("WHAT WE BUILD", "WAT WE BOUWEN")}</div>
            <h2 className={`${h2} max-w-[640px]`}>
              {t(
                "If it runs in a browser or on a phone, we can build it.",
                "Als het in een browser of op een telefoon draait, kunnen wij het bouwen.",
              )}
            </h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-px overflow-hidden rounded-2xl border border-[#1f2640] bg-[#1f2640]">
            {builds(t).map((b) => (
              <div key={b.title} className="flex flex-col gap-2.5 bg-ink p-7">
                <h3 className="text-[19px] font-bold tracking-[-0.02em]">{b.title}</h3>
                <p className="text-sm leading-[1.55] text-[#a9b0c8]">{b.body}</p>
                <span className="mt-1.5 font-mono text-[11px] tracking-[0.06em] text-[#6f97ff]">{b.eg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Packages ---------- */}
      <section id="packages" className="scroll-mt-20 px-6 py-[clamp(64px,9vw,96px)]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-12">
          <div className="flex flex-col items-center gap-3.5 text-center">
            <div className={eyebrow}>{t("PACKAGES", "PAKKETTEN")}</div>
            <h2 className={h2}>{t("Clear packages. Clear prices.", "Duidelijke pakketten. Duidelijke prijzen.")}</h2>
            <p className="max-w-[520px] text-[15px] leading-[1.6] text-muted">
              {t(
                "Pick the stage you're at. Every build package includes three months of Care.",
                "Kies de fase waarin je zit. Bij elk bouwpakket zit drie maanden Care.",
              )}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3.5">
              {packages(t).map((p) => {
                const dark = !!p.featured;
                const outline = p.id === "validate";
                return (
                  <div
                    key={p.id}
                    className={`flex flex-col gap-3.5 rounded-[18px] border p-[26px] ${
                      dark ? "border-[#1f2847] bg-ink text-white" : "border-line bg-white text-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold tracking-[-0.02em]">{p.name}</h3>
                      {dark && (
                        <span className="rounded-full bg-brand px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-white">
                          {t("MOST POPULAR", "MEEST GEKOZEN")}
                        </span>
                      )}
                    </div>
                    <div className={`-mt-2 text-sm font-medium ${dark ? "text-[#6f97ff]" : "text-brand"}`}>{p.tag}</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[40px] font-extrabold tracking-[-0.04em]">{p.price}</span>
                      <span className={`text-[13px] ${dark ? "text-[#a9b0c8]" : "text-muted"}`}>{p.unit}</span>
                    </div>
                    <p className={`min-h-11 text-sm leading-[1.55] ${dark ? "text-[#a9b0c8]" : "text-muted"}`}>{p.desc}</p>
                    <a
                      href="#contact"
                      className={`rounded-[10px] border p-3 text-center text-sm font-semibold transition-colors ${
                        outline
                          ? "border-ink bg-white text-ink hover:bg-surface"
                          : "border-brand bg-brand text-white hover:bg-brand-hover hover:text-white"
                      }`}
                    >
                      {p.cta}
                    </a>
                    <ul
                      className={`flex flex-col gap-2 border-t pt-3.5 text-[13px] leading-[1.45] ${
                        dark ? "border-[#1f2847] text-[#a9b0c8]" : "border-line text-muted"
                      }`}
                    >
                      {p.items.map((it) => (
                        <li key={it} className="flex gap-2.5">
                          <span className="font-bold text-brand" aria-hidden>
                            +
                          </span>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2.5 rounded-[14px] border border-line bg-white px-6 py-4 text-sm text-muted">
              <strong className="text-ink">{t("Every project:", "Bij elk project:")}</strong>
              <span>{t("Fixed price, no surprises", "Vaste prijs, geen verrassingen")}</span>
              <span>{t("Weekly progress demo", "Wekelijkse demo van de voortgang")}</span>
              <span>{t("You own code, domain and accounts", "Code, domein en accounts zijn van jou")}</span>
              <span>
                {t("Something bigger?", "Iets groters?")}{" "}
                <a href="#contact" className="text-brand hover:text-brand-hover">
                  {t("Talk to us", "Neem contact op")}
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <section id="work" className="scroll-mt-20 px-6 pt-6 pb-[clamp(64px,9vw,96px)]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-9">
          <SplitHeading
            label={t("OUR WORK", "ONS WERK")}
            title={t("Ideas we've shipped.", "Ideeën die we hebben gelanceerd.")}
            intro={t(
              "Products we took from first sketch to real users, and still maintain today.",
              "Producten die we van eerste schets tot echte gebruikers hebben gebracht, en nog steeds onderhouden.",
            )}
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3.5">
            {work(t).map((w) => (
              <article key={w.name} className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-white">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-[#eef1fa]">
                  <Image
                    src={w.img}
                    alt={t(`${w.name} screenshot`, `Screenshot van ${w.name}`)}
                    fill
                    sizes="(min-width: 1160px) 380px, (min-width: 700px) 50vw, 100vw"
                    className="object-cover object-top-left"
                  />
                </div>
                <div className="flex flex-col gap-2 p-[22px]">
                  <span className="font-mono text-[11px] tracking-[0.08em] text-brand">{w.type}</span>
                  <h3 className="text-[19px] font-bold tracking-[-0.02em]">{w.name}</h3>
                  <p className="text-sm leading-[1.55] text-muted">{w.body}</p>
                  <span className="mt-1 text-[13px] font-semibold text-ink">{w.result}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqSection title={t("Good questions.", "Goede vragen.")} items={faqs(t)} />
      <IdeaContact />
    </PageShell>
  );
}
