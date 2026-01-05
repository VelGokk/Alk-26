import { AppLocale, DEFAULT_LOCALE } from "./i18n";
import { paths } from "./paths";

const DEFAULT_REMINDER_MINUTES = 60;
const DEFAULT_WINDOW_MINUTES = 5;

export const EVENT_REMINDER_MINUTES_BEFORE = Number(
  process.env.EVENT_REMINDER_MINUTES_BEFORE ?? DEFAULT_REMINDER_MINUTES
);

export const EVENT_REMINDER_WINDOW_MINUTES = Number(
  process.env.EVENT_REMINDER_WINDOW_MINUTES ?? DEFAULT_WINDOW_MINUTES
);

export const EVENT_REMINDER_SECRET =
  process.env.EVENT_REMINDER_SECRET ?? "";

export function buildEventLink(slug: string, locale?: AppLocale) {
  const resolved = locale ?? DEFAULT_LOCALE;
  return paths.public.program(resolved, slug);
}
