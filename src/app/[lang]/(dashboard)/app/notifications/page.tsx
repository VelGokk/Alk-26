"use server";

import { prisma } from "@/lib/prisma";
import { createTranslator, getDictionary, isLocale, DEFAULT_LOCALE } from "@/lib/i18n";
import { requireSession } from "@/lib/auth/guards";
import { NotificationType } from "@prisma/client";
import { ALL_NOTIFICATION_TYPES, NOTIFICATION_TYPE_LABEL_KEYS } from "@/config/notifications";
import {
  markAllNotificationsRead,
  markNotificationRead,
  updateNotificationPreference,
} from "@/lib/actions/notifications";

export default async function NotificationsPage({
  params,
}: {
  params: { lang: string };
}) {
  const lang = isLocale(params.lang) ? params.lang : DEFAULT_LOCALE;
  const dictionary = await getDictionary(lang);
  const translate = createTranslator(dictionary);
  const session = await requireSession();

  const [notifications, preferences] = await prisma.$transaction([
    prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
    prisma.notificationPreference.findMany({
      where: { userId: session.user.id },
    }),
  ]);

  const preferenceMap = new Map(
    preferences.map((pref) => [pref.type, pref.enabled])
  );

  const titleLabel = translate("dashboard.notificationsTitle");
  const emptyLabel = translate("dashboard.notificationsEmpty");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {translate("dashboard.notifications")}
        </p>
        <h1 className="font-heading text-3xl">{titleLabel}</h1>
      </div>

      <section className="glass-panel space-y-4 rounded-3xl border border-black/10 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-zinc-700">
              {translate("dashboard.notificationsPreferencesTitle")}
            </p>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {translate("dashboard.notificationsPreferencesHint")}
            </p>
          </div>
          <form action={markAllNotificationsRead}>
            <button
              type="submit"
              className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.2em]"
            >
              {translate("dashboard.notificationsMarkAllRead")}
            </button>
          </form>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          {ALL_NOTIFICATION_TYPES.map((type) => {
            const enabled = preferenceMap.get(type) ?? true;
            return (
              <form
                key={type}
                action={updateNotificationPreference}
                className="flex items-center justify-between rounded-2xl border border-black/10 p-3 text-sm"
              >
                <div>
                  <p className="font-semibold">
                    {translate(NOTIFICATION_TYPE_LABEL_KEYS[type])}
                  </p>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                    {enabled
                      ? translate("dashboard.notificationsEnabled")
                      : translate("dashboard.notificationsDisabled")}
                  </p>
                </div>
                <input type="hidden" name="type" value={type} />
                <input type="hidden" name="enabled" value={enabled ? "false" : "true"} />
                <button
                  type="submit"
                  className="rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                >
                  {enabled
                    ? translate("dashboard.notificationsDisable")
                    : translate("dashboard.notificationsEnable")}
                </button>
              </form>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-black/10 p-6 text-sm text-zinc-600">
            {emptyLabel}
          </div>
        ) : (
          notifications.map((notification) => (
            <article
              key={notification.id}
              className={`space-y-2 rounded-2xl border border-black/10 p-4 ${
                notification.isRead ? "opacity-60" : "bg-white"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
                  {translate(NOTIFICATION_TYPE_LABEL_KEYS[notification.type])}
                </p>
                <span className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
                  {new Date(notification.createdAt).toLocaleString(lang)}
                </span>
              </div>
              <div>
                <p className="font-heading text-lg text-ink">{notification.title}</p>
                <p className="text-sm text-slate-600">{notification.body}</p>
              </div>
              {!notification.isRead && (
                <form action={markNotificationRead}>
                  <input type="hidden" name="notificationId" value={notification.id} />
                  <button
                    type="submit"
                    className="rounded-full border border-black/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                  >
                    {translate("dashboard.notificationsMarkRead")}
                  </button>
                </form>
              )}
            </article>
          ))
        )}
      </section>
    </div>
  );
}
