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

export type PublicCertificate = {
  code: string;
  recipientName: string;
  courseTitle: string;
  organizationName: string;
  issuedAt: string;
  expiresAt: string | null;
  status: "valid" | "expired" | "revoked";
};

function certificateStatus({ revokedAt, expiresAt }: { revokedAt: Date | null; expiresAt: Date | null }) {
  if (revokedAt) return "revoked" as const;
  if (expiresAt && expiresAt < new Date()) return "expired" as const;
  return "valid" as const;
}

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
  return rows.map((certificate) => ({
    id: certificate.id,
    code: certificate.certificateCode,
    courseTitle: certificate.course.title,
    courseVertical: certificate.course.vertical,
    organizationName: certificate.organization.name,
    issuedAt: certificate.issuedAt.toISOString(),
    expiresAt: certificate.expiresAt?.toISOString() ?? null,
    status: certificateStatus(certificate)
  }));
}

// Public verification deliberately returns only the information necessary to
// confirm the credential. Email, enrollment progress and other private learner
// details never leave the authenticated area.
export async function getCertificateForVerification(code: string): Promise<PublicCertificate | null> {
  const normalizedCode = code.trim().toUpperCase();
  if (!normalizedCode || normalizedCode.length > 100 || !process.env.DATABASE_URL) return null;

  const { prisma } = await import("@/lib/db");
  const certificate = await prisma.certificate.findUnique({
    where: { certificateCode: normalizedCode },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true } },
      organization: { select: { name: true } }
    }
  });
  if (!certificate) return null;

  return {
    code: certificate.certificateCode,
    recipientName: certificate.user.name,
    courseTitle: certificate.course.title,
    organizationName: certificate.organization.name,
    issuedAt: certificate.issuedAt.toISOString(),
    expiresAt: certificate.expiresAt?.toISOString() ?? null,
    status: certificateStatus(certificate)
  };
}
