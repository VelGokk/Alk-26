import { prisma } from "@/lib/prisma";
import { updateIntegration } from "@/lib/actions/admin";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

const providers = [
  { id: "MercadoPago", env: ["MERCADOPAGO_ACCESS_TOKEN"] },
  { id: "Resend", env: ["RESEND_API_KEY"] },
  { id: "Cloudinary", env: ["CLOUDINARY_CLOUD_NAME"] },
  { id: "Mux", env: ["MUX_TOKEN_ID"] },
  { id: "OpenAI", env: ["OPENAI_API_KEY"] },
];

export default async function IntegrationsPage() {
  await requireRole([Role.SUPERADMIN]);
  const settings = await prisma.integrationSetting.findMany();

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Integraciones
        </p>
        <h1 className="font-heading text-3xl">Conectores activos</h1>
      </div>

      <div className="space-y-4">
        {providers.map((provider) => {
          const existing = settings.find((item) => item.provider === provider.id);
          const envConfigured = provider.env.every((key) => Boolean(process.env[key]));

          return (
            <form
              key={provider.id}
              action={updateIntegration}
              className="glass-panel space-y-4 rounded-2xl p-6"
            >
              <input type="hidden" name="provider" value={provider.id} />
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading text-xl">{provider.id}</h2>
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                    {envConfigured ? "ENV OK" : "ENV PENDIENTE"}
                  </p>
                </div>
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em]">
                  <input
                    type="checkbox"
                    name="isEnabled"
                    defaultChecked={existing?.isEnabled ?? false}
                  />
                  Activo
                </label>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <input
                  name="publicKey"
                  defaultValue={existing?.publicKey ?? ""}
                  placeholder="Public key (no secretos)"
                  className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                />
                <input
                  name="webhookUrl"
                  defaultValue={existing?.webhookUrl ?? ""}
                  placeholder="Webhook URL"
                  className="rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
                />
              </div>
              <textarea
                name="notes"
                defaultValue={existing?.notes ?? ""}
                placeholder="Notas internas"
                className="h-24 w-full rounded-xl border border-black/10 bg-white px-4 py-2 text-sm"
              />
              <p className="text-xs text-zinc-500">
                Secretos y tokens se gestionan via variables de entorno.
              </p>
              <button
                type="submit"
                className="rounded-full bg-ink px-4 py-2 text-xs uppercase tracking-[0.2em] text-white"
              >
                Guardar
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
