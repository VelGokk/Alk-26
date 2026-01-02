import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ProfileMenu from "./ProfileMenu";

export default async function Topbar({ lang }: { lang: string }) {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white/70 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          Dashboard
        </p>
        <h1 className="font-heading text-2xl text-ink">ALKAYA Control</h1>
      </div>
      {session?.user ? (
        <ProfileMenu
          lang={lang}
          name={session.user.name}
          email={session.user.email}
        />
      ) : null}
    </header>
  );
}
