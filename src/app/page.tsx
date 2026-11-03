import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { GoalPicker } from "@/components/goal-picker";
import { PageShell } from "@/components/page-shell";
import { Eyebrow } from "@/components/ui";
import { getVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Finloa — We grow brands and audiences",
  description:
    "Built to deliver revenue. Strategy, websites, video, marketing and new income streams from one team, for creators and businesses of every size.",
};

const reasons = [
  ["We know your market", "We learn your niche, your audience and what they buy before we build anything."],
  ["We're flexible", "Packages, commission or a custom plan. Pick what fits your budget and stage."],
  ["We focus on results", "Every project starts with a revenue goal and is measured against it after launch."],
  ["One team, together", "Strategy, design, build and marketing work as one team with a named lead."],
];

const industries = [
  "Software & Learning",
  "Property & Home",
  "Health & Wellness",
  "Professional Services",
  "Retail & E-commerce",
  "Hospitality & Lifestyle",
];

const services = [
  { id: "seo", href: "/seo", tag: "SEO", title: "Get found on Google and in AI answers.", cta: "Explore SEO →" },
  { id: "content", href: "/content-marketing", tag: "Content marketing", title: "Content that builds authority.", cta: "Explore content marketing →" },
  { id: "paid", href: "/paid-media", tag: "Paid media", title: "Make every ad dollar count.", cta: "Explore paid media →" },
  { id: "ai", href: "/ai-marketing", tag: "AI marketing", title: "An AI marketing system that drives revenue.", cta: "Explore AI marketing →" },
];

const paths = [
  {
    href: "/for-creators",
    eyebrow: "FOR CREATORS",
    title: "Turn your audience into income",
    body: "For YouTube channels, podcasts, newsletters and social accounts that want to earn more than ad and sponsor revenue.",
  },
  {
    href: "/video-creation",
    eyebrow: "FOR BUSINESSES",
    title: "Grow what already works",
    body: "For small, mid-size and established companies ready for a better website and new revenue beyond their core offer.",
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

export default async function LandingPage() {
  const videos = await getVideos();
  const reel = videos.find((v) => v.niche === "showreel" && v.kind === "LONG");

  return (
    <PageShell brandHeader ctaLabel="Plan Your Growth" ctaHref="#goals">
      <div className="overflow-x-clip">
        {/* ---------- Hero ---------- */}
        <section className="relative bg-brand px-6 pt-[clamp(40px,6vw,80px)] text-white">
          <div className="pointer-events-none absolute inset-0" style={grid("rgba(255,255,255,.07)")} aria-hidden />
          <div className="relative mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,460px),1fr))] items-end gap-[clamp(40px,5vw,64px)]">
            <div className="flex flex-col gap-[26px] pb-[clamp(40px,8vw,140px)]">
              <span className="font-mono text-[13px] tracking-[0.08em]">SIMPLE · FLEXIBLE · REVENUE-DRIVEN</span>
              <h1 className="text-[clamp(48px,7.4vw,92px)] leading-[0.98] font-extrabold tracking-[-0.05em] text-balance">
                We grow brands and audiences.
              </h1>
              <p className="max-w-[500px] text-[clamp(17px,1.6vw,20px)] leading-normal text-pretty">
                Built to deliver revenue. Strategy, websites, marketing and new income streams from one team, for
                creators and businesses of every size.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="mailto:info@finloa.com"
                  className="whitespace-nowrap rounded-[11px] bg-ink px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-ink-2"
                >
                  Contact Us →
                </a>
                <a
                  href="#goals"
                  className="whitespace-nowrap rounded-[11px] border border-white/60 px-[22px] py-[13px] text-[15.5px] font-medium text-white transition-colors hover:bg-white/12"
                >
                  What&apos;s your goal?
                </a>
              </div>
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
                    title="Finloa showreel"
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
                <span className="mr-2 font-mono text-xs text-brand-pale">02</span>Video creation
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Why Finloa ---------- */}
        <section className="px-6 pt-[clamp(56px,6vw,88px)] pb-[clamp(64px,8vw,96px)]">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-10">
            <div className="flex max-w-[720px] flex-col gap-3.5">
              <Eyebrow>Why Finloa</Eyebrow>
              <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
                What sets us apart.
              </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-4">
              {reasons.map(([title, body], i) => (
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
        <div className="overflow-hidden bg-ink py-[26px] text-white" aria-label="Industries we work with">
          <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-11 text-[clamp(20px,2.2vw,26px)] font-semibold tracking-[-0.02em] whitespace-nowrap">
            {[...industries, ...industries].map((name, i) => (
              <span key={i} className="flex gap-11" aria-hidden={i >= industries.length}>
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
              <Eyebrow>Your goal</Eyebrow>
              <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
                Tell us where you want to go. We&apos;ll map the route.
              </h2>
            </div>
            <GoalPicker />
          </div>
        </section>

        {/* ---------- Services ---------- */}
        <section id="services" className="scroll-mt-20 bg-ink px-6 py-[clamp(72px,9vw,104px)] text-white">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-8">
            <div className="flex max-w-[720px] flex-col gap-3.5">
              <div className="eyebrow text-brand-pale!">Services</div>
              <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance text-white">
                Ways we grow your business.
              </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
              {services.map((s) => (
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
              <div className="font-mono text-[13px] tracking-[0.08em] text-brand">VIDEO CREATION &amp; SOCIAL GROWTH</div>
              <h2 className="text-[clamp(36px,5vw,62px)] leading-[1.02] font-extrabold tracking-[-0.05em] text-balance">
                Affordable videos that <span className="text-brand">grow your audience.</span>
              </h2>
              <p className="max-w-[500px] text-lg leading-[1.55] text-pretty text-muted">
                Professional videos for YouTube, TikTok, Instagram and LinkedIn at a clear price. We edit, optimise and
                post so your channels keep growing.
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
                  href="/video-creation"
                  className="whitespace-nowrap rounded-[11px] bg-ink px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-ink-2 hover:text-white"
                >
                  See video packages →
                </Link>
                <span className="text-[15px] text-muted">
                  From <strong className="font-bold text-ink">$299</strong>/month
                </span>
              </div>
            </div>

            <div className="relative min-h-[clamp(380px,44vw,520px)]" aria-hidden>
              <div className="absolute top-[6%] left-0 aspect-video w-[78%] overflow-hidden rounded-[18px] border-[6px] border-ink bg-ink shadow-[0_40px_70px_-30px_rgba(11,16,32,.55)]">
                <div
                  className="absolute -inset-[30%] animate-[drift_9s_ease-in-out_infinite_alternate]"
                  style={glow("#2F6BFF", "rgba(126,162,255,.55)", "#111832")}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <Play size={64} tri={[18, 11]} offset={5} />
                </div>
                <span className="absolute top-3.5 left-4 rounded-md bg-white/14 px-[9px] py-[5px] font-mono text-[11.5px] tracking-[0.08em] text-white">
                  YOUTUBE · LONG-FORM
                </span>
                <div className="absolute right-4 bottom-3.5 left-4 h-1 overflow-hidden rounded bg-white/20">
                  <div className="h-full animate-[track_7s_ease-in-out_infinite] bg-brand" />
                </div>
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
              </div>

              <div className="absolute bottom-[4%] left-[6%] flex gap-1.5 rounded-[14px] border border-[oklch(0.9_0.02_265)] bg-white p-1.5 shadow-[0_20px_40px_-24px_rgba(11,16,32,.45)]">
                <span className="rounded-[9px] bg-ink px-[13px] py-[9px] text-sm font-semibold text-white">Edit</span>
                <span className="rounded-[9px] bg-brand px-[13px] py-[9px] text-sm font-semibold text-white">Optimise</span>
                <span className="rounded-[9px] bg-[#EEF3FF] px-[13px] py-[9px] text-sm font-semibold text-ink">Post</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- Solutions ---------- */}
        <section id="paths" className="scroll-mt-20 px-6 pt-[clamp(64px,8vw,96px)] pb-6">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-11">
            <div className="flex max-w-[720px] flex-col gap-3.5">
              <Eyebrow>Solutions</Eyebrow>
              <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
                Growth that scales with you.
              </h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-4">
              {paths.map((p) => (
                <Link
                  key={p.eyebrow}
                  href={p.href}
                  className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-8 text-ink transition-colors hover:border-brand hover:text-ink"
                >
                  <div className="font-mono text-[12.5px] tracking-[0.04em] text-brand">{p.eyebrow}</div>
                  <h3 className="text-2xl font-semibold tracking-[-0.02em]">{p.title}</h3>
                  <p className="text-[15px] leading-[1.55] text-muted">{p.body}</p>
                  <span className="mt-2 text-[15px] font-medium text-brand">Explore →</span>
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
              You have the vision. We have the team to get you there.
            </h2>
            <a
              href="mailto:info@finloa.com"
              className="relative whitespace-nowrap rounded-[11px] bg-ink px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-ink-2 hover:text-white"
            >
              Contact Us →
            </a>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
