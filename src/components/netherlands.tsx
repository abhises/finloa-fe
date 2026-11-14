"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useLocale, useT } from "@/i18n/client";
import type { T } from "@/i18n/config";
import { submitLead, type ApiError } from "@/lib/api";
import { EmailSignup } from "./email-signup";

const mono = "font-mono text-xs tracking-[0.16em]";

/** "a [[b]] c" → text with the [[…]] parts wrapped in a span with `className` (edited in Admin → Pages) */
function marked(text: string, className: string) {
  return text.split(/\[\[(.+?)\]\]/).map((part, i) => (i % 2 ? <span key={i} className={className}>{part}</span> : part));
}

const KEYWORDS = (t: T) => [
  {
    en: t("cheap health insurance", "cheap health insurance"),
    nl: t("zorgverzekering vergelijken", "zorgverzekering vergelijken"),
    note: t(
      "Dutch buyers compare before they buy. “Vergelijken” (compare) beats “cheap” in intent and volume for most categories.",
      "Nederlanders vergelijken voordat ze kopen. In de meeste categorieën wint “vergelijken” het van “goedkoop”, zowel in intentie als in zoekvolume.",
    ),
  },
  {
    en: t("buy now pay later", "buy now pay later"),
    nl: t("achteraf betalen", "achteraf betalen"),
    note: t(
      "A fixed Dutch term. Translate it literally and you rank for nothing, and your checkout copy looks foreign.",
      "Een vaste Nederlandse term. Vertaal je het letterlijk, dan rank je nergens op en voelt je checkout buitenlands aan.",
    ),
  },
  {
    en: t("accountant near me", "accountant near me"),
    nl: t("boekhouder in de buurt", "boekhouder in de buurt"),
    note: t(
      "“Accountant” exists in Dutch but means something narrower. Local searchers mostly look for a boekhouder.",
      "“Accountant” bestaat in het Nederlands, maar betekent iets specifiekers. Lokale zoekers zoeken meestal naar een boekhouder.",
    ),
  },
  {
    en: t("running shoes sale", "running shoes sale"),
    nl: t("hardloopschoenen aanbieding", "hardloopschoenen aanbieding"),
    note: t(
      "Dutch shoppers search for “aanbieding” (offer) far more than “sale”, and compound words change the whole keyword set.",
      "Nederlandse shoppers zoeken veel vaker op “aanbieding” dan op “sale”, en samenstellingen veranderen de hele zoekwoordenset.",
    ),
  },
  {
    en: t("solar panel cost", "solar panel cost"),
    nl: t("wat kosten zonnepanelen?", "wat kosten zonnepanelen?"),
    note: t(
      "Dutch people increasingly search in full questions, the way they’d ask a friend or an AI assistant. We write pages that answer those questions directly.",
      "Nederlanders zoeken steeds vaker in hele vragen, zoals ze het aan een vriend of een AI-assistent zouden vragen. Wij schrijven pagina's die die vragen direct beantwoorden.",
    ),
  },
];

const CHANNELS = (t: T) => [
  {
    tag: t("DUTCH SEO", "NEDERLANDSE SEO"),
    title: t("Get found on Google.nl and in AI answers.", "Word gevonden op Google.nl en in AI-antwoorden."),
    href: "/seo",
  },
  {
    tag: t("PAID MEDIA NL", "BETAALDE MEDIA NL"),
    title: t("Ads written for Dutch buyers.", "Advertenties geschreven voor Nederlandse kopers."),
    href: "/paid-media",
  },
  {
    tag: "WEBSITE",
    title: t("A site that reads like it was built here.", "Een site die leest alsof hij hier is gebouwd."),
    href: "/website-design",
  },
  {
    tag: "E-MAIL & CRM",
    title: t("Flows in Dutch, from welcome to win-back.", "Flows in het Nederlands, van welkomstmail tot win-back."),
    href: "/content-marketing",
  },
];

const PHASES = (t: T) => [
  {
    weeks: t("WEEK 1–2", "WEEK 1–2"),
    title: t("Market & audience", "Markt & doelgroep"),
    items: [
      t("Dutch competitor scan", "Scan van Nederlandse concurrenten"),
      t("Keyword research NL", "Zoekwoordonderzoek NL"),
      t("Tone of voice in Dutch", "Nederlandse tone of voice"),
    ],
  },
  {
    weeks: t("WEEK 3–6", "WEEK 3–6"),
    title: t("Localise", "Lokaliseren"),
    items: [
      t("Website rewrite & build", "Website herschrijven & bouwen"),
      t("Dutch SEO pages", "Nederlandse SEO-pagina's"),
      t("Ad & email copy", "Teksten voor ads & e-mail"),
    ],
  },
  {
    weeks: t("WEEK 7–10", "WEEK 7–10"),
    title: t("Launch", "Lancering"),
    items: [
      t("Google Ads NL", "Google Ads NL"),
      t("Meta, TikTok & LinkedIn", "Meta, TikTok & LinkedIn"),
      t("Marketplaces like bol.com", "Marktplaatsen zoals bol.com"),
    ],
  },
  {
    weeks: t("WEEK 11–13", "WEEK 11–13"),
    title: t("Scale", "Opschalen"),
    items: [
      t("Revenue reporting", "Omzetrapportage"),
      t("Creative testing", "Creatives testen"),
      t("Next-quarter plan", "Plan voor het volgende kwartaal"),
    ],
  },
];

const CHIPS = (t: T) => [
  t("Dutch voice-over", "Nederlandse voice-over"),
  t("Native creators", "Nederlandse creators"),
  t("Captions", "Ondertiteling"),
  "TikTok NL",
  "LinkedIn NL",
];

export function LanguageSwitchHero() {
  const locale = useLocale();
  const t = useT();
  const [lang, setLang] = useState<"en" | "nl">(locale);
  const en = lang === "en";
  return (
    <section className="bg-brand px-6 pt-14 pb-[110px] text-white">
      <div className="mx-auto grid max-w-[1088px] grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] items-center gap-14">
        <div className="flex flex-col gap-[26px]">
          <div className={mono}>{t("LOCALISATION · ENGLISH → DUTCH", "LOKALISATIE · ENGELS → NEDERLANDS")}</div>
          <h1 className="text-[clamp(56px,8vw,96px)] leading-[0.92] font-extrabold tracking-[-0.06em]" lang={lang}>
            {/* The toggle shows either headline on both sites, so each one is the same in both languages */}
            <span className="whitespace-pre-line">
              {en ? t("Your brand,\nfluent in\nDutch.", "Your brand,\nfluent in\nDutch.") : t("Jouw merk,\nvloeiend\nNederlands.", "Jouw merk,\nvloeiend\nNederlands.")}
            </span>
          </h1>
          <p className="max-w-[500px] text-lg leading-[1.55]">
            {t(
              "We take what already works in English and rebuild it for the Netherlands: website, SEO, ads, social and video. Written by native speakers, run by one team.",
              "We nemen wat in het Engels al werkt en bouwen het opnieuw op voor Nederland: website, SEO, advertenties, social en video. Geschreven door moedertaalsprekers, uitgevoerd door één team.",
            )}
          </p>
          <EmailSignup source="netherlands" cta={t("Launch in the Netherlands →", "Start in Nederland →")} tone="brand" align="start" />
        </div>
        <div className="flex flex-col items-center gap-7">
          <button
            type="button"
            onClick={() => setLang(en ? "nl" : "en")}
            aria-label={en ? t("Switch headline to Dutch", "Kop naar Nederlands wisselen") : t("Switch headline to English", "Kop naar Engels wisselen")}
            className="flex cursor-pointer gap-1.5 rounded-full bg-ink p-2 shadow-[0_30px_60px_rgba(10,16,34,.35)]"
          >
            <span
              className={`rounded-full px-[clamp(28px,4vw,44px)] py-[22px] text-[34px] font-extrabold transition-colors ${en ? "bg-white text-ink" : "text-[#8A92A6]"}`}
            >
              EN
            </span>
            <span
              className={`rounded-full px-[clamp(28px,4vw,44px)] py-[22px] text-[34px] font-extrabold transition-colors ${en ? "text-[#8A92A6]" : "bg-brand text-white"}`}
            >
              NL
            </span>
          </button>
          <div className="font-mono text-xs tracking-[0.14em]">{t("CLICK TO SWITCH LANGUAGE", "KLIK OM VAN TAAL TE WISSELEN")}</div>
        </div>
      </div>
    </section>
  );
}

export function SpotTheTranslation() {
  const t = useT();
  const wavy = "bg-[#FDE3E3] underline decoration-[#D23B3B] decoration-wavy";
  return (
    <section className="px-6 py-[90px]">
      <div className="mx-auto flex max-w-[1088px] flex-col gap-8">
        <div className={`${mono} text-brand`}>{t("SAME MESSAGE, TWO VERSIONS", "ZELFDE BOODSCHAP, TWEE VERSIES")}</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,360px),1fr))] gap-4">
          <div className="flex flex-col gap-5 rounded-xl border border-[#E3E7EF] bg-white p-8">
            <div className="flex justify-between font-mono text-[11px]">
              <span className="tracking-[0.12em] text-[#C42F2F]">{t("MACHINE TRANSLATED", "MACHINAAL VERTAALD")}</span>
              <span className="text-[#6B7389]">{t("✕ 3 ISSUES", "✕ 3 FOUTEN")}</span>
            </div>
            <p className="text-[28px] leading-[1.2] font-bold tracking-[-0.03em]" lang="nl">
              {marked(
                t(
                  "Wij zijn [[gepassioneerd]] over het leveren van oplossingen die [[uw]] bedrijf [[naar het volgende niveau tillen]].",
                  "Wij zijn [[gepassioneerd]] over het leveren van oplossingen die [[uw]] bedrijf [[naar het volgende niveau tillen]].",
                ),
                wavy,
              )}
            </p>
            <ol className="flex flex-col gap-2 border-t border-[#EEF0F5] pt-[18px] text-sm text-[#4A5268]">
              <li>1 · {t("Big claims without proof read as sales talk.", "Grote beloftes zonder bewijs klinken als verkooppraatjes.")}</li>
              <li>2 · {t("Formal “uw” feels distant for most consumer brands.", "Het formele “uw” voelt afstandelijk voor de meeste consumentenmerken.")}</li>
              <li>3 · {t("A literal English idiom. Nobody says this.", "Een letterlijk vertaalde Engelse uitdrukking. Niemand zegt dit.")}</li>
            </ol>
          </div>
          <div className="flex flex-col gap-5 rounded-xl bg-ink p-8 text-white">
            <div className="flex justify-between font-mono text-[11px] text-brand-pale">
              <span className="tracking-[0.12em]">{t("LOCALISED BY FINLOA", "GELOKALISEERD DOOR FINLOA")}</span>
              <span>{t("✓ READY TO RUN", "✓ KLAAR VOOR GEBRUIK")}</span>
            </div>
            <p className="text-[28px] leading-[1.2] font-bold tracking-[-0.03em]" lang="nl">
              {t(
                "Meer klanten, minder gedoe. Wij regelen je marketing, jij doet waar je goed in bent.",
                "Meer klanten, minder gedoe. Wij regelen je marketing, jij doet waar je goed in bent.",
              )}
            </p>
            <ul className="flex flex-col gap-2 border-t border-white/12 pt-[18px] text-sm text-[#C9D0E0]">
              <li>{t("Direct and plain, the way Dutch buyers talk.", "Direct en helder, zoals Nederlandse kopers praten.")}</li>
              <li>{t("Informal “je” where the brand allows it.", "Informeel “je” waar het merk dat toelaat.")}</li>
              <li>{t("Tested in ads before it goes on your site.", "Getest in advertenties voordat het op je site komt.")}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function DutchSearch() {
  const [kw, setKw] = useState(0);
  const t = useT();
  const keywords = KEYWORDS(t);
  const active = keywords[kw];
  return (
    <section>
      <div className="bg-brand px-6 py-[100px] text-white">
        <div className="mx-auto flex max-w-[1088px] flex-col items-center gap-[26px] text-center">
          <div className={mono}>{t("DUTCH SEO · GOOGLE.NL · AI ANSWERS", "NEDERLANDSE SEO · GOOGLE.NL · AI-ANTWOORDEN")}</div>
          <h2 className="max-w-[960px] text-[clamp(44px,7.5vw,88px)] leading-[0.95] font-extrabold tracking-[-0.06em] text-balance">
            {t("Nobody in Lutjebroek searches in English.", "Niemand in Lutjebroek zoekt in het Engels.")}
          </h2>
          <p className="max-w-[600px] text-lg leading-[1.55]">
            {t(
              "Translating your keywords misses how Dutch people actually search. We research the real terms, then build your pages, ads and content around them.",
              "Als je je zoekwoorden alleen vertaalt, mis je hoe Nederlanders echt zoeken. Wij onderzoeken de termen die ze werkelijk gebruiken en bouwen daar je pagina's, advertenties en content omheen.",
            )}
          </p>
          <div className="mt-3 flex w-full max-w-[760px] items-center justify-between gap-4 rounded-full bg-white py-2.5 pr-2.5 pl-[clamp(18px,4vw,30px)] shadow-[0_30px_60px_rgba(10,16,34,.3)]">
            <div className="flex min-w-0 items-center gap-4">
              <span className="size-3.5 flex-none rounded-full border-[2.5px] border-[#6B7389]" aria-hidden />
              <span className="truncate text-left text-[clamp(17px,2.4vw,24px)] font-semibold tracking-[-0.02em] text-ink" lang="nl" aria-live="polite">
                {active.nl}
              </span>
            </div>
            <span className="flex-none rounded-full bg-ink px-[22px] py-3.5 text-sm font-semibold text-white">{t("Zoeken", "Zoeken")}</span>
          </div>
        </div>
      </div>
      <div className="px-6 py-[90px]">
        <div className="mx-auto grid max-w-[1088px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-12">
          <div className="flex flex-col gap-[18px]">
            <div className={`${mono} text-brand`}>{t("WHAT THEY TYPE", "WAT ZE INTYPEN")}</div>
            <h3 className="text-[clamp(34px,4.5vw,44px)] leading-[1.02] font-extrabold tracking-[-0.04em]">{t("Your keyword vs. their keyword.", "Jouw zoekwoord vs. hun zoekwoord.")}</h3>
            <div className="mt-2.5 flex flex-col gap-2.5 rounded-xl bg-ink p-[26px] text-white">
              <div className="font-mono text-[11px] tracking-[0.12em] text-brand-pale">{t("WHY IT MATTERS", "WAAROM HET ERTOE DOET")}</div>
              <p className="text-[17px] leading-[1.5]">{active.note}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2.5" role="listbox" aria-label={t("Keyword examples", "Voorbeelden van zoekwoorden")}>
            {keywords.map((k, i) => (
              <button
                key={i}
                type="button"
                role="option"
                aria-selected={i === kw}
                onClick={() => setKw(i)}
                className={`grid cursor-pointer grid-cols-[1fr_24px_1fr] items-center gap-3 rounded-xl border bg-white px-[22px] py-[18px] text-left transition-colors hover:border-brand ${
                  i === kw ? "border-brand" : "border-[#E3E7EF]"
                }`}
              >
                <span className="text-[15px] text-[#6B7389]">{k.en}</span>
                <span className="text-brand">→</span>
                <span className="text-[17px] font-bold" lang="nl">
                  {k.nl}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Channels() {
  const t = useT();
  return (
    <section id="channels" className="scroll-mt-16 bg-ink px-6 py-[90px] text-white">
      <div className="mx-auto flex max-w-[1088px] flex-col gap-8">
        <div className={`${mono} text-brand-pale`}>{t("EVERY CHANNEL, IN DUTCH", "ELK KANAAL, IN HET NEDERLANDS")}</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-3.5">
          {CHANNELS(t).map((c) => (
            <Link
              key={c.tag}
              href={c.href}
              className="flex flex-col gap-3 rounded-xl border border-[#1F2846] bg-[#141B33] p-6 text-white transition-colors hover:border-brand hover:text-white"
            >
              <span className="font-mono text-[11px] tracking-[0.12em] text-brand-pale">{c.tag}</span>
              <span className="text-xl leading-[1.2] font-bold tracking-[-0.02em]">{c.title}</span>
              <span className="text-[13px] text-[#C9D0E0]">{t("Explore →", "Ontdek →")}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Route() {
  const t = useT();
  return (
    <section className="px-6 py-[90px]">
      <div className="mx-auto flex max-w-[1088px] flex-col gap-8">
        <div className={`${mono} text-brand`}>{t("THE ROUTE · EXAMPLE", "DE ROUTE · VOORBEELD")}</div>
        <p className="-mt-4 max-w-[640px] text-[17px] leading-[1.5] text-[#4A5268]">
          {t(
            "An example route. Every plan is built around your goals: take the full route, or just the parts you need.",
            "Een voorbeeldroute. Elk plan bouwen we rond jouw doelen: neem de hele route, of alleen de onderdelen die je nodig hebt.",
          )}
        </p>
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,230px),1fr))] gap-y-6">
          {PHASES(t).map((p) => (
            <li key={p.weeks} className="flex flex-col gap-4 pr-5">
              <div className="flex items-center" aria-hidden>
                <span className="size-4 flex-none rounded-full bg-brand shadow-[0_0_0_6px_#DCE5FF]" />
                <span className="ml-3 h-0.5 flex-1 bg-[#C9D5FA]" />
              </div>
              <div className="font-mono text-xs tracking-[0.1em] text-brand">{p.weeks}</div>
              <div className="text-2xl font-extrabold tracking-[-0.03em]">{p.title}</div>
              <ul className="flex flex-col gap-2 rounded-xl border border-[#E3E7EF] bg-white p-[18px]">
                {p.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-[#2A3146]">
                    <span className="text-brand">✓</span>
                    {it}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-[#C3CAD8] px-6 py-[18px]">
          <span className="text-[15px] text-[#4A5268]">
            <strong className="text-ink">{t("Not in scope:", "Valt erbuiten:")}</strong>{" "}
            {t("legal, tax and compliance.", "juridisch, fiscaal en compliance.")}
          </span>
          <span className="font-mono text-xs tracking-[0.1em] text-[#6B7389]">{t("MARKETING ONLY", "ALLEEN MARKETING")}</span>
        </div>
      </div>
    </section>
  );
}

export function DutchVideo() {
  const t = useT();
  return (
    <section
      className="bg-[#EEF2FD] px-6 py-[100px]"
      style={{
        backgroundImage: "linear-gradient(#DFE6FA 1px,transparent 1px),linear-gradient(90deg,#DFE6FA 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    >
      <div className="mx-auto grid max-w-[1088px] grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-14">
        <div className="flex flex-col gap-6">
          <div className={`${mono} text-brand`}>{t("DUTCH VIDEO · SOCIAL · CREATORS", "NEDERLANDSE VIDEO · SOCIAL · CREATORS")}</div>
          <h2 className="text-[clamp(48px,7vw,84px)] leading-[0.92] font-extrabold tracking-[-0.06em]">
            {t("Subtitles aren't", "Ondertiteling is geen")}{" "}
            <span className="text-brand">{t("localisation.", "lokalisatie.")}</span>
          </h2>
          <p className="max-w-[500px] text-lg leading-[1.55] text-[#2A3146]">
            {t(
              "Dutch voice-overs, native creators and captions written for TikTok, Instagram, YouTube and LinkedIn in the Netherlands. We edit, post and grow the channels.",
              "Nederlandse voice-overs, Nederlandse creators en ondertitels geschreven voor TikTok, Instagram, YouTube en LinkedIn in Nederland. Wij monteren, posten en laten de kanalen groeien.",
            )}
          </p>
          <ul className="flex flex-wrap gap-2">
            {CHIPS(t).map((c) => (
              <li key={c} className="rounded-full border border-[#DCE2EE] bg-white px-3.5 py-[7px] text-[13px] font-semibold whitespace-nowrap">
                {c}
              </li>
            ))}
          </ul>
          <div className="flex">
            <Link href="/videos" className="rounded-md bg-ink px-[18px] py-[13px] text-sm font-semibold text-white hover:bg-ink-2 hover:text-white">
              {t("See Dutch video packages →", "Bekijk Nederlandse videopakketten →")}
            </Link>
          </div>
        </div>
        <div className="relative mx-auto h-[520px] w-full max-w-[520px] max-[520px]:h-[460px]" aria-hidden>
          <div
            className="absolute top-10 left-0 h-[250px] w-[76%] rounded-[14px] border-[6px] border-ink bg-ink shadow-[0_30px_60px_rgba(10,16,34,.3)]"
            style={{ backgroundImage: "radial-gradient(ellipse at 35% 45%,#2f6bff,transparent 65%)" }}
          >
            <div className="absolute top-3 left-3.5 rounded bg-white/15 px-2 py-1 font-mono text-[10px] tracking-[0.1em] text-white">{t("YOUTUBE · VOICE-OVER NL", "YOUTUBE · VOICE-OVER NL")}</div>
            <div className="absolute right-0 bottom-[22px] left-0 text-center">
              <span className="rounded bg-black/75 px-2.5 py-1.5 text-[15px] font-semibold text-white" lang="nl">
                {t("Zo bespaar je elke week twee uur.", "Zo bespaar je elke week twee uur.")}
              </span>
            </div>
          </div>
          <div
            className="absolute top-0 right-0 h-[370px] w-[200px] animate-[floaty_5s_ease-in-out_infinite] rounded-3xl border-[6px] border-ink bg-brand shadow-[0_30px_60px_rgba(10,16,34,.35)] max-[520px]:w-[160px]"
            style={{ backgroundImage: "radial-gradient(ellipse at 50% 30%,#7FA0FF,transparent 60%)" }}
          >
            <div className="absolute top-3.5 left-3 font-mono text-[10px] tracking-[0.1em] text-white">{t("TIKTOK · NL CREATOR", "TIKTOK · NL CREATOR")}</div>
            <div className="absolute right-3 bottom-[60px] left-3 text-center">
              <span className="rounded bg-white px-2 py-1.5 text-base leading-[1.6] font-extrabold text-ink [box-decoration-break:clone]" lang="nl">
                {t("eerlijk? dit had ik eerder moeten kopen", "eerlijk? dit had ik eerder moeten kopen")}
              </span>
            </div>
          </div>
          <div className="absolute bottom-0 left-[12%] flex w-[320px] max-w-[88%] items-center gap-3 rounded-xl border border-[#DCE2EE] bg-white px-[18px] py-4 shadow-[0_20px_40px_rgba(10,16,34,.12)]">
            <span className="size-10 flex-none rounded-full bg-[#DCE5FF]" />
            <div className="flex flex-col gap-[3px]">
              <span className="text-[13px] font-bold" lang="nl">
                {t("Reacties in het Nederlands", "Reacties in het Nederlands")}
              </span>
              <span className="text-[13px] text-[#4A5268]">{t("Community managed by native speakers", "Community beheerd door moedertaalsprekers")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const input =
  "w-full rounded-lg border border-[#DCE2EE] bg-white px-3.5 py-[13px] text-[15px] text-ink outline-none transition-colors focus:border-brand aria-[invalid=true]:border-red-400";

export function NlContact() {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});
  const [error, setError] = useState("");
  const t = useT();
  const locale = useLocale();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const get = (k: string) => String(f.get(k) ?? "").trim();
    const [firstName, ...rest] = get("name").split(/\s+/);
    setState("sending");
    setErrors({});
    setError("");
    try {
      await submitLead({
        source: "netherlands",
        firstName: firstName ?? "",
        lastName: rest.join(" ") || "–",
        email: get("email"),
        company: get("company") || undefined,
        website: get("website") || undefined,
        message: get("message") || undefined,
        platforms: [],
        companyFax: get("companyFax") || undefined,
      });
      setState("done");
    } catch (err) {
      const apiErr = err as Partial<ApiError>;
      const details = apiErr.details ?? {};
      const all = { ...details, name: details.firstName ?? details.lastName };
      // API messages are English; on the Dutch site show a Dutch hint per field
      setErrors(
        locale === "nl"
          ? Object.fromEntries(Object.entries(all).map(([k, v]) => [k, v ? ["Controleer dit veld."] : undefined]))
          : all,
      );
      setError(
        typeof apiErr.error === "string" && !apiErr.details
          ? locale === "nl"
            ? "Versturen is niet gelukt. Probeer het opnieuw."
            : apiErr.error
          : "",
      );
      setState("idle");
    }
  }

  return (
    <section id="contact" className="scroll-mt-16 px-6 py-[90px]">
      <div className="mx-auto grid max-w-[1088px] grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-start gap-12 rounded-2xl bg-brand p-[clamp(24px,5vw,56px)] text-white">
        <div className="flex flex-col gap-7">
          <div className={mono}>{t("CONTACT", "CONTACT")}</div>
          <h2 className="text-[clamp(36px,4.5vw,52px)] leading-none font-extrabold tracking-[-0.05em]">
            {t("You have the product. We'll make it Dutch.", "Jij hebt het product. Wij maken het Nederlands.")}
          </h2>
          <div className="flex max-w-[380px] items-center gap-4 rounded-xl bg-ink/18 p-4">
            <span className="flex size-16 flex-none items-center justify-center rounded-full bg-white text-xl font-bold text-brand">{t("AG", "AG")}</span>
            <div className="flex flex-col gap-1">
              <span className="text-[17px] font-bold">{t("Alexander van Gog", "Alexander van Gog")}</span>
              <span className="text-sm">{t("Founder, Finloa", "Oprichter, Finloa")}</span>
            </div>
          </div>
        </div>

        {state === "done" ? (
          <div className="flex flex-col gap-3 rounded-xl bg-white p-7 text-ink" role="status">
            <div className="text-2xl font-extrabold tracking-[-0.03em]">{t("Bedankt! Thanks.", "Bedankt!")}</div>
            <p className="text-[15px] leading-[1.55] text-[#4A5268]">
              {t(
                "We've got your message and will reply within one working day.",
                "We hebben je bericht ontvangen en reageren binnen één werkdag.",
              )}
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4 rounded-xl bg-white p-7 text-ink">
            <input type="text" name="companyFax" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
              <label className="flex flex-col gap-2 text-[13px] font-semibold">
                {t("Name", "Naam")}
                <input name="name" required autoComplete="name" placeholder={t("Your name", "Je naam")} className={input} aria-invalid={!!errors.name} />
                {errors.name && <span className="text-[13px] font-normal text-red-500">{errors.name[0]}</span>}
              </label>
              <label className="flex flex-col gap-2 text-[13px] font-semibold">
                {t("Company", "Bedrijf")}
                <input name="company" autoComplete="organization" placeholder={t("Company name", "Bedrijfsnaam")} className={input} />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              {t("Email", "E-mailadres")}
              <input name="email" type="email" required autoComplete="email" placeholder={t("you@company.com", "jij@bedrijf.nl")} className={input} aria-invalid={!!errors.email} />
              {errors.email && <span className="text-[13px] font-normal text-red-500">{errors.email[0]}</span>}
            </label>
            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              {t("Website", "Website")}
              <input name="website" autoComplete="url" placeholder={t("www.yourcompany.com", "www.jouwbedrijf.nl")} className={input} aria-invalid={!!errors.website} />
              {errors.website && <span className="text-[13px] font-normal text-red-500">{errors.website[0]}</span>}
            </label>
            <label className="flex flex-col gap-2 text-[13px] font-semibold">
              {t("What do you want to achieve in the Netherlands?", "Wat wil je bereiken in Nederland?")}
              <textarea name="message" rows={4} placeholder={t("Tell us about your goals", "Vertel ons over je doelen")} className={`${input} resize-y`} />
            </label>
            {error && (
              <p className="text-[13px] text-red-500" role="alert">
                {error}
              </p>
            )}
            <div className="flex">
              <button
                type="submit"
                disabled={state === "sending"}
                className="cursor-pointer rounded-md bg-ink px-[18px] py-[13px] text-sm font-semibold text-white hover:bg-ink-2 disabled:opacity-70"
              >
                {state === "sending" ? t("Sending…", "Versturen…") : t("Send message →", "Verstuur bericht →")}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
