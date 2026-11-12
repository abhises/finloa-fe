"use client";

import { useState } from "react";
import { useT } from "@/i18n/client";
import type { T } from "@/i18n/config";

const goals = (t: T) => [
  {
    label: t("Build my brand", "Mijn merk opbouwen"),
    title: t("Give people a reason to choose you", "Geef mensen een reden om voor jou te kiezen"),
    body: t(
      "A clear position and a website that shows it. We sharpen what you stand for so you show up with confidence everywhere.",
      "Een heldere positionering en een website die dat laat zien. We scherpen aan waar je voor staat, zodat je overal zelfverzekerd naar buiten treedt.",
    ),
    items: [
      t("Brand strategy and positioning", "Merkstrategie en positionering"),
      t("Website design and build", "Ontwerp en bouw van je website"),
      t("Content and creative", "Content en creatie"),
      t("Messaging for every channel", "Boodschap voor elk kanaal"),
    ],
  },
  {
    label: t("Grow revenue", "Meer omzet"),
    title: t("Turn attention into paying customers", "Maak van aandacht betalende klanten"),
    body: t(
      "We connect your marketing to sales, so traffic and followers become predictable revenue you can forecast.",
      "We koppelen je marketing aan sales, zodat bezoekers en volgers voorspelbare omzet worden waar je op kunt plannen.",
    ),
    items: [
      t("SEO and paid campaigns", "SEO en betaalde campagnes"),
      t("Conversion-focused pages", "Pagina's die converteren"),
      t("Email and retention flows", "E-mail- en retentieflows"),
      t("Monthly reporting on revenue", "Maandelijkse rapportage over omzet"),
    ],
  },
  {
    label: t("Launch new income", "Nieuwe inkomsten"),
    title: t("Earn beyond your core offer", "Verdien meer dan met je kernaanbod"),
    body: t(
      "Memberships, products, shops and partnerships designed around the audience or customers you already have.",
      "Lidmaatschappen, producten, webshops en partnerships, ontworpen rond het publiek of de klanten die je al hebt.",
    ),
    items: [
      t("Memberships and courses", "Lidmaatschappen en cursussen"),
      t("Digital products and shops", "Digitale producten en webshops"),
      t("Brand and sponsor partnerships", "Merk- en sponsorsamenwerkingen"),
      t("Pricing and launch plan", "Prijsstrategie en lanceringsplan"),
    ],
  },
  {
    label: t("Work smarter", "Slimmer werken"),
    title: t("Spend less time on what slows you down", "Minder tijd kwijt aan wat je ophoudt"),
    body: t(
      "We streamline the tools and processes behind your growth, so your team can focus on the work that moves the numbers.",
      "We stroomlijnen de tools en processen achter je groei, zodat je team zich kan richten op het werk dat echt resultaat oplevert.",
    ),
    items: [
      t("Tool and platform setup", "Inrichting van tools en platforms"),
      t("Automated workflows", "Geautomatiseerde workflows"),
      t("Clear dashboards", "Overzichtelijke dashboards"),
      t("Ongoing support", "Doorlopende ondersteuning"),
    ],
  },
];

export function GoalPicker() {
  const [active, setActive] = useState(0);
  const t = useT();
  const all = goals(t);
  const g = all[active];

  return (
    <>
      <div role="tablist" aria-label={t("Your goal", "Jouw doel")} className="flex flex-wrap gap-1.5 self-start rounded-xl bg-surface-2 p-[5px]">
        {all.map((x, i) => (
          <button
            key={i}
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
          <div className="font-mono text-[12.5px] tracking-[0.04em] text-subtle">{t("WHAT WE DO", "WAT WE DOEN")}</div>
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
