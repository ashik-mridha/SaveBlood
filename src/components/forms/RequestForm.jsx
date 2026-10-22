"use client";

import { useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { uploadImage } from "@/lib/api";
import { bloodGroups, districts, upazilas } from "@/components/geoData";
import Button from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

const urgencyOptions = [
  { key: "normal", label: "Normal - within a week" },
  { key: "urgent", label: "Urgent - within a few days" },
  { key: "critical", label: "Critical - within 24 hours" },
];

const emptyValues = {
  recipientName: "",
  bloodGroup: "",
  district: "",
  upazila: "",
  hospitalName: "",
  fullAddress: "",
  donationDate: "",
  donationTime: "",
  urgency: "normal",
  unitsNeeded: "1",
  requestMessage: "",
  images: [],
};

const lengthRule = (label, min, max) => (value) => {
  const text = value.trim();
  if (!text) return `${label} is required.`;
  if (text.length < min) return `${label} must be at least ${min} characters.`;
  if (text.length > max) return `${label} must be at most ${max} characters.`;
  return "";
};

const rules = {
  recipientName: lengthRule("Recipient name", 2, 80),
  hospitalName: lengthRule("Hospital name", 3, 120),
  fullAddress: lengthRule("Full address", 5, 200),
  requestMessage: lengthRule("Message", 10, 1000),
  bloodGroup: (value) => (value ? "" : "Select a blood group."),
  district: (value) => (value ? "" : "Select a district."),
  upazila: (value) => (value ? "" : "Select an upazila."),
  donationDate: (value) => (value ? "" : "Choose the date blood is needed."),
  donationTime: (value) => (value ? "" : "Choose a time."),
  unitsNeeded: (value) => {
    const units = Number(value);
    return Number.isInteger(units) && units >= 1 && units <= 10 ? "" : "Units must be a whole number between 1 and 10.";
  },
};

function validate(values) {
  return Object.fromEntries(Object.entries(rules).map(([field, rule]) => [field, rule(values[field])]).filter(([, message]) => message));
}

/** Shared create/edit form. `onSubmit(payload)` should throw an ApiError to surface server field errors. */
export default function RequestForm({ initial, submitLabel, onSubmit }) {
  const toast = useToast();
  const [values, setValues] = useState(() => (initial ? { ...emptyValues, ...initial, unitsNeeded: String(initial.unitsNeeded ?? 1) } : emptyValues));
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const set = (field) => (event) => {
    const { value } = event.target;
    setValues((prev) => ({ ...prev, [field]: value, ...(field === "district" ? { upazila: "" } : {}) }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addImages = async (event) => {
    const files = Array.from(event.target.files || []).slice(0, 4 - values.images.length);
    event.target.value = "";
    if (!files.length) return;
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setValues((prev) => ({ ...prev, images: [...prev.images, ...urls].slice(0, 4) }));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const payload = {
        ...Object.fromEntries(Object.entries(values).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value])),
        unitsNeeded: Number(values.unitsNeeded),
      };
      // Stored photos may be site-relative paths, which the API only accepts when unchanged.
      if (initial && JSON.stringify(values.images) === JSON.stringify(initial.images || [])) delete payload.images;
      await onSubmit(payload);
    } catch (error) {
      setErrors(error.errors || {});
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-5 sm:grid-cols-2">
      <Input label="Recipient name" required value={values.recipientName} onChange={set("recipientName")} error={errors.recipientName} maxLength={80} />
      <Select label="Blood group" required value={values.bloodGroup} onChange={set("bloodGroup")} options={bloodGroups} placeholder="Select blood group" error={errors.bloodGroup} />
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
      <Input label="Hospital name" required value={values.hospitalName} onChange={set("hospitalName")} error={errors.hospitalName} maxLength={120} />
      <Input label="Full address" required value={values.fullAddress} onChange={set("fullAddress")} error={errors.fullAddress} maxLength={200} hint="Ward, floor or cabin helps donors find you." />
      <Input label="Date needed" required type="date" min={initial ? undefined : today} value={values.donationDate} onChange={set("donationDate")} error={errors.donationDate} />
      <Input label="Time" required type="time" value={values.donationTime} onChange={set("donationTime")} error={errors.donationTime} />
      <Select label="Urgency" value={values.urgency} onChange={set("urgency")} options={urgencyOptions} error={errors.urgency} />
      <Input label="Units of blood needed" required type="number" min={1} max={10} value={values.unitsNeeded} onChange={set("unitsNeeded")} error={errors.unitsNeeded} />
      <Textarea className="sm:col-span-2" label="Why is blood needed?" required value={values.requestMessage} onChange={set("requestMessage")} error={errors.requestMessage} maxLength={1000} hint="Briefly describe the patient's condition and where donors should report." />

      <div className="sm:col-span-2">
        <p className="mb-2 text-sm font-semibold text-ink">Photos (optional, up to 4)</p>
        <div className="flex flex-wrap items-center gap-3">
          {values.images.map((url) => (
            <div key={url} className="relative size-20 overflow-hidden rounded-xl border border-line">
              <Image src={url} alt="Uploaded case photo" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => setValues((prev) => ({ ...prev, images: prev.images.filter((item) => item !== url) }))}
                aria-label="Remove photo"
                className="focus-ring absolute right-1 top-1 rounded-full bg-slate-900/80 p-0.5 text-white"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))}
          {values.images.length < 4 && (
            <label className="focus-within:ring-2 focus-within:ring-brand-500 flex size-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-line text-xs text-muted hover:border-brand-500">
              <ImagePlus className="size-5" aria-hidden="true" />
              {uploading ? "Uploading" : "Add"}
              <input type="file" accept="image/*" multiple className="sr-only" onChange={addImages} disabled={uploading} />
            </label>
          )}
        </div>
        {errors.images && <p role="alert" className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">{errors.images}</p>}
      </div>

      <div className="flex justify-end gap-3 sm:col-span-2">
        <Button href="/dashboard/requests" variant="outline">
          Cancel
        </Button>
        <Button type="submit" loading={submitting} disabled={uploading}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
