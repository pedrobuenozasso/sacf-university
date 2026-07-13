import { auth } from "@/lib/auth";

export type UserCertificate = {
  id: string;
  code: string;
  courseTitle: string;
  courseVertical: string;
  organizationName: string;
  issuedAt: string;
  expiresAt: string | null;
  status: "valid" | "expired" | "revoked";
};

// Certificate rows are always scoped to the signed-in user's organization.
// This makes the certificate area safe even when the same user is a member of
// multiple tenants in a future Hub-integrated session.
export async function getMyCertificates(): Promise<UserCertificate[]> {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId || !process.env.DATABASE_URL) return [];

  const { prisma } = await import("@/lib/db");
  const rows = await prisma.certificate.findMany({
    where: {
      userId: session.user.id,
      organizationId: session.user.organizationId
    },
    include: {
      course: { select: { title: true, vertical: true } },
      organization: { select: { name: true } }
    },
    orderBy: { issuedAt: "desc" }
  });
  const now = new Date();
  return rows.map((certificate) => ({
    id: certificate.id,
    code: certificate.certificateCode,
    courseTitle: certificate.course.title,
    courseVertical: certificate.course.vertical,
    organizationName: certificate.organization.name,
    issuedAt: certificate.issuedAt.toISOString(),
    expiresAt: certificate.expiresAt?.toISOString() ?? null,
    status: certificate.revokedAt
      ? "revoked"
      : certificate.expiresAt && certificate.expiresAt < now
        ? "expired"
        : "valid"
  }));
}
