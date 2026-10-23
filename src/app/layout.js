import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { SITE_URL } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const description =
  "SaveBlood connects blood donors with patients across Bangladesh. Find donors by blood group and location, post urgent blood requests and track every donation.";

export const metadata = {
  title: {
    default: "SaveBlood - Blood Donation Platform",
    template: "%s | SaveBlood",
  },
  description,
  keywords: ["blood donation", "blood donor", "donate blood", "blood bank", "Bangladesh", "SaveBlood"],
  robots: { index: true, follow: true },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "SaveBlood - Blood Donation Platform",
    description,
    url: SITE_URL,
    siteName: "SaveBlood",
    type: "website",
  },
  verification: process.env.GOOGLE_SEARCH_CLOUD_SECRET ? { google: process.env.GOOGLE_SEARCH_CLOUD_SECRET } : undefined,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col bg-surface-muted font-sans text-ink transition-colors duration-300">
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-xl focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to content
          </a>
          {children}
        </Providers>
      </body>
    </html>
  );
}
