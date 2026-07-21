"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { consumeVerificationToken } from "@/lib/verification-tokens";

export type ResetPasswordResult = { ok: true } | { ok: false; error: string };

export async function resetPassword(email: string, token: string, password: string): Promise<ResetPasswordResult> {
  const normalized = email.trim().toLowerCase();
  if (password.length < 8) return { ok: false, error: "A senha precisa ter pelo menos 8 caracteres." };

  const valid = await consumeVerificationToken(normalized, token, "password_reset");
  if (!valid) return { ok: false, error: "Link inválido ou expirado. Solicite uma nova redefinição de senha." };

  const user = await prisma.user.findUnique({ where: { email: normalized }, select: { id: true } });
  if (!user) return { ok: false, error: "Link inválido ou expirado. Solicite uma nova redefinição de senha." };

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await bcrypt.hash(password, 12) } });
  return { ok: true };
}
