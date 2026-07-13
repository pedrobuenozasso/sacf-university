"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Only SACF admins onboard new tenant companies — company admins manage their
// own organization only.
export async function createOrganization(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "sacf_admin") return;

  if (!process.env.DATABASE_URL) return;
  const { prisma } = await import("@/lib/db");

  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const adminEmail = String(formData.get("adminEmail") ?? "").trim().toLowerCase();
  const seatLimitInput = String(formData.get("seatLimit") ?? "").trim();

  if (!name) return;
  const slug = slugify(slugInput || name);
  if (!slug) return;

  // Empty or invalid values mean "no limit" — otherwise must be a positive integer.
  const parsedSeatLimit = Number.parseInt(seatLimitInput, 10);
  const seatLimit = seatLimitInput && Number.isFinite(parsedSeatLimit) && parsedSeatLimit > 0
    ? parsedSeatLimit
    : null;

  // Slug must be unique (DB enforces it too) — skip silently if taken.
  const existing = await prisma.organization.findUnique({ where: { slug } });
  if (existing) return;

  // Derive the login domain from the admin email, but only attach it if free
  // (a domain can map to a single org).
  const domain = adminEmail.includes("@") ? adminEmail.split("@")[1] : null;
  const domainFree = domain ? !(await prisma.organizationDomain.findUnique({ where: { domain } })) : false;

  await prisma.organization.create({
    data: {
      name,
      slug,
      status: "active",
      seatLimit,
      ...(domain && domainFree ? { domains: { create: { domain } } } : {})
    }
  });

  revalidatePath("/admin/empresas");
}
