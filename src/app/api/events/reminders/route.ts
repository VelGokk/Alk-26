import { NextResponse } from "next/server";
import { EVENT_REMINDER_SECRET } from "@/config/events";
import { sendEventReminders } from "@/lib/events";

function isAuthorized(request: Request) {
  if (!EVENT_REMINDER_SECRET) return true;
  const headerSecret =
    request.headers.get("x-event-reminder-secret") ??
    request.headers.get("authorization");
  if (headerSecret === EVENT_REMINDER_SECRET) return true;
  const url = new URL(request.url);
  const querySecret = url.searchParams.get("secret");
  return querySecret === EVENT_REMINDER_SECRET;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  const result = await sendEventReminders();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  return GET(request);
}
