import { SITE_URL } from "@/lib/utils";

const staticRoutes = [
  { path: "/", priority: 1 },
  { path: "/donation-requests", priority: 0.9 },
  { path: "/search", priority: 0.8 },
  { path: "/funding", priority: 0.6 },
  { path: "/blog", priority: 0.7 },
  { path: "/about", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
  { path: "/login", priority: 0.4 },
  { path: "/register", priority: 0.5 },
];

async function fetchBlogSlugs() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return [];
  try {
    const res = await fetch(`${apiUrl}/api/blogs?limit=24`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items.map((post) => ({ slug: post.slug, date: post.publishedAt }));
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const now = new Date();
  const pages = staticRoutes.map(({ path, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    priority,
  }));

  const posts = (await fetchBlogSlugs()).map(({ slug, date }) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: date ? new Date(date) : now,
    priority: 0.6,
  }));

  return [...pages, ...posts];
}
