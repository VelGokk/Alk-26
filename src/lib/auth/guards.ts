import { Role } from "@prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../auth";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/auth");
  }
  return session;
}

export async function requireRole(roles: Role[]) {
  const session = await requireSession();
  const role = session.user.role as Role;
  if (!roles.includes(role)) {
    redirect("/access-denied");
  }
  return session;
}
