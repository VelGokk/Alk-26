"use client";

import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
};

export function InstallToast() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
      setVisible(true);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === "accepted") {
      setVisible(false);
    }
    setPromptEvent(null);
  };

  if (!visible || !promptEvent) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl border border-white/20 bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-4 text-sm text-white shadow-2xl shadow-black/50">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
        ALKAYA App
      </p>
      <p className="mt-2 font-semibold">
        Instala ALKAYA en tu dispositivo para acceso rápido.
      </p>
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleInstall}
          className="rounded-full bg-emerald-400 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900"
        >
          Instalar
        </button>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-xs uppercase tracking-[0.3em] text-slate-400"
        >
          No, gracias
        </button>
      </div>
    </div>
  );
}
