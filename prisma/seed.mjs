import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 connects via a driver adapter; load the local DB url.
process.loadEnvFile(".env.local");
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const ORGS = [
  { slug: "sacf", name: "SACF", status: "active" },
  { slug: "zasso", name: "Zasso", status: "active", primaryColor: "#2F5BFF" },
  { slug: "zasso-latam", name: "Representantes Zasso LATAM", status: "active" },
  { slug: "demo", name: "Cliente demonstração", status: "paused" }
];

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
    certificateEnabled: true, certificateValidityDays: 365, mandatory: false,
    instructorName: "Equipe técnica Zasso",
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
    instructorName: "Especialistas de segurança Zasso",
    summary: "Curso crítico para técnicos elétricos que atuam com procedimentos de alta tensão, proteção individual e protocolos de isolamento.",
    audience: "Técnicos elétricos, equipe de alta tensão e treinadores certificados.",
    modules: [
      { title: "Base de segurança", lessons: ["Risco elétrico", "EPIs obrigatórios", "Zona controlada"] },
      { title: "Procedimentos", lessons: ["Bloqueio e etiquetagem", "Teste de ausência de tensão", "Plano de emergência"] }
    ]
  },
  {
    slug: "formacao-treinadores", title: "Formação de treinadores Zasso",
    orgs: ["zasso", "zasso-latam"], accessGroups: ["treinadores", "representantes"],
    vertical: "Treinador", level: "Avançado", language: "PT-BR", workloadMinutes: 300,
    certificateEnabled: true, certificateValidityDays: 730, mandatory: false,
    instructorName: "Academia Zasso",
    summary: "Padronização para multiplicadores internos: como ensinar, validar conhecimento e manter registros de certificação.",
    audience: "Treinadores, coordenadores de operação e representantes master.",
    modules: [
      { title: "Metodologia", lessons: ["Como conduzir treinamento", "Avaliação prática", "Gestão de dúvidas recorrentes"] },
      { title: "Certificação", lessons: ["Critérios de aprovação", "Registro de evidências", "Reciclagem"] }
    ]
  }
];

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
  for (const u of USERS) {
    const org = orgBySlug[u.org];
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name },
      create: { email: u.email, name: u.name, preferredLocale: "pt-BR" }
    });
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
  for (const c of COURSES) {
    const ownerOrg = orgBySlug[c.orgs[0]];
    const course = await prisma.course.upsert({
      where: { organizationId_slug: { organizationId: ownerOrg.id, slug: c.slug } },
      update: {
        title: c.title, vertical: c.vertical, level: c.level, language: c.language,
        workloadMinutes: c.workloadMinutes, status: "published",
        certificateEnabled: c.certificateEnabled, certificateValidityDays: c.certificateValidityDays,
        mandatory: c.mandatory, instructorName: c.instructorName,
        shortDescription: c.summary, description: c.summary, targetAudience: c.audience, publishedAt: new Date()
      },
      create: {
        organizationId: ownerOrg.id, title: c.title, slug: c.slug,
        vertical: c.vertical, level: c.level, language: c.language,
        workloadMinutes: c.workloadMinutes, status: "published",
        certificateEnabled: c.certificateEnabled, certificateValidityDays: c.certificateValidityDays,
        mandatory: c.mandatory, instructorName: c.instructorName,
        shortDescription: c.summary, description: c.summary, targetAudience: c.audience, publishedAt: new Date()
      }
    });

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
        await prisma.lesson.create({
          data: { moduleId: mod.id, courseId: course.id, title: lessonTitle, lessonType: "video", language: c.language, position: lPos++, required: true }
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

  const counts = {
    organizations: await prisma.organization.count(),
    users: await prisma.user.count(),
    groups: await prisma.group.count(),
    organizationMembers: await prisma.organizationMember.count(),
    groupMembers: await prisma.groupMember.count(),
    courses: await prisma.course.count(),
    modules: await prisma.courseModule.count(),
    lessons: await prisma.lesson.count(),
    visibilityRules: await prisma.courseVisibilityRule.count()
  };
  console.log("Seed concluído:", JSON.stringify(counts, null, 2));
}

main()
  .catch((e) => { console.error(e); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
