import Link from "next/link";
import SectionHeading from "@/components/common/SectionHeading";

const compatibility = [
  { group: "A+", give: ["A+", "AB+"], receive: ["A+", "A-", "O+", "O-"] },
  { group: "A-", give: ["A+", "A-", "AB+", "AB-"], receive: ["A-", "O-"] },
  { group: "B+", give: ["B+", "AB+"], receive: ["B+", "B-", "O+", "O-"] },
  { group: "B-", give: ["B+", "B-", "AB+", "AB-"], receive: ["B-", "O-"] },
  { group: "AB+", give: ["AB+"], receive: ["Everyone"] },
  { group: "AB-", give: ["AB+", "AB-"], receive: ["A-", "B-", "AB-", "O-"] },
  { group: "O+", give: ["O+", "A+", "B+", "AB+"], receive: ["O+", "O-"] },
  { group: "O-", give: ["Everyone"], receive: ["O-"] },
];

export default function Compatibility() {
  return (
    <section className="section" aria-labelledby="compat-title">
      <div className="container-page">
        <SectionHeading
          eyebrow="Know your group"
          title={<span id="compat-title">Blood group compatibility</span>}
          description="Red-cell compatibility at a glance. Choose a group to see donors who match it."
        />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {compatibility.map(({ group, give, receive }) => (
            <li key={group}>
              <Link
                href={`/search?bloodGroup=${encodeURIComponent(group)}`}
                className="focus-ring group flex h-full flex-col gap-4 rounded-2xl border border-line bg-surface p-5 shadow-card transition-all hover:-translate-y-1 hover:border-brand-500 hover:shadow-lift"
              >
                <div className="flex items-center justify-between">
                  <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-600 text-xl font-extrabold text-white">{group}</span>
                  <span className="text-xs font-semibold text-brand-600 group-hover:underline">Find {group} donors →</span>
                </div>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="font-semibold text-ink">Can donate to</dt>
                    <dd className="text-muted">{give.join(", ")}</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink">Can receive from</dt>
                    <dd className="text-muted">{receive.join(", ")}</dd>
                  </div>
                </dl>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
