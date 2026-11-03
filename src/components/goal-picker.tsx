"use client";

import { useState } from "react";

const goals = [
  {
    label: "Build my brand",
    title: "Give people a reason to choose you",
    body: "A clear position and a website that shows it. We sharpen what you stand for so you show up with confidence everywhere.",
    items: ["Brand strategy and positioning", "Website design and build", "Content and creative", "Messaging for every channel"],
  },
  {
    label: "Grow revenue",
    title: "Turn attention into paying customers",
    body: "We connect your marketing to sales, so traffic and followers become predictable revenue you can forecast.",
    items: ["SEO and paid campaigns", "Conversion-focused pages", "Email and retention flows", "Monthly reporting on revenue"],
  },
  {
    label: "Launch new income",
    title: "Earn beyond your core offer",
    body: "Memberships, products, shops and partnerships designed around the audience or customers you already have.",
    items: ["Memberships and courses", "Digital products and shops", "Brand and sponsor partnerships", "Pricing and launch plan"],
  },
  {
    label: "Work smarter",
    title: "Spend less time on what slows you down",
    body: "We streamline the tools and processes behind your growth, so your team can focus on the work that moves the numbers.",
    items: ["Tool and platform setup", "Automated workflows", "Clear dashboards", "Ongoing support"],
  },
];

export function GoalPicker() {
  const [active, setActive] = useState(0);
  const g = goals[active];

  return (
    <>
      <div role="tablist" aria-label="Your goal" className="flex flex-wrap gap-1.5 self-start rounded-xl bg-surface-2 p-[5px]">
        {goals.map((x, i) => (
          <button
            key={x.label}
            type="button"
            role="tab"
            id={`goal-tab-${i}`}
            aria-selected={i === active}
            aria-controls="goal-panel"
            onClick={() => setActive(i)}
            className={`cursor-pointer whitespace-nowrap rounded-[9px] px-4 py-2.5 text-[14.5px] font-medium transition-colors ${
              i === active ? "bg-white text-ink shadow-[0_1px_3px_oklch(0.2_0.02_265/0.12)]" : "text-muted-2 hover:text-ink"
            }`}
          >
            {x.label}
          </button>
        ))}
      </div>
      <div
        id="goal-panel"
        role="tabpanel"
        aria-labelledby={`goal-tab-${active}`}
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] items-stretch gap-4"
      >
        <div className="flex flex-col gap-3.5 rounded-2xl bg-ink p-8 text-white">
          <h3 className="text-2xl font-semibold tracking-[-0.02em] text-balance">{g.title}</h3>
          <p className="text-[15.5px] leading-[1.55] text-pretty text-on-ink-muted">{g.body}</p>
        </div>
        <div className="flex flex-col gap-3.5 rounded-2xl border border-line bg-white p-8">
          <div className="font-mono text-[12.5px] tracking-[0.04em] text-subtle">WHAT WE DO</div>
          {g.items.map((it) => (
            <span key={it} className="flex gap-2.5 text-[15.5px]">
              <span className="text-brand" aria-hidden>
                ✓
              </span>
              {it}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
