import { ClipboardList, HandHeart, HeartHandshake, Search, ShieldCheck, Users } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import Button from "@/components/ui/Button";
import PublicStats from "./PublicStats";

export const metadata = {
  title: "About Us",
  description: "SaveBlood is a free, volunteer-driven platform that connects blood donors with patients across Bangladesh.",
};

const steps = [
  { icon: Users, title: "Register as a donor", text: "Create a free account with your blood group, district and upazila so nearby families can find you." },
  { icon: ClipboardList, title: "Post or browse requests", text: "Families post the patient's blood group, hospital, date and urgency. Anyone can browse open requests without signing in." },
  { icon: HandHeart, title: "Respond and donate", text: "A matching donor accepts the request, coordinates with the family and donates at the hospital blood bank." },
  { icon: HeartHandshake, title: "Close the loop", text: "The request moves from pending to in progress to completed, so everyone knows a patient has been helped." },
];

const values = [
  { icon: ShieldCheck, title: "Voluntary and free", text: "Blood is never bought or sold on SaveBlood. Every donation is a gift, and the platform charges no fees." },
  { icon: Search, title: "Fast, local matching", text: "Search by blood group, district and upazila to find the people closest to the hospital, when minutes matter." },
  { icon: Users, title: "Privacy by design", text: "Phone numbers and emails are visible only to signed-in members, and passwords are stored as salted hashes." },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page section">
          <SectionHeading
            as="h1"
            eyebrow="About SaveBlood"
            title="Helping families find blood donors before it is too late"
            description="Bangladesh needs hundreds of thousands of units of safe blood every year, and much of it still comes from relatives and voluntary donors found at the last minute. SaveBlood shortens that search."
          />
          <PublicStats />
        </div>
      </section>

      <section className="container-page section">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-600">Our mission</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink">A donor in every district</h2>
            <div className="mt-4 flex flex-col gap-4 leading-relaxed text-muted">
              <p>
                When a patient needs surgery, a transfusion for thalassemia or emergency care after an accident, the family often spends hours calling relatives and posting in social media groups. Rare groups such as AB-negative and B-negative make the search even harder.
              </p>
              <p>
                SaveBlood gives every family a single place to publish a verified request, and gives every willing donor a simple way to be found. Volunteers and administrators keep the data accurate, follow up on open requests and close them once the donation is complete.
              </p>
              <p>
                Optional contributions on our Funding page cover transport for donors travelling from outside the city and the cost of awareness camps in schools and universities.
              </p>
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-surface p-6 shadow-card">
            <h3 className="text-lg font-bold text-ink">Who can use SaveBlood?</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-muted">
              <li><strong className="text-ink">Donors</strong> — healthy adults aged 18 to 60 and at least 50 kg who want to be reachable when someone nearby needs their blood group.</li>
              <li><strong className="text-ink">Families and patients</strong> — anyone who needs blood and can share the hospital, date and patient details.</li>
              <li><strong className="text-ink">Volunteers</strong> — coordinators from clubs and community groups who follow up on requests and update their status.</li>
              <li><strong className="text-ink">Administrators</strong> — the SaveBlood team, who manage accounts, messages and reports.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page section">
          <SectionHeading eyebrow="How it works" title="From request to donation in four steps" />
          <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-2xl border border-line bg-surface-muted p-6">
                <span className="flex size-12 items-center justify-center rounded-xl bg-brand-600 text-white">
                  <step.icon className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-ink">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page section">
        <SectionHeading eyebrow="Our values" title="What we stand for" />
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
              <value.icon className="size-8 text-brand-600" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-bold text-ink">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{value.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 md:pb-20">
        <div className="rounded-2xl bg-brand-700 px-6 py-12 text-center text-white md:px-12">
          <h2 className="text-3xl font-extrabold tracking-tight">Ready to be someone&apos;s donor?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">Registration takes under two minutes and you stay in control of what others can see.</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/register" size="lg" className="bg-white text-brand-700 hover:bg-brand-50">
              Become a donor
            </Button>
            <Button href="/donation-requests" size="lg" variant="outline" className="border-white/60 bg-transparent text-white hover:border-white hover:text-white">
              See open requests
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
