"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { clientAddress, consumeRateLimit } from "@/lib/rate-limit";
import { createVerificationCode } from "@/lib/verification-tokens";
import { sendAdminLoginCodeEmail } from "@/lib/send-verification-email";

const ADMIN_ROLES = new Set(["sacf_admin", "org_admin"]);
const adminEmailMfaEnabled = process.env.ADMIN_EMAIL_MFA_ENABLED !== "false";

export type LoginCodeResult = { ok: true; requiresCode: boolean } | { ok: false };

// Password validation happens before an email is sent. The response remains
// deliberately generic so this action cannot be used to enumerate accounts.
export async function requestAdminLoginCode(email: string, password: string): Promise<LoginCodeResult> {
  const normalized = email.trim().toLowerCase();
  const requestHeaders = await headers();
  const ip = clientAddress(requestHeaders);
  const [emailAllowed, ipAllowed] = await Promise.all([
    consumeRateLimit({ namespace: "login-email", identifier: normalized, max: 8, windowMs: 15 * 60_000 }),
    consumeRateLimit({ namespace: "login-ip", identifier: ip, max: 30, windowMs: 15 * 60_000 })
  ]);
  if (!emailAllowed || !ipAllowed) return { ok: false };

  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: {
      id: true,
      passwordHash: true,
      emailVerified: true,
      memberships: { where: { status: "active" }, select: { role: true } }
    }
  });
  if (!user?.emailVerified || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) return { ok: false };

  const isAdmin = user.memberships.some((membership) => ADMIN_ROLES.has(membership.role));
  if (!adminEmailMfaEnabled || !isAdmin) return { ok: true, requiresCode: false };

  const [emailCodeAllowed, ipCodeAllowed] = await Promise.all([
    consumeRateLimit({ namespace: "admin-login-code-email", identifier: normalized, max: 3, windowMs: 15 * 60_000 }),
    consumeRateLimit({ namespace: "admin-login-code-ip", identifier: ip, max: 10, windowMs: 15 * 60_000 })
  ]);
  if (!emailCodeAllowed || !ipCodeAllowed) return { ok: false };

  try {
    const code = await createVerificationCode(normalized, "admin_login_otp");
    await sendAdminLoginCodeEmail(normalized, code);
    return { ok: true, requiresCode: true };
  } catch {
    return { ok: false };
  }
}
