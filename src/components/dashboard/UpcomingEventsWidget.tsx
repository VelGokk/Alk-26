import Link from "next/link";
import type { AppDictionary, AppLocale } from "@/config/i18n";
import type { UpcomingEvent } from "@/lib/events";

type UpcomingEventsWidgetProps = {
  dictionary: AppDictionary;
  events: UpcomingEvent[];
  locale: AppLocale;
};

const formatDateTime = (value: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(value);

export function UpcomingEventsWidget({
  dictionary,
  events,
  locale,
}: UpcomingEventsWidgetProps) {
  if (events.length === 0) {
    return (
      <section className="space-y-2 rounded-3xl border border-black/10 bg-white/90 p-5 shadow-soft">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dictionary.dashboard.eventsTitle}
        </p>
        <h2 className="font-heading text-2xl text-ink">
          {dictionary.dashboard.eventsSubtitle}
        </h2>
        <p className="text-sm text-zinc-600">
          {dictionary.dashboard.eventsEmpty}
        </p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-3xl border border-black/10 bg-white/90 p-5 shadow-soft">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500">
          {dictionary.dashboard.eventsTitle}
        </p>
        <h2 className="font-heading text-2xl text-ink">
          {dictionary.dashboard.eventsSubtitle}
        </h2>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <article
            key={event.id}
            className="rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ink">{event.title}</p>
                {event.description ? (
                  <p className="text-xs text-zinc-500">{event.description}</p>
                ) : null}
                <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                  {dictionary.dashboard.eventsProgramLabel}: {event.programTitle}
                </p>
              </div>
              <div className="text-right text-[11px] tracking-[0.3em] text-zinc-500">
                {dictionary.dashboard.eventsDateLabel}
                <p className="font-semibold text-ink">
                  {formatDateTime(event.scheduledAt, locale)}
                </p>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3 text-xs uppercase tracking-[0.3em]">
              <Link
                href={event.link ?? "#"}
                target="_blank"
                className="rounded-full border border-black/10 px-4 py-2 text-ink transition hover:border-ink hover:text-ink"
              >
                {dictionary.dashboard.eventsLinkLabel}
              </Link>
              <span className="text-[10px] text-zinc-500">
                {dictionary.dashboard.eventsReminderLabel}
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
