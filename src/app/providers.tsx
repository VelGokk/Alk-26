"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { InstallToast } from "@/components/pwa/InstallToast";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <SessionProvider>
        <ServiceWorkerRegister />
        <InstallToast />
        {children}
      </SessionProvider>
    </ThemeProvider>
  );
}
