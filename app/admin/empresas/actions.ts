"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// NOTE: this write is currently unguarded (behind the client-side admin gate only).
// When real auth lands, restrict it to SACF-admin sessions before doing anything.
export async function createOrganization(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const slugInput = String(formData.get("slug") ?? "").trim();
  const adminEmail = String(formData.get("adminEmail") ?? "").trim().toLowerCase();

  if (!name) return;
  const slug = slugify(slugInput || name);
  if (!slug) return;

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
      ...(domain && domainFree ? { domains: { create: { domain } } } : {})
    }
  });

  revalidatePath("/admin/empresas");
}
