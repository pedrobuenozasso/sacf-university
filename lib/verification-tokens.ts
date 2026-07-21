import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/db";

const TOKEN_TTL_MINUTES = 30;

export type VerificationPurpose = "email_verify" | "password_reset";

function hashToken(rawToken: string) {
  return createHash("sha256").update(rawToken).digest("hex");
}

export async function createVerificationToken(email: string, purpose: VerificationPurpose) {
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000);

  // Drop any outstanding tokens for this email/purpose so old links stop working.
  await prisma.verificationToken.deleteMany({ where: { email, purpose } });
  await prisma.verificationToken.create({ data: { email, tokenHash, purpose, expiresAt } });

  return rawToken;
}

export async function consumeVerificationToken(
  email: string,
  rawToken: string,
  purpose: VerificationPurpose
): Promise<boolean> {
  if (!rawToken) return false;
  const tokenHash = hashToken(rawToken);
  const record = await prisma.verificationToken.findUnique({ where: { tokenHash } });

  if (!record || record.email !== email || record.purpose !== purpose) return false;

  // Single-use: always delete once looked up, whether valid or expired.
  await prisma.verificationToken.delete({ where: { id: record.id } });

  return record.expiresAt >= new Date();
}
