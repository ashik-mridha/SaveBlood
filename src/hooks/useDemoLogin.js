"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import { roleHome } from "@/lib/utils";

// Credentials of the accounts created by `npm run seed` in donation-server.
export const DEMO_ACCOUNTS = {
  user: { label: "Demo User", email: "user@saveblood.demo", password: "Donor@12345" },
  admin: { label: "Demo Admin", email: "admin@saveblood.demo", password: "Admin@12345" },
};

export function useDemoLogin() {
  const { login } = useAuth();
  const router = useRouter();
  const [activeDemo, setActiveDemo] = useState(null);
  const [error, setError] = useState("");

  const loginAs = useCallback(
    async (kind) => {
      const account = DEMO_ACCOUNTS[kind];
      setActiveDemo(kind);
      setError("");
      try {
        const { user } = await login(account.email, account.password);
        router.replace(roleHome[user.role] || "/dashboard");
      } catch (err) {
        setError(err.message);
      } finally {
        setActiveDemo(null);
      }
    },
    [login, router]
  );

  return { loginAs, activeDemo, error };
}
