import { HandHeart, Search, UserPlus, Droplet } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";

const steps = [
  { icon: UserPlus, title: "Create your free account", text: "Register with your blood group and location so patients nearby can reach the right donor." },
  { icon: Search, title: "Search or request blood", text: "Look up donors by group and district, or post a request with the hospital and date." },
  { icon: HandHeart, title: "A donor responds", text: "Matching donors accept the request. You see who is coming and when, right from your dashboard." },
  { icon: Droplet, title: "Donate and save a life", text: "Give blood at the hospital, mark the request completed and help the next family." },
];

export default function HowItWorks() {
  return (
    <section className="section bg-surface" aria-labelledby="how-title">
      <div className="container-page">
        <SectionHeading eyebrow="Simple process" title={<span id="how-title">How SaveBlood works</span>} description="From registration to donation in four steps." />
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative rounded-2xl border border-line bg-surface-muted p-6">
              <span className="absolute right-5 top-5 text-4xl font-extrabold text-brand-100 dark:text-brand-900/60" aria-hidden="true">
                {i + 1}
              </span>
              <span className="mb-4 flex size-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
