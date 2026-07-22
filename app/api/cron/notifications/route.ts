import { NextResponse } from "next/server";
import { runOperationalNotifications } from "@/lib/operational-notifications";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ ok: true, ...(await runOperationalNotifications()) });
  } catch {
    return NextResponse.json({ error: "notification_run_failed" }, { status: 500 });
  }
}
