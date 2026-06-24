# Funcionalidades da Plataforma — Estado Atual

> Atualizado em 2026-06-24. Fase atual: **protótipo visual interativo (Fase 1 do roadmap)**.
> Stack: Next.js 16 (App Router) + React 19 + TypeScript. Sem backend, sem banco, sem autenticação real.
> Todos os dados vivem em `lib/courses.ts`. A sessão é simulada no navegador (localStorage).

Este documento descreve **o que a plataforma realmente faz hoje**, separando o que é funcional do que ainda é apenas visual.

## Legenda

- ✅ **Funcional** — funciona de verdade (no cliente, com dados mock).
- 🟡 **Parcial** — a lógica existe, mas limitada ou só ilustrativa.
- ⬜ **Visual/mock** — a tela existe, mas o botão/ação ainda não faz nada.

---

## Mapa de rotas

| Rota | Página | Acesso | Status |
|------|--------|--------|--------|
| `/` | Landing / apresentação do produto | Pública | ✅ |
| `/login` | Login simulado (perfis de teste) | Pública | ✅ |
| `/home` | Dashboard do aluno | Logado | ✅ |
| `/catalogo` | Catálogo privado de cursos | Logado | ✅ |
| `/catalogo/[slug]` | Página de detalhe do curso | Pública* | 🟡 |
| `/aprender/[courseId]` | Player de aula | Pública* | ⬜ |
| `/meus-cursos` | Cursos liberados para o usuário | Logado | ✅ |
| `/certificados` | Certificados e validade | Logado | 🟡 |
| `/ajuda` | Central de ajuda / FAQ | Pública | 🟡 |
| `/admin` | Painel administrativo (visão geral) | Admin | 🟡 |
| `/admin/empresas` | Gestão de empresas | Admin | ⬜ |
| `/admin/cursos` | Gestão de cursos | Admin | ⬜ |
| `/admin/usuarios` | Gestão de usuários | Admin | ⬜ |
| `/admin/certificacoes` | Regras de certificação | Admin | 🟡 |
| `/admin/relatorios` | Relatórios e exportações | Admin | ⬜ |

\* Hoje acessíveis sem login (são server components). No produto real entram atrás do gate de acesso.

---

## 1. Acesso e autenticação ✅ (simulado)

- **Login por perfil de teste**: a tela `/login` lista usuários mock; clicar entra como aquele perfil e redireciona para `/home`.
- **Sessão persistente**: o usuário escolhido é guardado em `localStorage` (`sacf_university_user_id`).
  - Sincroniza entre abas (evento `storage`) e dentro da mesma aba (evento `sacf-user-change`), via `useSyncExternalStore`.
  - Sobrevive a reload. "Sair" limpa a sessão.
- **Identidade real**: ⬜ ainda não existe — sem senha, sem provedor. Previsto para o SACF Hub.

Perfis de teste disponíveis: Ana (admin da empresa), Carlos (operador/aluno), Marina (elétrica/aluna), Diego (parceiro externo LATAM), Admin SACF.

## 2. Multiempresa e permissões ✅

O coração do produto já está modelado e **funciona de verdade** no cliente.

- **Papéis**: `sacf_admin`, `org_admin`, `instructor`, `manager`, `student`, `external_partner`.
- **Regra de acesso a curso** (`canAccessCourse`): combina
  1. SACF admin vê tudo;
  2. mesma organização (`organizationSlug`);
  3. admins/instrutores/gestores da empresa veem todos os cursos da empresa;
  4. alunos veem cursos liberados por **grupo** ou por **matrícula direta**.
- **Efeito real**: catálogo, home, "meus cursos" e certificados mostram **conjuntos diferentes** conforme o perfil logado.
- **Branding por empresa**: cada curso exibe a marca da organização dona (logo da Zasso, ou monograma de fallback).
- ⚠️ **Importante**: essa checagem roda **só no cliente**. É correto para protótipo, mas no produto real precisa ser reforçada no servidor (isolamento por `organization_id`).

## 3. Catálogo ✅

- Lista os cursos **filtrados pelo acesso** do usuário logado.
- **Filtros funcionais** por vertical (Operador, Mecânico, Elétrico, Treinador), gerados a partir dos cursos visíveis, com estado ativo e estado vazio ("nenhum curso em X").
- Sem login, mostra um painel explicando que o catálogo é privado.
- Cards de curso com capa por vertical, nível, duração, idioma, progresso (quando houver), selo de certificado e status.

## 4. Curso e player

- **Detalhe do curso** (`/catalogo/[slug]`) 🟡 — mostra resumo, metadados, conteúdo programático (módulos e aulas), público-alvo e responsável. Slug inválido retorna 404 de verdade.
- **Player** (`/aprender/[courseId]`) ⬜ — layout com sidebar de módulos/aulas e área de conteúdo, mas:
  - sem vídeo real;
  - aulas não são clicáveis/navegáveis;
  - "Marcar como concluída" apenas leva para `/certificados` (não registra conclusão).

## 5. Meus cursos e progresso 🟡

- `/meus-cursos` ✅ lista os cursos liberados para o usuário.
- **Progresso** ⬜ é um valor estático do mock (ex.: 64%), **não é rastreado** — assistir/concluir não altera nada.

## 6. Certificados 🟡

- `/certificados` lista certificados derivados dos cursos do usuário, com status ilustrativo (Emitido / Em andamento / Pendente).
- ⬜ Não há emissão real, código único, validação, vencimento dinâmico nem PDF — tudo isso é o diferencial previsto, ainda não construído.

## 7. Painel administrativo

- **Guard de acesso** ✅ — `/admin/*` só abre para `sacf_admin`, `org_admin` ou `instructor`; outros perfis veem aviso de permissão.
- **Visão geral** 🟡 — métricas e filas agregadas (somatórios reais do mock + itens ilustrativos).
- **Tabelas** 🟡 — empresas, usuários, cursos e certificações listam os dados mock corretamente.
- **Ações** ⬜ — todos os formulários (criar curso, convidar usuário, adicionar empresa, publicar, apagar) e os botões de exportar CSV **são botões mortos**: não persistem nada nem dão feedback.

## 8. Ajuda 🟡

- FAQ estático ✅. Formulário de mensagem ⬜ (não envia).

## 9. Internacionalização 🟡

- Lista de idiomas previstos definida (`lib/i18n.ts`): pt-BR, pt-PT, en, es, de, fr.
- ⬜ Não há troca de idioma nem textos traduzidos — a UI é toda em pt-BR.

## 10. Design system ✅

- Tema escuro consistente com tokens (`--radius`, `--shadow-*`, `--ring`, `--ease`).
- Logo oficial SACF no header; hero "showcase" estilo Udemy na home.
- Capas de curso geradas por vertical (ícone + arte), cards alinhados, hovers e foco-visível.
- Responsivo (desktop / tablet / mobile).

---

## Resumo: o que é real vs. o que é casca

**Já funciona (no cliente, com mock):**

- Sessão simulada persistente + troca de perfil.
- Permissões multiempresa/RBAC filtrando o que cada usuário vê.
- Catálogo com filtros funcionais.
- Branding por empresa e navegação que se adapta ao papel.
- 404 real, guard de admin, design system completo.

**Ainda é casca (visual, sem ação):**

- Todos os formulários do admin (CRUD).
- Player, progresso e conclusão de aula.
- Emissão e validação de certificados.
- Relatórios / exportações.
- Troca de idioma.
- Autenticação real e isolamento no servidor.

---

## Stack e infraestrutura (atual)

- **Frontend/app**: Next.js 16 + React 19 + TypeScript (App Router).
- **Dados**: hardcoded em `lib/courses.ts` (cursos, usuários, organizações, admin).
- **Sessão**: `localStorage` + `useSyncExternalStore` (`components/use-mock-user.ts`).
- **Backend / banco / storage / e-mail**: ⬜ inexistentes.
- **Qualidade**: build de produção e lint passam limpos.

## Próximo passo planejado

Tornar o protótipo **funcional de ponta a ponta sem banco**, atrás de uma camada de dados limpa (matrícula → assistir → concluir → certificado emitido + feedback nos formulários do admin), de forma que a futura migração para **PostgreSQL no Google Cloud SQL** seja apenas a troca da implementação por trás dessa camada — sem reescrever telas. Schema de referência já documentado em [database-schema.md](database-schema.md).
