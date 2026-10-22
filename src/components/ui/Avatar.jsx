import Image from "next/image";
import { cn, initials } from "@/lib/utils";

export default function Avatar({ name, src, size = 40, className }) {
  const style = { width: size, height: size, fontSize: Math.max(size * 0.38, 11) };

  if (src) {
    return (
      <Image
        src={src}
        alt={name ? `${name} profile photo` : "Profile photo"}
        width={size}
        height={size}
        style={style}
        className={cn("shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  return (
    <span
      style={style}
      aria-hidden="true"
      className={cn("inline-flex shrink-0 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700 dark:bg-brand-900/50 dark:text-brand-200", className)}
    >
      {initials(name) || "?"}
    </span>
  );
}
