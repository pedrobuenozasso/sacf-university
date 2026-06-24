# SACF University

Plataforma SaaS da SACF para empresas criarem, gerenciarem e certificarem treinamentos profissionalizantes para seus funcionários, equipes, clientes e parceiros.

O primeiro cliente/plano piloto será a Zasso, usando a plataforma para organizar cursos internos, trilhas profissionais, avaliações, reciclagens e certificados.

## Objetivo

Criar uma plataforma B2B de educação corporativa com foco em:

- Cursos profissionalizantes por empresa.
- Trilhas de formação por cargo, área ou unidade.
- Certificação de funcionários.
- Controle de progresso.
- Avaliações e provas.
- Painel administrativo para empresas.
- Relatórios de conclusão e desempenho.
- Base escalável para múltiplos clientes.
- Catálogo de cursos no estilo Udemy, mas privado por empresa.
- Controle de vencimento e reciclagem.
- Suporte multilíngue.

## Produto

Nome inicial: **SACF University**

Proposta:

> Uma plataforma para empresas treinarem, certificarem e acompanharem equipes em cursos profissionalizantes próprios, com experiência moderna, controle corporativo e emissão de certificados.

Experiência desejada:

- Estilo **Udemy corporativo**.
- Catálogo visual de cursos.
- Cards com capa, duração, nível, idioma, vertical, progresso e certificado.
- Página de curso com descrição, módulos, aulas, instrutor, requisitos e conteúdo programático.
- Player de aula com vídeo/conteúdo, navegação lateral, progresso e próxima aula.
- Área "Meus cursos" para o aluno.
- Painel administrativo para empresa criar, publicar e acompanhar cursos.

## Documentação

- [Funcionalidades — Estado Atual](docs/funcionalidades.md)
- [Product Spec](docs/product-spec.md)
- [Stack e Arquitetura](docs/stack-architecture.md)
- [Banco de Dados](docs/database-schema.md)
- [Páginas e Fluxos](docs/pages-flows.md)
- [Roadmap MVP](docs/roadmap.md)
- [Brief para Apresentação](docs/presentation-brief.md)

## Repositório

Repositório dedicado:

- `https://github.com/pedrobuenozasso/sacf-university.git`

Recomendação: manter a SACF University em um GitHub separado do Tender e do Patent.

Motivos:

- O produto terá deploy, banco, autenticação, admin e roadmap próprios.
- Evita quebrar o SACF Tender ou o SACF Patent com mudanças de outro produto.
- Facilita previews na Vercel por pull request.
- Mantém o histórico limpo para apresentar o projeto para Zasso/CEO.
- Permite evoluir a University como SaaS independente dentro do ecossistema SACF.

Quando o SACF Hub estiver pronto, a integração deve acontecer por login central e permissões compartilhadas, não por misturar os códigos no mesmo repositório.

## Stack escolhida

Base recomendada para o MVP:

- Next.js + TypeScript.
- PostgreSQL, preferencialmente Google Cloud SQL.
- Autenticação futura pelo SACF Hub.
- Storage externo para vídeos, anexos e certificados.
- Resend para emails transacionais.
- Vercel para previews e deploy do app.

Next.js faz sentido aqui porque permite criar telas, APIs internas, dashboards, catálogo e player no mesmo produto sem montar uma arquitetura grande cedo demais.

Segurança e escalabilidade dependem principalmente de:

- JWT assinado pelo Hub SACF.
- RBAC por papel.
- `organization_id` validado em todas as queries.
- Logs de auditoria.
- URLs assinadas para vídeos e anexos privados.
- Banco separado por ambiente.
- Storage externo, nunca vídeos dentro do banco.

## Princípios

- Multiempresa desde o início.
- A Zasso é o primeiro cliente/tenant, não o produto inteiro.
- Login centralizado no futuro Hub SACF.
- Certificados verificáveis.
- Cursos simples de criar e consumir.
- Experiência limpa, profissional e mobile-first.
- Permissões claras: SACF admin, empresa admin, instrutor, aluno.
- Sem complexidade de marketplace no MVP.

## Cliente piloto: Zasso

Verticais iniciais:

- Operador.
- Mecânico.
- Elétrico / alta tensão.
- Treinador.

O conteúdo inicial deve focar nas dúvidas mais recorrentes de campo, operação, manutenção, segurança, alta tensão e treinamento de representantes/prestadores.
