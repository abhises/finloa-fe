import type { Metadata } from "next";
import Image from "next/image";
import { FaqSection, type FaqItem } from "@/components/faq";
import { IdeaContact, IdeaHeroForm } from "@/components/idea-to-product";
import { PageShell } from "@/components/page-shell";

export const metadata: Metadata = {
  title: "Idea to Product — Finloa",
  description:
    "An online business, a SaaS product or an internal tool. We shape the concept, design and build it, put it live and keep it running after launch.",
};

const eyebrow = "font-mono text-xs tracking-[0.16em] text-brand";
const h2 = "text-[clamp(34px,4.6vw,48px)] leading-[1.02] font-extrabold tracking-[-0.04em] text-balance";

const steps = [
  { title: "Concept", body: "We sharpen the idea with you: who it is for, what the first version must do and what can wait.", time: "WEEK 1" },
  { title: "Design", body: "Clickable screens you can test with real people before a single line of code is written.", time: "WEEK 2–3" },
  { title: "Build", body: "We develop the product in short sprints and show you working software every week.", time: "WEEK 3–8" },
  { title: "Deploy", body: "Hosting, domain, payments, email and analytics set up. Your product goes live.", time: "LAUNCH DAY" },
  { title: "Maintain", body: "Updates, monitoring, backups and new features as your users ask for them.", time: "ONGOING" },
];

const builds = [
  { title: "SaaS products", body: "Subscription software with accounts, billing and a dashboard your customers log into.", eg: "BOOKING TOOLS · CRMS · ANALYTICS" },
  { title: "Marketplaces", body: "Platforms that connect buyers and sellers, with listings, search, messaging and payouts.", eg: "SERVICES · RENTALS · B2B" },
  { title: "Online businesses", body: "Web shops, membership sites and course platforms that take payments from day one.", eg: "E-COMMERCE · MEMBERSHIPS · COURSES" },
  { title: "Internal tools", body: "Replace the spreadsheet. Custom portals, planners and admin panels for your team.", eg: "PORTALS · PLANNING · REPORTING" },
];

const packages = [
  { name: "Validate", tag: "Concept + clickable prototype", price: "$1,900", unit: "one-off", desc: "For testing an idea with users or investors before you build.", cta: "Start with Validate", items: ["Idea workshop", "User flows & scope", "Clickable prototype", "Build roadmap & estimate"] },
  { name: "MVP", tag: "First working version", price: "$4,900", unit: "one-off", desc: "For getting a real product in front of your first users fast.", cta: "Get MVP", items: ["Everything in Validate", "Core features, 1 user type", "Accounts & login", "Deployed & live"] },
  { name: "Launch", tag: "Ready for paying customers", price: "$9,900", unit: "one-off", desc: "For launching a business that takes payments from day one.", cta: "Get Launch", items: ["Everything in MVP", "Payments & subscriptions", "Admin dashboard", "Marketing site & SEO basics"], featured: true },
  { name: "Care", tag: "Hosting & maintenance", price: "$299", unit: "/ month", desc: "For keeping your product fast, safe and growing after launch.", cta: "Add Care", items: ["Hosting & monitoring", "Security updates & backups", "Monthly report"] },
];

const work = [
  { type: "SAAS · MARKETPLACE", name: "SERPsupport", img: "/work/serpsupport.png", body: "A platform where websites connect, chat about backlinks and approve or reject link requests.", result: "Accounts, chat, approvals & free trial" },
  { type: "SAAS · AD LIBRARY", name: "Adplaylist", img: "/work/adplaylist.png", body: "An ad library that studies winning ads and turns them into original templates teams edit in Canva.", result: "Searchable library, sign-up & Google login" },
  { type: "ONLINE BUSINESS · CONTENT", name: "BrasQ", img: "/work/brasq.png", body: "An independent product testing site with buying guides, reviews and affiliate revenue.", result: "Content platform, search & newsletter" },
];

const faqs: FaqItem[] = [
  ["I'm not technical. Is that a problem?", "No. Most of our clients are not developers. We explain every decision in plain language and you approve the scope before we build."],
  ["Who owns the code and the product?", "You do. The code, domain, hosting and all accounts are in your name from day one."],
  ["How long does it take?", "Validate takes about two weeks. An MVP is usually live in 6 weeks, a Launch build in 8 to 10 weeks."],
  ["What if my idea needs something outside the packages?", "Tell us about it. We combine or extend packages and give you one fixed price for the whole project."],
  ["What happens after launch?", "Every build includes three months of Care. After that you can continue month to month, or take the code to another team."],
  ["Will you keep my idea confidential?", "Yes. We are happy to sign an NDA before you share details."],
];

function SplitHeading({ label, title, intro }: { label: string; title: string; intro: string }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-8">
      <div className="flex flex-col gap-3.5">
        <div className={eyebrow}>{label}</div>
        <h2 className={h2}>{title}</h2>
      </div>
      <p className="max-w-[380px] text-[15px] leading-[1.6] text-muted">{intro}</p>
    </div>
  );
}

export default function IdeaToProductPage() {
  return (
    <PageShell ctaLabel="Tell us your idea" ctaHref="#contact">
      {/* ---------- Hero ---------- */}
      <section className="bg-[linear-gradient(180deg,#eef1fa_0%,var(--color-canvas)_100%)] px-6 pt-[clamp(56px,9vw,96px)] pb-[clamp(56px,8vw,88px)]">
        <div className="mx-auto flex max-w-[960px] flex-col items-center gap-6 text-center">
          <div className={eyebrow}>CONCEPT · BUILD · DEPLOY · MAINTAIN</div>
          <h1 className="text-[clamp(44px,7.4vw,84px)] leading-[0.98] font-extrabold tracking-[-0.045em] text-balance">
            You have the idea.
            <br />
            <span className="text-brand">We make it real.</span>
          </h1>
          <p className="max-w-[600px] text-lg leading-[1.55] text-pretty text-muted">
            An online business, a SaaS product or an internal tool. We shape the concept, design and build it, put it
            live and keep it running after launch. One team for the whole journey.
          </p>
          <div className="mt-3 w-full">
            <IdeaHeroForm />
          </div>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3.5 text-sm text-muted">
            {["Fixed price before we start", "You own all code and accounts", "First release in 6–10 weeks"].map((t, i) => (
              <li key={t} className="flex gap-6">
                {i > 0 && (
                  <span className="text-[#c3c8d6]" aria-hidden>
                    •
                  </span>
                )}
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Process ---------- */}
      <section id="process" className="scroll-mt-20 px-6 py-[clamp(64px,9vw,96px)]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-12">
          <SplitHeading
            label="HOW IT WORKS"
            title="From idea to live product."
            intro="Five clear stages. You always know what happens next, what it costs and when you'll see it."
          />
          <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3">
            {steps.map((s, i) => (
              <li key={s.title} className="flex min-h-[220px] flex-col gap-3 rounded-2xl border border-line bg-white p-6">
                <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold tracking-[-0.02em]">{s.title}</h3>
                <p className="text-sm leading-[1.55] text-muted">{s.body}</p>
                <span className="mt-auto font-mono text-[11px] tracking-[0.08em] text-subtle">{s.time}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- What we build ---------- */}
      <section id="build" className="scroll-mt-20 bg-ink px-6 py-[clamp(64px,9vw,96px)] text-white">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-12">
          <div className="flex flex-col gap-3.5">
            <div className="font-mono text-xs tracking-[0.16em] text-[#6f97ff]">WHAT WE BUILD</div>
            <h2 className={`${h2} max-w-[640px]`}>If it runs in a browser or on a phone, we can build it.</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-px overflow-hidden rounded-2xl border border-[#1f2640] bg-[#1f2640]">
            {builds.map((b) => (
              <div key={b.title} className="flex flex-col gap-2.5 bg-ink p-7">
                <h3 className="text-[19px] font-bold tracking-[-0.02em]">{b.title}</h3>
                <p className="text-sm leading-[1.55] text-[#a9b0c8]">{b.body}</p>
                <span className="mt-1.5 font-mono text-[11px] tracking-[0.06em] text-[#6f97ff]">{b.eg}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Packages ---------- */}
      <section id="packages" className="scroll-mt-20 px-6 py-[clamp(64px,9vw,96px)]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-12">
          <div className="flex flex-col items-center gap-3.5 text-center">
            <div className={eyebrow}>PACKAGES</div>
            <h2 className={h2}>Clear packages. Clear prices.</h2>
            <p className="max-w-[520px] text-[15px] leading-[1.6] text-muted">
              Pick the stage you&apos;re at. Every build package includes three months of Care.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-3.5">
              {packages.map((p) => {
                const dark = !!p.featured;
                const outline = p.name === "Validate";
                return (
                  <div
                    key={p.name}
                    className={`flex flex-col gap-3.5 rounded-[18px] border p-[26px] ${
                      dark ? "border-[#1f2847] bg-ink text-white" : "border-line bg-white text-ink"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-xl font-bold tracking-[-0.02em]">{p.name}</h3>
                      {dark && (
                        <span className="rounded-full bg-brand px-2 py-1 text-[10px] font-bold tracking-[0.06em] text-white">
                          MOST POPULAR
                        </span>
                      )}
                    </div>
                    <div className={`-mt-2 text-sm font-medium ${dark ? "text-[#6f97ff]" : "text-brand"}`}>{p.tag}</div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-[40px] font-extrabold tracking-[-0.04em]">{p.price}</span>
                      <span className={`text-[13px] ${dark ? "text-[#a9b0c8]" : "text-muted"}`}>{p.unit}</span>
                    </div>
                    <p className={`min-h-11 text-sm leading-[1.55] ${dark ? "text-[#a9b0c8]" : "text-muted"}`}>{p.desc}</p>
                    <a
                      href="#contact"
                      className={`rounded-[10px] border p-3 text-center text-sm font-semibold transition-colors ${
                        outline
                          ? "border-ink bg-white text-ink hover:bg-surface"
                          : "border-brand bg-brand text-white hover:bg-brand-hover hover:text-white"
                      }`}
                    >
                      {p.cta}
                    </a>
                    <ul
                      className={`flex flex-col gap-2 border-t pt-3.5 text-[13px] leading-[1.45] ${
                        dark ? "border-[#1f2847] text-[#a9b0c8]" : "border-line text-muted"
                      }`}
                    >
                      {p.items.map((it) => (
                        <li key={it} className="flex gap-2.5">
                          <span className="font-bold text-brand" aria-hidden>
                            +
                          </span>
                          {it}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2.5 rounded-[14px] border border-line bg-white px-6 py-4 text-sm text-muted">
              <strong className="text-ink">Every project:</strong>
              <span>Fixed price, no surprises</span>
              <span>Weekly progress demo</span>
              <span>You own code, domain and accounts</span>
              <span>
                Something bigger?{" "}
                <a href="#contact" className="text-brand hover:text-brand-hover">
                  Talk to us
                </a>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Work ---------- */}
      <section id="work" className="scroll-mt-20 px-6 pt-6 pb-[clamp(64px,9vw,96px)]">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-9">
          <SplitHeading
            label="OUR WORK"
            title="Ideas we've shipped."
            intro="Products we took from first sketch to real users, and still maintain today."
          />
          <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-3.5">
            {work.map((w) => (
              <article key={w.name} className="flex flex-col overflow-hidden rounded-[18px] border border-line bg-white">
                <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-[#eef1fa]">
                  <Image
                    src={w.img}
                    alt={`${w.name} screenshot`}
                    fill
                    sizes="(min-width: 1160px) 380px, (min-width: 700px) 50vw, 100vw"
                    className="object-cover object-top-left"
                  />
                </div>
                <div className="flex flex-col gap-2 p-[22px]">
                  <span className="font-mono text-[11px] tracking-[0.08em] text-brand">{w.type}</span>
                  <h3 className="text-[19px] font-bold tracking-[-0.02em]">{w.name}</h3>
                  <p className="text-sm leading-[1.55] text-muted">{w.body}</p>
                  <span className="mt-1 text-[13px] font-semibold text-ink">{w.result}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <FaqSection title="Good questions." items={faqs} />
      <IdeaContact />
    </PageShell>
  );
}
