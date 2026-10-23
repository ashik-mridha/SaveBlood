import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Logo from "@/components/common/Logo";
import ThemeToggle from "@/components/common/ThemeToggle";

// Auth pages are focused screens: no site Navbar/Footer, just a way back home.
export default function AuthLayout({ children }) {
  return (
    <>
      <header className="container-page flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="focus-ring inline-flex h-10 items-center gap-2 rounded-xl border border-line bg-surface px-4 text-sm font-semibold text-ink transition-colors hover:border-brand-500 hover:text-brand-600"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to Home
        </Link>
        <div className="flex items-center gap-2">
          <Logo className="hidden sm:flex" />
          <ThemeToggle />
        </div>
      </header>
      <main id="main" className="flex-1">
        {children}
      </main>
    </>
  );
}
