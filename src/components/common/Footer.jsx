import Link from "next/link";
import { FaFacebookF, FaGithub, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { SITE, footerGroups } from "@/lib/site";
import Logo from "./Logo";

const socials = [
  { label: "Facebook", href: SITE.socials.facebook, icon: FaFacebookF },
  { label: "X (Twitter)", href: SITE.socials.twitter, icon: FaXTwitter },
  { label: "LinkedIn", href: SITE.socials.linkedin, icon: FaLinkedinIn },
  { label: "GitHub", href: SITE.socials.github, icon: FaGithub },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-slate-950 text-slate-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
            {SITE.tagline} SaveBlood is a free platform that helps families find voluntary blood donors quickly, anywhere in Bangladesh.
          </p>
          <ul className="mt-6 flex gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="focus-ring flex size-10 items-center justify-center rounded-xl bg-slate-800 text-slate-200 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={group.title}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">{group.title}</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="focus-ring rounded transition-colors hover:text-white">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-slate-800">
        <div className="container-page grid gap-4 py-6 text-sm text-slate-400 sm:grid-cols-2 lg:grid-cols-4">
          <a href={`mailto:${SITE.email}`} className="focus-ring flex items-center gap-2 rounded hover:text-white">
            <Mail className="size-4 text-brand-400" aria-hidden="true" />
            {SITE.email}
          </a>
          <a href={`tel:${SITE.phone.replace(/[^\d+]/g, "")}`} className="focus-ring flex items-center gap-2 rounded hover:text-white">
            <Phone className="size-4 text-brand-400" aria-hidden="true" />
            {SITE.phone}
          </a>
          <p className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
            {SITE.address}
          </p>
          <p className="flex items-center gap-2">
            <Clock className="size-4 shrink-0 text-brand-400" aria-hidden="true" />
            {SITE.hours}
          </p>
        </div>
        <p className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SaveBlood. All rights reserved. Blood must never be sold — donate voluntarily.
        </p>
      </div>
    </footer>
  );
}
