"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

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

  if (avatarUrl !== undefined) {
    return { ok: false, error: "Foto de perfil será liberada após a configuração do armazenamento seguro." };
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: trimmedName
    }
  });

  revalidatePath("/perfil");
  return { ok: true };
}
