// Single source of truth for contact details and navigation.
// Override the contact values through NEXT_PUBLIC_* variables at deploy time.

export const SITE = {
  name: "SaveBlood",
  tagline: "Every drop connects a donor to a life.",
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "support@saveblood.org",
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "+880 1712-345678",
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS || "12/A Dhanmondi, Dhaka 1209, Bangladesh",
  hours: "Sat – Thu, 9:00 AM – 9:00 PM",
  socials: {
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL || "https://www.facebook.com",
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://www.linkedin.com",
    github: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com",
  },
};

export const guestLinks = [
  { name: "Home", href: "/" },
  { name: "Donation Requests", href: "/donation-requests" },
  { name: "Search Donors", href: "/search" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export const memberLinks = [
  { name: "Home", href: "/" },
  { name: "Donation Requests", href: "/donation-requests" },
  { name: "Search Donors", href: "/search" },
  { name: "Funding", href: "/funding" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
];

export const footerGroups = [
  {
    title: "Explore",
    links: [
      { name: "Donation Requests", href: "/donation-requests" },
      { name: "Search Donors", href: "/search" },
      { name: "Funding", href: "/funding" },
      { name: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { name: "Create Account", href: "/register" },
      { name: "Log In", href: "/login" },
      { name: "Dashboard", href: "/dashboard" },
    ],
  },
];
