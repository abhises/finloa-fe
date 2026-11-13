import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ContactSection } from "@/components/contact-section";
import { GoalPicker } from "@/components/goal-picker";
import { PageShell } from "@/components/page-shell";
import { Eyebrow } from "@/components/ui";
import { getVideos } from "@/lib/data";
import { EmailSignup } from "@/components/email-signup";
import type { T } from "@/i18n/config";
import { getT, pageMetadata } from "@/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata(
    "",
    ["Finloa — We grow brands and audiences", "Finloa — Wij laten merken en publiek groeien"],
    [
      "Built to deliver revenue. Strategy, websites, video, marketing and new income streams from one team, for creators and businesses of every size.",
      "Gebouwd om omzet op te leveren. Strategie, websites, video, marketing en nieuwe inkomstenbronnen van één team, voor creators en bedrijven van elke omvang.",
    ],
  );
}

const reasons = (t: T) => [
  [
    t("We know your market", "Wij kennen je markt"),
    t(
      "We learn your niche, your audience and what they buy before we build anything.",
      "We verdiepen ons in je niche, je doelgroep en wat zij kopen voordat we iets bouwen.",
    ),
  ],
  [
    t("We're flexible", "Wij zijn flexibel"),
    t(
      "Packages, commission or a custom plan. Pick what fits your budget and stage.",
      "Pakketten, commissie of een plan op maat. Kies wat past bij je budget en fase.",
    ),
  ],
  [
    t("We focus on results", "Wij sturen op resultaat"),
    t(
      "Every project starts with a revenue goal and is measured against it after launch.",
      "Elk project begint met een omzetdoel en na de lancering meten we daartegen af.",
    ),
  ],
  [
    t("One team, together", "Eén team, samen"),
    t(
      "Strategy, design, build and marketing work as one team with a named lead.",
      "Strategie, design, development en marketing werken als één team, met één vast aanspreekpunt.",
    ),
  ],
];

const industries = (t: T) => [
  t("Software & Learning", "Software & onderwijs"),
  t("Property & Home", "Vastgoed & wonen"),
  t("Health & Wellness", "Gezondheid & welzijn"),
  t("Professional Services", "Zakelijke dienstverlening"),
  t("Retail & E-commerce", "Retail & e-commerce"),
  t("Hospitality & Lifestyle", "Horeca & lifestyle"),
];

const services = (t: T) => [
  {
    id: "seo",
    href: "/seo",
    tag: "SEO",
    title: t("Get found on Google and in AI answers.", "Word gevonden in Google en in AI-antwoorden."),
    cta: t("Explore SEO →", "Bekijk SEO →"),
  },
  {
    id: "content",
    href: "/content-marketing",
    tag: t("Content marketing", "Contentmarketing"),
    title: t("Content that builds authority.", "Content die autoriteit opbouwt."),
    cta: t("Explore content marketing →", "Bekijk contentmarketing →"),
  },
  {
    id: "paid",
    href: "/paid-media",
    tag: t("Paid media", "Betaalde media"),
    title: t("Make every ad dollar count.", "Haal alles uit elke advertentie-euro."),
    cta: t("Explore paid media →", "Bekijk betaalde media →"),
  },
  {
    id: "ai",
    href: "/ai-marketing",
    tag: t("AI marketing", "AI-marketing"),
    title: t("An AI marketing system that drives revenue.", "Een AI-marketingsysteem dat omzet oplevert."),
    cta: t("Explore AI marketing →", "Bekijk AI-marketing →"),
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
      "For small, mid-size and established companies ready for a better website and new revenue beyond their core offer.",
      "Voor kleine, middelgrote en gevestigde bedrijven die klaar zijn voor een betere website en nieuwe omzet naast hun kernaanbod.",
    ),
  },
];

/** Blue/light grid overlay used on several sections */
const grid = (color: string, size = 70): CSSProperties => ({
  backgroundImage: `linear-gradient(${color} 1px,transparent 1px),linear-gradient(90deg,${color} 1px,transparent 1px)`,
  backgroundSize: `${size}px ${size}px`,
});

/** Animated gradient "video" surface */
const glow = (a: string, b: string, base: string): CSSProperties => ({
  background: `radial-gradient(40% 35% at 35% 35%,${a},transparent 70%),radial-gradient(35% 30% at 65% 70%,${b},transparent 70%),${base}`,
});

function Play({ size, tri, offset }: { size: number; tri: [number, number]; offset: number }) {
  return (
    <div className="flex items-center justify-center rounded-full bg-white" style={{ width: size, height: size }}>
      <div
        className="h-0 w-0"
        style={{
          borderLeft: `${tri[0]}px solid #0B1020`,
          borderTop: `${tri[1]}px solid transparent`,
          borderBottom: `${tri[1]}px solid transparent`,
          marginLeft: offset,
        }}
      />
    </div>
  );
}

/** YouTube player filling its (positioned) parent frame; works for long-form videos and Shorts */
function Embed({ id, title }: { id: string; title: string }) {
  return (
    <iframe
      src={`https://www.youtube.com/embed/${id}?rel=0&playsinline=1`}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 size-full border-0"
    />
  );
}

export default async function LandingPage() {
  const videos = await getVideos();
  const reel = videos.find((v) => v.niche === "showreel" && v.kind === "LONG");
  const homeLong = videos.find((v) => v.niche === "home-video" && v.kind === "LONG");
  const [homeShortA, homeShortB] = videos.filter((v) => v.niche === "home-video" && v.kind === "SHORT");
  const t = await getT();

  return (
    <PageShell brandHeader ctaLabel={t("Plan Your Growth", "Plan je groei")} ctaHref="#goals">
      <div className="overflow-x-clip">
        {/* ---------- Hero ---------- */}
        <section className="relative bg-brand px-6 pt-[clamp(40px,6vw,80px)] text-white">
          <div className="pointer-events-none absolute inset-0" style={grid("rgba(255,255,255,.07)")} aria-hidden />
          <div className="relative mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-[clamp(40px,5vw,64px)]">
            <div className="flex flex-col gap-[26px] pb-[clamp(40px,8vw,140px)]">
              <span className="font-mono text-[11px] tracking-[0.06em] whitespace-nowrap min-[400px]:text-[12px] sm:text-[13px] sm:tracking-[0.08em]">{t("SIMPLE · FLEXIBLE · REVENUE-DRIVEN", "SIMPEL · FLEXIBEL · GERICHT OP OMZET")}</span>
              <h1 className="text-[clamp(48px,7.4vw,92px)] leading-[0.98] font-extrabold tracking-[-0.05em] text-balance">
                {t("We grow brands and audiences.", "Wij laten merken en publiek groeien.")}
              </h1>
              <p className="max-w-[500px] text-[clamp(17px,1.6vw,20px)] leading-normal text-pretty">
                {t(
                  "Built to deliver revenue. Strategy, websites, marketing and new income streams from one team, for creators and businesses of every size.",
                  "Gebouwd om omzet op te leveren. Strategie, websites, marketing en nieuwe inkomstenbronnen van één team, voor creators en bedrijven van elke omvang.",
                )}
              </p>
              <EmailSignup source="home" cta={t("Get started →", "Aan de slag →")} tone="brand" align="start" />
            </div>

            <div className="relative z-[2] mt-11 mb-[clamp(-100px,-6vw,-40px)] w-[calc(100%+clamp(0px,5vw,80px))] self-start max-[1019px]:w-full">
              <div className="relative aspect-[16/10] -rotate-3 overflow-hidden rounded-[22px] border-8 border-ink bg-ink shadow-[0_50px_80px_-30px_rgba(11,16,32,.6)]">
                <div
                  className="absolute -inset-[20%] animate-[drift_8s_ease-in-out_infinite_alternate]"
                  style={{
                    background:
                      "radial-gradient(40% 40% at 30% 40%,#2F6BFF,transparent 70%),radial-gradient(35% 35% at 72% 62%,rgba(126,162,255,.55),transparent 70%),#111832",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-[pulse-ring_1.8s_ease-out_infinite] rounded-full">
                    <Play size={84} tri={[22, 13]} offset={6} />
                  </div>
                </div>
                <span className="absolute bottom-4 left-5 font-mono text-xs tracking-[0.08em] text-white">SHOWREEL</span>
                {reel && (
                  <iframe
                    src={`https://www.youtube.com/embed/${reel.youtubeId}?rel=0`}
                    title={t("Finloa showreel", "Finloa-showreel")}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 size-full border-0"
                  />
                )}
              </div>
              <div className="absolute -top-[18px] -left-3.5 -rotate-3 animate-[floaty_4s_ease-in-out_infinite] rounded-xl bg-white px-[15px] py-[11px] text-[15px] font-semibold text-ink shadow-[0_16px_30px_-18px_rgba(11,16,32,.5)]">
                <span className="mr-2 font-mono text-xs text-brand">01</span>SEO
              </div>
              <div className="absolute right-[-10px] bottom-[24%] animate-[floaty_5s_ease-in-out_infinite_.8s] rounded-xl bg-ink px-[15px] py-[11px] text-[15px] font-semibold text-white shadow-[0_16px_30px_-18px_rgba(11,16,32,.6)] max-[520px]:right-0">
                <span className="mr-2 font-mono text-xs text-brand-pale">02</span>{t("Video creation", "Videoproductie")}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Why Finloa ---------- */}
        <section className="px-6 pt-[clamp(56px,6vw,88px)] pb-[clamp(64px,8vw,96px)]">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
            <div className="flex max-w-[720px] flex-col gap-3.5">
              <Eyebrow>{t("Why Finloa", "Waarom Finloa")}</Eyebrow>
              <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
                {t("What sets us apart.", "Wat ons onderscheidt.")}
              </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-4">
              {reasons(t).map(([title, body], i) => (
                <div
                  key={title}
                  className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-7 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-[0_24px_40px_-28px_rgba(47,107,255,.55)]"
                >
                  <span className="flex size-[38px] items-center justify-center rounded-[10px] bg-brand font-mono text-[13px] text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{title}</h3>
                  <p className="text-[15px] leading-[1.55] text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Industry ticker ---------- */}
        <div className="overflow-hidden bg-ink py-[26px] text-white" aria-label={t("Industries we work with", "Branches waarin we werken")}>
          <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-11 text-[clamp(20px,2.2vw,26px)] font-semibold tracking-[-0.02em] whitespace-nowrap">
            {[...industries(t), ...industries(t)].map((name, i) => (
              <span key={i} className="flex gap-11" aria-hidden={i >= industries(t).length}>
                <span>{name}</span>
                <span className="text-brand">●</span>
              </span>
            ))}
          </div>
        </div>

        {/* ---------- Goals ---------- */}
        <section id="goals" className="scroll-mt-20 px-6 py-[clamp(64px,8vw,96px)]">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-8">
            <div className="flex max-w-[720px] flex-col gap-3.5">
              <Eyebrow>{t("Your goal", "Jouw doel")}</Eyebrow>
              <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
                {t("Tell us where you want to go. We'll map the route.", "Vertel ons waar je naartoe wilt. Wij stippelen de route uit.")}
              </h2>
            </div>
            <GoalPicker />
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section id="services" className="scroll-mt-20 bg-ink px-6 py-[clamp(72px,9vw,104px)] text-white">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-8">
            <div className="flex max-w-[720px] flex-col gap-3.5">
              <div className="eyebrow text-brand-pale!">{t("Services", "Diensten")}</div>
              <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance text-white">
                {t("Ways we grow your business.", "Zo laten wij je bedrijf groeien.")}
              </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
              {services(t).map((s) => (
                <Link
                  key={s.id}
                  id={s.id}
                  href={s.href}
                  className="flex flex-col gap-3 rounded-2xl border border-[#232B45] bg-[#141A2E] px-6 py-7 text-white transition-colors duration-200 hover:border-brand hover:bg-[#1A2240] hover:text-white"
                >
                  <span className="font-mono text-[12.5px] tracking-[0.08em] text-brand-pale uppercase">{s.tag}</span>
                  <h3 className="text-[19px] leading-[1.25] font-semibold tracking-[-0.02em] text-balance">{s.title}</h3>
                  <span className="mt-auto pt-2 text-[14.5px] font-medium text-[#C9D3EE]">{s.cta}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Video creation teaser ---------- */}
        <section id="video" className="relative scroll-mt-20 overflow-hidden bg-[#EEF3FF] px-6 py-[clamp(72px,9vw,112px)]">
          <div className="pointer-events-none absolute inset-0" style={grid("rgba(47,107,255,.08)")} aria-hidden />
          <div className="relative mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] items-center gap-[clamp(48px,6vw,80px)]">
            <div className="flex flex-col gap-[22px]">
              <div className="font-mono text-[13px] tracking-[0.08em] text-brand">{t("VIDEO CREATION & SOCIAL GROWTH", "VIDEOPRODUCTIE & SOCIALE GROEI")}</div>
              <h2 className="text-[clamp(36px,5vw,62px)] leading-[1.02] font-extrabold tracking-[-0.05em] text-balance">
                {t("Affordable videos that", "Betaalbare video's die")}{" "}
                <span className="text-brand">{t("grow your audience.", "je publiek laten groeien.")}</span>
              </h2>
              <p className="max-w-[500px] text-lg leading-[1.55] text-pretty text-muted">
                {t(
                  "Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear price. We edit, optimise and post so your channels keep growing.",
                  "Professionele video's voor YouTube, TikTok, Instagram en LinkedIn voor een heldere prijs. Wij monteren, optimaliseren en posten, zodat je kanalen blijven groeien.",
                )}
              </p>
              <ul className="flex flex-wrap gap-2">
                {["YouTube", "TikTok", "Instagram", "LinkedIn"].map((p) => (
                  <li
                    key={p}
                    className="rounded-full border border-[oklch(0.9_0.02_265)] bg-white px-3.5 py-2 text-[14.5px] font-medium"
                  >
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-1.5 flex flex-wrap items-center gap-5">
                <Link
                  href="/videos"
                  className="whitespace-nowrap rounded-[11px] bg-ink px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-ink-2 hover:text-white"
                >
                  {t("See video packages →", "Bekijk videopakketten →")}
                </Link>
                <span className="text-[15px] text-muted">
                  {t("From", "Vanaf")} <strong className="font-bold text-ink">$299</strong>
                  {t("/month", " per maand")}
                </span>
              </div>
            </div>

            <div className="relative min-h-[clamp(380px,44vw,520px)]" aria-hidden={!homeLong && !homeShortA && !homeShortB}>
              <div className="absolute top-[6%] left-0 aspect-video w-[78%] overflow-hidden rounded-[18px] border-[6px] border-ink bg-ink shadow-[0_40px_70px_-30px_rgba(11,16,32,.55)]">
                <div
                  className="absolute -inset-[30%] animate-[drift_9s_ease-in-out_infinite_alternate]"
                  style={glow("#2F6BFF", "rgba(126,162,255,.55)", "#111832")}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Play size={64} tri={[18, 11]} offset={5} />
                </div>
                <span className="absolute top-3.5 left-4 rounded-md bg-white/14 px-[9px] py-[5px] font-mono text-[11.5px] tracking-[0.08em] text-white">
                  {t("YOUTUBE · LONG-FORM", "YOUTUBE · LANGE VIDEO")}
                </span>
                <div className="absolute right-4 bottom-3.5 left-4 h-1 overflow-hidden rounded bg-white/20">
                  <div className="h-full animate-[track_7s_ease-in-out_infinite] bg-brand" />
                </div>
                {homeLong && <Embed id={homeLong.youtubeId} title={homeLong.title ?? t("Finloa video", "Finloa-video")} />}
              </div>

              <div className="absolute right-[16%] bottom-0 aspect-[9/16] w-[26%] animate-[floaty_5s_ease-in-out_infinite] overflow-hidden rounded-[22px] border-[5px] border-ink bg-ink shadow-[0_40px_60px_-24px_rgba(11,16,32,.6)]">
                <div
                  className="absolute -inset-[30%] animate-[drift_7s_ease-in-out_infinite_alternate]"
                  style={glow("#2F6BFF", "rgba(126,162,255,.55)", "#111832")}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Play size={42} tri={[12, 7]} offset={3} />
                </div>
                <span className="absolute top-2.5 left-2.5 font-mono text-[10.5px] tracking-[0.06em] text-white">TIKTOK</span>
                {homeShortA && <Embed id={homeShortA.youtubeId} title={homeShortA.title ?? t("Finloa short", "Finloa-short")} />}
              </div>

              <div className="absolute top-[20%] right-0 aspect-[9/16] w-[24%] animate-[floaty_6s_ease-in-out_infinite_1s] overflow-hidden rounded-[22px] border-[5px] border-ink bg-brand shadow-[0_40px_60px_-24px_rgba(11,16,32,.6)]">
                <div
                  className="absolute -inset-[30%] animate-[drift_6s_ease-in-out_infinite_alternate]"
                  style={{ background: "radial-gradient(45% 35% at 50% 35%,#9FB9FF,transparent 70%)" }}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Play size={40} tri={[11, 7]} offset={3} />
                </div>
                <span className="absolute top-2.5 left-2.5 font-mono text-[10.5px] tracking-[0.06em] text-white">SHORTS</span>
                {homeShortB && <Embed id={homeShortB.youtubeId} title={homeShortB.title ?? t("Finloa short", "Finloa-short")} />}
              </div>

              <div className="absolute bottom-[4%] left-[6%] flex gap-1.5 rounded-[14px] border border-[oklch(0.9_0.02_265)] bg-white p-1.5 shadow-[0_20px_40px_-24px_rgba(11,16,32,.45)]">
                <span className="rounded-[9px] bg-ink px-[13px] py-[9px] text-sm font-semibold text-white">{t("Edit", "Monteren")}</span>
                <span className="rounded-[9px] bg-brand px-[13px] py-[9px] text-sm font-semibold text-white">{t("Optimise", "Optimaliseren")}</span>
                <span className="rounded-[9px] bg-[#EEF3FF] px-[13px] py-[9px] text-sm font-semibold text-ink">{t("Post", "Posten")}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Solutions ---------- */}
        <section id="paths" className="scroll-mt-20 px-6 pt-[clamp(64px,8vw,96px)] pb-6">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-11">
            <div className="flex max-w-[720px] flex-col gap-3.5">
              <Eyebrow>{t("Solutions", "Oplossingen")}</Eyebrow>
              <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
                {t("Growth that scales with you.", "Groei die met je meeschaalt.")}
              </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
              {paths(t).map((p) => (
                <Link
                  key={p.eyebrow}
                  href={p.href}
                  className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-8 text-ink transition-colors hover:border-brand hover:text-ink"
                >
                  <div className="font-mono text-[12.5px] tracking-[0.04em] text-brand">{p.eyebrow}</div>
                  <h3 className="text-2xl font-semibold tracking-[-0.02em]">{p.title}</h3>
                  <p className="text-[15px] leading-[1.55] text-muted">{p.body}</p>
                  <span className="mt-2 text-[15px] font-medium text-brand">{t("Explore →", "Ontdek →")}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="px-6 pt-[clamp(24px,3vw,32px)] pb-[clamp(56px,7vw,88px)]">
          <div className="relative mx-auto flex max-w-[1180px] flex-wrap items-end justify-between gap-7 overflow-hidden rounded-3xl bg-brand px-[clamp(28px,5vw,64px)] py-[clamp(40px,6vw,72px)] text-white">
            <div className="pointer-events-none absolute inset-0" style={grid("rgba(255,255,255,.08)", 56)} aria-hidden />
            <h2 className="relative max-w-[720px] text-[clamp(32px,4.4vw,54px)] leading-[1.04] font-extrabold tracking-[-0.045em] text-balance">
              {t(
                "You have the vision. We have the team to get you there.",
                "Jij hebt de visie. Wij hebben het team om je daar te krijgen.",
              )}
            </h2>
            <a
              href="#contact"
              className="relative whitespace-nowrap rounded-[11px] bg-ink px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-ink-2 hover:text-white"
            >
              {t("Contact Us →", "Neem contact op →")}
            </a>
          </div>
        </section>
      </div>
      <ContactSection
        source="home"
        intro={t(
          "Share your goals and challenges. We'll come back with a plan for where to start.",
          "Vertel ons over je doelen en uitdagingen. Wij komen terug met een plan voor waar je het best kunt beginnen.",
        )}
        fourthField={{ name: "website", placeholder: t("Website", "Website") }}
      />
    </PageShell>
  );
}
