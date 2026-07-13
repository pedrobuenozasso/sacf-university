"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// A revoked credential remains in the audit trail; it is never deleted. The
// same revoked status is immediately reflected in public verification.
export async function revokeCertificate(formData: FormData) {
  const certificateId = String(formData.get("certificateId") ?? "");
  const session = await auth();
  const role = session?.user?.role;
  if (!certificateId || !session?.user?.organizationSlug || !["sacf_admin", "org_admin", "instructor"].includes(role ?? "")) {
    return;
  }

  const certificate = await prisma.certificate.findFirst({
    where: {
      id: certificateId,
      ...(role === "sacf_admin" ? {} : { organization: { slug: session.user.organizationSlug } })
    },
    select: { id: true, userId: true }
  });
  if (!certificate) return;

  await prisma.certificate.update({
    where: { id: certificate.id },
    data: { revokedAt: new Date() }
  });
  revalidatePath("/admin/certificacoes");
  revalidatePath("/certificados");
  revalidatePath("/verificar");
}
