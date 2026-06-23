# Roadmap MVP

## Fase 0: Fundação

Objetivo: definir produto e estrutura.

- Documentação inicial.
- Stack final.
- Schema inicial.
- Decisão de banco.
- Decisão de autenticação.
- Identidade visual alinhada SACF.
- Criar repositório GitHub próprio: `https://github.com/pedrobuenozasso/sacf-university.git`.
- Criar projeto Vercel próprio.
- Definir ambientes: local, preview e produção.

## Fase 1: Protótipo visual

Objetivo: mostrar para Zasso/CEO.

- Dashboard inicial.
- Catálogo de cursos estilo Udemy.
- Cards de curso com capa, vertical, duração, idioma, progresso e certificado.
- Página de apresentação do curso.
- Player de curso mockado com sidebar de módulos/aulas.
- Página "Meus cursos".
- Página de certificados mockada.
- Página de reciclagens/vencimentos mockada.
- Página de usuários mockada.
- Página de ajuda.
- Base de idiomas documentada: pt-BR, pt-PT, en, es, de e fr.

Sem banco real obrigatório.

## Fase 2: Banco e CRUD

Objetivo: transformar em produto funcional.

- Conectar PostgreSQL/Cloud SQL.
- Criar migrations.
- CRUD de organizações.
- CRUD de usuários/membros.
- CRUD de cursos.
- CRUD de módulos e aulas.

## Fase 3: Área do aluno

Objetivo: permitir treinamento real.

- Matrícula de aluno.
- Página `/catalogo`.
- Página `/catalogo/[slug]`.
- Página `/meus-cursos`.
- Player de aula.
- Marcar aula como concluída.
- Progresso por curso.
- Retomar de onde parou.

## Fase 4: Avaliação

Objetivo: medir aprendizado.

- Criar quiz.
- Responder quiz.
- Calcular nota.
- Definir aprovação/reprovação.

## Fase 5: Certificados

Objetivo: entregar valor principal.

- Emitir certificado.
- Código único.
- Tela de certificado.
- Data de emissão.
- Data de vencimento quando aplicável.
- Status: válido, vencendo, vencido, revogado.
- Export/print.
- PDF futuro.

## Fase 6: Reciclagem

Objetivo: garantir que certificações não vençam sem controle.

- Configurar validade por curso/função.
- Listar certificados vencendo.
- Listar certificados vencidos.
- Alertar admin e aluno.
- Rematricular automaticamente em curso de reciclagem.

## Fase 7: Relatórios

Objetivo: valor para empresa/admin.

- Progresso por aluno.
- Conclusão por curso.
- Certificados emitidos.
- Certificados vencidos.
- Certificados vencendo.
- Alunos atrasados.
- Export CSV.

## Fase 8: Produção

Objetivo: piloto Zasso.

- Deploy Vercel.
- Banco Cloud SQL.
- Storage configurado.
- Emails Resend.
- Teste mobile.
- Segurança e permissões.
- Dados reais do primeiro cliente.

## Fase 9: Evolução

Objetivo: aproximar do padrão de produto SaaS completo.

- Trilhas de aprendizado por cargo.
- Avaliações de curso.
- Multi-idioma completo.
- Interface traduzida para inglês, português Brasil, português Portugal, espanhol, alemão e francês.
- Legendas/transcrições.
- PDF de certificado com QR Code.
- Página pública de validação de certificado.
- Upload de vídeos com processamento próprio.
- Integração com SACF Hub, login central e billing.

## Fase 10: Marketplace SACF University

Objetivo: permitir que a plataforma deixe de ser apenas corporativa privada e vire também um ecossistema de cursos profissionais.

- Catálogo público de cursos.
- Cursos privados e cursos públicos convivendo na mesma base.
- Instrutores/profissionais publicando cursos mediante aprovação SACF.
- Empresas comprando cursos públicos para grupos internos.
- Usuários corporativos acessando cursos da empresa e cursos públicos adquiridos.
- Checkout e billing.
- Comissão SACF por venda.
- Painel de instrutor.
- Relatórios de venda.
- Curadoria e aprovação de conteúdo.

## Prioridade recomendada agora

1. Criar protótipo visual Next.js.
2. Validar com CEO/Zasso.
3. Definir Cloud SQL e autenticação.
4. Implementar CRUD real.
5. Implementar catálogo, player, progresso e certificado.
6. Implementar reciclagem/vencimentos.
