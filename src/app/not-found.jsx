import { Droplet } from "lucide-react";
import Button from "@/components/ui/Button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 dark:bg-brand-900/40">
        <Droplet className="size-8 fill-current" aria-hidden="true" />
      </span>
      <p className="mt-6 text-sm font-bold uppercase tracking-widest text-brand-600">Error 404</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink md:text-4xl">This page could not be found</h1>
      <p className="mt-3 max-w-md text-muted">The link may be broken or the page may have been removed. Let&apos;s get you back to people who need help.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/" size="lg">
          Back to home
        </Button>
        <Button href="/donation-requests" variant="outline" size="lg">
          Browse requests
        </Button>
      </div>
    </div>
  );
}
