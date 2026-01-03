import { prisma } from "@/lib/prisma";
import { createLiveSession } from "@/lib/actions/live";
import { isMuxConfigured } from "@/lib/integrations/mux";

export default async function LiveSessionsPanel() {
  const sessions = await prisma.liveSession.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="font-heading text-xl">Live sessions</h2>
        <p className="text-sm text-zinc-600">
          Estado Mux: {isMuxConfigured ? "Activo" : "Disabled"}
        </p>
        {!isMuxConfigured ? (
          <p className="mt-2 text-xs text-zinc-500">
            Configur� MUX_TOKEN_ID y MUX_TOKEN_SECRET para habilitar streaming.
          </p>
        ) : null}
      </div>

      <form action={createLiveSession} className="glass-panel rounded-2xl p-6 space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <input
            name="title"
            placeholder="Título de la sesión"
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
          <input
            name="scheduledAt"
            type="datetime-local"
            className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
        >
          Crear sesión
        </button>
      </form>

      <div className="space-y-3">
        {sessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
            No hay sesiones creadas.
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="glass-panel rounded-2xl p-4">
              <p className="font-heading text-lg">{session.title}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                {session.status}
              </p>
              {session.muxPlaybackId ? (
                <p className="text-sm text-zinc-600">
                  Playback ID: {session.muxPlaybackId}
                </p>
              ) : null}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

