import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileMenu from "./ProfileMenu";
import FlowGlowCTA from "@/components/ui/FlowGlowCTA";
import type { FeatureFlags } from "@/config/navigation";
import type { Role } from "@prisma/client";

export default async function Topbar({
  lang,
  roles,
  activeRole,
  flags,
  flowReady,
}: {
  lang: string;
  roles: Role[];
  activeRole: Role;
  flags: FeatureFlags;
  flowReady: boolean;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white/70 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Dashboard
        </p>
        <h1 className="font-heading text-2xl text-ink">ALKAYA Control</h1>
      </div>
      <div className="flex items-center gap-4">
        {flags.flowGlowEnabled && (
          <FlowGlowCTA ready={flowReady} />
        )}
        <ProfileMenu
          lang={lang}
          name={session.user.name}
          email={session.user.email}
          role={activeRole}
          roles={roles}
        />
      </div>
    </header>
  );
}
