"use client";

import { SessionProvider } from "next-auth/react";
import { InstallToast } from "@/components/pwa/InstallToast";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ServiceWorkerRegister />
      <InstallToast />
      {children}
    </SessionProvider>
  );
}
