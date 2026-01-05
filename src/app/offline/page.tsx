export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4 text-center text-white">
      <div className="max-w-lg rounded-3xl border border-white/10 bg-slate-900/60 p-8">
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
          Modo offline
        </p>
        <h1 className="mt-4 text-3xl font-bold">Parece que estás sin conexión</h1>
        <p className="mt-3 text-sm text-slate-300">
          Guardamos una copia de esta pantalla y podrás seguir leyendo algunos contenidos. Vuelve a intentar
          en cuanto tengas señal o recarga la aplicación.
        </p>
      </div>
    </div>
  );
}
