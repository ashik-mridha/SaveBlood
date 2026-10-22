"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  HandHeart,
  LayoutDashboard,
  ListChecks,
  Menu,
  MessageSquare,
  PlusCircle,
  Settings,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { cn, roleHome, roleLabels } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

const profile = { icon: UserRound, href: "/dashboard/profile", label: "Profile" };
const settings = { icon: Settings, href: "/dashboard/settings", label: "Settings" };
const create = { icon: PlusCircle, href: "/dashboard/requests/create", label: "Create Request" };

function navFor(role) {
  const overview = { icon: LayoutDashboard, href: roleHome[role], label: "Overview" };
  if (role === "admin") {
    return [
      overview,
      { icon: Users, href: "/dashboard/admin/users", label: "Manage Users" },
      { icon: ListChecks, href: "/dashboard/requests", label: "Manage Requests" },
      create,
      { icon: BarChart3, href: "/dashboard/admin/reports", label: "Reports" },
      { icon: MessageSquare, href: "/dashboard/admin/messages", label: "Contact Messages" },
      profile,
      settings,
    ];
  }
  if (role === "volunteer") {
    return [overview, { icon: ListChecks, href: "/dashboard/requests", label: "All Requests" }, create, profile, settings];
  }
  return [
    overview,
    { icon: ListChecks, href: "/dashboard/requests", label: "My Requests" },
    create,
    { icon: HandHeart, href: "/dashboard/donations", label: "My Donations" },
    profile,
    settings,
  ];
}

function NavList({ items, pathname, onNavigate }) {
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-1">
      {items.map((item) => {
        const isOverview = item.label === "Overview";
        const active = isOverview ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "focus-ring flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
              active
                ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
                : "text-ink hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <item.icon className="size-5 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function UserCard({ user }) {
  return (
    <div className="mb-4 flex items-center gap-3 border-b border-line pb-4">
      <Avatar name={user.name} src={user.avatar} size={44} />
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink">{user.name}</p>
        <p className="text-xs text-muted">{roleLabels[user.role]}</p>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [drawer, setDrawer] = useState({ open: false, path: pathname });
  const open = drawer.open && drawer.path === pathname;

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setDrawer({ open: false, path: pathname });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, pathname]);

  if (!user) return null;
  const items = navFor(user.role);
  const close = () => setDrawer({ open: false, path: pathname });

  return (
    <>
      <aside className="hidden w-64 shrink-0 border-r border-line bg-surface p-5 lg:block">
        <UserCard user={user} />
        <NavList items={items} pathname={pathname} />
      </aside>

      <div className="sticky top-16 z-30 flex items-center justify-between border-b border-line bg-surface px-4 py-2 lg:hidden">
        <p className="text-sm font-semibold text-muted">{roleLabels[user.role]} dashboard</p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setDrawer({ open: !open, path: pathname })}
          aria-expanded={open}
          aria-controls="dashboard-drawer"
        >
          <Menu className="size-4" aria-hidden="true" />
          Menu
        </Button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-slate-950/60" onClick={close} aria-hidden="true" />
          <aside id="dashboard-drawer" className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto bg-surface p-5 shadow-2xl">
            <div className="mb-4 flex justify-end">
              <Button variant="ghost" size="icon" onClick={close} aria-label="Close menu">
                <X className="size-5" />
              </Button>
            </div>
            <UserCard user={user} />
            <NavList items={items} pathname={pathname} onNavigate={close} />
          </aside>
        </div>
      )}
    </>
  );
}
