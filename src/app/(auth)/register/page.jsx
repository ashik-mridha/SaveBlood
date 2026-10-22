"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, X } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { uploadImage } from "@/lib/api";
import { cn, roleHome } from "@/lib/utils";
import { bloodGroups, districts, upazilas } from "@/components/geoData";
import AuthShell from "@/components/auth/AuthShell";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const passwordRules = [
  { label: "At least 6 characters", test: (v) => v.length >= 6 },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
];

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading: authLoading, register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", bloodGroup: "", district: "", upazila: "" });
  const [avatar, setAvatar] = useState({ file: null, preview: "" });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && user) router.replace(roleHome[user.role] || "/dashboard");
  }, [authLoading, user, router]);

  const update = (field) => (event) => {
    const { value } = event.target;
    setForm((f) => ({ ...f, [field]: value, ...(field === "district" ? { upazila: "" } : {}) }));
  };

  const chooseAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (avatar.preview) URL.revokeObjectURL(avatar.preview);
    setAvatar({ file, preview: URL.createObjectURL(file) });
  };

  const clearAvatar = () => {
    if (avatar.preview) URL.revokeObjectURL(avatar.preview);
    setAvatar({ file: null, preview: "" });
  };

  const validate = () => {
    const next = {};
    if (form.name.trim().length < 2) next.name = "Enter your full name.";
    if (!EMAIL_PATTERN.test(form.email.trim())) next.email = "Enter a valid email address.";
    if (!passwordRules.every((rule) => rule.test(form.password))) next.password = "Password does not meet all the rules below.";
    if (form.password !== form.confirmPassword) next.confirmPassword = "Passwords do not match.";
    if (!form.bloodGroup) next.bloodGroup = "Select your blood group.";
    if (!form.district) next.district = "Select your district.";
    if (!form.upazila) next.upazila = "Select your upazila.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      const avatarUrl = avatar.file ? await uploadImage(avatar.file) : "";
      const { confirmPassword, ...payload } = form;
      const { user: member } = await register({ ...payload, name: payload.name.trim(), email: payload.email.trim(), avatar: avatarUrl });
      router.replace(roleHome[member.role] || "/dashboard");
    } catch (err) {
      setFormError(err.message);
      setErrors(err.errors || {});
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Register as a donor so patients nearby can reach you when it matters."
      footer={
        <>
          Already registered?{" "}
          <Link href="/login" className="font-semibold text-brand-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        {formError && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
            {formError}
          </p>
        )}

        <div className="flex items-center gap-4">
          <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-surface">
            {avatar.preview ? <Image src={avatar.preview} alt="Selected profile photo preview" fill sizes="80px" unoptimized className="object-cover" /> : <ImagePlus className="size-6 text-muted" aria-hidden="true" />}
          </div>
          <div className="flex flex-col gap-2">
            <label className="focus-within:ring-2 focus-within:ring-brand-500 inline-flex h-10 w-fit cursor-pointer items-center rounded-xl border border-line bg-surface px-4 text-sm font-semibold hover:border-brand-500">
              {avatar.file ? "Change photo" : "Upload photo (optional)"}
              <input type="file" accept="image/*" onChange={chooseAvatar} className="sr-only" />
            </label>
            {avatar.file && (
              <button type="button" onClick={clearAvatar} className="focus-ring inline-flex w-fit items-center gap-1 rounded text-xs font-semibold text-muted hover:text-brand-600">
                <X className="size-3" aria-hidden="true" /> Remove
              </button>
            )}
          </div>
        </div>

        <Input label="Full name" autoComplete="name" value={form.name} onChange={update("name")} error={errors.name} required />
        <Input label="Email" type="email" autoComplete="email" value={form.email} onChange={update("email")} error={errors.email} required />

        <div className="grid gap-5 sm:grid-cols-2">
          <Select label="Blood group" placeholder="Select" options={bloodGroups} value={form.bloodGroup} onChange={update("bloodGroup")} error={errors.bloodGroup} required />
          <Select label="District" placeholder="Select" options={districts} value={form.district} onChange={update("district")} error={errors.district} required />
        </div>
        <Select
          label="Upazila"
          placeholder={form.district ? "Select upazila" : "Choose a district first"}
          options={upazilas[form.district] || []}
          value={form.upazila}
          onChange={update("upazila")}
          error={errors.upazila}
          disabled={!form.district}
          required
        />

        <div className="flex flex-col gap-3">
          <Input label="Password" type="password" autoComplete="new-password" value={form.password} onChange={update("password")} error={errors.password} required />
          <ul className="grid gap-1.5 text-xs sm:grid-cols-2" aria-label="Password rules">
            {passwordRules.map((rule) => {
              const passed = rule.test(form.password);
              return (
                <li key={rule.label} className={cn("flex items-center gap-1.5", passed ? "text-emerald-700 dark:text-emerald-400" : "text-muted")}>
                  <Check className={cn("size-3.5", !passed && "opacity-30")} aria-hidden="true" />
                  {rule.label}
                </li>
              );
            })}
          </ul>
        </div>
        <Input label="Confirm password" type="password" autoComplete="new-password" value={form.confirmPassword} onChange={update("confirmPassword")} error={errors.confirmPassword} required />

        <Button type="submit" size="lg" loading={submitting}>
          Create account
        </Button>
        <p className="text-center text-xs text-muted">
          By registering you agree to our{" "}
          <Link href="/terms" className="font-semibold text-brand-600 hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-semibold text-brand-600 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
