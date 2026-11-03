import { ContactForm, type ContactFormProps } from "./contact-form";
import { Eyebrow } from "./ui";

export function ContactSection({
  intro,
  title = "Growth starts here. Let's talk.",
  ...form
}: ContactFormProps & { intro: string; title?: string }) {
  return (
    <section id="contact" className="scroll-mt-16 bg-ink px-6 py-[clamp(72px,10vw,110px)] text-white">
      <div className="mx-auto grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(min(100%,380px),1fr))] items-start gap-12">
        <div className="flex flex-col gap-4">
          <Eyebrow dark>Contact</Eyebrow>
          <h2 className="text-[clamp(32px,4.4vw,54px)] leading-[1.06] font-bold tracking-[-0.04em] text-balance">
            {title}
          </h2>
          <p className="max-w-[460px] text-base leading-[1.55] text-on-ink-muted">{intro}</p>
        </div>
        <ContactForm {...form} />
      </div>
    </section>
  );
}
