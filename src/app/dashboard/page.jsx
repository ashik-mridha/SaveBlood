"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { roleHome } from "@/lib/utils";

export default function DashboardIndex() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) router.replace(roleHome[user.role] || roleHome.donor);
  }, [user, router]);

  return null;
}
