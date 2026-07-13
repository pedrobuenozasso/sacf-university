"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createVerificationToken } from "@/lib/verification-tokens";
import { sendVerificationEmail } from "@/lib/send-verification-email";
import type { MemberRole } from "@prisma/client";

export type InviteUserErrorCode =
  | "forbidden"
  | "missing_name"
  | "invalid_email"
  | "missing_role"
  | "missing_org"
  | "org_not_found"
  | "seat_limit"
  | "already_member";

export type InviteUserResult =
  | { ok: true }
  | { ok: false; errorCode: InviteUserErrorCode; seatLimit?: number };

const ROLE_MAP: Record<string, MemberRole> = {
  admin: "org_admin",
  trainer: "instructor",
  student: "student",
  partner: "external_partner"
};

export async function inviteUser(
  _prevState: InviteUserResult | null,
  formData: FormData
): Promise<InviteUserResult> {
  const session = await auth();
  const sessionRole = session?.user?.role;

  if (sessionRole !== "sacf_admin" && sessionRole !== "org_admin") {
    return { ok: false, errorCode: "forbidden" };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const roleKey = String(formData.get("role") ?? "");
  const orgSlugInput = String(formData.get("organizationSlug") ?? "").trim();

  if (!name) return { ok: false, errorCode: "missing_name" };
  if (!email.includes("@") || email.length > 254) return { ok: false, errorCode: "invalid_email" };

  const role = ROLE_MAP[roleKey];
  if (!role) return { ok: false, errorCode: "missing_role" };

  // Company admins can only invite into their own organization — never trust
  // a client-submitted org slug for that role.
  const organizationSlug = sessionRole === "sacf_admin" ? orgSlugInput : session!.user.organizationSlug;
  if (!organizationSlug) return { ok: false, errorCode: "missing_org" };

  const organization = await prisma.organization.findUnique({ where: { slug: organizationSlug } });
  if (!organization) return { ok: false, errorCode: "org_not_found" };

  if (organization.seatLimit) {
    const memberCount = await prisma.organizationMember.count({
      where: { organizationId: organization.id }
    });
    if (memberCount >= organization.seatLimit) {
      return { ok: false, errorCode: "seat_limit", seatLimit: organization.seatLimit };
    }
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name }
  });

  const existingMembership = await prisma.organizationMember.findUnique({
    where: { organizationId_userId: { organizationId: organization.id, userId: user.id } }
  });
  if (existingMembership) {
    return { ok: false, errorCode: "already_member" };
  }

  await prisma.organizationMember.create({
    data: {
      organizationId: organization.id,
      userId: user.id,
      role,
      status: "invited",
      invitedAt: new Date()
    }
  });

  const token = await createVerificationToken(email, "email_verify");
  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const url = `${protocol}://${host}/verificar?token=${token}&email=${encodeURIComponent(email)}`;
  await sendVerificationEmail(email, url);

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/empresas");
  return { ok: true };
}
