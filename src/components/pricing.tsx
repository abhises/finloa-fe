import type { T } from "@/i18n/config";
import { getT } from "@/i18n/server";
import { formatPrice, type Plan } from "@/lib/api";
import { PlanCta } from "./plan-cta";

function PlanCard({ plan, t }: { plan: Plan; t: T }) {
  const dark = plan.highlighted;
  const muted = dark ? "text-on-ink-muted-2" : "text-muted-2";
  return (
    <div
      className={`flex flex-col gap-5 rounded-[22px] border px-[26px] py-7 ${
        dark
          ? "border-ink bg-ink text-white shadow-[0_30px_50px_-24px_oklch(0.25_0.06_265/0.45)]"
          : "border-line bg-white text-ink"
      }`}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <span className="text-[22px] font-bold tracking-[-0.02em]">{plan.name}</span>
          {plan.popular && (
            <span className="whitespace-nowrap rounded-full bg-brand px-[11px] py-[5px] text-[11.5px] font-bold tracking-[0.04em] text-white">
              {t("MOST POPULAR", "MEEST GEKOZEN")}
            </span>
          )}
        </div>
        <span className={`text-[15.5px] font-semibold ${dark ? "text-brand-pale" : "text-brand"}`}>{plan.tagline}</span>
      </div>

      <div className="flex flex-wrap items-baseline gap-1.5">
        <span className="text-[clamp(40px,4vw,50px)] leading-none font-extrabold tracking-[-0.045em]">
          {formatPrice(plan.priceCents)}
        </span>
        <span className={`text-[15px] ${muted}`}>{t("/ month", "/ maand")}</span>
      </div>

      <p className={`min-h-[4.65em] text-[15px] leading-[1.55] text-pretty ${muted}`}>{plan.description}</p>

      <PlanCta
        slug={plan.slug}
        label={plan.ctaLabel}
        className={`rounded-xl border px-5 py-3.5 text-center text-[15.5px] font-semibold transition-opacity hover:opacity-88 ${
          plan.slug === "starter"
            ? "border-ink bg-transparent text-ink hover:text-ink"
            : "border-brand bg-brand text-white hover:text-white"
        }`}
      />

      <div className="grid grid-cols-2 gap-2.5">
        {[
          { n: plan.longVideos, label: t("long-form · 3–10 min", "lange video's · 3–10 min") },
          { n: plan.shorts, label: t("Shorts · up to 60 s", "Shorts · tot 60 sec") },
        ].map((s) => (
          <div
            key={s.label}
            className={`flex flex-col gap-1 rounded-[14px] px-3.5 pt-3.5 pb-3 ${dark ? "bg-ink-2" : "bg-surface"}`}
          >
            <span className="text-[30px] leading-none font-extrabold tracking-[-0.03em]">{s.n}</span>
            <span className={`text-[13px] leading-[1.35] ${muted}`}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export async function Pricing({ plans }: { plans: Plan[] }) {
  const t = await getT();
  return (
    <section id="pricing" className="scroll-mt-20 px-6 pt-2 pb-[72px]">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-7">
        <div className="grid w-full grid-cols-1 items-stretch gap-[18px] min-[600px]:grid-cols-2 min-[1100px]:grid-cols-4">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} t={t} />
          ))}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3.5 rounded-[20px] border border-line bg-white px-7 py-[22px] text-[15.5px] text-muted">
          <span className="font-bold whitespace-nowrap text-ink">{t("Every plan:", "Bij elk pakket:")}</span>
          <span className="whitespace-nowrap">{t("Month to month, cancel anytime", "Maandelijks opzegbaar")}</span>
          <span className="whitespace-nowrap">{t("You own every file", "Alle bestanden zijn van jou")}</span>
          <span className="whitespace-nowrap">
            {t("Need something custom?", "Iets op maat nodig?")}{" "}
            <a href="#contact" className="font-medium text-brand underline hover:text-brand-hover">
              {t("Talk to us", "Neem contact op")}
            </a>
          </span>
        </div>
      </div>
    </section>
  );
}
