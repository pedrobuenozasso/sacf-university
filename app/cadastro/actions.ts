"use server";

import { prisma } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/send-verification-email";
import { createVerificationToken } from "@/lib/verification-tokens";

export type SignupResult = { ok: true } | { ok: false; error: string };

export async function requestSignup(email: string): Promise<SignupResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || normalized.length > 254) {
    return { ok: false, error: "Informe um email válido." };
  }

  const existing = await prisma.user.findUnique({ where: { email: normalized } });
  if (!existing) {
    await prisma.user.create({
      data: { email: normalized, name: normalized.split("@")[0] }
    });
  }
  // If the user already exists (verified or not), we still just (re)send a link —
  // the response is identical either way so we never reveal account existence.

  const rawToken = await createVerificationToken(normalized, "email_verify");
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const url = `${baseUrl}/verificar?token=${rawToken}&email=${encodeURIComponent(normalized)}`;

  await sendVerificationEmail(normalized, url);

  return { ok: true };
}
