"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { submitLead, type ApiError } from "@/lib/api";

/** The hero form hands its email to the contact form via this window event. */
const CARRY_EVENT = "finloa:idea-email";

/** Hero: email field that scrolls to the contact form and pre-fills it. */
export function IdeaHeroForm() {
  const id = useId();
  const [email, setEmail] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent(CARRY_EVENT, { detail: email.trim() }));
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto flex w-full max-w-[640px] flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-[60px] min-w-0 flex-1 rounded-xl border border-[#dfe2ec] bg-white px-5 text-[17px] text-ink outline-none placeholder:text-[#7d84a0] focus:border-brand focus:shadow-[0_0_0_4px_rgba(47,107,255,.18)]"
        />
        <button
          type="submit"
          className="h-[60px] flex-none cursor-pointer rounded-xl bg-brand px-[30px] text-[17px] font-semibold whitespace-nowrap text-white transition-colors hover:bg-brand-hover"
        >
          Tell us your idea →
        </button>
      </div>
      <p className="text-[13px] leading-normal text-[#5a6380]">
        No spam. By signing up you agree to our{" "}
        <Link href="/terms" className="text-brand underline hover:text-brand-hover">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-brand underline hover:text-brand-hover">
          Privacy Policy
        </Link>
        .
      </p>
    </form>
  );
}

const STAGES = ["Just an idea", "Have designs", "Have a product", "Need maintenance"] as const;

const field =
  "min-w-0 rounded-[10px] border border-[#27304f] bg-ink px-3.5 py-3 text-sm text-white outline-none placeholder:text-[#7d84a0] focus:border-brand aria-[invalid=true]:border-red-400";

/** Dark contact section: idea form that creates a lead (source "idea-to-product"). */
export function IdeaContact() {
  const [email, setEmail] = useState("");
  const [stage, setStage] = useState<(typeof STAGES)[number]>(STAGES[0]);
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const ideaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    function onCarry(e: Event) {
      const value = (e as CustomEvent<string>).detail;
      if (value) setEmail(value);
      window.setTimeout(() => ideaRef.current?.focus({ preventScroll: true }), 500);
    }
    window.addEventListener(CARRY_EVENT, onCarry);
    return () => window.removeEventListener(CARRY_EVENT, onCarry);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const idea = String(fd.get("idea") ?? "").trim();
    setState("sending");
    setErrors({});
    setFormError(null);
    try {
      await submitLead({
        source: "idea-to-product",
        firstName: String(fd.get("firstName") ?? ""),
        lastName: String(fd.get("lastName") ?? ""),
        email: email.trim(),
        platforms: [],
        message: `Stage: ${stage}${idea ? `\n\n${idea}` : ""}`,
        companyFax: String(fd.get("companyFax") ?? ""),
      });
      setState("sent");
    } catch (err) {
      const apiErr = err as Partial<ApiError> | undefined;
      const details = apiErr?.details ?? {};
      setErrors(Object.fromEntries(Object.entries(details).map(([k, v]) => [k, v?.[0]])));
      setFormError(
        Object.keys(details).length ? null : typeof apiErr?.error === "string" ? apiErr.error : "Could not send. Try again.",
      );
      setState("idle");
    }
  }

  return (
    <section id="contact" className="scroll-mt-20 bg-ink px-6 py-[clamp(72px,9vw,96px)] text-white">
      <div className="mx-auto grid max-w-[1120px] grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-start gap-12">
        <div className="flex flex-col gap-[18px]">
          <div className="font-mono text-xs tracking-[0.16em] text-[#6f97ff]">CONTACT</div>
          <h2 className="text-[clamp(38px,5vw,56px)] leading-none font-extrabold tracking-[-0.045em]">
            Tell us your idea.
            <br />
            We&apos;ll send the plan.
          </h2>
          <p className="max-w-[420px] text-base leading-[1.6] text-[#a9b0c8]">
            Within two working days you get our view on feasibility, the package that fits and a fixed price. No
            obligation.
          </p>
        </div>
        <div className="rounded-[18px] border border-[#1f2847] bg-[#121a36] p-[22px]">
          {state === "sent" ? (
            <div role="status" className="flex flex-col gap-2.5 px-3 py-12 text-center">
              <div className="text-2xl font-bold tracking-[-0.02em]">Thanks, we&apos;ve got your idea.</div>
              <div className="text-[15px] text-[#a9b0c8]">Expect our plan in your inbox within two working days.</div>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="grid grid-cols-2 gap-2.5">
              <Field name="firstName" label="First name" error={errors.firstName} />
              <Field name="lastName" label="Last name" error={errors.lastName} />
              <div className="col-span-2 flex flex-col gap-1">
                <label htmlFor="idea-email" className="sr-only">
                  Email
                </label>
                <input
                  id="idea-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  className={field}
                />
                {errors.email && <span className="text-xs text-red-300">{errors.email}</span>}
              </div>
              <label htmlFor="idea-text" className="sr-only">
                Your idea
              </label>
              <textarea
                id="idea-text"
                ref={ideaRef}
                name="idea"
                rows={4}
                placeholder="What's the idea? Who is it for?"
                className={`${field} col-span-2 resize-y`}
              />
              <input type="text" name="companyFax" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
              <fieldset className="col-span-2 mt-1 flex flex-col gap-2.5">
                <legend className="mb-2.5 font-mono text-xs tracking-[0.08em] text-[#a9b0c8]">WHERE ARE YOU NOW?</legend>
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={stage === s}
                      onClick={() => setStage(s)}
                      className={`cursor-pointer rounded-full border px-3 py-[7px] text-[13px] whitespace-nowrap text-white transition-colors ${
                        stage === s ? "border-brand bg-brand" : "border-[#27304f] hover:border-[#3a4570]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </fieldset>
              {formError && (
                <p role="alert" className="col-span-2 text-sm text-red-300">
                  {formError}
                </p>
              )}
              <button
                type="submit"
                disabled={state === "sending"}
                className="col-span-2 mt-1.5 cursor-pointer rounded-[10px] bg-brand p-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-brand-hover disabled:opacity-70"
              >
                {state === "sending" ? "Sending…" : "Send my idea →"}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({ name, label, error }: { name: string; label: string; error?: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1 max-[420px]:col-span-2">
      <label htmlFor={`idea-${name}`} className="sr-only">
        {label}
      </label>
      <input
        id={`idea-${name}`}
        name={name}
        required
        autoComplete={name === "firstName" ? "given-name" : "family-name"}
        placeholder={label}
        aria-invalid={!!error}
        className={field}
      />
      {error && <span className="text-xs text-red-300">{error}</span>}
    </div>
  );
}
