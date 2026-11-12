"use client";

import { useState } from "react";
import { useT } from "@/i18n/client";
import type { T } from "@/i18n/config";

const labelsFor = (t: T) => [
  t("We have a clear ideal customer profile", "We hebben een helder ideaal klantprofiel"),
  t("Our messaging is distinct from competitors", "Onze boodschap onderscheidt zich van concurrenten"),
  t("Our brand voice is documented", "Onze tone of voice is vastgelegd"),
  t("Our CRM data is clean and connected", "Onze CRM-data is schoon en gekoppeld"),
  t("We can attribute revenue to channels", "We kunnen omzet toewijzen aan kanalen"),
];

function verdict(score: number, t: T) {
  if (score >= 4)
    return t(
      "Strong foundation. You’re ready to launch AI-powered campaigns and scale what works.",
      "Sterke basis. Je bent klaar om campagnes met AI te lanceren en op te schalen wat werkt.",
    );
  if (score >= 2)
    return t(
      "A solid start with a few gaps. Fixing them first will make AI far more effective.",
      "Een goede start met een paar gaten. Als je die eerst dicht, wordt AI veel effectiever.",
    );
  return t(
    "Start with the foundation. AI will only scale what’s already there, so this is where the biggest wins are.",
    "Begin bij de basis. AI schaalt alleen op wat er al is, dus hier valt de meeste winst te halen.",
  );
}

export function ReadinessCheck() {
  const t = useT();
  const labels = labelsFor(t);
  const [on, setOn] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const toggle = (i: number) => setOn((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-7" aria-live="polite">
      {!checked ? (
        <>
          <span className="text-[17px] font-semibold">{t("How ready is your marketing for AI?", "Hoe klaar is jouw marketing voor AI?")}</span>
          <div className="flex flex-col gap-2.5">
            {labels.map((label, i) => {
              const v = on.includes(i);
              return (
                <button
                  key={i}
                  type="button"
                  role="checkbox"
                  aria-checked={v}
                  onClick={() => toggle(i)}
                  className={`flex cursor-pointer items-center gap-3 rounded-[10px] border px-3.5 py-3 text-left text-[15px] text-ink transition-colors ${
                    v ? "border-[#BFD0FF] bg-[#F3F6FF]" : "border-line bg-white"
                  }`}
                >
                  <span
                    className={`grid size-5 flex-none place-items-center rounded-md border-[1.5px] text-xs text-white ${
                      v ? "border-brand bg-brand" : "border-[oklch(0.75_0.02_265)] bg-white"
                    }`}
                    aria-hidden
                  >
                    {v ? "✓" : ""}
                  </span>
                  {label}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            onClick={() => setChecked(true)}
            className="cursor-pointer rounded-[11px] bg-brand px-[22px] py-3.5 text-[15.5px] font-medium text-white hover:bg-brand-hover"
          >
            {t("See my score →", "Bekijk mijn score →")}
          </button>
        </>
      ) : (
        <>
          <span className="font-mono text-[12.5px] tracking-[0.04em] text-subtle">{t("YOUR READINESS", "JOUW SCORE")}</span>
          <span className="text-[56px] leading-none font-bold tracking-[-0.04em]">
            {on.length}
            <span className="text-[22px] text-subtle">/5</span>
          </span>
          <p className="text-[15px] leading-[1.55] text-muted">{verdict(on.length, t)}</p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="#contact"
              className="whitespace-nowrap rounded-[10px] bg-brand px-5 py-[13px] text-[15px] font-medium text-white hover:bg-brand-hover"
            >
              {t("Book a review call →", "Plan een adviesgesprek →")}
            </a>
            <button
              type="button"
              onClick={() => {
                setChecked(false);
                setOn([]);
              }}
              className="cursor-pointer rounded-[10px] border border-line-2 bg-white px-5 py-[13px] text-[15px] font-medium text-ink"
            >
              {t("Start over", "Opnieuw beginnen")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
