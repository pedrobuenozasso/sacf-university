export type Course = {
  slug: string;
  title: string;
  organizationSlugs: string[];
  accessGroups: string[];
  assignedUserIds?: string[];
  vertical: string;
  level: string;
  language: string;
  duration: string;
  lessons: number;
  progress: number;
  certificate: string;
  status: "Em andamento" | "Disponível" | "Concluído";
  accent: string;
  summary: string;
  audience: string;
  instructor: string;
  modules: {
    title: string;
    lessons: string[];
  }[];
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  organization: string;
  organizationSlug: string;
  role: "sacf_admin" | "org_admin" | "instructor" | "manager" | "student" | "external_partner";
  groups: string[];
};

export type Organization = {
  name: string;
  slug: string;
  status: "Ativa" | "Piloto" | "Pausada";
  users: number;
  courses: number;
  certificates: number;
  expiring: number;
  accent: string;
  brandLogo?: string;
};

export type AdminUser = {
  name: string;
  email: string;
  organization: string;
  role: string;
  status: "Ativo" | "Pendente" | "Bloqueado";
  progress: number;
};

export const courses: Course[] = [
  {
    slug: "operador-eletroherb",
    title: "Operação segura do sistema Eletroherb",
    organizationSlugs: ["zasso", "zasso-latam"],
    accessGroups: ["operadores", "treinadores", "representantes"],
    vertical: "Operador",
    level: "Essencial",
    language: "PT-BR",
    duration: "3h 20min",
    lessons: 18,
    progress: 64,
    certificate: "Validade 12 meses",
    status: "Em andamento",
    accent: "blue",
    summary:
      "Treinamento base para operar o equipamento com segurança, rotina correta e leitura dos principais indicadores de campo.",
    audience: "Operadores, líderes de campo e novos representantes técnicos.",
    instructor: "Equipe técnica SACF",
    modules: [
      {
        title: "Fundamentos do equipamento",
        lessons: ["Visão geral do sistema", "Componentes principais", "Riscos operacionais"]
      },
      {
        title: "Operação em campo",
        lessons: ["Checklist antes da aplicação", "Parâmetros de trabalho", "Erros comuns"]
      },
      {
        title: "Validação teórica",
        lessons: ["Revisão final", "Prova de certificação"]
      }
    ]
  },
  {
    slug: "mecanica-preventiva",
    title: "Manutenção mecânica preventiva",
    organizationSlugs: ["zasso"],
    accessGroups: ["mecanicos", "treinadores"],
    vertical: "Mecânico",
    level: "Intermediário",
    language: "PT-BR",
    duration: "2h 45min",
    lessons: 14,
    progress: 0,
    certificate: "Certificado",
    status: "Disponível",
    accent: "cyan",
    summary:
      "Procedimentos de inspeção, conservação e troca de componentes para reduzir paradas e padronizar a manutenção.",
    audience: "Mecânicos, assistência técnica e prestadores de serviço autorizados.",
    instructor: "Engenharia de campo",
    modules: [
      {
        title: "Rotina preventiva",
        lessons: ["Inspeção visual", "Pontos de desgaste", "Lubrificação e limpeza"]
      },
      {
        title: "Diagnóstico",
        lessons: ["Sintomas frequentes", "Registro de ocorrências", "Plano de ação"]
      }
    ]
  },
  {
    slug: "alta-tensao-seguranca",
    title: "Segurança em alta tensão",
    organizationSlugs: ["zasso"],
    accessGroups: ["eletrico", "treinadores"],
    vertical: "Elétrico",
    level: "Avançado",
    language: "PT-BR",
    duration: "4h 10min",
    lessons: 22,
    progress: 0,
    certificate: "Obrigatório",
    status: "Disponível",
    accent: "violet",
    summary:
      "Curso crítico para técnicos elétricos que atuam com procedimentos de alta tensão, proteção individual e protocolos de isolamento.",
    audience: "Técnicos elétricos, equipe de alta tensão e treinadores certificados.",
    instructor: "Especialistas SACF",
    modules: [
      {
        title: "Base de segurança",
        lessons: ["Risco elétrico", "EPIs obrigatórios", "Zona controlada"]
      },
      {
        title: "Procedimentos",
        lessons: ["Bloqueio e etiquetagem", "Teste de ausência de tensão", "Plano de emergência"]
      }
    ]
  },
  {
    slug: "formacao-treinadores",
    title: "Formação de treinadores corporativos",
    organizationSlugs: ["zasso", "zasso-latam"],
    accessGroups: ["treinadores", "representantes"],
    vertical: "Treinador",
    level: "Avançado",
    language: "PT-BR",
    duration: "5h",
    lessons: 26,
    progress: 100,
    certificate: "Validade 24 meses",
    status: "Concluído",
    accent: "green",
    summary:
      "Padronização para multiplicadores internos: como ensinar, validar conhecimento e manter registros de certificação.",
    audience: "Treinadores, coordenadores de operação e representantes master.",
    instructor: "SACF University",
    modules: [
      {
        title: "Metodologia",
        lessons: ["Como conduzir treinamento", "Avaliação prática", "Gestão de dúvidas recorrentes"]
      },
      {
        title: "Certificação",
        lessons: ["Critérios de aprovação", "Registro de evidências", "Reciclagem"]
      }
    ]
  }
];

export const sessionUsers: SessionUser[] = [
  {
    id: "ana-admin",
    name: "Ana Ribeiro",
    email: "ana@zasso.com",
    organization: "Zasso",
    organizationSlug: "zasso",
    role: "org_admin",
    groups: ["administradores", "treinadores"]
  },
  {
    id: "carlos-operador",
    name: "Carlos Mendes",
    email: "carlos@zasso.com",
    organization: "Zasso",
    organizationSlug: "zasso",
    role: "student",
    groups: ["operadores"]
  },
  {
    id: "marina-eletrica",
    name: "Marina Costa",
    email: "marina@zasso.com",
    organization: "Zasso",
    organizationSlug: "zasso",
    role: "student",
    groups: ["eletrico"]
  },
  {
    id: "diego-parceiro",
    name: "Diego Silva",
    email: "diego@latam-partner.com",
    organization: "Representantes Zasso LATAM",
    organizationSlug: "zasso-latam",
    role: "external_partner",
    groups: ["representantes"]
  },
  {
    id: "sacf-admin",
    name: "Admin SACF",
    email: "admin@sacf.io",
    organization: "SACF",
    organizationSlug: "sacf",
    role: "sacf_admin",
    groups: ["sacf-admin"]
  }
];

export const organizations: Organization[] = [
  {
    name: "Zasso",
    slug: "zasso",
    status: "Piloto",
    users: 86,
    courses: 4,
    certificates: 31,
    expiring: 8,
    accent: "blue",
    brandLogo: "/brand/zasso-logo.png"
  },
  {
    name: "Representantes Zasso LATAM",
    slug: "zasso-latam",
    status: "Ativa",
    users: 24,
    courses: 2,
    certificates: 12,
    expiring: 3,
    accent: "cyan"
  },
  {
    name: "Cliente Industrial Sul",
    slug: "industrial-sul",
    status: "Pausada",
    users: 12,
    courses: 1,
    certificates: 4,
    expiring: 1,
    accent: "violet"
  }
];

export const adminUsers: AdminUser[] = [
  {
    name: "Ana Ribeiro",
    email: "ana@zasso.com",
    organization: "Zasso",
    role: "Admin da empresa",
    status: "Ativo",
    progress: 92
  },
  {
    name: "Carlos Mendes",
    email: "carlos@zasso.com",
    organization: "Zasso",
    role: "Operador",
    status: "Ativo",
    progress: 64
  },
  {
    name: "Marina Costa",
    email: "marina@zasso.com",
    organization: "Zasso",
    role: "Treinadora",
    status: "Pendente",
    progress: 18
  },
  {
    name: "Diego Silva",
    email: "diego@latam-partner.com",
    organization: "Representantes Zasso LATAM",
    role: "Parceiro externo",
    status: "Ativo",
    progress: 48
  }
];

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug) ?? null;
}

export function getOrganization(slug: string) {
  return organizations.find((organization) => organization.slug === slug) ?? null;
}

export function canAccessCourse(course: Course, user: SessionUser) {
  if (user.role === "sacf_admin") return true;

  const sameOrganization = course.organizationSlugs.includes(user.organizationSlug);
  if (!sameOrganization) return false;

  if (user.role === "org_admin" || user.role === "instructor" || user.role === "manager") {
    return true;
  }

  const directlyAssigned = course.assignedUserIds?.includes(user.id);
  const groupAllowed = course.accessGroups.some((group) => user.groups.includes(group));

  return Boolean(directlyAssigned || groupAllowed);
}

export function getSessionUser(userId: string | null) {
  return sessionUsers.find((user) => user.id === userId) ?? null;
}
