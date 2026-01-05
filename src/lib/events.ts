import type { AppLocale } from "@/config/i18n";
import { DEFAULT_LOCALE } from "@/config/i18n";
import { EVENT_REMINDER_MINUTES_BEFORE, EVENT_REMINDER_WINDOW_MINUTES, buildEventLink } from "@/config/events";
import { deliverEmail } from "@/lib/email";
import { notifyEvent } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { EnrollmentStatus } from "@prisma/client";

export type UpcomingEvent = {
  id: string;
  title: string;
  description?: string | null;
  scheduledAt: Date;
  link?: string | null;
  programTitle: string;
  programSlug: string;
};

export async function getUpcomingEventsForUser(
  userId: string,
  locale: AppLocale,
  limit = 3
): Promise<UpcomingEvent[]> {
  const now = new Date();
  const events = await prisma.event.findMany({
    where: {
      scheduledAt: { gt: now },
      program: {
        enrollments: {
          some: { userId, status: EnrollmentStatus.ACTIVE },
        },
      },
    },
    include: {
      program: true,
    },
    orderBy: { scheduledAt: "asc" },
    take: limit,
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    scheduledAt: event.scheduledAt,
    link: event.link ?? buildEventLink(event.program.slug ?? "", locale),
    programTitle: event.program.title,
    programSlug: event.program.slug,
  }));
}

export async function sendEventReminders() {
  const now = new Date();
  const startWindow = new Date(
    now.getTime() +
      (EVENT_REMINDER_MINUTES_BEFORE - EVENT_REMINDER_WINDOW_MINUTES) * 60_000
  );
  const endWindow = new Date(
    now.getTime() +
      (EVENT_REMINDER_MINUTES_BEFORE + EVENT_REMINDER_WINDOW_MINUTES) * 60_000
  );

  const events = await prisma.event.findMany({
    where: {
      scheduledAt: {
        gte: startWindow,
        lt: endWindow,
      },
    },
    include: {
      program: {
        select: {
          title: true,
          slug: true,
          enrollments: {
            where: { status: EnrollmentStatus.ACTIVE },
            include: { user: true },
          },
        },
      },
    },
  });

  let delivered = 0;
  let skipped = 0;

  for (const event of events) {
    for (const enrollment of event.program.enrollments) {
      const user = enrollment.user;
      if (!user?.email) {
        skipped += 1;
        continue;
      }
      const existing = await prisma.eventReminder.findUnique({
        where: {
          eventId_userId: {
            eventId: event.id,
            userId: user.id,
          },
        },
      });
      if (existing) {
        skipped += 1;
        continue;
      }

      const link =
        event.link ??
        buildEventLink(event.program.slug ?? "", DEFAULT_LOCALE);
      const scheduledLabel = new Intl.DateTimeFormat("es-AR", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(event.scheduledAt);

      const payload = {
        to: user.email,
        subject: `Recordatorio: ${event.title}`,
        html: `<p>Hola ${user.name ?? "Alkaya"}!</p>
<p>Tu programa ${event.program.title} tiene un evento programado para ${scheduledLabel}.</p>
<p><strong>${event.title}</strong></p>
${event.description ? `<p>${event.description}</p>` : ""}
<p>Sumate desde <a href="${link}">aquí</a>.</p>`,
        metadata: {
          eventId: event.id,
        },
      };

      const sent = await deliverEmail(payload);
      if (!sent) {
        continue;
      }

      await prisma.eventReminder.create({
        data: {
          eventId: event.id,
          userId: user.id,
        },
      });

      await notifyEvent(
        user.id,
        `Recordatorio: ${event.title}`,
        `El evento arranca en ${scheduledLabel}.`
      );

      delivered += 1;
    }
  }

  return { sent: delivered, skipped };
}
