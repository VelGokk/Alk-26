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
  params: any;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect(`/${params.lang}/auth`);
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar lang={params.lang} role={session.user.role as Role} />
      <div className="flex flex-1 flex-col">
        <Topbar lang={params.lang} />
        <main className="flex-1 bg-grid px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
