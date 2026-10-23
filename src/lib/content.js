import { api } from "@/lib/api";
import { defaultBlogs } from "@/lib/defaults/blogs";
import { defaultFaqs } from "@/lib/defaults/faqs";
import { defaultTestimonials } from "@/lib/defaults/testimonials";

// Content sections try the API first. If it is unreachable, fails, or has nothing
// published yet, the bundled defaults are used so the section is never empty.
async function withFallback(request, fallback) {
  try {
    const data = await request();
    if (data?.items?.length) return data;
  } catch {
    // Silent by design: the defaults below are the graceful degradation path.
  }
  return { items: fallback, isFallback: true };
}

export const loadTestimonials = () => withFallback(() => api.getTestimonials(), defaultTestimonials);
export const loadFaqs = () => withFallback(() => api.getFaqs(), defaultFaqs);
export const loadLatestBlogs = (limit = 3) => withFallback(() => api.getBlogs({ limit }), defaultBlogs.slice(0, limit));
