"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { formatDate, roleLabels } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import PageHeader from "@/components/dashboard/PageHeader";

const emptyForm = { currentPassword: "", newPassword: "", confirmPassword: "" };

function passwordProblem(password) {
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/[a-z]/.test(password)) return "Password must include a lowercase letter.";
  if (!/[A-Z]/.test(password)) return "Password must include an uppercase letter.";
  if (!/\d/.test(password)) return "Password must include a number.";
  return "";
}

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const { theme, setTheme } = useTheme();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = {};
    if (!form.currentPassword) found.currentPassword = "Current password is required.";
    const problem = passwordProblem(form.newPassword);
    if (problem) found.newPassword = problem;
    if (form.confirmPassword !== form.newPassword) found.confirmPassword = "Passwords do not match.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      await api.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success("Password updated.");
      setForm(emptyForm);
    } catch (error) {
      setErrors(error.errors || {});
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Settings" description="Manage your password, appearance and account." />

      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Change password</CardTitle>
            <p className="text-sm text-muted">Use at least 6 characters with an uppercase letter, a lowercase letter and a number.</p>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} noValidate className="grid gap-5">
              <Input label="Current password" type="password" required autoComplete="current-password" value={form.currentPassword} onChange={set("currentPassword")} error={errors.currentPassword} />
              <Input label="New password" type="password" required autoComplete="new-password" value={form.newPassword} onChange={set("newPassword")} error={errors.newPassword} />
              <Input label="Confirm new password" type="password" required autoComplete="new-password" value={form.confirmPassword} onChange={set("confirmPassword")} error={errors.confirmPassword} />
              <div className="flex justify-end">
                <Button type="submit" loading={saving}>
                  Update password
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
          </CardHeader>
          <CardBody>
            <div role="radiogroup" aria-label="Theme" className="flex gap-3">
              {["light", "dark"].map((option) => (
                <Button key={option} variant={theme === option ? "primary" : "outline"} role="radio" aria-checked={theme === option} onClick={() => setTheme(option)} className="capitalize">
                  {option}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardBody>
            <dl className="grid gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted">Email</dt>
                <dd className="mt-1 break-all font-semibold text-ink">{user.email}</dd>
              </div>
              <div>
                <dt className="text-muted">Role</dt>
                <dd className="mt-1 font-semibold text-ink">{roleLabels[user.role]}</dd>
              </div>
              <div>
                <dt className="text-muted">Member since</dt>
                <dd className="mt-1 font-semibold text-ink">{formatDate(user.createdAt)}</dd>
              </div>
            </dl>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
