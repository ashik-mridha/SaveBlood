"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const empty = { name: "", email: "", subject: "", message: "" };

function validate(values) {
  const errors = {};
  const name = values.name.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Name is required.";
  else if (name.length < 2) errors.name = "Name must be at least 2 characters.";
  else if (name.length > 80) errors.name = "Name must be at most 80 characters.";

  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter a valid email address.";

  if (!subject) errors.subject = "Subject is required.";
  else if (subject.length < 3) errors.subject = "Subject must be at least 3 characters.";
  else if (subject.length > 120) errors.subject = "Subject must be at most 120 characters.";

  if (!message) errors.message = "Message is required.";
  else if (message.length < 10) errors.message = "Message must be at least 10 characters.";
  else if (message.length > 2000) errors.message = "Message must be at most 2000 characters.";

  return errors;
}

export default function ContactForm({ compact = false, className }) {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setSuccess("");

    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSubmitting(true);
    try {
      const result = await api.sendContactMessage({
        name: values.name.trim(),
        email: values.email.trim(),
        subject: values.subject.trim(),
        message: values.message.trim(),
      });
      setSuccess(result.message);
      setValues(empty);
    } catch (error) {
      setErrors(error.errors || {});
      setFormError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-4", className)}>
      {success && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-500/40 bg-emerald-50 p-4 text-sm font-medium text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {success}
        </div>
      )}
      {formError && !Object.keys(errors).length && (
        <p role="alert" className="rounded-xl border border-red-500/40 bg-red-50 p-4 text-sm font-medium text-red-800 dark:bg-red-950/40 dark:text-red-200">
          {formError}
        </p>
      )}

      <div className={cn("grid gap-4", !compact && "sm:grid-cols-2")}>
        <Input label="Your name" name="name" autoComplete="name" required value={values.name} onChange={onChange} error={errors.name} />
        <Input label="Email address" name="email" type="email" autoComplete="email" required value={values.email} onChange={onChange} error={errors.email} />
      </div>
      <Input label="Subject" name="subject" required value={values.subject} onChange={onChange} error={errors.subject} />
      <Textarea
        label="Message"
        name="message"
        required
        rows={compact ? 4 : 6}
        value={values.message}
        onChange={onChange}
        error={errors.message}
        hint={`${values.message.trim().length}/2000 characters`}
      />
      <Button type="submit" size="lg" loading={submitting} className="w-full sm:w-fit">
        {!submitting && <Send className="size-4" aria-hidden="true" />}
        {submitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
