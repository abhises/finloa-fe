"use client";

import Image from "next/image";
import { useState } from "react";
import { useLocale, useT } from "@/i18n/client";
import type { T } from "@/i18n/config";

type Creator = { name: string; meta: string; metaNl: string; src: string };

const creators: Record<string, Creator> = {
  ac: { name: "AlanCars", meta: "Cars · 56k subs", metaNl: "Auto's · 56k abonnees", src: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=200&fit=crop" },
  mb: { name: "MiaBakes", meta: "Baking · 120k subs", metaNl: "Bakken · 120k abonnees", src: "https://randomuser.me/api/portraits/women/44.jpg" },
  tt: { name: "TechTomas", meta: "Tech · 310k subs", metaNl: "Tech · 310k abonnees", src: "https://randomuser.me/api/portraits/men/75.jpg" },
  fj: { name: "FitWithJo", meta: "Fitness · 88k subs", metaNl: "Fitness · 88k abonnees", src: "https://randomuser.me/api/portraits/women/68.jpg" },
  wl: { name: "WanderLena", meta: "Travel · 64k subs", metaNl: "Reizen · 64k abonnees", src: "https://randomuser.me/api/portraits/women/21.jpg" },
  gg: { name: "GameGrid", meta: "Gaming · 210k subs", metaNl: "Gaming · 210k abonnees", src: "https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=200&h=200&fit=crop" },
};

/** Desktop layout positions (percent of a 560×600 box), taken from the design. */
const desktop: { id: keyof typeof creators; left: number; top: number; stacked?: boolean }[] = [
  { id: "ac", left: 4.29, top: 7.5 },
  { id: "mb", left: 43.57, top: 5 },
  { id: "tt", left: 88.39, top: 9.17, stacked: true },
  { id: "fj", left: 10.71, top: 90.83, stacked: true },
  { id: "wl", left: 36.43, top: 94.17 },
  { id: "gg", left: 72.14, top: 91.67 },
];

const desktopPaths = [
  ["M60 75 C70 120 140 105 150 170", "1 7"],
  ["M262 58 C235 90 300 105 280 170", "6 6"],
  ["M500 155 C490 175 440 160 430 190", "2 5"],
  ["M60 515 C60 480 115 495 120 430", "10 5 2 5"],
  ["M225 538 C212 500 268 495 255 430", "1 7"],
  ["M430 522 C455 490 385 490 400 430", "6 6"],
];

const switchesFor = (t: T) => [
  {
    label: t("Own a piece of the platform", "Word mede-eigenaar van het platform"),
    tip: t(
      "Get equity in a new platform built with you, and earn from everything it makes",
      "Krijg aandelen in een nieuw platform dat samen met jou wordt gebouwd, en verdien mee aan alles wat het oplevert",
    ),
  },
  {
    label: t("Collaborate with creators", "Werk samen met creators"),
    tip: t(
      "Team up on content, ideas, cross-promotion and growth",
      "Werk samen aan content, ideeën, cross-promotie en groei",
    ),
  },
  {
    label: t("Land group sponsor deals", "Sluit samen sponsordeals"),
    tip: t("Pitch brands together with your combined reach", "Benader merken samen, met jullie gezamenlijke bereik"),
  },
  {
    label: t("Sign up for free to know more", "Meld je gratis aan voor meer info"),
    tip: t(
      "We’ll share how it works, what you earn and who’s joining",
      "We vertellen je hoe het werkt, wat je verdient en wie er meedoen",
    ),
  },
];

function Avatar({ c, stacked }: { c: Creator; stacked?: boolean }) {
  const locale = useLocale();
  return (
    <div className={`flex items-center ${stacked ? "flex-col gap-1.5 text-center" : "gap-[9px]"}`}>
      <span className="block size-[52px] flex-none overflow-hidden rounded-full border-[3px] border-white bg-[oklch(0.93_0.01_265)] shadow-[0_12px_22px_-12px_oklch(0.25_0.06_265/0.55)]">
        <Image src={c.src} alt="" width={52} height={52} className="size-full object-cover" />
      </span>
      <span className={`flex flex-col leading-tight ${stacked ? "items-center" : ""}`}>
        <span className="text-[13.5px] font-bold">{c.name}</span>
        <span className="text-[11.5px] text-subtle">{locale === "nl" ? c.metaNl : c.meta}</span>
      </span>
    </div>
  );
}

function SwitchCard() {
  const [on, setOn] = useState([true, true, true, false]);
  const [tip, setTip] = useState<number | null>(null);
  const t = useT();
  const switches = switchesFor(t);

  const toggle = (i: number) => {
    const next = on.map((v, j) => (j === i ? !v : v));
    setOn(next);
    if (i === switches.length - 1 && next[i]) {
      setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 350);
    }
  };

  return (
    <div className="w-full rounded-[18px] bg-white shadow-[0_30px_50px_-24px_oklch(0.25_0.06_265/0.4)]">
      <div className="flex flex-col gap-0.5 rounded-t-[18px] bg-ink px-[22px] py-5 text-white">
        <span className="text-[clamp(19px,4.6vw,25px)] leading-[1.12] font-extrabold tracking-[-0.03em] whitespace-nowrap">
          {t("Ready to earn more than views?", "Klaar om meer te verdienen dan views?")}
        </span>
      </div>
      {switches.map((sw, i) => (
        <button
          key={i}
          type="button"
          role="switch"
          aria-checked={on[i]}
          aria-describedby={tip === i ? `sw-tip-${i}` : undefined}
          onClick={() => toggle(i)}
          onMouseEnter={() => setTip(i)}
          onMouseLeave={() => setTip(null)}
          onFocus={() => setTip(i)}
          onBlur={() => setTip(null)}
          className="relative flex w-full cursor-pointer items-center justify-between gap-3.5 border-t border-[oklch(0.94_0.005_265)] px-[22px] py-3.5 text-left text-[15px] font-semibold last:rounded-b-[18px]"
        >
          <span className="flex items-center gap-[7px]">
            <span>{sw.label}</span>
            <span
              className="grid size-4 flex-none place-items-center rounded-full border-[1.5px] border-[oklch(0.7_0.02_265)] font-mono text-[10px] font-bold text-[oklch(0.55_0.02_265)]"
              aria-hidden
            >
              i
            </span>
          </span>
          {tip === i && (
            <span
              id={`sw-tip-${i}`}
              role="tooltip"
              className="pointer-events-none absolute top-[calc(100%-6px)] right-4 left-4 z-10 rounded-[9px] bg-ink px-3 py-[9px] text-[13px] leading-[1.4] font-medium text-pretty text-white shadow-[0_12px_24px_-10px_oklch(0.2_0.03_265/0.5)]"
            >
              {sw.tip}
            </span>
          )}
          <span
            className={`flex h-6 w-10 flex-none rounded-xl p-[3px] transition-colors ${
              on[i] ? "justify-end bg-brand" : "justify-start bg-[oklch(0.88_0.01_265)]"
            }`}
            aria-hidden
          >
            <span className="size-[18px] rounded-full bg-white shadow-[0_1px_2px_oklch(0.2_0.02_265/0.25)]" />
          </span>
        </button>
      ))}
    </div>
  );
}

export function CreatorNetwork() {
  return (
    <>
      {/* Desktop: creators around the card, connected by dashed lines */}
      <div className="relative mx-auto hidden aspect-[560/600] w-full max-w-[560px] self-center sm:block">
        <svg viewBox="0 0 560 600" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
          {desktopPaths.map(([d, dash]) => (
            <path key={d} d={d} fill="none" stroke="#2F6BFF" strokeWidth={2} strokeLinecap="round" strokeDasharray={dash} />
          ))}
        </svg>
        {desktop.map(({ id, left, top, stacked }) => (
          <div
            key={id}
            className="absolute z-[3]"
            style={{ left: `${left}%`, top: `${top}%`, transform: stacked ? "translate(-50%,-26px)" : "translateY(-50%)" }}
          >
            <Avatar c={creators[id]} stacked={stacked} />
          </div>
        ))}
        <div className="absolute top-1/2 left-1/2 z-[2] w-[min(430px,82%)] -translate-x-1/2 -translate-y-1/2">
          <SwitchCard />
        </div>
      </div>

      {/* Mobile: creators above and below the card */}
      <div className="mx-auto flex w-full max-w-[420px] flex-col gap-5 sm:hidden">
        <div className="flex justify-between gap-2">
          {(["ac", "mb", "tt"] as const).map((id) => (
            <Avatar key={id} c={creators[id]} stacked />
          ))}
        </div>
        <SwitchCard />
        <div className="flex justify-between gap-2">
          {(["fj", "wl", "gg"] as const).map((id) => (
            <Avatar key={id} c={creators[id]} stacked />
          ))}
        </div>
      </div>
    </>
  );
}
