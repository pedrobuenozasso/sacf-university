"use server";

import { headers } from "next/headers";
import { appPath } from "@/lib/app-path";
import { prisma } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/send-verification-email";
import { createVerificationToken } from "@/lib/verification-tokens";

export type PasswordResetRequestResult = { ok: true } | { ok: false; error: string };

export async function requestPasswordReset(email: string): Promise<PasswordResetRequestResult> {
  const normalized = email.trim().toLowerCase();
  if (!normalized.includes("@") || normalized.length > 254) {
    return { ok: false, error: "Informe um email válido." };
  }

  // Always return the same confirmation below, whether the account exists or
  // not, so this endpoint cannot be used to enumerate Academy accounts.
  const user = await prisma.user.findUnique({
    where: { email: normalized },
    select: { emailVerified: true, passwordHash: true }
  });

  if (!user?.emailVerified || !user.passwordHash) return { ok: true };

  try {
    const token = await createVerificationToken(normalized, "password_reset");
    const host = (await headers()).get("host") ?? "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const url = `${protocol}://${host}${appPath("/redefinir-senha")}?token=${token}&email=${encodeURIComponent(normalized)}`;
    await sendPasswordResetEmail(normalized, url);
  } catch {
    return { ok: false, error: "Não foi possível enviar o email agora. Tente novamente em alguns minutos." };
  }

  return { ok: true };
}
