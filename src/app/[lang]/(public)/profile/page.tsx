import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function ProfilePage({ params }: { params: { lang: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${params.lang}/auth`);
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Perfil
        </p>
        <h1 className="font-heading text-3xl">Tu cuenta</h1>
      </div>
      <div className="glass-panel rounded-2xl p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Nombre
            </p>
            <p className="mt-1 text-sm">{user?.name ?? "Sin definir"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Email
            </p>
            <p className="mt-1 text-sm">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Rol
            </p>
            <p className="mt-1 text-sm">{user?.role}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Estado
            </p>
            <p className="mt-1 text-sm">
              {user?.isActive ? "Activo" : "Inactivo"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
