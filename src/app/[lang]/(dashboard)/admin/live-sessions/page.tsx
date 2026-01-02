import LiveSessionsPanel from "@/components/dashboard/LiveSessionsPanel";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function AdminLiveSessionsPage() {
  await requireRole([Role.ADMIN, Role.SUPERADMIN]);
  return <LiveSessionsPanel />;
}
