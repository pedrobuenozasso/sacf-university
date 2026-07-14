import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

// Prisma 7 connects via a driver adapter; load the local DB url.
process.loadEnvFile(".env.local");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Random, in-memory-only password for the seeded demo accounts — generated fresh
// on every seed run and printed to the console. NEVER hardcoded or written to a
// file, since this script is committed to source control.
const demoPassword = randomBytes(9).toString("base64url");
const demoPasswordHash = await bcrypt.hash(demoPassword, 12);

const ORGS = [
  { slug: "sacf", name: "SACF", status: "active" },
  { slug: "zasso", name: "Zasso", status: "active", primaryColor: "#2F5BFF" },
  { slug: "zasso-latam", name: "Representantes Zasso LATAM", status: "active" },
  { slug: "demo", name: "Cliente Industrial Sul", status: "paused" }
];

// Email domains that map a corporate login to its organization (lowercase, unique).
const ORG_DOMAINS = {
  zasso: ["zasso.com"],
  "zasso-latam": ["latam-partner.com"],
  sacf: ["sacf.io"]
};

const GROUPS = {
  sacf: ["sacf-admin"],
  zasso: ["administradores", "treinadores", "operadores", "eletrico", "mecanicos", "representantes"],
  "zasso-latam": ["representantes"]
};

const GROUP_NAMES = {
  "sacf-admin": "Administradores SACF",
  administradores: "Administradores",
  treinadores: "Treinadores",
  operadores: "Operadores",
  eletrico: "Elétrico / alta tensão",
  mecanicos: "Mecânicos",
  representantes: "Representantes"
};

const USERS = [
  { key: "ana", email: "ana@zasso.com", name: "Ana Ribeiro", org: "zasso", role: "org_admin", groups: ["administradores", "treinadores"] },
  { key: "carlos", email: "carlos@zasso.com", name: "Carlos Mendes", org: "zasso", role: "student", groups: ["operadores"] },
  { key: "marina", email: "marina@zasso.com", name: "Marina Costa", org: "zasso", role: "student", groups: ["eletrico"] },
  { key: "diego", email: "diego@latam-partner.com", name: "Diego Silva", org: "zasso-latam", role: "external_partner", groups: ["representantes"] },
  { key: "sacf", email: "admin@sacf.io", name: "Admin SACF", org: "sacf", role: "sacf_admin", groups: ["sacf-admin"] }
];

const COURSES = [
  {
    slug: "operador-eletroherb", title: "Operação segura do sistema Eletroherb",
    orgs: ["zasso", "zasso-latam"], accessGroups: ["operadores", "treinadores", "representantes"],
    vertical: "Operador", level: "Essencial", language: "PT-BR", workloadMinutes: 200,
    certificateEnabled: true, certificateValidityDays: 365, passingScore: 70, mandatory: false,
    instructorName: "Equipe técnica SACF",
    summary: "Treinamento base para operar o equipamento com segurança, rotina correta e leitura dos principais indicadores de campo.",
    audience: "Operadores, líderes de campo e novos representantes técnicos.",
    modules: [
      { title: "Fundamentos do equipamento", lessons: ["Visão geral do sistema", "Componentes principais", "Riscos operacionais"] },
      { title: "Operação em campo", lessons: ["Checklist antes da aplicação", "Parâmetros de trabalho", "Erros comuns"] },
      { title: "Validação teórica", lessons: ["Revisão final", "Prova de certificação"] }
    ]
  },
  {
    slug: "mecanica-preventiva", title: "Manutenção mecânica preventiva",
    orgs: ["zasso"], accessGroups: ["mecanicos", "treinadores"],
    vertical: "Mecânico", level: "Intermediário", language: "PT-BR", workloadMinutes: 165,
    certificateEnabled: true, certificateValidityDays: null, mandatory: false,
    instructorName: "Engenharia de campo",
    summary: "Procedimentos de inspeção, conservação e troca de componentes para reduzir paradas e padronizar a manutenção.",
    audience: "Mecânicos, assistência técnica e prestadores de serviço autorizados.",
    modules: [
      { title: "Rotina preventiva", lessons: ["Inspeção visual", "Pontos de desgaste", "Lubrificação e limpeza"] },
      { title: "Diagnóstico", lessons: ["Sintomas frequentes", "Registro de ocorrências", "Plano de ação"] }
    ]
  },
  {
    slug: "alta-tensao-seguranca", title: "Segurança em alta tensão",
    orgs: ["zasso"], accessGroups: ["eletrico", "treinadores"],
    vertical: "Elétrico", level: "Avançado", language: "PT-BR", workloadMinutes: 250,
    certificateEnabled: true, certificateValidityDays: 365, mandatory: true,
    instructorName: "Especialistas SACF",
    summary: "Curso crítico para técnicos elétricos que atuam com procedimentos de alta tensão, proteção individual e protocolos de isolamento.",
    audience: "Técnicos elétricos, equipe de alta tensão e treinadores certificados.",
    modules: [
      { title: "Base de segurança", lessons: ["Risco elétrico", "EPIs obrigatórios", "Zona controlada"] },
      { title: "Procedimentos", lessons: ["Bloqueio e etiquetagem", "Teste de ausência de tensão", "Plano de emergência"] }
    ]
  },
  {
    slug: "formacao-treinadores", title: "Formação de treinadores corporativos",
    orgs: ["zasso", "zasso-latam"], accessGroups: ["treinadores", "representantes"],
    vertical: "Treinador", level: "Avançado", language: "PT-BR", workloadMinutes: 300,
    certificateEnabled: true, certificateValidityDays: 730, mandatory: false,
    instructorName: "SACF University",
    summary: "Padronização para multiplicadores internos: como ensinar, validar conhecimento e manter registros de certificação.",
    audience: "Treinadores, coordenadores de operação e representantes master.",
    modules: [
      { title: "Metodologia", lessons: ["Como conduzir treinamento", "Avaliação prática", "Gestão de dúvidas recorrentes"] },
      { title: "Certificação", lessons: ["Critérios de aprovação", "Registro de evidências", "Reciclagem"] }
    ]
  }
];

const DEMO_QUIZZES = {
  "operador-eletroherb:Prova de certificação": [
    {
      question: "Antes de iniciar a operação, qual é a conduta correta?",
      options: ["Executar o checklist de segurança", "Aumentar a velocidade imediatamente", "Ignorar alertas do painel"],
      correctOption: 0
    },
    {
      question: "Ao identificar um risco operacional, o operador deve:",
      options: ["Seguir o procedimento e comunicar a ocorrência", "Continuar para não atrasar a operação", "Desativar os alertas"],
      correctOption: 0
    },
    {
      question: "Qual é o objetivo principal do treinamento Eletroherb?",
      options: ["Operar o sistema com segurança e consistência", "Substituir a manutenção preventiva", "Eliminar a necessidade de registros"],
      correctOption: 0
    }
  ]
};

const PRESENTATION_ENROLLMENTS = [
  {
    user: "carlos",
    course: "operador-eletroherb",
    status: "in_progress",
    completedLessons: 5,
    activeLessonPercent: 70,
    dueInDays: 18
  },
  {
    user: "ana",
    course: "formacao-treinadores",
    status: "completed",
    completedLessons: 999,
    finalScore: 96,
    certificateCode: "SACF-ZAS-TRN-1001",
    expiresInDays: 710
  },
  {
    user: "marina",
    course: "alta-tensao-seguranca",
    status: "in_progress",
    completedLessons: 2,
    activeLessonPercent: 35,
    dueInDays: 9
  },
  {
    user: "diego",
    course: "operador-eletroherb",
    status: "completed",
    completedLessons: 999,
    finalScore: 91,
    certificateCode: "SACF-LAT-OPR-1002",
    expiresInDays: 320
  }
];

function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}

async function main() {
  // 1. organizations
  const orgBySlug = {};
  for (const o of ORGS) {
    orgBySlug[o.slug] = await prisma.organization.upsert({
      where: { slug: o.slug },
      update: { name: o.name, status: o.status, primaryColor: o.primaryColor ?? null },
      create: { name: o.name, slug: o.slug, status: o.status, primaryColor: o.primaryColor ?? null }
    });
  }

  // 1b. organization email domains (login resolves the org from the email domain)
  for (const [orgSlug, domains] of Object.entries(ORG_DOMAINS)) {
    const org = orgBySlug[orgSlug];
    if (!org) continue;
    for (const domain of domains) {
      await prisma.organizationDomain.upsert({
        where: { domain },
        update: { organizationId: org.id },
        create: { organizationId: org.id, domain }
      });
    }
  }

  // 2. groups (per org)
  const groupByKey = {}; // `${orgSlug}:${groupSlug}`
  for (const [orgSlug, slugs] of Object.entries(GROUPS)) {
    const org = orgBySlug[orgSlug];
    for (const gslug of slugs) {
      const g = await prisma.group.upsert({
        where: { organizationId_slug: { organizationId: org.id, slug: gslug } },
        update: { name: GROUP_NAMES[gslug] ?? gslug },
        create: { organizationId: org.id, slug: gslug, name: GROUP_NAMES[gslug] ?? gslug }
      });
      groupByKey[`${orgSlug}:${gslug}`] = g;
    }
  }

  // 3. users + memberships + group memberships
  const userByKey = {};
  for (const u of USERS) {
    const org = orgBySlug[u.org];
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, emailVerified: new Date(), passwordHash: demoPasswordHash },
      create: {
        email: u.email,
        name: u.name,
        preferredLocale: "pt-BR",
        emailVerified: new Date(),
        passwordHash: demoPasswordHash
      }
    });
    userByKey[u.key] = user;
    await prisma.organizationMember.upsert({
      where: { organizationId_userId: { organizationId: org.id, userId: user.id } },
      update: { role: u.role, status: "active" },
      create: { organizationId: org.id, userId: user.id, role: u.role, status: "active", joinedAt: new Date() }
    });
    for (const gslug of u.groups) {
      const g = groupByKey[`${u.org}:${gslug}`];
      if (!g) continue;
      await prisma.groupMember.upsert({
        where: { groupId_userId: { groupId: g.id, userId: user.id } },
        update: {},
        create: { organizationId: org.id, groupId: g.id, userId: user.id }
      });
    }
  }

  // 4. courses + modules + lessons + visibility rules
  const courseBySlug = {};
  for (const c of COURSES) {
    const ownerOrg = orgBySlug[c.orgs[0]];
    const course = await prisma.course.upsert({
      where: { organizationId_slug: { organizationId: ownerOrg.id, slug: c.slug } },
      update: {
        title: c.title, vertical: c.vertical, level: c.level, language: c.language,
        workloadMinutes: c.workloadMinutes, status: "published",
        certificateEnabled: c.certificateEnabled, certificateValidityDays: c.certificateValidityDays,
        passingScore: c.passingScore ?? null,
        mandatory: c.mandatory, instructorName: c.instructorName,
        shortDescription: c.summary, description: c.summary, targetAudience: c.audience, publishedAt: new Date()
      },
      create: {
        organizationId: ownerOrg.id, title: c.title, slug: c.slug,
        vertical: c.vertical, level: c.level, language: c.language,
        workloadMinutes: c.workloadMinutes, status: "published",
        certificateEnabled: c.certificateEnabled, certificateValidityDays: c.certificateValidityDays,
        passingScore: c.passingScore ?? null,
        mandatory: c.mandatory, instructorName: c.instructorName,
        shortDescription: c.summary, description: c.summary, targetAudience: c.audience, publishedAt: new Date()
      }
    });
    courseBySlug[c.slug] = course;

    // reset children for idempotency
    await prisma.lesson.deleteMany({ where: { courseId: course.id } });
    await prisma.courseModule.deleteMany({ where: { courseId: course.id } });
    await prisma.courseVisibilityRule.deleteMany({ where: { courseId: course.id } });

    let mPos = 0;
    for (const m of c.modules) {
      const mod = await prisma.courseModule.create({
        data: { courseId: course.id, title: m.title, position: mPos++ }
      });
      let lPos = 0;
      for (const lessonTitle of m.lessons) {
        const quiz = DEMO_QUIZZES[`${c.slug}:${lessonTitle}`];
        await prisma.lesson.create({
          data: {
            moduleId: mod.id,
            courseId: course.id,
            title: lessonTitle,
            lessonType: quiz ? "quiz" : "video",
            language: c.language,
            position: lPos++,
            required: true,
            ...(quiz ? {
              questions: {
                create: quiz.map((item, questionPosition) => ({
                  question: item.question,
                  position: questionPosition,
                  options: {
                    create: item.options.map((optionText, optionPosition) => ({
                      optionText,
                      position: optionPosition,
                      isCorrect: optionPosition === item.correctOption
                    }))
                  }
                }))
              }
            } : {})
          }
        });
      }
    }

    // visibility rules
    const rules = [];
    for (const orgSlug of c.orgs) {
      rules.push({ courseId: course.id, organizationId: orgBySlug[orgSlug].id, ruleType: "organization" });
      for (const gslug of c.accessGroups) {
        const g = groupByKey[`${orgSlug}:${gslug}`];
        if (g) rules.push({ courseId: course.id, organizationId: orgBySlug[orgSlug].id, groupId: g.id, ruleType: "group" });
      }
    }
    await prisma.courseVisibilityRule.createMany({ data: rules });
  }

  // 5. presentation enrollments, lesson progress and certificates
  for (const item of PRESENTATION_ENROLLMENTS) {
    const user = userByKey[item.user];
    const course = courseBySlug[item.course];
    if (!user || !course) continue;

    const membership = await prisma.organizationMember.findFirst({
      where: { userId: user.id, organizationId: { in: Object.values(orgBySlug).map((org) => org.id) } },
      include: { organization: true }
    });
    const organization = membership?.organization ?? orgBySlug.zasso;
    const completed = item.status === "completed";

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: { courseId: course.id, userId: user.id, cycleNumber: 1 }
    });
    const enrollment = existingEnrollment
      ? await prisma.enrollment.update({
          where: { id: existingEnrollment.id },
          data: {
        organizationId: organization.id,
        status: item.status,
        assignedAt: addDays(-42),
        startedAt: addDays(-28),
        completedAt: completed ? addDays(-12) : null,
        dueDate: completed ? null : addDays(item.dueInDays ?? 14),
        finalScore: item.finalScore ?? null,
        certificateExpiresAt: item.expiresInDays ? addDays(item.expiresInDays) : null,
        recertificationRequired: false
      }
        })
      : await prisma.enrollment.create({
          data: {
        organizationId: organization.id,
        courseId: course.id,
        userId: user.id,
        status: item.status,
        assignedAt: addDays(-42),
        startedAt: addDays(-28),
        completedAt: completed ? addDays(-12) : null,
        dueDate: completed ? null : addDays(item.dueInDays ?? 14),
        finalScore: item.finalScore ?? null,
        certificateExpiresAt: item.expiresInDays ? addDays(item.expiresInDays) : null,
        recertificationRequired: false,
        cycleNumber: 1
      }
        });

    const modules = await prisma.courseModule.findMany({
      where: { courseId: course.id },
      orderBy: { position: "asc" },
      include: { lessons: { orderBy: { position: "asc" } } }
    });
    const lessons = modules.flatMap((module) => module.lessons);

    for (const [index, lesson] of lessons.entries()) {
      const isCompleted = completed || index < item.completedLessons;
      const isActive = !completed && index === item.completedLessons;
      await prisma.lessonProgress.upsert({
        where: { enrollmentId_lessonId: { enrollmentId: enrollment.id, lessonId: lesson.id } },
        update: {
          status: isCompleted ? "completed" : isActive ? "in_progress" : "not_started",
          progressPercent: isCompleted ? 100 : isActive ? item.activeLessonPercent ?? 35 : 0,
          completedAt: isCompleted ? addDays(-8 + index) : null,
          lastSeenAt: isCompleted || isActive ? addDays(-1) : null
        },
        create: {
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
          status: isCompleted ? "completed" : isActive ? "in_progress" : "not_started",
          progressPercent: isCompleted ? 100 : isActive ? item.activeLessonPercent ?? 35 : 0,
          completedAt: isCompleted ? addDays(-8 + index) : null,
          lastSeenAt: isCompleted || isActive ? addDays(-1) : null
        }
      });
    }

    if (completed && item.certificateCode) {
      await prisma.certificate.upsert({
        where: { certificateCode: item.certificateCode },
        update: {
          organizationId: organization.id,
          courseId: course.id,
          userId: user.id,
          enrollmentId: enrollment.id,
          issuedAt: addDays(-12),
          expiresAt: item.expiresInDays ? addDays(item.expiresInDays) : null,
          metadata: { source: "presentation-seed" }
        },
        create: {
          organizationId: organization.id,
          courseId: course.id,
          userId: user.id,
          enrollmentId: enrollment.id,
          certificateCode: item.certificateCode,
          issuedAt: addDays(-12),
          expiresAt: item.expiresInDays ? addDays(item.expiresInDays) : null,
          metadata: { source: "presentation-seed" }
        }
      });
    }
  }

  const counts = {
    organizations: await prisma.organization.count(),
    users: await prisma.user.count(),
    groups: await prisma.group.count(),
    organizationMembers: await prisma.organizationMember.count(),
    groupMembers: await prisma.groupMember.count(),
    courses: await prisma.course.count(),
    modules: await prisma.courseModule.count(),
    lessons: await prisma.lesson.count(),
    visibilityRules: await prisma.courseVisibilityRule.count(),
    organizationDomains: await prisma.organizationDomain.count(),
    enrollments: await prisma.enrollment.count(),
    lessonProgress: await prisma.lessonProgress.count(),
    certificates: await prisma.certificate.count()
  };
  console.log("Seed concluído:", JSON.stringify(counts, null, 2));
  console.log(`\nSenha temporária dos usuários de demonstração: ${demoPassword}`);
  console.log("(gerada agora, só nesta execução — não fica salva em nenhum arquivo)");
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
