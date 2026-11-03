"use client";

export const SELECT_PLAN_EVENT = "finloa:select-plan";

/** Scrolls to the contact form and pre-selects the plan there. */
export function PlanCta({
  slug,
  label,
  className,
}: {
  slug: string;
  label: string;
  className: string;
}) {
  return (
    <a
      href="#contact"
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_PLAN_EVENT, { detail: slug }))}
    >
      {label}
    </a>
  );
}
