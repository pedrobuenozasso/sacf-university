"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recordAuditEvent } from "@/lib/audit";
import { isScopedStoragePath } from "@/lib/storage";

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

async function resolveVerticalGroup(organizationId: string, formData: FormData) {
  const newVertical = String(formData.get("newVertical") ?? "").trim();
  const groupId = String(formData.get("verticalGroupId") ?? "").trim();
  if (newVertical) {
    const existing = await prisma.group.findFirst({ where: { organizationId, name: { equals: newVertical, mode: "insensitive" } }, select: { id: true, name: true } });
    if (existing) return existing;
    const base = slugify(newVertical) || "vertical";
    let slug = base;
    let suffix = 2;
    while (await prisma.group.findUnique({ where: { organizationId_slug: { organizationId, slug } }, select: { id: true } })) slug = `${base}-${suffix++}`;
    return prisma.group.create({ data: { organizationId, name: newVertical, slug, description: "Vertical de treinamento" }, select: { id: true, name: true } });
  }
  if (!groupId) return null;
  return prisma.group.findFirst({ where: { id: groupId, organizationId }, select: { id: true, name: true } });
}

async function setCourseAudience(courseId: string, organizationId: string, formData: FormData) {
  const allVerticals = String(formData.get("audienceScope") ?? "group") === "all_verticals";
  if (!allVerticals) {
    await prisma.courseVisibilityRule.deleteMany({ where: { courseId, organizationId, ruleType: "organization" } });
    return;
  }
  const existing = await prisma.courseVisibilityRule.findFirst({ where: { courseId, organizationId, ruleType: "organization" }, select: { id: true } });
  if (!existing) await prisma.courseVisibilityRule.create({ data: { courseId, organizationId, ruleType: "organization" } });
}

async function getManagedCourse(courseId: string) {
  const session = await auth();
  const role = session?.user?.role;
  if (!session?.user?.id || !session.user.organizationSlug || !["sacf_admin", "org_admin", "instructor"].includes(role ?? "")) {
    return null;
  }
  return prisma.course.findFirst({
    where: {
      id: courseId,
      ...(role === "sacf_admin" ? {} : { organization: { slug: session.user.organizationSlug } })
    },
    select: { id: true, organizationId: true }
  });
}

function revalidateCourseEditor(courseId: string) {
  revalidatePath(`/admin/cursos/${courseId}`);
  revalidatePath("/admin/cursos");
  revalidatePath("/catalogo");
}

const lessonTypes = ["video", "text", "file", "quiz"] as const;
const videoProviders = ["unlisted_youtube", "vimeo", "mux", "cloud_storage", "external_url"] as const;

function safeCourseAssetUrl(value: string, organizationId: string, courseId: string) {
  if (!value) return null;
  if (value.startsWith("https://")) return value.slice(0, 1000);
  return isScopedStoragePath(value, organizationId, "course", courseId) ? value : null;
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
  const intent = String(formData.get("intent") ?? "draft");
  if (!title) return;

  const targetSlug = role === "sacf_admin"
    ? String(formData.get("organizationSlug") ?? "").trim()
    : session.user.organizationSlug;
  if (!targetSlug) return;

  const organization = await prisma.organization.findUnique({ where: { slug: targetSlug } });
  if (!organization) return;
  const verticalGroup = await resolveVerticalGroup(organization.id, formData);
  if (!verticalGroup) return;

  const workloadHours = Number.parseFloat(String(formData.get("workloadHours") ?? ""));
  const validityMonths = Number.parseInt(String(formData.get("validityMonths") ?? ""), 10);
  const passingScore = Number.parseInt(String(formData.get("passingScore") ?? ""), 10);
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
      vertical: verticalGroup.name,
      level: String(formData.get("level") ?? "Essencial"),
      language: String(formData.get("language") ?? "pt-BR"),
      instructorName: String(formData.get("instructor") ?? "").trim() || null,
      workloadMinutes: Number.isFinite(workloadHours) && workloadHours > 0 ? Math.round(workloadHours * 60) : null,
      certificateEnabled: formData.get("certificateEnabled") === "on",
      certificateValidityDays: Number.isFinite(validityMonths) && validityMonths > 0 ? validityMonths * 30 : null,
      passingScore: Number.isFinite(passingScore) && passingScore >= 0 && passingScore <= 100 ? passingScore : null,
      mandatory: formData.get("mandatory") === "on",
      visibilityScope: "private_org",
      status: published ? "published" : "draft",
      publishedAt: published ? new Date() : null
    }
  });
  await recordAuditEvent({ organizationId: organization.id, actorUserId: session.user.id, action: "course.created", entityType: "course", entityId: course.id, metadata: { title, published } });

  await prisma.courseVisibilityRule.create({ data: { courseId: course.id, organizationId: organization.id, groupId: verticalGroup.id, ruleType: "group" } });
  await setCourseAudience(course.id, organization.id, formData);

  if (lessonTitles.length) {
    const courseModule = await prisma.courseModule.create({
      data: { courseId: course.id, title: "Conteúdo inicial", position: 0 }
    });
    await prisma.lesson.createMany({
      data: lessonTitles.map((lesson, position) => ({
        courseId: course.id,
        moduleId: courseModule.id,
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

  const courseId = String(formData.get("courseId") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  const allowedStatuses = ["draft", "published", "archived"] as const;
  if (!courseId || !allowedStatuses.includes(status as (typeof allowedStatuses)[number])) return;
  const courseStatus = status as (typeof allowedStatuses)[number];

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
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
  revalidateCourseEditor(course.id);
}

export async function updateCourse(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const course = await getManagedCourse(courseId);
  if (!course) return;

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  const currentCourse = await prisma.course.findFirst({ where: { id: course.id }, select: { vertical: true } });
  const verticalGroup = await resolveVerticalGroup(course.organizationId, formData);
  if (!verticalGroup) return;

  const workloadHours = Number.parseFloat(String(formData.get("workloadHours") ?? ""));
  const validityMonths = Number.parseInt(String(formData.get("validityMonths") ?? ""), 10);
  const passingScore = Number.parseInt(String(formData.get("passingScore") ?? ""), 10);
  await prisma.course.update({
    where: { id: course.id },
    data: {
      title,
      vertical: verticalGroup.name,
      level: String(formData.get("level") ?? "Essencial"),
      language: String(formData.get("language") ?? "pt-BR"),
      instructorName: String(formData.get("instructor") ?? "").trim() || null,
      shortDescription: String(formData.get("summary") ?? "").trim() || null,
      description: String(formData.get("summary") ?? "").trim() || null,
      workloadMinutes: Number.isFinite(workloadHours) && workloadHours > 0 ? Math.round(workloadHours * 60) : null,
      certificateEnabled: formData.get("certificateEnabled") === "on",
      certificateValidityDays: Number.isFinite(validityMonths) && validityMonths > 0 ? validityMonths * 30 : null,
      passingScore: Number.isFinite(passingScore) && passingScore >= 0 && passingScore <= 100 ? passingScore : null,
      mandatory: formData.get("mandatory") === "on",
      coverUrl: safeCourseAssetUrl(String(formData.get("coverUrl") ?? "").trim(), course.organizationId, course.id)
    }
  });
  const session = await auth();
  await recordAuditEvent({ organizationId: course.organizationId, actorUserId: session?.user?.id, action: "course.updated", entityType: "course", entityId: course.id, metadata: { title } });
  if (currentCourse?.vertical !== verticalGroup.name) {
    const previousGroup = await prisma.group.findFirst({ where: { organizationId: course.organizationId, name: currentCourse?.vertical }, select: { id: true } });
    if (previousGroup) await prisma.courseVisibilityRule.deleteMany({ where: { courseId: course.id, groupId: previousGroup.id, ruleType: "group" } });
    const existingRule = await prisma.courseVisibilityRule.findFirst({ where: { courseId: course.id, organizationId: course.organizationId, groupId: verticalGroup.id, ruleType: "group" }, select: { id: true } });
    if (!existingRule) await prisma.courseVisibilityRule.create({ data: { courseId: course.id, organizationId: course.organizationId, groupId: verticalGroup.id, ruleType: "group" } });
  }
  await setCourseAudience(course.id, course.organizationId, formData);
  revalidateCourseEditor(course.id);
}

export async function addModule(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const course = await getManagedCourse(courseId);
  if (!course || !title) return;

  const lastModule = await prisma.courseModule.findFirst({
    where: { courseId: course.id },
    orderBy: { position: "desc" },
    select: { position: true }
  });
  await prisma.courseModule.create({ data: { courseId: course.id, title, position: (lastModule?.position ?? -1) + 1 } });
  await recordAuditEvent({ organizationId: course.organizationId, actorUserId: (await auth())?.user?.id, action: "course.module_created", entityType: "course", entityId: course.id, metadata: { title } });
  revalidateCourseEditor(course.id);
}

export async function addLesson(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const moduleId = String(formData.get("moduleId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const lessonTypeValue = String(formData.get("lessonType") ?? "text");
  const lessonType = lessonTypes.includes(lessonTypeValue as (typeof lessonTypes)[number])
    ? lessonTypeValue as (typeof lessonTypes)[number]
    : "text";
  const course = await getManagedCourse(courseId);
  if (!course || !moduleId || !title) return;

  const courseModule = await prisma.courseModule.findFirst({
    where: { id: moduleId, courseId: course.id },
    select: { id: true }
  });
  if (!courseModule) return;
  const lastLesson = await prisma.lesson.findFirst({
    where: { moduleId: courseModule.id },
    orderBy: { position: "desc" },
    select: { position: true }
  });
  await prisma.lesson.create({
    data: {
      courseId: course.id,
      moduleId: courseModule.id,
      title,
      position: (lastLesson?.position ?? -1) + 1,
      lessonType,
      durationMinutes: Number.parseInt(String(formData.get("durationMinutes") ?? ""), 10) || null
    }
  });
  await recordAuditEvent({ organizationId: course.organizationId, actorUserId: (await auth())?.user?.id, action: "course.lesson_created", entityType: "course", entityId: course.id, metadata: { title, lessonType } });
  revalidateCourseEditor(course.id);
}

async function getManagedLesson(courseId: string, lessonId: string) {
  const course = await getManagedCourse(courseId);
  if (!course) return null;
  const lesson = await prisma.lesson.findFirst({ where: { id: lessonId, courseId: course.id }, select: { id: true, courseId: true, lessonType: true } });
  return lesson ? { course, lesson } : null;
}

export async function updateLesson(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const managed = await getManagedLesson(courseId, lessonId);
  if (!managed) return;

  const title = String(formData.get("title") ?? "").trim();
  const lessonTypeValue = String(formData.get("lessonType") ?? "text");
  const configureQuiz = String(formData.get("intent") ?? "") === "configure_quiz";
  const lessonType = configureQuiz ? "quiz" : lessonTypeValue;
  if (!title || !lessonTypes.includes(lessonType as (typeof lessonTypes)[number])) return;
  const videoProviderValue = String(formData.get("videoProvider") ?? "");
  const durationMinutes = Number.parseInt(String(formData.get("durationMinutes") ?? ""), 10);
  const videoUrl = String(formData.get("videoUploadUrl") ?? "").trim() || String(formData.get("videoUrl") ?? "").trim();
  const attachmentUrl = String(formData.get("attachmentUploadUrl") ?? "").trim() || String(formData.get("attachmentUrl") ?? "").trim();
  await prisma.lesson.update({
    where: { id: managed.lesson.id },
    data: {
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      lessonType: lessonType as (typeof lessonTypes)[number],
      videoProvider: videoProviders.includes(videoProviderValue as (typeof videoProviders)[number])
        ? videoProviderValue as (typeof videoProviders)[number]
        : null,
      videoUrl: safeCourseAssetUrl(videoUrl, managed.course.organizationId, managed.course.id),
      content: String(formData.get("content") ?? "").trim() || null,
      attachmentUrl: safeCourseAssetUrl(attachmentUrl, managed.course.organizationId, managed.course.id),
      language: String(formData.get("language") ?? "pt-BR"),
      durationMinutes: Number.isFinite(durationMinutes) && durationMinutes > 0 ? durationMinutes : null,
      previewEnabled: formData.get("previewEnabled") === "on",
      required: formData.get("required") === "on"
    }
  });
  revalidatePath(`/admin/cursos/${managed.course.id}/aulas/${managed.lesson.id}`);
  revalidateCourseEditor(managed.course.id);
  redirect(`/admin/cursos/${managed.course.id}/aulas/${managed.lesson.id}?saved=1`);
}

export async function addQuizQuestion(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const managed = await getManagedLesson(courseId, lessonId);
  if (!managed || managed.lesson.lessonType !== "quiz") return;
  const question = String(formData.get("question") ?? "").trim();
  const options = ["optionA", "optionB", "optionC", "optionD"].map((name) => String(formData.get(name) ?? "").trim()).filter(Boolean);
  const correctOption = Number.parseInt(String(formData.get("correctOption") ?? ""), 10);
  if (!question || options.length < 2 || !Number.isInteger(correctOption) || correctOption < 0 || correctOption >= options.length) return;
  const lastQuestion = await prisma.quizQuestion.findFirst({ where: { lessonId }, orderBy: { position: "desc" }, select: { position: true } });
  await prisma.quizQuestion.create({
    data: {
      lessonId,
      question,
      position: (lastQuestion?.position ?? -1) + 1,
      options: { create: options.map((optionText, position) => ({ optionText, position, isCorrect: position === correctOption })) }
    }
  });
  revalidatePath(`/admin/cursos/${managed.course.id}/aulas/${lessonId}`);
}

export async function deleteQuizQuestion(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const questionId = String(formData.get("questionId") ?? "");
  const managed = await getManagedLesson(courseId, lessonId);
  if (!managed || !questionId) return;
  await prisma.quizQuestion.deleteMany({ where: { id: questionId, lessonId: managed.lesson.id } });
  revalidatePath(`/admin/cursos/${managed.course.id}/aulas/${lessonId}`);
}

export async function deleteModule(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const moduleId = String(formData.get("moduleId") ?? "");
  const course = await getManagedCourse(courseId);
  if (!course || !moduleId) return;
  await prisma.courseModule.deleteMany({ where: { id: moduleId, courseId: course.id } });
  revalidateCourseEditor(course.id);
}

export async function deleteLesson(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const lessonId = String(formData.get("lessonId") ?? "");
  const course = await getManagedCourse(courseId);
  if (!course || !lessonId) return;
  await prisma.lesson.deleteMany({ where: { id: lessonId, courseId: course.id } });
  revalidateCourseEditor(course.id);
}

export async function assignCourse(formData: FormData) {
  const courseId = String(formData.get("courseId") ?? "");
  const targetType = String(formData.get("targetType") ?? "");
  const targetId = String(formData.get("targetId") ?? "");
  const dueDateValue = String(formData.get("dueDate") ?? "");
  const course = await getManagedCourse(courseId);
  const session = await auth();
  if (!course || !session?.user?.id || !targetId || !["user", "group"].includes(targetType)) return;

  const dueDate = dueDateValue ? new Date(`${dueDateValue}T23:59:59`) : null;
  if (dueDate && Number.isNaN(dueDate.getTime())) return;
  let userIds: string[] = [];

  if (targetType === "user") {
    const member = await prisma.organizationMember.findFirst({
      where: { organizationId: course.organizationId, userId: targetId, status: "active" },
      select: { userId: true }
    });
    if (!member) return;
    userIds = [member.userId];
    const existingRule = await prisma.courseVisibilityRule.findFirst({
      where: { courseId: course.id, organizationId: course.organizationId, userId: member.userId, ruleType: "user" },
      select: { id: true }
    });
    if (!existingRule) {
      await prisma.courseVisibilityRule.create({
        data: { courseId: course.id, organizationId: course.organizationId, userId: member.userId, ruleType: "user" }
      });
    }
  } else {
    const group = await prisma.group.findFirst({
      where: { id: targetId, organizationId: course.organizationId },
      include: { members: { select: { userId: true } } }
    });
    if (!group) return;
    const activeMembers = await prisma.organizationMember.findMany({
      where: { organizationId: course.organizationId, status: "active", userId: { in: group.members.map((member) => member.userId) } },
      select: { userId: true }
    });
    userIds = activeMembers.map((member) => member.userId);
    const existingRule = await prisma.courseVisibilityRule.findFirst({
      where: { courseId: course.id, organizationId: course.organizationId, groupId: group.id, ruleType: "group" },
      select: { id: true }
    });
    if (!existingRule) {
      await prisma.courseVisibilityRule.create({
        data: { courseId: course.id, organizationId: course.organizationId, groupId: group.id, ruleType: "group" }
      });
    }
  }

  await prisma.$transaction(async (tx) => {
    for (const userId of userIds) {
      const activeEnrollment = await tx.enrollment.findFirst({
        where: { courseId: course.id, userId, status: { notIn: ["completed", "cancelled", "expired"] } },
        orderBy: { cycleNumber: "desc" },
        select: { id: true }
      });
      if (activeEnrollment) {
        await tx.enrollment.update({ where: { id: activeEnrollment.id }, data: { assignedById: session.user.id, assignedAt: new Date(), dueDate } });
        continue;
      }
      const latestEnrollment = await tx.enrollment.findFirst({
        where: { courseId: course.id, userId }, orderBy: { cycleNumber: "desc" }, select: { cycleNumber: true }
      });
      await tx.enrollment.create({
        data: {
          organizationId: course.organizationId, courseId: course.id, userId, cycleNumber: (latestEnrollment?.cycleNumber ?? 0) + 1,
          status: "not_started", assignedById: session.user.id, assignedAt: new Date(), dueDate
        }
      });
    }
  });
  revalidateCourseEditor(course.id);
  revalidatePath("/meus-cursos");
}
