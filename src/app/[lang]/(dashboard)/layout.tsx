import { ReactNode } from "react";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";
import { getFeatureFlags } from "@/config/feature-flags";
import { getActiveRoleFromCookies } from "@/lib/auth/activeRole";
import type { Role } from "@prisma/client";
import { createTranslator, getDictionary } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import LegalComplianceOverlay, {
  type LegalComplianceLabels,
} from "@/components/dashboard/legal/LegalComplianceOverlay";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const requestCookies = cookies();
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;
  if (!session?.user) {
    redirect(`/${resolvedParams.lang}/auth`);
  }

  const featureFlags = getFeatureFlags();
  const sessionRoles =
    session.user.roles && session.user.roles.length > 0
      ? session.user.roles
      : [session.user.role as Role];
  const activeRole = getActiveRoleFromCookies(requestCookies, sessionRoles);

  const dictionary = await getDictionary(resolvedParams.lang);
  const translate = createTranslator(dictionary);
  const overlayLabels: LegalComplianceLabels = {
    overlayTitle: translate("dashboard.legalOverlayTitle"),
    overlayBody: translate("dashboard.legalOverlayBody"),
    checkboxLabel: translate("dashboard.legalOverlayCheckbox"),
    acceptButton: translate("dashboard.legalOverlayButton"),
    signingLabel: translate("dashboard.legalOverlaySigning"),
    errorRequired: translate("dashboard.legalOverlayError"),
    errorMessage: translate("dashboard.legalErrorMessage"),
  };
  const activeDocument = await prisma.legalDocument.findFirst({
    where: { roleTarget: activeRole, isActive: true },
    select: { id: true, title: true, content: true, versionNumber: true },
  });
  const needsSignature =
    Boolean(activeDocument) &&
    (Boolean(session.user.pendingLegalUpdate) ||
      session.user.signedLegalDocumentId !== activeDocument?.id);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        lang={resolvedParams.lang}
        flags={featureFlags}
        activeRole={activeRole}
      />
      <div className="flex flex-1 flex-col">
        <Topbar
          lang={resolvedParams.lang}
          roles={sessionRoles}
          activeRole={activeRole}
        />
        <main className="flex-1 bg-grid px-6 py-8">{children}</main>
        <LegalComplianceOverlay
          document={needsSignature ? activeDocument : null}
          labels={overlayLabels}
        />
      </div>
    </div>
  );
}
