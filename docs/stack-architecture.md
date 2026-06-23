# Stack e Arquitetura

## Stack recomendada

Recomendação atual: manter Next.js como base do produto.

Motivo:

- O MVP precisa evoluir rápido com telas, APIs internas e deploys frequentes.
- Next.js permite montar catálogo, player, admin e APIs internas sem separar frontend e backend cedo demais.
- Para o SACF Hub, a integração futura pode ser feita por JWT assinado e permissões por organização.
- A escalabilidade inicial vem de banco bem modelado, storage externo, cache e separação correta de responsabilidades.

### Frontend

- Next.js
- TypeScript
- CSS/Tailwind ou CSS Modules, seguindo o padrão visual SACF
- Componentes próprios SACF
- Experiência de catálogo/player inspirada em Udemy, mas privada por organização

### Backend

- Next.js Route Handlers para MVP
- Futuro: API separada se a plataforma crescer

### Banco

- PostgreSQL
- Preferência estratégica: Google Cloud SQL, alinhado com a plataforma SACF
- ORM recomendado: Prisma ou Drizzle

### Autenticação

MVP:

- Login próprio simples ou integração com Hub SACF se já estiver pronto.

Arquitetura final:

- Login central no SACF Hub.
- Produtos consomem usuário/organização via JWT assinado.

### Storage

Para vídeos e arquivos:

- Google Cloud Storage, Cloudflare R2 ou Supabase Storage

Recomendação:

- Começar com Cloudflare R2 ou Google Cloud Storage.
- Não armazenar vídeos diretamente no banco.

### Vídeos

Opções:

- Upload de vídeo próprio para storage.
- Link externo privado.
- Vimeo/YouTube não listado para MVP simples.
- Plataforma dedicada como Mux, Vimeo OTT ou Cloudflare Stream no futuro.

Recomendação MVP:

- Suportar link de vídeo primeiro.
- Depois adicionar upload.
- Registrar progresso por aula no backend.
- Não depender só do player para dizer que o usuário assistiu.

Recomendação produção:

- Preferir provedor com controle de acesso, analytics e URLs assinadas.
- Evitar deixar conteúdo sensível em links públicos quando o curso for obrigatório/certificador.
- Separar vídeo, anexos e certificados por organização.

### Emails

- Resend

Uso:

- Convite de usuário.
- Aviso de curso atribuído.
- Certificado emitido.
- Certificado vencendo.
- Certificado vencido.
- Lembrete de reciclagem.
- Recuperação de acesso, se login próprio existir.

### PDF/Certificado

MVP:

- Certificado HTML com código.

Depois:

- Gerar PDF com `@react-pdf/renderer`, Playwright PDF ou serviço dedicado.

### Deploy

- Vercel para frontend/app.
- Cloud SQL para banco.
- Storage externo para arquivos.

## Repositório e deploy

Repositório dedicado:

- `https://github.com/pedrobuenozasso/sacf-university.git`

Recomendação:

- Criar um projeto Vercel próprio para `sacf-university`.
- Usar previews por pull request.
- Separar ambientes local, preview/staging e produção.
- Manter variáveis de ambiente no Vercel, não no GitHub.

Não recomendado:

- Misturar University no repositório do Tender.
- Deployar University pelo pipeline da Hostinger do Tender.
- Reaproveitar banco de outro produto sem fronteira clara de tabelas, usuários e permissões.

## Arquitetura lógica

```text
SACF Hub / Login
        |
        v
SACF University App
        |
        +-- Organizations
        +-- Users/Roles
        +-- Catalog
        +-- Courses
        +-- Modules/Lessons
        +-- Enrollments
        +-- Progress
        +-- Assessments
        +-- Certificates
        +-- Recertifications
        +-- Reports
        |
        v
PostgreSQL / Cloud SQL
        |
        v
Storage externo para arquivos e vídeos
```

## Modelo multiempresa

Quase todas as tabelas principais devem ter `organization_id`.

Isso permite:

- Separação de dados.
- Várias empresas na mesma plataforma.
- Relatórios por cliente.
- Futuro billing por organização.
- Catálogo diferente por cliente.
- Certificações e prazos diferentes por função/empresa.

Regra importante:

- Usuário só pode ver cursos da organização em que é membro.
- Admin de uma organização nunca pode consultar usuários, certificados ou cursos de outra.
- SACF admin deve acessar tudo, mas com auditoria.

## Papéis

### sacf_admin

- Acessa todas as organizações.
- Cria clientes.
- Gerencia planos.
- Vê suporte e logs.

### org_admin

- Gerencia usuários da própria organização.
- Cria cursos.
- Matricula alunos.
- Vê relatórios.

### instructor

- Cria/edita conteúdo se permitido.
- Corrige avaliações futuras.

### student

- Assiste aulas.
- Faz avaliações.
- Recebe certificados.

### external_partner

- Acesso limitado para representantes e prestadores de serviço.
- Pode fazer cursos e receber certificados.
- Não acessa relatórios internos da empresa.

## Segurança

- Nunca confiar apenas em headers públicos sem assinatura.
- Usar JWT assinado pelo Hub no futuro.
- Validar `organization_id` em todas as queries.
- Rate limit em endpoints sensíveis.
- Não expor URLs privadas de arquivos sem autorização.
- Logs para ações administrativas.
- URLs de vídeo/anexos devem ser assinadas quando possível.
- Certificados devem ter código único e validação contra banco.
- Progresso e conclusão devem ser gravados no servidor.
- Eventos críticos devem entrar em auditoria: matrícula, conclusão, emissão, revogação e vencimento de certificado.

## Ambientes

### Local

- PostgreSQL local ou Cloud SQL proxy.
- `.env.local`

### Preview

- Vercel preview.
- Banco/staging separado.

### Produção

- Vercel production.
- Cloud SQL production.
- Storage production.
- Domínio final SACF.
