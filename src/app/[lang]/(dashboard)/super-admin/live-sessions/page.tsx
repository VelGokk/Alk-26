import LiveSessionsPanel from "@/components/dashboard/LiveSessionsPanel";
import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";

export default async function SuperAdminLiveSessionsPage() {
  await requireRole([Role.SUPERADMIN]);
  return <LiveSessionsPanel />;
}
