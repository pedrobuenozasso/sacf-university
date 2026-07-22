import {
  adminUsers as fallbackAdminUsers,
  courses as fallbackCourses,
  organizations as fallbackOrganizations,
  type AdminUser,
  type Course,
  type Organization
} from "@/lib/courses";
import { canAccessCourse, type SessionUser } from "@/lib/courses";
import { auth } from "@/lib/auth";

const courseInclude = {
  organization: { select: { slug: true } },
  modules: {
    orderBy: { position: "asc" },
    include: { lessons: { orderBy: { position: "asc" } } }
  },
  enrollments: {
    include: { lessonProgress: true }
  },
  visibilityRules: { include: { organization: true, group: true, user: true } },
  _count: { select: { lessons: true } }
} as const;

type CourseRow = {
  id: string;
  organization: { slug: string };
  status: "draft" | "published" | "archived";
  slug: string;
  title: string;
  coverUrl: string | null;
  description: string | null;
  shortDescription: string | null;
  vertical: string;
  level: string;
  language: string;
  instructorName: string | null;
  targetAudience: string | null;
  workloadMinutes: number | null;
  mandatory: boolean;
  certificateValidityDays: number | null;
  certificateEnabled: boolean;
  modules: { title: string; lessons: { title: string }[] }[];
  enrollments: {
    status: string;
    dueDate: Date | null;
    lessonProgress: { status: string; progressPercent: number }[];
  }[];
  visibilityRules: {
    ruleType: string;
    organization: { slug: string } | null;
    group: { slug: string } | null;
    user: { id: string } | null;
  }[];
  _count: { lessons: number };
};

type OrganizationRow = {
  name: string;
  slug: string;
  status: string;
  logoUrl: string | null;
  seatLimit: number | null;
  _count: { members: number; courses: number; certificates: number };
};

type AdminMemberRow = {
  userId: string;
  role: string;
  status: string;
  user: {
    id: string;
    name: string;
    email: string;
    groupMemberships: { group: { id: string; name: string } }[];
    enrollments: {
      status: string;
      lessonProgress: { status: string; progressPercent: number }[];
      course: { _count: { lessons: number } };
    }[];
  };
  organization: { name: string; slug: string };
};

async function getPrisma() {
  const db = await import("@/lib/db");
  if (!db.hasDatabaseConfig()) return null;
  return db.prisma;
}

function formatDuration(minutes: number | null): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h && m) return `${h}h ${m}min`;
  if (h) return `${h}h`;
  return `${m}min`;
}

function certificateLabel(course: CourseRow): string {
  if (course.mandatory) return "Obrigatório";
  if (course.certificateValidityDays === 365) return "Validade 12 meses";
  if (course.certificateValidityDays === 730) return "Validade 24 meses";
  if (course.certificateValidityDays) return `Validade ${Math.round(course.certificateValidityDays / 30)} meses`;
  if (course.certificateEnabled) return "Certificado";
  return "Sem certificado";
}

function accentFor(vertical: string): string {
  const v = vertical.toLowerCase();
  if (v.includes("mec")) return "cyan";
  if (v.includes("elétr") || v.includes("eletr") || v.includes("tens")) return "violet";
  if (v.includes("trein")) return "green";
  return "blue";
}

function enrollmentProgress(course: CourseRow): { progress: number; status: Course["status"]; dueDate: string | null } {
  const totalLessons = Math.max(course._count.lessons, 1);
  const enrollmentScores = course.enrollments.map((enrollment) => {
    if (enrollment.status === "completed") return { progress: 100, status: "Concluído" as const, dueDate: enrollment.dueDate?.toISOString() ?? null };

    const completed = enrollment.lessonProgress.filter((lesson) => lesson.status === "completed").length;
    const inProgress = enrollment.lessonProgress.filter((lesson) => lesson.status === "in_progress");
    const partial = inProgress.reduce((sum, lesson) => sum + lesson.progressPercent / 100, 0);
    const progress = Math.min(99, Math.round(((completed + partial) / totalLessons) * 100));

    return {
      progress,
      status: progress > 0 ? ("Em andamento" as const) : ("Disponível" as const),
      dueDate: enrollment.dueDate?.toISOString() ?? null
    };
  });

  return enrollmentScores.reduce(
    (best, current) => (current.progress > best.progress ? current : best),
    { progress: 0, status: "Disponível" as const, dueDate: null }
  );
}

function mapCourse(course: CourseRow): Course {
  const organizationSlugs = Array.from(
    new Set(
      [
        course.organization.slug,
        ...course.visibilityRules
          .filter((rule) => rule.ruleType === "organization" && rule.organization)
          .map((rule) => rule.organization!.slug)
      ]
    )
  );
  const accessGroups = Array.from(
    new Set(
      course.visibilityRules
        .filter((rule) => rule.ruleType === "group" && rule.group)
        .map((rule) => rule.group!.slug)
    )
  );
  const assignedUserIds = Array.from(
    new Set(
      course.visibilityRules
        .filter((rule) => rule.ruleType === "user" && rule.user)
        .map((rule) => rule.user!.id)
    )
  );
  const organizationWide = course.visibilityRules.some(
    (rule) => rule.ruleType === "organization" && rule.organization?.slug === course.organization.slug
  );

  const enrollment = enrollmentProgress(course);

  return {
    id: course.id,
    coverUrl: course.coverUrl,
    slug: course.slug,
    title: course.title,
    organizationSlugs,
    accessGroups,
    organizationWide,
    assignedUserIds,
    vertical: course.vertical,
    level: course.level,
    language: course.language,
    duration: formatDuration(course.workloadMinutes),
    lessons: course._count.lessons,
    progress: enrollment.progress,
    dueDate: enrollment.dueDate,
    certificate: certificateLabel(course),
    status: enrollment.status,
    publicationStatus: course.status,
    accent: accentFor(course.vertical),
    summary: course.shortDescription ?? course.description ?? "",
    audience: course.targetAudience ?? "",
    instructor: course.instructorName ?? "",
    modules: course.modules.map((module) => ({
      title: module.title,
      lessons: module.lessons.map((lesson) => lesson.title)
    }))
  };
}

export type CourseEditorData = {
  id: string;
  title: string;
  shortDescription: string | null;
  coverUrl: string | null;
  vertical: string;
  level: string;
  language: string;
  instructorName: string | null;
  workloadMinutes: number | null;
  passingScore: number | null;
  certificateEnabled: boolean;
  certificateValidityDays: number | null;
  mandatory: boolean;
  status: "draft" | "published" | "archived";
  organizationWide: boolean;
  modules: { id: string; title: string; lessons: { id: string; title: string; lessonType: "video" | "text" | "file" | "quiz" }[] }[];
};

export type LessonEditorData = {
  id: string;
  courseId: string;
  moduleTitle: string;
  title: string;
  description: string | null;
  lessonType: "video" | "text" | "file" | "quiz";
  videoProvider: "unlisted_youtube" | "vimeo" | "mux" | "cloud_storage" | "external_url" | null;
  videoUrl: string | null;
  content: string | null;
  attachmentUrl: string | null;
  language: string;
  durationMinutes: number | null;
  previewEnabled: boolean;
  required: boolean;
  questions: { id: string; question: string; options: { id: string; optionText: string; isCorrect: boolean }[] }[];
};

export async function getAdminCourseEditor(courseId: string, organizationSlug?: string): Promise<CourseEditorData | null> {
  const prisma = await getPrisma();
  if (!prisma) return null;

  const course = await prisma.course.findFirst({
    where: {
      id: courseId,
      ...(organizationSlug ? { organization: { slug: organizationSlug } } : {})
    },
    include: {
      visibilityRules: { where: { ruleType: "organization" }, select: { id: true } },
      modules: {
        orderBy: { position: "asc" },
        include: { lessons: { orderBy: { position: "asc" } } }
      }
    }
  });
  if (!course) return null;

  return {
    id: course.id,
    title: course.title,
    shortDescription: course.shortDescription,
    coverUrl: course.coverUrl,
    vertical: course.vertical,
    level: course.level,
    language: course.language,
    instructorName: course.instructorName,
    workloadMinutes: course.workloadMinutes,
    passingScore: course.passingScore,
    certificateEnabled: course.certificateEnabled,
    certificateValidityDays: course.certificateValidityDays,
    mandatory: course.mandatory,
    status: course.status,
    organizationWide: course.visibilityRules.length > 0,
    modules: course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      lessons: module.lessons.map((lesson) => ({ id: lesson.id, title: lesson.title, lessonType: lesson.lessonType }))
    }))
  };
}

export async function getAdminLessonEditor(courseId: string, lessonId: string, organizationSlug?: string): Promise<LessonEditorData | null> {
  const prisma = await getPrisma();
  if (!prisma) return null;

  const lesson = await prisma.lesson.findFirst({
    where: { id: lessonId, courseId, ...(organizationSlug ? { course: { organization: { slug: organizationSlug } } } : {}) },
    include: {
      module: { select: { title: true } },
      questions: { orderBy: { position: "asc" }, include: { options: { orderBy: { position: "asc" } } } }
    }
  });
  if (!lesson) return null;

  return {
    id: lesson.id,
    courseId: lesson.courseId,
    moduleTitle: lesson.module.title,
    title: lesson.title,
    description: lesson.description,
    lessonType: lesson.lessonType,
    videoProvider: lesson.videoProvider,
    videoUrl: lesson.videoUrl,
    content: lesson.content,
    attachmentUrl: lesson.attachmentUrl,
    language: lesson.language,
    durationMinutes: lesson.durationMinutes,
    previewEnabled: lesson.previewEnabled,
    required: lesson.required,
    questions: lesson.questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options.map((option) => ({ id: option.id, optionText: option.optionText, isCorrect: option.isCorrect }))
    }))
  };
}

export type CourseAssignmentOptions = {
  users: { id: string; name: string; email: string }[];
  groups: { id: string; name: string }[];
};

export async function getCourseAssignmentOptions(courseId: string, organizationSlug?: string): Promise<CourseAssignmentOptions> {
  const prisma = await getPrisma();
  if (!prisma) return { users: [], groups: [] };

  const course = await prisma.course.findFirst({
    where: { id: courseId, ...(organizationSlug ? { organization: { slug: organizationSlug } } : {}) },
    select: { organizationId: true }
  });
  if (!course) return { users: [], groups: [] };

  const [members, groups] = await Promise.all([
    prisma.organizationMember.findMany({
      where: { organizationId: course.organizationId, status: "active" },
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" }
    }),
    prisma.group.findMany({
      where: { organizationId: course.organizationId },
      select: { id: true, name: true },
      orderBy: { name: "asc" }
    })
  ]);
  return {
    users: members.map((member) => member.user),
    groups
  };
}

export async function getCourses(organizationSlug?: string): Promise<Course[]> {
  const prisma = await getPrisma();
  if (!prisma) return fallbackCourses;

  const rows = await prisma.course.findMany({
    where: {
      status: "published",
      ...(organizationSlug ? { organization: { slug: organizationSlug } } : {})
    },
    include: courseInclude,
    orderBy: { createdAt: "asc" }
  });
  return rows.map(mapCourse);
}

// Administrative lists include drafts as well as published courses, but are
// still constrained to the caller's tenant by the route-level scope.
export async function getAdminCourses(organizationSlug?: string): Promise<Course[]> {
  const prisma = await getPrisma();
  if (!prisma) return fallbackCourses;

  const rows = await prisma.course.findMany({
    where: organizationSlug ? { organization: { slug: organizationSlug } } : {},
    include: courseInclude,
    orderBy: { createdAt: "desc" }
  });
  return rows.map(mapCourse);
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const prisma = await getPrisma();
  if (!prisma) return fallbackCourses.find((course) => course.slug === slug) ?? null;

  const row = await prisma.course.findFirst({
    where: { slug, status: "published" },
    include: courseInclude
  });
  return row ? mapCourse(row) : null;
}

type CourseViewerSession = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    organizationSlug?: string | null;
    organizationName?: string | null;
    role?: string | null;
    groups?: string[];
  };
} | null;

function sessionToCourseViewer(session: CourseViewerSession): SessionUser | null {
  if (!session?.user?.id || !session.user.organizationSlug || !session.user.organizationName || !session.user.email) return null;
  return {
    id: session.user.id,
    name: session.user.name ?? session.user.email,
    email: session.user.email,
    organization: session.user.organizationName,
    organizationSlug: session.user.organizationSlug,
    role: (session.user.role ?? "student") as SessionUser["role"],
    groups: session.user.groups ?? []
  };
}

async function getCurrentViewer() {
  const session = await auth();
  const viewer = sessionToCourseViewer(session);
  if (!viewer) return null;
  const prisma = await getPrisma();
  if (!prisma) return viewer;
  const memberships = await prisma.groupMember.findMany({
    where: { userId: viewer.id, group: { organization: { slug: viewer.organizationSlug } } },
    include: { group: { select: { slug: true } } }
  });
  return { ...viewer, groups: memberships.map((membership) => membership.group.slug) };
}

// Course visibility is enforced before private catalog data is sent to the
// browser. Client-side filters remain only as a presentation convenience.
export async function getCoursesForCurrentUser(): Promise<Course[]> {
  const viewer = await getCurrentViewer();
  if (!viewer) return [];
  const prisma = await getPrisma();
  if (!prisma) return fallbackCourses.filter((course) => canAccessCourse(course, viewer));

  // A learner must only ever receive the progress and deadline from their own
  // enrollment. The course itself can be shared by many people in a tenant.
  const rows = await prisma.course.findMany({
    where: { status: "published" },
    include: {
      ...courseInclude,
      enrollments: {
        where: { userId: viewer.id, organization: { slug: viewer.organizationSlug } },
        include: { lessonProgress: true }
      }
    },
    orderBy: { createdAt: "asc" }
  });
  return rows.map(mapCourse).filter((course) => canAccessCourse(course, viewer));
}

export async function getCourseForCurrentUser(slug: string): Promise<Course | null> {
  return (await getCoursesForCurrentUser()).find((course) => course.slug === slug) ?? null;
}

const ORG_ACCENT: Record<string, string> = {
  zasso: "blue",
  "zasso-latam": "cyan",
  demo: "violet"
};

// Tenant companies shown in the admin — excludes the SACF platform org itself.
export async function getOrganizations(organizationSlug?: string): Promise<Organization[]> {
  const prisma = await getPrisma();
  if (!prisma) return fallbackOrganizations;

  const rows = (await prisma.organization.findMany({
    where: organizationSlug ? { slug: organizationSlug } : { slug: { not: "sacf" } },
    include: { _count: { select: { members: true, courses: true, certificates: true } } },
    orderBy: { createdAt: "asc" }
  })) as OrganizationRow[];
  return rows.map((org) => ({
    name: org.name,
    slug: org.slug,
    status: org.status === "paused" ? "Pausada" : "Ativa",
    users: org._count.members,
    seatLimit: org.seatLimit,
    courses: org._count.courses,
    certificates: org._count.certificates,
    expiring: 0,
    accent: ORG_ACCENT[org.slug] ?? "blue",
    brandLogo: org.logoUrl ?? undefined
  }));
}

const ROLE_LABEL: Record<string, string> = {
  org_admin: "Admin da empresa",
  instructor: "Instrutor",
  manager: "Gestor",
  student: "Aluno",
  external_partner: "Parceiro externo",
  sacf_admin: "Admin SACF"
};

const MEMBER_STATUS_LABEL: Record<string, AdminUser["status"]> = {
  active: "Ativo",
  invited: "Pendente",
  blocked: "Bloqueado"
};

export async function getAdminUsers(organizationSlug?: string): Promise<AdminUser[]> {
  const prisma = await getPrisma();
  if (!prisma) return fallbackAdminUsers;

  const rows = (await prisma.organizationMember.findMany({
    where: organizationSlug
      ? { organization: { slug: organizationSlug } }
      : { organization: { slug: { not: "sacf" } } },
    include: {
      user: {
        include: {
          groupMemberships: { include: { group: { select: { id: true, name: true } } } },
          enrollments: {
            include: { lessonProgress: true, course: { select: { id: true, _count: { select: { lessons: true } } } } }
          }
        }
      },
      organization: true
    },
    orderBy: { createdAt: "asc" }
  })) as AdminMemberRow[];
  return rows.map((member) => {
    const progressValues = member.user.enrollments.map((enrollment) => {
      if (enrollment.status === "completed") return 100;
      const totalLessons = Math.max(enrollment.course._count.lessons, 1);
      const completed = enrollment.lessonProgress.filter((lesson) => lesson.status === "completed").length;
      const partial = enrollment.lessonProgress
        .filter((lesson) => lesson.status === "in_progress")
        .reduce((sum, lesson) => sum + lesson.progressPercent / 100, 0);
      return Math.min(99, Math.round(((completed + partial) / totalLessons) * 100));
    });
    const averageProgress = progressValues.length
      ? Math.round(progressValues.reduce((sum, progress) => sum + progress, 0) / progressValues.length)
      : 0;

    return {
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      organization: member.organization.name,
      organizationSlug: member.organization.slug,
      role: ROLE_LABEL[member.role] ?? member.role,
      status: MEMBER_STATUS_LABEL[member.status] ?? "Ativo",
      progress: averageProgress,
      groups: member.user.groupMemberships.map((membership) => membership.group)
    };
  });
}

export type AdminGroup = { id: string; name: string; description: string | null; organizationSlug: string; memberCount: number };

export async function getAdminGroups(organizationSlug?: string): Promise<AdminGroup[]> {
  const prisma = await getPrisma();
  if (!prisma) return [];
  const groups = await prisma.group.findMany({
    where: organizationSlug ? { organization: { slug: organizationSlug } } : { organization: { slug: { not: "sacf" } } },
    include: { organization: { select: { slug: true } }, _count: { select: { members: true } } },
    orderBy: [{ organization: { name: "asc" } }, { name: "asc" }]
  });
  return groups.map((group) => ({ id: group.id, name: group.name, description: group.description, organizationSlug: group.organization.slug, memberCount: group._count.members }));
}

// Courses an org has started but hasn't published yet — used by the admin
// "implementation" queue. Scope to one company, or omit for the whole platform.
export async function getDraftCourseCount(organizationSlug?: string): Promise<number> {
  const prisma = await getPrisma();
  if (!prisma) return 0;

  return prisma.course.count({
    where: {
      status: "draft",
      ...(organizationSlug ? { organization: { slug: organizationSlug } } : {})
    }
  });
}

export type AdminCertificateRecord = {
  id: string;
  code: string;
  userName: string;
  organizationName: string;
  courseTitle: string;
  issuedAt: string;
  expiresAt: string | null;
  status: "valid" | "expiring" | "expired" | "revoked";
};

export type CertificationOverview = {
  issued: number;
  expiring: number;
  expired: number;
  revoked: number;
  records: AdminCertificateRecord[];
};

// Certification reporting is scoped by tenant before rows are returned to an
// organization admin. "Expiring" means the certificate ends within 30 days.
export async function getCertificationOverview(organizationSlug?: string): Promise<CertificationOverview> {
  const prisma = await getPrisma();
  if (!prisma) return { issued: 0, expiring: 0, expired: 0, revoked: 0, records: [] };

  const rows = await prisma.certificate.findMany({
    where: organizationSlug ? { organization: { slug: organizationSlug } } : {},
    include: {
      user: { select: { name: true } },
      course: { select: { title: true } },
      organization: { select: { name: true } }
    },
    orderBy: { issuedAt: "desc" }
  });
  const now = new Date();
  const expiringThreshold = new Date(now.getTime() + 30 * 86_400_000);
  const records = rows.map((certificate) => {
    const status = certificate.revokedAt
      ? "revoked" as const
      : certificate.expiresAt && certificate.expiresAt < now
        ? "expired" as const
        : certificate.expiresAt && certificate.expiresAt <= expiringThreshold
          ? "expiring" as const
          : "valid" as const;
    return {
      id: certificate.id,
      code: certificate.certificateCode,
      userName: certificate.user.name,
      organizationName: certificate.organization.name,
      courseTitle: certificate.course.title,
      issuedAt: certificate.issuedAt.toISOString(),
      expiresAt: certificate.expiresAt?.toISOString() ?? null,
      status
    };
  });
  return {
    issued: records.length,
    expiring: records.filter((record) => record.status === "expiring").length,
    expired: records.filter((record) => record.status === "expired").length,
    revoked: records.filter((record) => record.status === "revoked").length,
    records
  };
}

export type TrainingDeadlineOverview = {
  overdue: number;
  dueSoon: number;
  records: { id: string; userName: string; courseTitle: string; organizationName: string; dueDate: string; status: "overdue" | "due_soon" | "scheduled" }[];
};

export async function getTrainingDeadlineOverview(organizationSlug?: string): Promise<TrainingDeadlineOverview> {
  const prisma = await getPrisma();
  if (!prisma) return { overdue: 0, dueSoon: 0, records: [] };

  const rows = await prisma.enrollment.findMany({
    where: {
      dueDate: { not: null },
      status: { notIn: ["completed", "cancelled", "expired"] },
      ...(organizationSlug ? { organization: { slug: organizationSlug } } : {})
    },
    include: {
      user: { select: { name: true } },
      course: { select: { title: true } },
      organization: { select: { name: true } }
    },
    orderBy: { dueDate: "asc" }
  });
  const now = new Date();
  const soonThreshold = new Date(now.getTime() + 7 * 86_400_000);
  const records = rows.map((enrollment) => {
    const dueDate = enrollment.dueDate!;
    const status = dueDate < now ? "overdue" as const : dueDate <= soonThreshold ? "due_soon" as const : "scheduled" as const;
    return {
      id: enrollment.id,
      userName: enrollment.user.name,
      courseTitle: enrollment.course.title,
      organizationName: enrollment.organization.name,
      dueDate: dueDate.toISOString(),
      status
    };
  });
  return {
    overdue: records.filter((record) => record.status === "overdue").length,
    dueSoon: records.filter((record) => record.status === "due_soon").length,
    records
  };
}
