"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recordAuditEvent } from "@/lib/audit";

const colorPattern = /^#[0-9a-fA-F]{6}$/;

export async function updateOrganizationBranding(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || !["sacf_admin", "org_admin"].includes(session.user.role ?? "") || !session.user.organizationSlug) return;
  const primaryColor = String(formData.get("primaryColor") ?? "").trim();
  const secondaryColor = String(formData.get("secondaryColor") ?? "").trim();
  const logoUrl = String(formData.get("logoUrl") ?? "").trim();
  const defaultLocale = String(formData.get("defaultLocale") ?? "pt-BR").trim();
  const allowedLocales = Array.from(new Set(formData.getAll("allowedLocales").map(String).filter((locale) => ["pt-BR", "en", "es", "de", "fr"].includes(locale))));
  const organization = await prisma.organization.findUnique({ where: { slug: session.user.organizationSlug }, select: { id: true } });
  if (!organization) return;
  await prisma.organization.update({
    where: { id: organization.id },
    data: {
      primaryColor: colorPattern.test(primaryColor) ? primaryColor : null,
      secondaryColor: colorPattern.test(secondaryColor) ? secondaryColor : null,
      logoUrl: logoUrl && /^(https:\/\/|gs:\/\/)/.test(logoUrl) ? logoUrl.slice(0, 1000) : null,
      defaultLocale: ["pt-BR", "en", "es", "de", "fr"].includes(defaultLocale) ? defaultLocale : "pt-BR",
      allowedLocales: allowedLocales.length ? allowedLocales : ["pt-BR"]
    }
  });
  await recordAuditEvent({ organizationId: organization.id, actorUserId: session.user.id, action: "organization.branding_updated", entityType: "organization", entityId: organization.id, metadata: { primaryColor, secondaryColor, hasLogo: Boolean(logoUrl), defaultLocale, allowedLocales } });
  revalidatePath("/admin/identidade");
}
