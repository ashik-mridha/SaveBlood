import Image from "next/image";
import { Droplet } from "lucide-react";

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-2 lg:py-14">
      <div className="relative hidden h-full min-h-[520px] overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 to-brand-600 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-white/15">
            <Droplet className="size-6 fill-current" aria-hidden="true" />
          </span>
          <h2 className="mt-6 text-3xl font-extrabold leading-tight">Every drop connects a donor to a life.</h2>
          <p className="mt-3 max-w-sm text-red-50/90">
            Join donors and volunteers across Bangladesh who respond to blood requests within hours.
          </p>
        </div>
        <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-2xl border border-white/20">
          <Image src="/images/community.svg" alt="Donors gathered around a blood drop" fill sizes="480px" className="object-cover" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
        <p className="mt-2 text-muted">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center text-sm text-muted">{footer}</div>
      </div>
    </div>
  );
}
