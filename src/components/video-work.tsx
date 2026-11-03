"use client";

import { useState } from "react";
import type { PortfolioVideo } from "@/lib/api";

export const NICHES = [
  { slug: "software-learning", name: "Software & Learning" },
  { slug: "property-home", name: "Property & Home" },
  { slug: "health-wellness", name: "Health & Wellness" },
  { slug: "professional-services", name: "Professional Services" },
  { slug: "retail-ecommerce", name: "Retail & E-commerce" },
  { slug: "hospitality-lifestyle", name: "Hospitality & Lifestyle" },
] as const;

const SLOTS = 4;
const pad = (n: number) => String(n + 1).padStart(2, "0");
const thumb = (id?: string) => (id ? `url(https://img.youtube.com/vi/${id}/hqdefault.jpg)` : "none");

/** Always 4 slots, filling empty ones with placeholders like the design. */
function slots(videos: PortfolioVideo[]) {
  return Array.from({ length: SLOTS }, (_, i) => videos[i]);
}

function PlayIcon({ size, color, offset }: { size: [number, number]; color: string; offset: number }) {
  return (
    <div
      className="h-0 w-0"
      style={{
        borderLeft: `${size[0]}px solid ${color}`,
        borderTop: `${size[1]}px solid transparent`,
        borderBottom: `${size[1]}px solid transparent`,
        marginLeft: offset,
      }}
    />
  );
}

export function VideoWork({ videos }: { videos: PortfolioVideo[] }) {
  const [tab, setTab] = useState(0);
  const [active, setActive] = useState(0);
  const [playingShort, setPlayingShort] = useState(-1);

  const niche = NICHES[tab];
  const inNiche = videos.filter((v) => v.niche === niche.slug);
  const longs = slots(inNiche.filter((v) => v.kind === "LONG"));
  const shorts = slots(inNiche.filter((v) => v.kind === "SHORT"));
  const featured = longs[active];

  return (
    <section id="work" className="scroll-mt-20 border-t border-line bg-[oklch(0.97_0.006_265)] px-6 py-[clamp(72px,9vw,104px)]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-9">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex max-w-[680px] flex-col gap-3.5">
            <div className="eyebrow">Our work</div>
            <h2 className="text-[clamp(30px,3.8vw,44px)] leading-[1.08] font-bold tracking-[-0.04em] text-balance">
              Videos we&apos;ve made.
            </h2>
          </div>
          <p className="max-w-[380px] text-base leading-[1.55] text-pretty text-muted">
            Long-form videos and Shorts, edited, packaged and published by our team.
          </p>
        </div>

        <div className="-mt-2 flex flex-wrap gap-2" role="tablist" aria-label="Industries">
          {NICHES.map((n, i) => (
            <button
              key={n.slug}
              type="button"
              role="tab"
              aria-selected={i === tab}
              onClick={() => {
                setTab(i);
                setActive(0);
                setPlayingShort(-1);
              }}
              className={`flex-none cursor-pointer whitespace-nowrap rounded-full border px-4 py-2.5 text-[14.5px] font-medium transition-colors hover:border-ink ${
                i === tab ? "border-ink bg-ink text-white" : "border-line-2 bg-white text-ink"
              }`}
            >
              {n.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 items-stretch gap-4 min-[900px]:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <div className="relative aspect-video w-full min-w-0 self-start overflow-hidden rounded-[20px] bg-ink shadow-[0_40px_60px_-30px_oklch(0.25_0.06_265/0.5)]">
            {featured ? (
              <iframe
                key={featured.youtubeId}
                src={`https://www.youtube.com/embed/${featured.youtubeId}?rel=0`}
                title={featured.title ?? "Featured video"}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 size-full border-0"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[radial-gradient(120%_90%_at_30%_20%,#1E2A55,#0B1020_70%)] text-white">
                <div className="flex size-[76px] items-center justify-center rounded-full bg-brand shadow-[0_0_0_12px_oklch(0.6_0.2_265/0.18)]">
                  <PlayIcon size={[22, 13]} color="white" offset={6} />
                </div>
                <span className="font-mono text-[13px] tracking-[0.06em] text-[#C9D3EE]">VIDEOS COMING SOON</span>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2.5">
            {longs.map((v, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={i === active}
                className={`flex cursor-pointer items-center gap-3.5 rounded-[14px] border p-[7px] text-left text-ink transition-colors hover:border-brand ${
                  i === active ? "border-brand bg-white" : "border-line-2 bg-transparent"
                }`}
              >
                <div className="relative aspect-video w-[104px] flex-none overflow-hidden rounded-[9px] bg-[linear-gradient(135deg,#1E2A55,#0B1020)]">
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: thumb(v?.youtubeId) }} />
                  <div className="absolute bottom-2 left-2 flex size-[22px] items-center justify-center rounded-full bg-white">
                    <PlayIcon size={[7, 4.5]} color="#0B1020" offset={2} />
                  </div>
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-mono text-xs tracking-[0.06em] text-brand">{pad(i)}</span>
                  <span className="text-[15px] font-semibold tracking-[-0.01em]">{v?.title ?? niche.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-3 flex flex-col gap-4">
          <div className="flex items-center gap-3.5">
            <span className="font-mono text-[13px] tracking-[0.08em] text-brand">SHORTS</span>
            <div className="h-px flex-1 bg-line-2" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-4">
            {shorts.map((s, i) => (
              <div
                key={i}
                className="relative aspect-[9/16] overflow-hidden rounded-[18px] bg-[radial-gradient(120%_70%_at_50%_0%,#1E2A55,#0B1020_75%)]"
              >
                {s && playingShort === i ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${s.youtubeId}?autoplay=1&rel=0`}
                    title={s.title ?? "Short"}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 size-full border-0"
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => s && setPlayingShort(i)}
                    aria-label={s ? `Play short ${pad(i)}` : `Short ${pad(i)} coming soon`}
                    className={`absolute inset-0 border-0 bg-transparent p-0 ${s ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: thumb(s?.youtubeId) }} />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.15_0.03_265/0.75),transparent_45%)]" />
                    <div className="absolute top-1/2 left-1/2 flex size-[54px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
                      <PlayIcon size={[16, 10]} color="#0B1020" offset={4} />
                    </div>
                    <span className="absolute bottom-3.5 left-4 font-mono text-xs tracking-[0.06em] text-white">
                      SHORT {pad(i)}
                    </span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
