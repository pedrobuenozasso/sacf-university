"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { consumeVerificationToken } from "@/lib/verification-tokens";

export type SetPasswordResult = { ok: true } | { ok: false; error: string };

export async function verifyAndSetPassword(
  email: string,
  token: string,
  password: string
): Promise<SetPasswordResult> {
  const normalized = email.trim().toLowerCase();

  if (password.length < 8) {
    return { ok: false, error: "A senha precisa ter pelo menos 8 caracteres." };
  }

  const valid = await consumeVerificationToken(normalized, token, "email_verify");
  if (!valid) {
    return { ok: false, error: "Link inválido ou expirado. Solicite um novo convite ao administrador." };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.update({
    where: { email: normalized },
    data: { emailVerified: new Date(), passwordHash }
  });

  const domain = normalized.split("@")[1];
  const orgDomain = await prisma.organizationDomain.findUnique({ where: { domain } });

  if (orgDomain) {
    await prisma.organizationMember.upsert({
      where: {
        organizationId_userId: { organizationId: orgDomain.organizationId, userId: user.id }
      },
      update: {},
      create: {
        organizationId: orgDomain.organizationId,
        userId: user.id,
        role: "student",
        status: "active",
        joinedAt: new Date()
      }
    });
  }

  return { ok: true };
}
