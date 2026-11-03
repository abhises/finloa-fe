import type { Metadata } from "next";
import { DismissibleNotice } from "@/components/dismissible-notice";
import { PageShell } from "@/components/page-shell";
import { PageHero, Section, SectionHeading, StepList, type NumberedItem } from "@/components/ui";

export const metadata: Metadata = {
  title: "Careers — Finloa",
  description: "Join a team where your voice matters, your growth is a priority and your wins are celebrated.",
};

const benefits = [
  "Flexible and remote working",
  "Paid holidays",
  "Healthcare benefits",
  "Learning and development budget",
  "Latest tools and AI software",
  "Team events and offsites",
];

const traits: NumberedItem[] = [
  { title: "Proactive", body: "You see what needs doing and do it, even when it’s not in your job description. You offer ideas to improve how we work." },
  { title: "Team-oriented", body: "You work well with others, share what you know and help the people around you do their best work." },
  { title: "Take ownership", body: "You own the results of your work, learn from them and take pride in what you deliver." },
  { title: "Enjoy a fast pace", body: "You’re comfortable switching focus quickly and handling several deadlines at once." },
  { title: "Self-motivated", body: "You can work independently and shape your own career path, with support from the team." },
  { title: "Adaptable", body: "You adjust easily when client needs and priorities change." },
  { title: "Want to do good", body: "You look for ways to make a difference and want your work to help people." },
];

export default function CareersPage() {
  return (
    <PageShell ctaHref="/#contact">
      <DismissibleNotice>
        Finloa will never ask candidates for personal financial information or payment as part of hiring. All genuine
        messages come from an @finloa.com address, and all applications go through this Careers page.
      </DismissibleNotice>
      <PageHero
        eyebrow="Careers at Finloa"
        title={["We invest in you.", "You help us grow."]}
        intro="Join a team where your voice matters, your growth is a priority and your wins are celebrated."
        actions={[{ href: "#positions", label: "Send an open application →" }]}
      />
      <Section innerClassName="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] items-start gap-[clamp(32px,5vw,56px)]">
        <SectionHeading eyebrow="Working at Finloa" title="What it’s like to work here." />
        <div className="flex flex-col gap-[18px] text-base leading-[1.6] text-[oklch(0.38_0.02_265)]">
          <p className="text-pretty">
            At Finloa you join a team that values who you are and the perspective you bring. Your work doesn’t just
            shape our results, it shapes how we work.
          </p>
          <p className="text-pretty">
            Everything we do is collaborative, from the first idea to celebrating the win. What we build together
            drives results for our clients and for our own future.
          </p>
          <p className="text-pretty">
            Working here is <strong className="text-ink">more than a job</strong>. It’s a chance to grow professionally
            while helping creators and businesses earn more from what they’ve built.
          </p>
        </div>
      </Section>
      <Section innerClassName="flex flex-col gap-9">
        <SectionHeading
          eyebrow="Benefits"
          title="What we offer."
          intro="We believe a healthy work-life balance is part of doing great work. These are some of the benefits we offer."
        />
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3">
          {benefits.map((b) => (
            <li key={b} className="flex gap-2.5 rounded-xl border border-line bg-white px-5 py-[18px] text-[15.5px] font-medium">
              <span className="text-brand" aria-hidden>
                ✓
              </span>
              {b}
            </li>
          ))}
        </ul>
      </Section>
      <Section>
        <StepList stickyHeading eyebrow="Who we look for" title="Is a career at Finloa right for you?" items={traits} />
      </Section>
      <Section id="positions" dark innerClassName="flex flex-col gap-9">
        <SectionHeading
          dark
          eyebrow="Join our team"
          title="Open application."
          intro="At Finloa you’re building something of your own. We have no open positions right now, but we’re always happy to hear from great people."
        />
        <div className="flex flex-col border-t border-ink-line-2">
          <div className="flex flex-wrap items-center gap-5 border-b border-ink-line-2 py-[22px]">
            <div className="flex min-w-[200px] flex-1 flex-col gap-1">
              <span className="text-[19px] font-semibold">Open application</span>
              <span className="text-sm text-[oklch(0.7_0.02_265)]">
                No open positions right now. Send your CV and a short note to info@finloa.com.
              </span>
            </div>
            <a
              href="mailto:info@finloa.com?subject=Open%20application"
              className="whitespace-nowrap rounded-full border border-brand px-5 py-[11px] text-[15px] font-medium text-white transition-colors hover:bg-brand"
            >
              Apply ↗
            </a>
          </div>
        </div>
      </Section>
      <section className="border-t border-line px-6 py-12">
        <div className="mx-auto flex max-w-[1180px] flex-col gap-2.5">
          <span className="text-sm font-semibold">Equal opportunity employer</span>
          <p className="max-w-[860px] text-[13.5px] leading-[1.6] text-pretty text-muted-2">
            Finloa is an equal opportunity employer. We consider all applicants without regard to race, religion,
            gender, sexual orientation, age, disability or any other protected characteristic. If you need an adjustment
            during the hiring process, email{" "}
            <a href="mailto:info@finloa.com" className="text-brand hover:text-brand-hover">
              info@finloa.com
            </a>
            .
          </p>
        </div>
      </section>
    </PageShell>
  );
}
