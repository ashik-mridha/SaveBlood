"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { roleHome } from "@/lib/utils";

/** Renders children only for signed-in users whose role is in `roles` (any role when omitted). */
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const allowed = Boolean(user) && (roles.length === 0 || roles.includes(user.role));

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace("/login");
    else if (!allowed) router.replace(roleHome[user.role] || "/dashboard");
  }, [loading, user, allowed, router]);

  if (loading || !allowed) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
        <Loader2 className="size-8 animate-spin text-brand-600" />
      </div>
    );
  }

  return children;
}
