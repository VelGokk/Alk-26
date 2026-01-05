"use client";

import Link from "next/link";

type ErrorFallbackProps = {
  reset?: () => void;
};

export function ErrorFallback({ reset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-white">
      <div className="w-full max-w-lg space-y-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-center shadow-2xl shadow-black/40">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Error 500
        </p>
        <h1 className="text-3xl font-bold">Algo no salió como esperábamos</h1>
        <p className="text-sm text-slate-300">
          Nuestro equipo ya fue notificado y estamos trabajando para resolverlo.
          Mientras tanto, puedes intentar recargar la página o volver al inicio.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset?.()}
            className="rounded-full bg-ink px-6 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:bg-ink/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Reintentar
          </button>
          <Link
            href="/es-ar"
            className="rounded-full border border-white/20 px-6 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
