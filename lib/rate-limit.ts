import { createHmac } from "crypto";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type Limit = { namespace: string; identifier: string; max: number; windowMs: number };

function hashedKey(namespace: string, identifier: string) {
  const secret = process.env.AUTH_SECRET ?? "development-rate-limit-key";
  return `${namespace}:${createHmac("sha256", secret).update(identifier).digest("hex")}`;
}

// The proxy-provided client address is used only as an additional abuse key;
// account-based limiting remains effective even if a client spoofs this header.
export function clientAddress(headers: Headers) {
  return headers.get("x-real-ip") ?? headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function consumeRateLimit({ namespace, identifier, max, windowMs }: Limit) {
  const now = new Date();
  const resetBefore = new Date(now.getTime() - windowMs);
  const key = hashedKey(namespace, identifier);
  const rows = await prisma.$queryRaw<{ count: number }[]>(Prisma.sql`
    INSERT INTO rate_limits ("key", count, window_started_at, updated_at)
    VALUES (${key}, 1, ${now}, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      count = CASE WHEN rate_limits.window_started_at < ${resetBefore} THEN 1 ELSE rate_limits.count + 1 END,
      window_started_at = CASE WHEN rate_limits.window_started_at < ${resetBefore} THEN ${now} ELSE rate_limits.window_started_at END,
      updated_at = ${now}
    RETURNING count
  `);
  return (rows[0]?.count ?? max + 1) <= max;
}

export async function clearRateLimit(namespace: string, identifier: string) {
  await prisma.rateLimit.delete({ where: { key: hashedKey(namespace, identifier) } }).catch(() => undefined);
}
