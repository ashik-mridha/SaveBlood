import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import SectionHeading from "@/components/common/SectionHeading";
import ContactForm from "@/components/forms/ContactForm";

export const metadata = {
  title: "Contact Us",
  description: "Send a message to the SaveBlood team or find our email, phone, address and opening hours.",
};

const details = [
  { icon: Mail, label: "Email", value: SITE.email, href: `mailto:${SITE.email}` },
  { icon: Phone, label: "Phone", value: SITE.phone, href: `tel:${SITE.phone.replace(/[^\d+]/g, "")}` },
  { icon: MapPin, label: "Address", value: SITE.address },
  { icon: Clock, label: "Opening hours", value: SITE.hours },
];

const help = [
  { href: "/donation-requests", title: "Need blood urgently?", text: "Browse open requests or post one from your dashboard." },
  { href: "/search", title: "Looking for a donor?", text: "Search by blood group, district and upazila." },
  { href: "/blog/who-can-donate-blood-eligibility-guide", title: "Can I donate?", text: "Read the eligibility guide before you visit a blood bank." },
  { href: "/privacy", title: "Privacy questions", text: "See what we store and who can see it." },
];

export default function ContactPage() {
  return (
    <div className="container-page section">
      <SectionHeading
        as="h1"
        eyebrow="Contact"
        title="We would love to hear from you"
        description="Questions about a request, a donor account or a partnership? Send us a message and we will reply by email within two working days."
      />

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8 lg:col-span-3">
          <h2 className="mb-6 text-xl font-bold text-ink">Send a message</h2>
          <ContactForm />
        </div>

        <aside className="flex flex-col gap-6 lg:col-span-2">
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <h2 className="mb-4 text-xl font-bold text-ink">Reach us directly</h2>
            <ul className="flex flex-col gap-4">
              {details.map(({ icon: Icon, label, value, href }) => (
                <li key={label} className="flex items-start gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-muted">{label}</p>
                    {href ? (
                      <a href={href} className="focus-ring break-words rounded font-medium text-ink hover:text-brand-600">
                        {value}
                      </a>
                    ) : (
                      <p className="font-medium text-ink">{value}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <h2 className="mb-4 text-xl font-bold text-ink">Quick help</h2>
            <ul className="flex flex-col gap-3">
              {help.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="focus-ring block rounded-xl border border-line p-3 transition-colors hover:border-brand-500">
                    <span className="block font-semibold text-ink">{item.title}</span>
                    <span className="block text-sm text-muted">{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
