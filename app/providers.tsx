"use client";

import { RegisterServiceWorker } from "@/components/register-sw";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RegisterServiceWorker />
      {children}
    </ThemeProvider>
  );
}
