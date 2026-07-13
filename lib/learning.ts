"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

type LearningSession = {
  userId: string;
  organizationId: string;
  role: string;
  groups: string[];
};

async function getLearningSession(): Promise<LearningSession | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) return null;
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
    role: session.user.role ?? "student",
    groups: session.user.groups ?? []
  };
}

async function findAccessibleCourse(slug: string, session: LearningSession) {
  const organizationAccess: Prisma.CourseWhereInput = {
    OR: [
      { organizationId: session.organizationId },
      { visibilityRules: { some: { organizationId: session.organizationId, ruleType: "organization" } } },
      { visibilityRules: { some: { organizationId: session.organizationId, userId: session.userId } } },
      ...(session.groups.length
        ? [{ visibilityRules: { some: { organizationId: session.organizationId, group: { slug: { in: session.groups } } } } }]
        : [])
    ]
  };

  return prisma.course.findFirst({
    where: {
      slug,
      status: "published",
      ...(session.role === "sacf_admin" ? {} : organizationAccess)
    },
    select: { id: true }
  });
}

// Starts a learner's enrollment only after its tenant and course visibility
// have been checked on the server. The submitted slug is never trusted alone.
export async function startCourse(formData: FormData) {
  const slug = String(formData.get("courseSlug") ?? "").trim();
  const session = await getLearningSession();
  if (!session) redirect("/login");
  if (!slug) redirect("/catalogo");

  const course = await findAccessibleCourse(slug, session);
  if (!course) redirect("/catalogo");

  await prisma.enrollment.upsert({
    where: { courseId_userId: { courseId: course.id, userId: session.userId } },
    update: {
      status: "in_progress",
      startedAt: new Date()
    },
    create: {
      organizationId: session.organizationId,
      courseId: course.id,
      userId: session.userId,
      status: "in_progress",
      startedAt: new Date()
    }
  });

  revalidatePath("/meus-cursos");
  redirect(`/aprender/${slug}`);
}

export type LearningLesson = {
  id: string;
  title: string;
  moduleTitle: string;
  durationMinutes: number | null;
  status: "not_started" | "in_progress" | "completed";
  progressPercent: number;
};

export type LearningCourse = {
  slug: string;
  title: string;
  instructor: string;
  certificate: string;
  progressPercent: number;
  lessons: LearningLesson[];
};

export async function getLearningCourse(slug: string): Promise<LearningCourse | null> {
  const session = await getLearningSession();
  if (!session) return null;

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: session.userId,
      organizationId: session.organizationId,
      course: { slug, status: "published" }
    },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { position: "asc" },
            include: { lessons: { orderBy: { position: "asc" } } }
          }
        }
      },
      lessonProgress: true
    }
  });
  if (!enrollment) return null;

  const progressByLesson = new Map(enrollment.lessonProgress.map((progress) => [progress.lessonId, progress]));
  const lessons = enrollment.course.modules.flatMap((module) =>
    module.lessons.map((lesson) => {
      const progress = progressByLesson.get(lesson.id);
      return {
        id: lesson.id,
        title: lesson.title,
        moduleTitle: module.title,
        durationMinutes: lesson.durationMinutes,
        status: progress?.status ?? "not_started",
        progressPercent: progress?.progressPercent ?? 0
      };
    })
  );
  const requiredLessons = lessons.length;
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;
  const progressPercent = requiredLessons ? Math.round((completedLessons / requiredLessons) * 100) : 0;

  return {
    slug: enrollment.course.slug,
    title: enrollment.course.title,
    instructor: enrollment.course.instructorName ?? "SACF Academy",
    certificate: enrollment.course.certificateEnabled ? "Certificado" : "Sem certificado",
    progressPercent,
    lessons
  };
}

export async function completeLesson(courseSlug: string, lessonId: string) {
  const session = await getLearningSession();
  if (!session) return { ok: false as const, error: "unauthorized" };

  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId: session.userId,
      organizationId: session.organizationId,
      course: { slug: courseSlug, status: "published" }
    },
    select: {
      id: true,
      courseId: true,
      organizationId: true,
      userId: true,
      startedAt: true,
      course: { select: { certificateEnabled: true, certificateValidityDays: true } }
    }
  });
  if (!enrollment) return { ok: false as const, error: "not_enrolled" };

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId: enrollment.courseId },
    select: { id: true }
  });
  if (!lesson) return { ok: false as const, error: "invalid_lesson" };

  const now = new Date();
  await prisma.lessonProgress.upsert({
    where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: lesson.id } },
    update: { status: "completed", progressPercent: 100, completedAt: now, lastSeenAt: now },
    create: {
      enrollmentId: enrollment.id,
      lessonId: lesson.id,
      status: "completed",
      progressPercent: 100,
      completedAt: now,
      lastSeenAt: now
    }
  });

  const [requiredLessons, completedProgress] = await Promise.all([
    prisma.lesson.count({ where: { courseId: enrollment.courseId, required: true } }),
    prisma.lessonProgress.count({
      where: { enrollmentId: enrollment.id, status: "completed", lesson: { required: true } }
    })
  ]);
  const completed = requiredLessons > 0 && completedProgress >= requiredLessons;
  const expiresAt = completed && enrollment.course.certificateValidityDays
    ? new Date(now.getTime() + enrollment.course.certificateValidityDays * 86_400_000)
    : null;

  await prisma.$transaction(async (tx) => {
    await tx.enrollment.update({
      where: { id: enrollment.id },
      data: {
        status: completed ? "completed" : "in_progress",
        startedAt: enrollment.startedAt ?? now,
        ...(completed ? { completedAt: now, certificateExpiresAt: expiresAt } : {})
      }
    });

    if (completed && enrollment.course.certificateEnabled) {
      await tx.certificate.upsert({
        where: { enrollmentId: enrollment.id },
        update: {},
        create: {
          organizationId: enrollment.organizationId,
          courseId: enrollment.courseId,
          userId: enrollment.userId,
          enrollmentId: enrollment.id,
          certificateCode: `SACF-${now.getFullYear()}-${randomBytes(5).toString("hex").toUpperCase()}`,
          issuedAt: now,
          expiresAt,
          metadata: { source: "course_completion" }
        }
      });
    }
  });

  revalidatePath(`/aprender/${courseSlug}`);
  revalidatePath("/meus-cursos");
  revalidatePath("/certificados");
  return { ok: true as const, completed, certificateIssued: completed && enrollment.course.certificateEnabled };
}
