import { requireRole } from "@/lib/auth/guards";
import { Role } from "@prisma/client";
import { createTranslator, getDictionary, type AppLocale } from "@/lib/i18n";
import LegalManager, { type LegalLabels } from "@/components/dashboard/legal/LegalManager";

export default async function SuperAdminLegalPage({
  params,
}: {
  params: Promise<{ lang: AppLocale }>;
}) {
  const resolvedParams = await params;
  await requireRole([Role.SUPERADMIN]);
  const dictionary = await getDictionary(resolvedParams.lang);
  const translate = createTranslator(dictionary);

  const labels: LegalLabels = {
    heading: translate("dashboard.legalHeading"),
    subheading: translate("dashboard.legalSubheading"),
    roleLabel: translate("dashboard.legalRoleLabel"),
    roleHelp: translate("dashboard.legalRoleHelp"),
    titleLabel: translate("dashboard.legalTitleLabel"),
    contentLabel: translate("dashboard.legalContentLabel"),
    editorHelp: translate("dashboard.legalEditorHelp"),
    publishButton: translate("dashboard.legalPublishButton"),
    previewLabel: translate("dashboard.legalPreviewLabel"),
    previewHint: translate("dashboard.legalPreviewHint"),
    versionsLabel: translate("dashboard.legalVersionsLabel"),
    historyLabel: translate("dashboard.legalHistoryLabel"),
    activeBadge: translate("dashboard.legalActiveBadge"),
    inactiveBadge: translate("dashboard.legalInactiveBadge"),
    successMessage: translate("dashboard.legalSuccessMessage"),
    errorMessage: translate("dashboard.legalErrorMessage"),
    emptyState: translate("dashboard.legalEmptyState"),
    pendingNotice: translate("dashboard.legalPendingNotice"),
    loadingLabel: translate("dashboard.legalLoading"),
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {translate("dashboard.legal")}
        </p>
        <h1 className="font-heading text-3xl text-ink">
          {labels.heading}
        </h1>
        <p className="mt-2 text-sm text-slate-600">{labels.subheading}</p>
      </div>
      <LegalManager labels={labels} />
    </div>
  );
}
