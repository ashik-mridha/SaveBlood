const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
const TOKEN_KEY = "saveblood_token";

export class ApiError extends Error {
  constructor(message, { status, errors, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors || {};
    this.code = code;
  }
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

let sessionExpiredHandler = null;

/** AuthProvider registers a callback that clears the user and redirects to /login. */
export function onSessionExpired(handler) {
  sessionExpiredHandler = handler;
  return () => {
    if (sessionExpiredHandler === handler) sessionExpiredHandler = null;
  };
}

/** Builds a query string, skipping empty values. */
export function qs(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, value);
    }
  });
  return search.toString();
}

export async function apiFetch(endpoint, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    if (res.status === 401 && token && data.code) {
      removeToken();
      sessionExpiredHandler?.(data.code);
    }
    throw new ApiError(data.message || "Something went wrong. Please try again.", {
      status: res.status,
      errors: data.errors,
      code: data.code,
    });
  }

  return data;
}

const send = (method) => (endpoint, body) =>
  apiFetch(endpoint, { method, body: body === undefined ? undefined : JSON.stringify(body) });
const post = send("POST");
const patch = send("PATCH");

export const api = {
  // Auth
  register: (body) => post("/api/auth/register", body),
  login: (body) => post("/api/auth/login", body),
  getMe: () => apiFetch("/api/auth/me"),

  // Users
  updateProfile: (body) => patch("/api/users/profile", body),
  changePassword: (body) => patch("/api/users/password", body),
  getUsers: (params) => apiFetch(`/api/users?${qs(params)}`),
  updateUserRole: (id, role) => patch(`/api/users/${id}/role`, { role }),
  updateUserStatus: (id, status) => patch(`/api/users/${id}/status`, { status }),
  searchDonors: (params) => apiFetch(`/api/users/search?${qs(params)}`),

  // Donation requests
  getPublicRequests: (params) => apiFetch(`/api/donation-requests/public?${qs(params)}`),
  getRequests: (params) => apiFetch(`/api/donation-requests?${qs(params)}`),
  getRequest: (id) => apiFetch(`/api/donation-requests/${id}`),
  getRelatedRequests: (id) => apiFetch(`/api/donation-requests/${id}/related`),
  createRequest: (body) => post("/api/donation-requests", body),
  updateRequest: (id, body) => patch(`/api/donation-requests/${id}`, body),
  updateRequestStatus: (id, status) => patch(`/api/donation-requests/${id}/status`, { status }),
  donateToRequest: (id, body) => post(`/api/donation-requests/${id}/donate`, body),
  deleteRequest: (id) => apiFetch(`/api/donation-requests/${id}`, { method: "DELETE" }),

  // Funding
  getFundings: (params) => apiFetch(`/api/funding?${qs(params)}`),
  getTotalFunds: () => apiFetch("/api/funding/total"),
  createCheckoutSession: (body) => post("/api/funding/create-checkout-session", body),
  confirmFunding: (sessionId) => post("/api/funding/confirm", { sessionId }),

  // Stats
  getPublicStats: () => apiFetch("/api/stats/public"),
  getAdminStats: () => apiFetch("/api/stats/admin"),
  getVolunteerStats: () => apiFetch("/api/stats/volunteer"),
  getDonorStats: () => apiFetch("/api/stats/donor"),

  // Contact messages
  sendContactMessage: (body) => post("/api/contact", body),
  getContactMessages: (params) => apiFetch(`/api/contact?${qs(params)}`),
  updateContactStatus: (id, status) => patch(`/api/contact/${id}/status`, { status }),
  deleteContactMessage: (id) => apiFetch(`/api/contact/${id}`, { method: "DELETE" }),

  // Content
  getBlogs: (params) => apiFetch(`/api/blogs?${qs(params)}`),
  getBlog: (slug) => apiFetch(`/api/blogs/${slug}`),
  getTestimonials: () => apiFetch("/api/testimonials"),
  getFaqs: () => apiFetch("/api/faqs"),
};

/** Uploads an image to the configured image host and returns its public URL. */
export async function uploadImage(file) {
  const key = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;
  if (!key) throw new ApiError("Image uploads are not configured.");
  if (!file.type.startsWith("image/")) throw new ApiError("Please choose an image file.");
  if (file.size > 5 * 1024 * 1024) throw new ApiError("Images must be 5 MB or smaller.");

  const body = new FormData();
  body.append("image", file);
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body });
  const data = await res.json().catch(() => ({}));
  if (!data.success) throw new ApiError("Image upload failed. Please try again.");
  return data.data.url;
}
