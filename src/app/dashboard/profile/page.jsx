"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { api, uploadImage } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { bloodGroups, districts, upazilas } from "@/components/geoData";
import { roleLabels } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Input, Select } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";
import PageHeader from "@/components/dashboard/PageHeader";

const PHONE_PATTERN = /^(?:\+?88)?01[3-9]\d{8}$/;

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [values, setValues] = useState({
    name: user.name || "",
    phone: user.phone || "",
    bloodGroup: user.bloodGroup || "",
    district: user.district || "",
    upazila: user.upazila || "",
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = (field) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value, ...(field === "district" ? { upazila: "" } : {}) }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleAvatar = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const avatar = await uploadImage(file);
      setUser(await api.updateProfile({ avatar }));
      toast.success("Profile photo updated.");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = {};
    if (values.name.trim().length < 2) found.name = "Name must be at least 2 characters.";
    if (values.phone && !PHONE_PATTERN.test(values.phone.replace(/[\s-]/g, ""))) found.phone = "Enter a valid mobile number, e.g. 01712345678.";
    if (!values.bloodGroup) found.bloodGroup = "Select a blood group.";
    if (!values.district) found.district = "Select a district.";
    if (!values.upazila) found.upazila = "Select an upazila.";
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    try {
      const payload = { ...values, name: values.name.trim() };
      if (!payload.phone) delete payload.phone;
      setUser(await api.updateProfile(payload));
      toast.success("Profile saved.");
    } catch (error) {
      setErrors(error.errors || {});
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader title="My profile" description="Keep your details current so patients can reach you when you are needed." />

      <Card className="mb-6">
        <CardBody className="flex flex-col items-center gap-5 sm:flex-row sm:p-6">
          <div className="relative">
            <Avatar name={user.name} src={user.avatar} size={96} />
            <label className="focus-within:ring-2 focus-within:ring-brand-500 absolute -bottom-1 -right-1 flex size-9 cursor-pointer items-center justify-center rounded-full bg-brand-600 text-white shadow hover:bg-brand-700">
              <Camera className="size-4" aria-hidden="true" />
              <span className="sr-only">{uploading ? "Uploading photo" : "Upload profile photo"}</span>
              <input type="file" accept="image/*" className="sr-only" onChange={handleAvatar} disabled={uploading} />
            </label>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-xl font-bold text-ink">{user.name}</p>
            <p className="text-sm text-muted">{user.email}</p>
            <div className="mt-2 flex justify-center gap-2 sm:justify-start">
              <Badge tone="solid">{user.bloodGroup}</Badge>
              <Badge>{roleLabels[user.role]}</Badge>
            </div>
            {uploading && <p className="mt-2 text-xs text-muted" role="status">Uploading photo…</p>}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="sm:p-6">
          <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
            <Input label="Full name" required value={values.name} onChange={set("name")} error={errors.name} maxLength={60} />
            <Input label="Phone" type="tel" value={values.phone} onChange={set("phone")} error={errors.phone} placeholder="01712345678" hint="Shared only with signed-in members." />
            <Select label="Blood group" required value={values.bloodGroup} onChange={set("bloodGroup")} options={bloodGroups} placeholder="Select blood group" error={errors.bloodGroup} />
            <Input label="Email" value={user.email} readOnly disabled hint="Email cannot be changed." />
            <Select label="District" required value={values.district} onChange={set("district")} options={districts} placeholder="Select district" error={errors.district} />
            <Select
              label="Upazila"
              required
              value={values.upazila}
              onChange={set("upazila")}
              options={upazilas[values.district] || []}
              placeholder={values.district ? "Select upazila" : "Choose a district first"}
              disabled={!values.district}
              error={errors.upazila}
            />
            <div className="flex justify-end sm:col-span-2">
              <Button type="submit" loading={saving}>
                Save changes
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
