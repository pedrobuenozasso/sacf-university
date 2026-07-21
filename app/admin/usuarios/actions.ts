"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { createVerificationToken } from "@/lib/verification-tokens";
import { sendVerificationEmail } from "@/lib/send-verification-email";
import { appPath } from "@/lib/app-path";
import { recordAuditEvent } from "@/lib/audit";
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

export type CsvUserRow = {
  name: string;
  email: string;
  role?: string;
  group?: string;
  jobTitle?: string;
};

export type CsvImportResult = {
  ok: boolean;
  created: number;
  invited: number;
  skipped: number;
  groupsCreated: number;
  message: string;
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
  const url = `${protocol}://${host}${appPath("/verificar")}?token=${token}&email=${encodeURIComponent(email)}`;
  await sendVerificationEmail(email, url);
  await recordAuditEvent({ organizationId: organization.id, actorUserId: session.user.id, action: "user.invited", entityType: "user", entityId: user.id, metadata: { email, role } });

  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/empresas");
  return { ok: true };
}

function normalizeRole(value?: string) {
  const role = (value ?? "student").trim().toLowerCase();
  const aliases: Record<string, string> = {
    aluno: "student", estudante: "student", student: "student",
    instrutor: "trainer", instructor: "trainer", trainer: "trainer",
    administrador: "admin", admin: "admin", "admin da empresa": "admin",
    parceiro: "partner", partner: "partner", "parceiro externo": "partner"
  };
  return ROLE_MAP[aliases[role] ?? role] ?? "student";
}

function groupSlug(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "grupo";
}

// CSV is parsed in the browser so no file is retained by the server. Every
// row is validated again here and company admins are always bound to their
// own tenant, regardless of what the browser sends.
export async function importUsersFromCsv(rows: CsvUserRow[]): Promise<CsvImportResult> {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !["sacf_admin", "org_admin"].includes(role ?? "") || !session.user.organizationSlug) {
    return { ok: false, created: 0, invited: 0, skipped: 0, groupsCreated: 0, message: "Você não tem permissão para importar usuários." };
  }
  const organizationSlug = role === "sacf_admin" ? session.user.organizationSlug : session.user.organizationSlug;
  const organization = await prisma.organization.findUnique({ where: { slug: organizationSlug }, select: { id: true, seatLimit: true } });
  if (!organization) return { ok: false, created: 0, invited: 0, skipped: 0, groupsCreated: 0, message: "Empresa não encontrada." };

  const uniqueRows = new Map<string, CsvUserRow>();
  for (const row of rows.slice(0, 500)) {
    const email = String(row.email ?? "").trim().toLowerCase();
    const name = String(row.name ?? "").trim().slice(0, 160);
    if (name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) uniqueRows.set(email, { ...row, name, email });
  }
  if (!uniqueRows.size) return { ok: false, created: 0, invited: 0, skipped: rows.length, groupsCreated: 0, message: "Nenhuma linha válida foi encontrada. Use nome e email." };

  const emails = [...uniqueRows.keys()];
  const existingUsers = await prisma.user.findMany({ where: { email: { in: emails } }, select: { id: true, email: true } });
  const existingByEmail = new Map(existingUsers.map((user) => [user.email, user]));
  const existingMembers = existingUsers.length ? await prisma.organizationMember.findMany({ where: { organizationId: organization.id, userId: { in: existingUsers.map((user) => user.id) } }, select: { userId: true } }) : [];
  const existingMemberIds = new Set(existingMembers.map((member) => member.userId));
  const candidates = [...uniqueRows.values()].filter((row) => !existingMemberIds.has(existingByEmail.get(row.email)?.id ?? ""));
  const currentSeats = await prisma.organizationMember.count({ where: { organizationId: organization.id } });
  if (organization.seatLimit && currentSeats + candidates.length > organization.seatLimit) {
    return { ok: false, created: 0, invited: 0, skipped: emails.length - candidates.length, groupsCreated: 0, message: `A importação excede o limite de ${organization.seatLimit} usuários da empresa.` };
  }

  const groupNames = [...new Set(candidates.map((row) => String(row.group ?? "").trim()).filter(Boolean))];
  const currentGroups = await prisma.group.findMany({ where: { organizationId: organization.id }, select: { id: true, name: true, slug: true } });
  const groupByName = new Map(currentGroups.map((group) => [group.name.toLocaleLowerCase("pt-BR"), group]));
  let groupsCreated = 0;
  for (const name of groupNames) {
    const key = name.toLocaleLowerCase("pt-BR");
    if (groupByName.has(key)) continue;
    const base = groupSlug(name);
    let slug = base;
    let suffix = 2;
    while ([...groupByName.values()].some((group) => group.slug === slug)) slug = `${base}-${suffix++}`;
    const group = await prisma.group.create({ data: { organizationId: organization.id, name: name.slice(0, 120), slug, description: "Criado pela importação de usuários" }, select: { id: true, name: true, slug: true } });
    groupByName.set(key, group);
    groupsCreated++;
  }

  let created = 0;
  let invited = 0;
  const skipped = emails.length - candidates.length;
  const host = (await headers()).get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  for (const row of candidates) {
    const user = existingByEmail.get(row.email) ?? await prisma.user.create({ data: { email: row.email, name: row.name }, select: { id: true, email: true } });
    if (!existingByEmail.has(row.email)) created++;
    const membership = await prisma.organizationMember.create({ data: { organizationId: organization.id, userId: user.id, role: normalizeRole(row.role), jobTitle: String(row.jobTitle ?? "").trim().slice(0, 120) || null, status: "invited", invitedAt: new Date() } });
    const group = row.group ? groupByName.get(row.group.trim().toLocaleLowerCase("pt-BR")) : undefined;
    if (group) await prisma.groupMember.create({ data: { organizationId: organization.id, userId: user.id, groupId: group.id } });
    const token = await createVerificationToken(row.email, "email_verify");
    await sendVerificationEmail(row.email, `${protocol}://${host}${appPath("/verificar")}?token=${token}&email=${encodeURIComponent(row.email)}`);
    await recordAuditEvent({ organizationId: organization.id, actorUserId: session.user.id, action: "user.imported", entityType: "organization_member", entityId: membership.id, metadata: { email: row.email, group: group?.name ?? null, role: membership.role } });
    invited++;
  }
  revalidatePath("/admin/usuarios");
  revalidatePath("/admin/empresas");
  return { ok: true, created, invited, skipped, groupsCreated, message: `${invited} convite${invited === 1 ? "" : "s"} enviado${invited === 1 ? "" : "s"}.` };
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
  await recordAuditEvent({ organizationId: member.organizationId, actorUserId: (await auth())?.user?.id, action: "user.updated", entityType: "user", entityId: member.userId, metadata: { role, status } });
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
  await recordAuditEvent({ organizationId: member.organizationId, actorUserId: (await auth())?.user?.id, action: "user.groups_updated", entityType: "user", entityId: member.userId, metadata: { groupIds: validGroups.map((group) => group.id) } });
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
  await recordAuditEvent({ organizationId: organization.id, actorUserId: session.user.id, action: "group.created", entityType: "group", metadata: { name } });
  revalidatePath("/admin/usuarios");
}
