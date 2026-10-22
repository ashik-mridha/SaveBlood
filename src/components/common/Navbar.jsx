"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, Menu, Settings, UserRound, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { guestLinks, memberLinks } from "@/lib/site";
import { cn, roleHome, roleLabels } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Avatar from "@/components/ui/Avatar";
import Dropdown from "@/components/ui/Dropdown";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";

function NavLink({ link, pathname, onClick, mobile }) {
  const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
  return (
    <Link
      href={link.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={cn(
        "focus-ring rounded-xl text-sm font-semibold transition-colors",
        mobile ? "block px-4 py-3" : "px-3 py-2",
        active
          ? "bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-200"
          : "text-ink hover:bg-slate-100 dark:hover:bg-slate-800"
      )}
    >
      {link.name}
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [menu, setMenu] = useState({ open: false, path: pathname });

  // The mobile menu closes itself whenever the route changes.
  const menuOpen = menu.open && menu.path === pathname;
  const setMenuOpen = (open) => setMenu({ open, path: pathname });

  const dashboardHref = roleHome[user?.role] || "/dashboard";
  const links = user ? [...memberLinks, { name: "Dashboard", href: dashboardHref }] : guestLinks;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const accountItems = [
    { label: "Dashboard", href: dashboardHref, icon: <LayoutDashboard className="size-4" /> },
    { label: "Profile", href: "/dashboard/profile", icon: <UserRound className="size-4" /> },
    { label: "Settings", href: "/dashboard/settings", icon: <Settings className="size-4" /> },
    { label: "Log out", onClick: handleLogout, icon: <LogOut className="size-4" />, danger: true },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-lg">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink key={link.href} link={link} pathname={pathname} />
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {loading ? (
            <div className="hidden h-10 w-24 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700/60 sm:block" aria-hidden="true" />
          ) : user ? (
            <Dropdown
              label="Account menu"
              items={accountItems}
              trigger={({ open }) => (
                <span className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Avatar name={user.name} src={user.avatar} size={36} />
                  <span className="hidden text-left leading-tight md:block">
                    <span className="block max-w-28 truncate text-sm font-semibold">{user.name}</span>
                    <span className="block text-xs text-muted">{roleLabels[user.role]}</span>
                  </span>
                  <ChevronDown className={cn("size-4 text-muted transition-transform", open && "rotate-180")} aria-hidden="true" />
                </span>
              )}
            />
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button href="/login" variant="ghost" size="sm">
                Log in
              </Button>
              <Button href="/register" size="sm">
                Register
              </Button>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-menu" aria-label="Mobile" className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-line bg-surface lg:hidden">
          <div className="container-page flex flex-col gap-1 py-4">
            {links.map((link) => (
              <NavLink key={link.href} link={link} pathname={pathname} mobile onClick={() => setMenuOpen(false)} />
            ))}
            {!user && !loading && (
              <div className="mt-3 grid grid-cols-2 gap-3 border-t border-line pt-4">
                <Button href="/login" variant="outline">
                  Log in
                </Button>
                <Button href="/register">Register</Button>
              </div>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
