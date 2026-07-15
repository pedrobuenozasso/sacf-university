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

async function getManagedMember(userId: string) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !["sacf_admin", "org_admin"].includes(role ?? "")) return null;
  const organizationSlug = session.user.organizationSlug;
  if (role !== "sacf_admin" && !organizationSlug) return null;
  const organizationFilter = role === "sacf_admin"
    ? { slug: { not: "sacf" } }
    : { slug: organizationSlug! };
  return prisma.organizationMember.findFirst({
    where: { userId, organization: organizationFilter },
    select: { id: true, userId: true, organizationId: true }
  });
}

const editableRoles: MemberRole[] = ["org_admin", "instructor", "student", "external_partner"];
const editableStatuses = ["active", "invited", "blocked"] as const;

export async function updateUser(formData: FormData) {
  const userId = String(formData.get("userId") ?? "").trim();
  const member = await getManagedMember(userId);
  if (!member) return;
  const name = String(formData.get("name") ?? "").trim();
  const role = String(formData.get("role") ?? "") as MemberRole;
  const status = String(formData.get("status") ?? "");
  if (!name || !editableRoles.includes(role) || !editableStatuses.includes(status as (typeof editableStatuses)[number])) return;
  await prisma.$transaction([
    prisma.user.update({ where: { id: member.userId }, data: { name } }),
    prisma.organizationMember.update({ where: { id: member.id }, data: { role, status: status as (typeof editableStatuses)[number] } })
  ]);
  revalidatePath("/admin/usuarios");
}

export async function updateUserGroups(formData: FormData) {
  const userId = String(formData.get("userId") ?? "").trim();
  const member = await getManagedMember(userId);
  if (!member) return;
  const requestedGroupIds = Array.from(new Set(formData.getAll("groupIds").map(String).filter(Boolean)));
  const validGroups = await prisma.group.findMany({ where: { organizationId: member.organizationId, id: { in: requestedGroupIds } }, select: { id: true } });
  await prisma.groupMember.deleteMany({ where: { organizationId: member.organizationId, userId: member.userId } });
  if (validGroups.length) {
    await prisma.groupMember.createMany({ data: validGroups.map((group) => ({ organizationId: member.organizationId, userId: member.userId, groupId: group.id })) });
  }
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/cursos");
}

export async function createGroup(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !["sacf_admin", "org_admin"].includes(role ?? "")) return;
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim() || null;
  const requestedSlug = String(formData.get("organizationSlug") ?? "").trim();
  const organizationSlug = role === "sacf_admin" ? requestedSlug : session.user.organizationSlug;
  if (!name || !organizationSlug) return;
  const organization = await prisma.organization.findUnique({ where: { slug: organizationSlug }, select: { id: true, slug: true } });
  if (!organization || (role !== "sacf_admin" && organization.slug !== session.user.organizationSlug)) return;
  const baseSlug = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "grupo";
  let slug = baseSlug;
  let suffix = 2;
  while (await prisma.group.findUnique({ where: { organizationId_slug: { organizationId: organization.id, slug } }, select: { id: true } })) slug = `${baseSlug}-${suffix++}`;
  await prisma.group.create({ data: { organizationId: organization.id, name, slug, description } });
  revalidatePath("/admin/usuarios");
}
