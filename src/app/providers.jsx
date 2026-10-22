"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "@/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <ToastProvider>
        <AuthProvider>{children}</AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
