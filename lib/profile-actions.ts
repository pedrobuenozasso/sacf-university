"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isScopedStoragePath } from "@/lib/storage";

export async function updateProfile({
  name,
  avatarUrl
}: {
  name: string;
  avatarUrl?: string | null;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, error: "Sessão expirada. Entre novamente." };
  }

  const trimmedName = name.trim();
  if (!trimmedName) {
    return { ok: false, error: "Informe um nome." };
  }

  const validAvatarUrl = avatarUrl === null || avatarUrl === undefined || avatarUrl.startsWith("https://") || Boolean(session.user.organizationId && isScopedStoragePath(avatarUrl, session.user.organizationId, "avatar", undefined, session.user.id));
  if (!validAvatarUrl || (avatarUrl?.length ?? 0) > 1000) return { ok: false, error: "A foto de perfil não é válida." };

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: trimmedName,
      ...(avatarUrl !== undefined ? { avatarUrl } : {})
    }
  });

  revalidatePath("/perfil");
  return { ok: true };
}
