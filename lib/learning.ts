"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { createDownloadUrl } from "@/lib/storage";

type LearningSession = {
  userId: string;
  organizationId: string;
  role: string;
  groups: string[];
};

async function getLearningSession(): Promise<LearningSession | null> {
  const session = await auth();
  if (!session?.user?.id || !session.user.organizationId) return null;
  // Group membership may change while the learner is signed in. Read it from
  // the tenant database instead of relying on the JWT snapshot, so catalogue
  // and course access reflect an admin change immediately.
  const memberships = await prisma.groupMember.findMany({
    where: { userId: session.user.id, organizationId: session.user.organizationId },
    include: { group: { select: { slug: true } } }
  });
  return {
    userId: session.user.id,
    organizationId: session.user.organizationId,
    role: session.user.role ?? "student",
    groups: memberships.map((membership) => membership.group.slug)
  };
}

async function findAccessibleCourse(slug: string, session: LearningSession) {
  const organizationAccess: Prisma.CourseWhereInput = {
    OR: [
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

  const latestEnrollment = await prisma.enrollment.findFirst({
    where: { courseId: course.id, userId: session.userId },
    orderBy: { cycleNumber: "desc" },
    select: { id: true, status: true }
  });
  if (latestEnrollment && latestEnrollment.status !== "completed") {
    await prisma.enrollment.update({ where: { id: latestEnrollment.id }, data: { status: "in_progress", startedAt: new Date() } });
  } else if (!latestEnrollment) {
    await prisma.enrollment.create({
      data: { organizationId: session.organizationId, courseId: course.id, userId: session.userId, status: "in_progress", startedAt: new Date() }
    });
  }

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
  lessonType: "video" | "text" | "file" | "quiz";
  description: string | null;
  content: string | null;
  videoUrl: string | null;
  attachmentUrl: string | null;
  questions: { id: string; question: string; options: { id: string; optionText: string }[] }[];
};

export type LearningCourse = {
  slug: string;
  title: string;
  instructor: string;
  certificate: string;
  passingScore: number | null;
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
    orderBy: { cycleNumber: "desc" },
    include: {
      course: {
        include: {
          modules: {
            orderBy: { position: "asc" },
            include: { lessons: { orderBy: { position: "asc" }, include: { questions: { orderBy: { position: "asc" }, include: { options: { orderBy: { position: "asc" } } } } } } }
          }
        }
      },
      lessonProgress: true
    }
  });
  if (!enrollment) return null;

  const progressByLesson = new Map(enrollment.lessonProgress.map((progress) => [progress.lessonId, progress]));
  const lessons = await Promise.all(enrollment.course.modules.flatMap((module) =>
    module.lessons.map(async (lesson) => {
      const progress = progressByLesson.get(lesson.id);
      return {
        id: lesson.id,
        title: lesson.title,
        moduleTitle: module.title,
        durationMinutes: lesson.durationMinutes,
        status: progress?.status ?? "not_started",
        progressPercent: progress?.progressPercent ?? 0,
        lessonType: lesson.lessonType,
        description: lesson.description,
        content: lesson.content,
        videoUrl: lesson.videoUrl ? await createDownloadUrl(lesson.videoUrl) : null,
        attachmentUrl: lesson.attachmentUrl ? await createDownloadUrl(lesson.attachmentUrl) : null,
        questions: lesson.questions.map((question) => ({ id: question.id, question: question.question, options: question.options.map((option) => ({ id: option.id, optionText: option.optionText })) }))
      };
    })
  ));
  const requiredLessons = lessons.length;
  const completedLessons = lessons.filter((lesson) => lesson.status === "completed").length;
  const progressPercent = requiredLessons ? Math.round((completedLessons / requiredLessons) * 100) : 0;

  return {
    slug: enrollment.course.slug,
    title: enrollment.course.title,
    instructor: enrollment.course.instructorName ?? "SACF Academy",
    certificate: enrollment.course.certificateEnabled ? "Certificado" : "Sem certificado",
    passingScore: enrollment.course.passingScore,
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
    orderBy: { cycleNumber: "desc" },
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
    select: { id: true, lessonType: true }
  });
  if (!lesson) return { ok: false as const, error: "invalid_lesson" };

  if (lesson.lessonType === "quiz") {
    const attempt = await prisma.quizAttempt.findFirst({ where: { enrollmentId: enrollment.id, lessonId: lesson.id, submittedAt: { not: null }, passed: true } });
    if (!attempt) return { ok: false as const, error: "quiz_required" };
  }

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

export async function submitQuiz(courseSlug: string, lessonId: string, answers: Record<string, string>) {
  const session = await getLearningSession();
  if (!session) return { ok: false as const, error: "unauthorized" };
  const enrollment = await prisma.enrollment.findFirst({
    where: { userId: session.userId, organizationId: session.organizationId, course: { slug: courseSlug, status: "published" } },
    orderBy: { cycleNumber: "desc" },
    select: { id: true, courseId: true, course: { select: { passingScore: true } } }
  });
  if (!enrollment) return { ok: false as const, error: "not_enrolled" };
  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId: enrollment.courseId, lessonType: "quiz" },
    include: { questions: { orderBy: { position: "asc" }, include: { options: true } } }
  });
  if (!lesson || !lesson.questions.length) return { ok: false as const, error: "invalid_quiz" };

  const score = Math.round((lesson.questions.filter((question) => question.options.some((option) => option.isCorrect && answers[question.id] === option.id)).length / lesson.questions.length) * 100);
  const passingScore = enrollment.course.passingScore ?? 0;
  const passed = score >= passingScore;
  await prisma.quizAttempt.create({
    data: { enrollmentId: enrollment.id, lessonId: lesson.id, userId: session.userId, score, passed, answers, submittedAt: new Date() }
  });
  if (!passed) return { ok: true as const, passed: false as const, score, passingScore };

  const completion = await completeLesson(courseSlug, lessonId);
  return { ok: completion.ok, passed: true as const, score, passingScore, completed: completion.ok && completion.completed, certificateIssued: completion.ok && completion.certificateIssued };
}
