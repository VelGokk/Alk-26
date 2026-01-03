import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import type { Role } from "@prisma/client";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;
  if (!session?.user) {
    redirect(`/${resolvedParams.lang}/auth`);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar lang={resolvedParams.lang} role={session.user.role as Role} />
      <div className="flex flex-1 flex-col">
        <Topbar lang={resolvedParams.lang} />
        <main className="flex-1 bg-grid px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
