import Link from "next/link";
import { Droplet } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ className, light = false }) {
  return (
    <Link href="/" className={cn("focus-ring flex w-fit items-center gap-2 rounded-xl", className)} aria-label="SaveBlood home">
      <span className="flex size-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
        <Droplet className="size-5 fill-current" aria-hidden="true" />
      </span>
      <span className={cn("text-xl font-extrabold tracking-tight", light ? "text-white" : "text-ink")}>
        Save<span className="text-brand-600">Blood</span>
      </span>
    </Link>
  );
}
