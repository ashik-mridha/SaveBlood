"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, UserRound } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { DEMO_ACCOUNTS, useDemoLogin } from "@/hooks/useDemoLogin";
import { roleHome } from "@/lib/utils";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading, login } = useAuth();
  const { loginAs, activeDemo, error: demoError } = useDemoLogin();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace(roleHome[user.role] || "/dashboard");
  }, [authLoading, user, router]);

  const update = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  const validate = () => {
    const next = {};
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const { user: member } = await login(form.email.trim(), form.password);
      router.replace(roleHome[member.role] || "/dashboard");
    } catch (err) {
      setFormError(err.message);
      setErrors(err.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = (kind) => {
    const { email, password } = DEMO_ACCOUNTS[kind];
    setForm({ email, password });
    setErrors({});
    setFormError("");
    loginAs(kind);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your requests and respond to donors."
      footer={
        <>
          New to SaveBlood?{" "}
          <Link href="/register" className="font-semibold text-brand-600 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {(formError || demoError) && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {formError || demoError}
          </p>
        )}
        <Input label="Email" type="email" autoComplete="email" placeholder="you@example.com" value={form.email} onChange={update("email")} error={errors.email} required />
        <Input label="Password" type="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={update("password")} error={errors.password} required />
        <Button type="submit" size="lg" loading={submitting} disabled={Boolean(activeDemo)}>
          Log in
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted">
        <span className="h-px flex-1 bg-line" />
        Try a demo account
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Button variant="outline" onClick={() => handleDemo("user")} loading={activeDemo === "user"} disabled={submitting || Boolean(activeDemo)}>
          <UserRound className="size-4" aria-hidden="true" />
          Login as Demo User
        </Button>
        <Button variant="outline" onClick={() => handleDemo("admin")} loading={activeDemo === "admin"} disabled={submitting || Boolean(activeDemo)}>
          <ShieldCheck className="size-4" aria-hidden="true" />
          Login as Demo Admin
        </Button>
      </div>
    </AuthShell>
  );
}
