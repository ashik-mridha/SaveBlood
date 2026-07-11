const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/common/Navbar";
import { Providers } from "./providers";
import Footer from "@/components/common/Footer";


const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700", "800", "900"]
});

export const metadata = {
  title: {
    default: "SaveBlood - Blood Donation Platform",
    template: "%s | SaveBlood",
  },
  description:
    "Donate blood and save lives. Find blood donors across Bangladesh.",
  keywords: [
    "blood donation",
    "blood donor",
    "donate blood",
    "blood bank",
    "Bangladesh",
    "SaveBlood",
  ],
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://assignment-10-snowy.vercel.app"), 
  openGraph: {
    title: "SaveBlood - Blood Donation Platform",
    description:
      "Donate blood and save lives. Find blood donors across Bangladesh.",
    url: "https://assignment-10-snowy.vercel.app",
    siteName: "SaveBlood",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${robotoSlab.className} h-full antialiased`}
      suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white text-slate-900 dark:bg-[#061325] dark:text-white transition-colors duration-300">
        <Providers>
          <Navbar />
           <main >
             {children}
           </main> 
          <Footer />
        </Providers>
      </body>
    </html>
  );
}