"use client";

import { useEffect, useState, type FormEvent } from "react";
import { PLATFORMS, submitLead, type ApiError, type Plan, type PlatformValue } from "@/lib/api";
import { SELECT_PLAN_EVENT } from "./plan-cta";

type PlanOption = Pick<Plan, "slug" | "name">;
type FieldErrors = Record<string, string[] | undefined>;

export type ContactFormProps = {
  /** Which page the lead came from, stored on the lead */
  source: string;
  /** Placeholder of the 4th field; "Website" fields are sent as `website`, others as `company` */
  fourthField?: { name: "company" | "website"; placeholder: string };
  messagePlaceholder?: string;
  /** Video page extras */
  plans?: PlanOption[];
  showPlatforms?: boolean;
  showVideosPerMonth?: boolean;
};

const inputClass =
  "w-full rounded-[10px] border border-[oklch(0.4_0.02_265)] bg-ink-4 px-[15px] py-[13px] text-[15px] text-white outline-none transition-colors focus:border-brand aria-[invalid=true]:border-red-400";

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="mt-1.5 text-[13px] text-red-300">{errors[0]}</p>;
}

function Field({
  name,
  placeholder,
  errors,
  type = "text",
  autoComplete,
  wide,
}: {
  name: string;
  placeholder: string;
  errors: FieldErrors;
  type?: string;
  autoComplete?: string;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : ""}>
      <label htmlFor={name} className="sr-only">
        {placeholder}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={inputClass}
        aria-invalid={!!errors[name]}
      />
      <FieldError errors={errors[name]} />
    </div>
  );
}

export function ContactForm({
  source,
  fourthField = { name: "company", placeholder: "Company or channel" },
  messagePlaceholder = "What would you like to grow?",
  plans,
  showPlatforms,
  showVideosPerMonth,
}: ContactFormProps) {
  const [planSlug, setPlanSlug] = useState("");
  const [platforms, setPlatforms] = useState<PlatformValue[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (!plans) return;
    const onSelect = (e: Event) => setPlanSlug((e as CustomEvent<string>).detail);
    window.addEventListener(SELECT_PLAN_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_PLAN_EVENT, onSelect);
  }, [plans]);

  const togglePlatform = (p: PlatformValue) =>
    setPlatforms((cur) => (cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim() || undefined;

    setStatus("sending");
    setErrors({});
    setFormError(null);
    try {
      await submitLead({
        source,
        firstName: get("firstName") ?? "",
        lastName: get("lastName") ?? "",
        email: get("email") ?? "",
        company: get("company"),
        website: get("website"),
        videosPerMonth: get("videosPerMonth"),
        message: get("message"),
        planSlug: planSlug || undefined,
        platforms,
        companyFax: get("companyFax"),
      });
      setStatus("sent");
    } catch (err) {
      const apiErr = err as Partial<ApiError> | undefined;
      if (!apiErr || typeof apiErr.error !== "string") {
        setFormError("We couldn't reach the server. Please try again, or email info@finloa.com.");
      } else {
        setErrors(apiErr.details ?? {});
        setFormError(apiErr.details ? "Please check the highlighted fields." : (apiErr.error ?? "Could not send."));
      }
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col gap-2 rounded-2xl border border-ink-line bg-ink-3 p-8" role="status">
        <h3 className="text-[22px] font-semibold">Thanks, we&apos;ve got it.</h3>
        <p className="text-[15px] text-on-ink-muted">We&apos;ll reply to your email within two working days.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid grid-cols-1 gap-3.5 rounded-2xl border border-ink-line bg-ink-3 p-7 sm:grid-cols-2"
    >
      <Field name="firstName" placeholder="First name" autoComplete="given-name" errors={errors} />
      <Field name="lastName" placeholder="Last name" autoComplete="family-name" errors={errors} />
      <Field name="email" type="email" placeholder="Work email" autoComplete="email" errors={errors} />
      <Field
        name={fourthField.name}
        placeholder={fourthField.placeholder}
        autoComplete={fourthField.name === "website" ? "url" : "organization"}
        errors={errors}
      />

      {plans && (
        <>
          <Field name="website" placeholder="Website or channel (optional)" autoComplete="url" errors={errors} />
          <div>
            <label htmlFor="plan" className="sr-only">
              Package
            </label>
            <select
              id="plan"
              value={planSlug}
              onChange={(e) => setPlanSlug(e.target.value)}
              className={`${inputClass} ${planSlug ? "" : "text-[oklch(0.6_0.02_265)]"}`}
            >
              <option value="">Package — not sure yet</option>
              {plans.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
            <FieldError errors={errors.planSlug} />
          </div>
        </>
      )}

      {showPlatforms && (
        <fieldset className="sm:col-span-2">
          <legend className="mb-2.5 text-[14px] text-on-ink-muted">Where do you want to post?</legend>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => {
              const on = platforms.includes(p.value);
              return (
                <button
                  key={p.value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => togglePlatform(p.value)}
                  className={`rounded-full border px-3.5 py-1.5 text-[14px] transition-colors ${
                    on
                      ? "border-brand bg-brand text-white"
                      : "border-[oklch(0.4_0.02_265)] text-on-ink-muted hover:border-brand-soft"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      {showVideosPerMonth && (
        <Field name="videosPerMonth" placeholder="How many videos do you want per month?" errors={errors} wide />
      )}

      <div className="sm:col-span-2">
        <label htmlFor="message" className="sr-only">
          Message
        </label>
        <textarea id="message" name="message" rows={4} placeholder={messagePlaceholder} className={`${inputClass} resize-y`} />
      </div>

      {/* Honeypot for bots — hidden from people and assistive tech */}
      <input name="companyFax" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

      {formError && (
        <p className="text-[14px] text-red-300 sm:col-span-2" role="alert">
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer rounded-[11px] bg-brand px-[22px] py-3.5 text-[15.5px] font-medium text-white transition-colors hover:bg-brand-light disabled:cursor-wait disabled:opacity-70 sm:col-span-2"
      >
        {status === "sending" ? "Sending…" : "Send →"}
      </button>
    </form>
  );
}
