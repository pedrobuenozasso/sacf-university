import {
  adminUsers as fallbackAdminUsers,
  courses as fallbackCourses,
  organizations as fallbackOrganizations,
  type AdminUser,
  type Course,
  type Organization
} from "@/lib/courses";

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
  role: string;
  status: string;
  user: {
    name: string;
    email: string;
    enrollments: {
      status: string;
      lessonProgress: { status: string; progressPercent: number }[];
      course: { _count: { lessons: number } };
    }[];
  };
  organization: { name: string; slug: string };
};

async function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  const db = await import("@/lib/db");
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

function enrollmentProgress(course: CourseRow): { progress: number; status: Course["status"] } {
  const totalLessons = Math.max(course._count.lessons, 1);
  const enrollmentScores = course.enrollments.map((enrollment) => {
    if (enrollment.status === "completed") return { progress: 100, status: "Concluído" as const };

    const completed = enrollment.lessonProgress.filter((lesson) => lesson.status === "completed").length;
    const inProgress = enrollment.lessonProgress.filter((lesson) => lesson.status === "in_progress");
    const partial = inProgress.reduce((sum, lesson) => sum + lesson.progressPercent / 100, 0);
    const progress = Math.min(99, Math.round(((completed + partial) / totalLessons) * 100));

    return {
      progress,
      status: progress > 0 ? ("Em andamento" as const) : ("Disponível" as const)
    };
  });

  return enrollmentScores.reduce(
    (best, current) => (current.progress > best.progress ? current : best),
    { progress: 0, status: "Disponível" as const }
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

  const enrollment = enrollmentProgress(course);

  return {
    id: course.id,
    slug: course.slug,
    title: course.title,
    organizationSlugs,
    accessGroups,
    assignedUserIds,
    vertical: course.vertical,
    level: course.level,
    language: course.language,
    duration: formatDuration(course.workloadMinutes),
    lessons: course._count.lessons,
    progress: enrollment.progress,
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
  vertical: string;
  level: string;
  language: string;
  instructorName: string | null;
  workloadMinutes: number | null;
  certificateEnabled: boolean;
  certificateValidityDays: number | null;
  mandatory: boolean;
  status: "draft" | "published" | "archived";
  modules: { id: string; title: string; lessons: { id: string; title: string }[] }[];
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
    vertical: course.vertical,
    level: course.level,
    language: course.language,
    instructorName: course.instructorName,
    workloadMinutes: course.workloadMinutes,
    certificateEnabled: course.certificateEnabled,
    certificateValidityDays: course.certificateValidityDays,
    mandatory: course.mandatory,
    status: course.status,
    modules: course.modules.map((module) => ({
      id: module.id,
      title: module.title,
      lessons: module.lessons.map((lesson) => ({ id: lesson.id, title: lesson.title }))
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
      name: member.user.name,
      email: member.user.email,
      organization: member.organization.name,
      organizationSlug: member.organization.slug,
      role: ROLE_LABEL[member.role] ?? member.role,
      status: MEMBER_STATUS_LABEL[member.status] ?? "Ativo",
      progress: averageProgress
    };
  });
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
