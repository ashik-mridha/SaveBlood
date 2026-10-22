export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://assignment-10-snowy.vercel.app").replace(/\/$/, "");

export const statusLabels = {
  pending: "Pending",
  inprogress: "In Progress",
  done: "Completed",
  canceled: "Canceled",
};

export const urgencyLabels = {
  normal: "Normal",
  urgent: "Urgent",
  critical: "Critical",
};

export function getStatusTone(status) {
  return { pending: "amber", inprogress: "slate", done: "green", canceled: "red" }[status] || "slate";
}

export function getUrgencyTone(urgency) {
  return { critical: "red", urgent: "amber", normal: "slate" }[urgency] || "slate";
}

export const formatStatus = (status) => statusLabels[status] || status;

export function formatPlace(value = "") {
  return value.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatLocation(district, upazila) {
  return [upazila, district].filter(Boolean).map(formatPlace).join(", ");
}

export function formatDate(date, options = { day: "numeric", month: "short", year: "numeric" }) {
  if (!date) return "";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString("en-GB", options);
}

export function formatTime(time) {
  if (!time) return "";
  const [hours, minutes] = time.split(":").map(Number);
  const suffix = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12}:${String(minutes).padStart(2, "0")} ${suffix}`;
}

export function formatCurrency(amount = 0) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}

export function formatNumber(value = 0) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function initials(name = "") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

export const roleLabels = { donor: "Donor", volunteer: "Volunteer", admin: "Admin" };

export const roleHome = {
  admin: "/dashboard/admin",
  volunteer: "/dashboard/volunteer",
  donor: "/dashboard/donor",
};

export const DEFAULT_REQUEST_IMAGE = "/images/hospital.svg";
