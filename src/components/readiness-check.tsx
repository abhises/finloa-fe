"use client";

import { useState } from "react";

const labels = [
  "We have a clear ideal customer profile",
  "Our messaging is distinct from competitors",
  "Our brand voice is documented",
  "Our CRM data is clean and connected",
  "We can attribute revenue to channels",
];

function verdict(score: number) {
  if (score >= 4) return "Strong foundation. You’re ready to launch AI-powered campaigns and scale what works.";
  if (score >= 2) return "A solid start with a few gaps. Fixing them first will make AI far more effective.";
  return "Start with the foundation. AI will only scale what’s already there, so this is where the biggest wins are.";
}

export function ReadinessCheck() {
  const [on, setOn] = useState<number[]>([]);
  const [checked, setChecked] = useState(false);
  const toggle = (i: number) => setOn((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]));

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-7" aria-live="polite">
      {!checked ? (
        <>
          <span className="text-[17px] font-semibold">How ready is your marketing for AI?</span>
          <div className="flex flex-col gap-2.5">
            {labels.map((label, i) => {
              const v = on.includes(i);
              return (
                <button
                  key={label}
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
            See my score →
          </button>
        </>
      ) : (
        <>
          <span className="font-mono text-[12.5px] tracking-[0.04em] text-subtle">YOUR READINESS</span>
          <span className="text-[56px] leading-none font-bold tracking-[-0.04em]">
            {on.length}
            <span className="text-[22px] text-subtle">/5</span>
          </span>
          <p className="text-[15px] leading-[1.55] text-muted">{verdict(on.length)}</p>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="#contact"
              className="whitespace-nowrap rounded-[10px] bg-brand px-5 py-[13px] text-[15px] font-medium text-white hover:bg-brand-hover"
            >
              Book a review call →
            </a>
            <button
              type="button"
              onClick={() => {
                setChecked(false);
                setOn([]);
              }}
              className="cursor-pointer rounded-[10px] border border-line-2 bg-white px-5 py-[13px] text-[15px] font-medium text-ink"
            >
              Start over
            </button>
          </div>
        </>
      )}
    </div>
  );
}
