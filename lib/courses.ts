export type Course = {
  slug: string;
  title: string;
  vertical: string;
  level: string;
  language: string;
  duration: string;
  lessons: number;
  progress: number;
  certificate: string;
  status: "Em andamento" | "Disponivel" | "Concluido";
  accent: string;
  summary: string;
  audience: string;
  instructor: string;
  modules: {
    title: string;
    lessons: string[];
  }[];
};

export type Organization = {
  name: string;
  slug: string;
  status: "Ativa" | "Piloto" | "Pausada";
  users: number;
  courses: number;
  certificates: number;
  expiring: number;
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
    title: "Operacao segura do sistema Eletroherb",
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
      "Treinamento base para operar o equipamento com seguranca, rotina correta e leitura dos principais indicadores de campo.",
    audience: "Operadores, lideres de campo e novos representantes tecnicos.",
    instructor: "Equipe tecnica Zasso",
    modules: [
      {
        title: "Fundamentos do equipamento",
        lessons: ["Visao geral do sistema", "Componentes principais", "Riscos operacionais"]
      },
      {
        title: "Operacao em campo",
        lessons: ["Checklist antes da aplicacao", "Parametros de trabalho", "Erros comuns"]
      },
      {
        title: "Validacao teorica",
        lessons: ["Revisao final", "Prova de certificacao"]
      }
    ]
  },
  {
    slug: "mecanica-preventiva",
    title: "Manutencao mecanica preventiva",
    vertical: "Mecanico",
    level: "Intermediario",
    language: "PT-BR",
    duration: "2h 45min",
    lessons: 14,
    progress: 0,
    certificate: "Certificado",
    status: "Disponivel",
    accent: "cyan",
    summary:
      "Procedimentos de inspecao, conservacao e troca de componentes para reduzir paradas e padronizar a manutencao.",
    audience: "Mecanicos, assistencia tecnica e prestadores de servico autorizados.",
    instructor: "Engenharia de campo",
    modules: [
      {
        title: "Rotina preventiva",
        lessons: ["Inspecao visual", "Pontos de desgaste", "Lubrificacao e limpeza"]
      },
      {
        title: "Diagnostico",
        lessons: ["Sintomas frequentes", "Registro de ocorrencias", "Plano de acao"]
      }
    ]
  },
  {
    slug: "alta-tensao-seguranca",
    title: "Seguranca em alta tensao",
    vertical: "Eletrico",
    level: "Avancado",
    language: "PT-BR",
    duration: "4h 10min",
    lessons: 22,
    progress: 0,
    certificate: "Obrigatorio",
    status: "Disponivel",
    accent: "violet",
    summary:
      "Curso critico para tecnicos eletricos que atuam com procedimentos de alta tensao, protecao individual e protocolos de isolamento.",
    audience: "Tecnicos eletricos, equipe de alta tensao e treinadores certificados.",
    instructor: "Especialistas de seguranca Zasso",
    modules: [
      {
        title: "Base de seguranca",
        lessons: ["Risco eletrico", "EPIs obrigatorios", "Zona controlada"]
      },
      {
        title: "Procedimentos",
        lessons: ["Bloqueio e etiquetagem", "Teste de ausencia de tensao", "Plano de emergencia"]
      }
    ]
  },
  {
    slug: "formacao-treinadores",
    title: "Formacao de treinadores Zasso",
    vertical: "Treinador",
    level: "Avancado",
    language: "PT-BR",
    duration: "5h",
    lessons: 26,
    progress: 100,
    certificate: "Validade 24 meses",
    status: "Concluido",
    accent: "green",
    summary:
      "Padronizacao para multiplicadores internos: como ensinar, validar conhecimento e manter registros de certificacao.",
    audience: "Treinadores, coordenadores de operacao e representantes master.",
    instructor: "Academia Zasso",
    modules: [
      {
        title: "Metodologia",
        lessons: ["Como conduzir treinamento", "Avaliacao pratica", "Gestao de duvidas recorrentes"]
      },
      {
        title: "Certificacao",
        lessons: ["Criterios de aprovacao", "Registro de evidencias", "Reciclagem"]
      }
    ]
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
    expiring: 8
  },
  {
    name: "Representantes Zasso LATAM",
    slug: "zasso-latam",
    status: "Ativa",
    users: 24,
    courses: 2,
    certificates: 12,
    expiring: 3
  },
  {
    name: "Cliente demonstracao",
    slug: "demo",
    status: "Pausada",
    users: 12,
    courses: 1,
    certificates: 4,
    expiring: 1
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
  return courses.find((course) => course.slug === slug) ?? courses[0];
}
