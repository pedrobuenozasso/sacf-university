"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const MAX_AVATAR_BYTES = 800_000;

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

  if (avatarUrl && avatarUrl.length > MAX_AVATAR_BYTES) {
    return { ok: false, error: "Imagem muito grande. Escolha uma foto menor." };
  }

  if (avatarUrl && !avatarUrl.startsWith("data:image/")) {
    return { ok: false, error: "Formato de imagem inválido." };
  }

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
