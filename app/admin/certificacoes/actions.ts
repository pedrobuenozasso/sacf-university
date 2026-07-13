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

// Creates a fresh enrollment cycle while keeping the expired enrollment and
// certificate available as historical evidence.
export async function startRecertification(formData: FormData) {
  const certificateId = String(formData.get("certificateId") ?? "");
  const session = await auth();
  const role = session?.user?.role;
  if (!certificateId || !session?.user?.id || !session.user.organizationSlug || !["sacf_admin", "org_admin", "instructor"].includes(role ?? "")) {
    return;
  }

  const certificate = await prisma.certificate.findFirst({
    where: {
      id: certificateId,
      expiresAt: { lt: new Date() },
      ...(role === "sacf_admin" ? {} : { organization: { slug: session.user.organizationSlug } })
    },
    include: { enrollment: { select: { id: true } } }
  });
  if (!certificate) return;

  await prisma.$transaction(async (tx) => {
    const latest = await tx.enrollment.findFirst({
      where: { courseId: certificate.courseId, userId: certificate.userId },
      orderBy: { cycleNumber: "desc" },
      select: { id: true, cycleNumber: true, status: true }
    });
    if (latest && latest.status !== "completed" && latest.status !== "cancelled" && latest.status !== "expired") return;

    await tx.enrollment.update({
      where: { id: certificate.enrollmentId },
      data: { recertificationRequired: true }
    });
    await tx.enrollment.create({
      data: {
        organizationId: certificate.organizationId,
        courseId: certificate.courseId,
        userId: certificate.userId,
        cycleNumber: (latest?.cycleNumber ?? 0) + 1,
        status: "not_started",
        assignedById: session.user.id,
        assignedAt: new Date(),
        recertificationOfEnrollmentId: certificate.enrollmentId
      }
    });
  });
  revalidatePath("/admin/certificacoes");
  revalidatePath("/admin/relatorios");
  revalidatePath("/meus-cursos");
}
