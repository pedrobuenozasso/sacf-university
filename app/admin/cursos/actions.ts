"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function uniqueSlug(organizationId: string, title: string) {
  const base = slugify(title) || "curso";
  let slug = base;
  let suffix = 2;
  while (await prisma.course.findUnique({ where: { organizationId_slug: { organizationId, slug } } })) {
    slug = `${base}-${suffix++}`;
  }
  return slug;
}

// Course creation is tenant-scoped on the server. A company admin/instructor
// can only create content for their own company; SACF admins choose a tenant.
export async function createCourse(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !session.user.organizationSlug || !["sacf_admin", "org_admin", "instructor"].includes(role ?? "")) {
    return;
  }

  const title = String(formData.get("title") ?? "").trim();
  const vertical = String(formData.get("vertical") ?? "").trim();
  const intent = String(formData.get("intent") ?? "draft");
  if (!title || !vertical) return;

  const targetSlug = role === "sacf_admin"
    ? String(formData.get("organizationSlug") ?? "").trim()
    : session.user.organizationSlug;
  if (!targetSlug) return;

  const organization = await prisma.organization.findUnique({ where: { slug: targetSlug } });
  if (!organization) return;

  const workloadHours = Number.parseFloat(String(formData.get("workloadHours") ?? ""));
  const validityMonths = Number.parseInt(String(formData.get("validityMonths") ?? ""), 10);
  const lessonTitles = String(formData.get("lessons") ?? "")
    .split("\n")
    .map((lesson) => lesson.trim())
    .filter(Boolean)
    .slice(0, 100);
  const slug = await uniqueSlug(organization.id, title);
  const published = intent === "publish";

  const course = await prisma.course.create({
    data: {
      organizationId: organization.id,
      createdById: session.user.id,
      title,
      slug,
      shortDescription: String(formData.get("summary") ?? "").trim() || null,
      description: String(formData.get("summary") ?? "").trim() || null,
      vertical,
      level: String(formData.get("level") ?? "Essencial"),
      language: String(formData.get("language") ?? "pt-BR"),
      instructorName: String(formData.get("instructor") ?? "").trim() || null,
      workloadMinutes: Number.isFinite(workloadHours) && workloadHours > 0 ? Math.round(workloadHours * 60) : null,
      certificateEnabled: formData.get("certificateEnabled") === "on",
      certificateValidityDays: Number.isFinite(validityMonths) && validityMonths > 0 ? validityMonths * 30 : null,
      mandatory: formData.get("mandatory") === "on",
      visibilityScope: "private_org",
      status: published ? "published" : "draft",
      publishedAt: published ? new Date() : null
    }
  });

  if (lessonTitles.length) {
    const module = await prisma.courseModule.create({
      data: { courseId: course.id, title: "Conteúdo inicial", position: 0 }
    });
    await prisma.lesson.createMany({
      data: lessonTitles.map((lesson, position) => ({
        courseId: course.id,
        moduleId: module.id,
        title: lesson,
        position,
        lessonType: "text",
        language: String(formData.get("language") ?? "pt-BR")
      }))
    });
  }

  revalidatePath("/admin/cursos");
  revalidatePath("/catalogo");
}

export async function setCourseStatus(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !session.user.organizationSlug || !["sacf_admin", "org_admin", "instructor"].includes(role ?? "")) {
    return;
  }

  const slug = String(formData.get("courseSlug") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  const allowedStatuses = ["draft", "published", "archived"] as const;
  if (!slug || !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) return;
  const courseStatus = status as (typeof allowedStatuses)[number];

  const course = await prisma.course.findFirst({
    where: {
      slug,
      ...(role === "sacf_admin" ? {} : { organization: { slug: session.user.organizationSlug } })
    },
    select: { id: true }
  });
  if (!course) return;

  await prisma.course.update({
    where: { id: course.id },
    data: {
      status: courseStatus,
      publishedAt: courseStatus === "published" ? new Date() : null
    }
  });
  revalidatePath("/admin/cursos");
  revalidatePath("/catalogo");
}
