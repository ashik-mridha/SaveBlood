"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Accessible menu button. `items` is [{ label, href?, onClick?, icon?, danger? }].
 * `trigger` receives { open } and returns the button content.
 */
export default function Dropdown({ trigger, items, label = "Open menu", align = "right", className }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const itemClass = (danger) =>
    cn(
      "focus-ring flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
      danger ? "text-red-700 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/40" : "text-ink hover:bg-slate-100 dark:hover:bg-slate-800"
    );

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className="focus-ring rounded-xl"
      >
        {trigger({ open })}
      </button>
      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-50 mt-2 min-w-52 rounded-xl border border-line bg-surface p-1.5 shadow-xl",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {items.map((item) =>
            item.href ? (
              <Link key={item.label} role="menuitem" href={item.href} onClick={() => setOpen(false)} className={itemClass(item.danger)}>
                {item.icon}
                {item.label}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onClick?.();
                }}
                className={itemClass(item.danger)}
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
