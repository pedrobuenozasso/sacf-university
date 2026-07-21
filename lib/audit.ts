import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type AuditEventInput = {
  organizationId: string;
  actorUserId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Prisma.InputJsonValue;
};

// Audit history must never prevent the business operation from completing.
// Keeping the write best-effort also makes staged rollouts safe while a
// migration is being applied to a new environment.
export async function recordAuditEvent(input: AuditEventInput) {
  try {
    await prisma.auditEvent.create({ data: input });
  } catch (error) {
    console.error("Unable to write audit event", error);
  }
}
