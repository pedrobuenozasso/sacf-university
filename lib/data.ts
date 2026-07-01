import {
  adminUsers as fallbackAdminUsers,
  courses as fallbackCourses,
  organizations as fallbackOrganizations,
  type AdminUser,
  type Course,
  type Organization
} from "@/lib/courses";

const courseInclude = {
  modules: {
    orderBy: { position: "asc" },
    include: { lessons: { orderBy: { position: "asc" } } }
  },
  enrollments: {
    include: { lessonProgress: true }
  },
  visibilityRules: { include: { organization: true, group: true } },
  _count: { select: { lessons: true } }
} as const;

type CourseRow = {
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
  }[];
  _count: { lessons: number };
};

type OrganizationRow = {
  name: string;
  slug: string;
  status: string;
  logoUrl: string | null;
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
  organization: { name: string };
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
      course.visibilityRules
        .filter((rule) => rule.ruleType === "organization" && rule.organization)
        .map((rule) => rule.organization!.slug)
    )
  );
  const accessGroups = Array.from(
    new Set(
      course.visibilityRules
        .filter((rule) => rule.ruleType === "group" && rule.group)
        .map((rule) => rule.group!.slug)
    )
  );

  const enrollment = enrollmentProgress(course);

  return {
    slug: course.slug,
    title: course.title,
    organizationSlugs,
    accessGroups,
    vertical: course.vertical,
    level: course.level,
    language: course.language,
    duration: formatDuration(course.workloadMinutes),
    lessons: course._count.lessons,
    progress: enrollment.progress,
    certificate: certificateLabel(course),
    status: enrollment.status,
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

export async function getCourses(): Promise<Course[]> {
  const prisma = await getPrisma();
  if (!prisma) return fallbackCourses;

  const rows = await prisma.course.findMany({
    where: { status: "published" },
    include: courseInclude,
    orderBy: { createdAt: "asc" }
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
export async function getOrganizations(): Promise<Organization[]> {
  const prisma = await getPrisma();
  if (!prisma) return fallbackOrganizations;

  const rows = (await prisma.organization.findMany({
    where: { slug: { not: "sacf" } },
    include: { _count: { select: { members: true, courses: true, certificates: true } } },
    orderBy: { createdAt: "asc" }
  })) as OrganizationRow[];
  return rows.map((org) => ({
    name: org.name,
    slug: org.slug,
    status: org.status === "paused" ? "Pausada" : "Ativa",
    users: org._count.members,
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

export async function getAdminUsers(): Promise<AdminUser[]> {
  const prisma = await getPrisma();
  if (!prisma) return fallbackAdminUsers;

  const rows = (await prisma.organizationMember.findMany({
    where: { organization: { slug: { not: "sacf" } } },
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
      role: ROLE_LABEL[member.role] ?? member.role,
      status: MEMBER_STATUS_LABEL[member.status] ?? "Ativo",
      progress: averageProgress
    };
  });
}
