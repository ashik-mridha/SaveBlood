import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import SectionHeading from "@/components/common/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";

export default function ContactCta() {
  const details = [
    { icon: Phone, label: "Call us", value: SITE.phone, href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}` },
    { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
    { icon: MapPin, label: "Office", value: SITE.address },
    { icon: Clock, label: "Hours", value: SITE.hours },
  ];

  return (
    <section className="section" aria-labelledby="contact-title">
      <div className="container-page grid items-start gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Get in touch"
            title={<span id="contact-title">Questions about donating or requesting blood?</span>}
            description="Send us a message and the SaveBlood team will reply by email within two working days."
          />
          <ul className="grid gap-5 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-ink">{label}</p>
                  {href ? (
                    <a href={href} className="focus-ring break-words rounded text-sm text-muted hover:text-brand-600">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm text-muted">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
          <ContactForm compact />
        </div>
      </div>
    </section>
  );
}
