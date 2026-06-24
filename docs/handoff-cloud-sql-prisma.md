# Handoff: Cloud SQL + Prisma

Este documento registra o estado atual da integracao do SACF University com Google Cloud SQL PostgreSQL e Prisma.

## Projeto

Workspace local:

```txt
/Users/pedrobueno/Zasso/sacf-university
```

Produto:

```txt
SACF University
```

Stack atual:

- Next.js 16.2.6
- React 19.2.4
- TypeScript
- Prisma 7.8.0
- Google Cloud SQL PostgreSQL

## Banco Google Cloud SQL

Instancia Cloud SQL:

```txt
cedar-context-456512-b9:us-central1:sacf-db
```

Detalhes confirmados:

- Project: `cedar-context-456512-b9`
- Region: `us-central1`
- Instance: `sacf-db`
- PostgreSQL: `POSTGRES_18`

Banco do SACF University:

```txt
sacf_university
```

Usuario do banco:

```txt
sacf_university_app
```

Importante:

A instancia tem outros bancos/produtos SACF. Qualquer comando deve apontar explicitamente para o banco `sacf_university`.

Antes de qualquer migration ou comando que escreva no banco, validar:

```sql
select current_database(), current_user;
```

Resultado esperado:

```txt
sacf_university|sacf_university_app
```

Essa checagem ja foi feita uma vez com sucesso via Cloud SQL Auth Proxy.

## Ferramentas locais instaladas

Instalado via Homebrew:

- `gcloud`
- `cloud-sql-proxy`
- `libpq`

Caminho do `psql`:

```bash
/usr/local/opt/libpq/bin/psql
```

Autenticacao Google Cloud ja feita:

```txt
pedrobueno.zasso@gmail.com
```

Projeto configurado:

```bash
gcloud config set project cedar-context-456512-b9
gcloud auth application-default set-quota-project cedar-context-456512-b9
```

## Cloud SQL Auth Proxy

Para ligar o proxy local:

```bash
cloud-sql-proxy cedar-context-456512-b9:us-central1:sacf-db --port 5432
```

Isso expõe o Cloud SQL localmente em:

```txt
127.0.0.1:5432
```

Para verificar se o proxy esta rodando:

```bash
pgrep -fl cloud-sql-proxy
```

## Variaveis de ambiente

Arquivo criado:

```txt
.env.local
```

Formato:

```env
DATABASE_URL="postgresql://sacf_university_app:SENHA@127.0.0.1:5432/sacf_university?schema=public"
```

O usuario colocou a senha localmente. Nao imprimir nem expor esse valor.

Tambem existe:

```txt
.env.example
```

Com placeholder seguro:

```env
DATABASE_URL="postgresql://sacf_university_app:YOUR_PASSWORD@127.0.0.1:5432/sacf_university?schema=public"
```

`.env.local` esta no `.gitignore`.

## Prisma

Dependencias instaladas:

```json
"@prisma/client": "^7.8.0",
"prisma": "^7.8.0"
```

Scripts adicionados em `package.json`:

```json
"db:generate": "prisma generate",
"db:validate": "prisma validate",
"db:migrate": "prisma migrate deploy",
"db:migrate:dev": "prisma migrate dev"
```

Schema criado:

```txt
prisma/schema.prisma
```

Validacoes ja feitas:

```bash
npm run db:validate
npm run db:generate
npm run lint
npm run build
```

Todas passaram.

## Modelos no schema Prisma

O schema inicial cobre:

- `organizations`
- `users`
- `organization_members`
- `groups`
- `group_members`
- `courses`
- `course_translations`
- `course_visibility_rules`
- `course_modules`
- `lessons`
- `lesson_translations`
- `quiz_questions`
- `quiz_options`
- `enrollments`
- `lesson_progress`
- `quiz_attempts`
- `certificates`
- `certification_requirements`
- `support_messages`

Enums:

- `OrganizationStatus`
- `MemberRole`
- `MemberStatus`
- `CourseStatus`
- `CourseVisibilityScope`
- `VisibilityRuleType`
- `LessonType`
- `VideoProvider`
- `EnrollmentStatus`
- `LessonProgressStatus`
- `SupportMessageStatus`

Todas as tabelas usam `@@map("nome_da_tabela")`.
Muitas tabelas possuem `organization_id` para isolamento multiempresa.

## Ponto onde paramos

Paramos antes de aplicar migration no Cloud SQL.

Nada foi criado no banco ainda por Prisma.

Foi criada uma pasta de migration vazia durante tentativa de gerar SQL:

```txt
prisma/migrations/20260624142500_init/migration.sql
```

Esse arquivo ficou vazio porque o comando falhou.

Comando que falhou:

```bash
npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script -o prisma/migrations/20260624142500_init/migration.sql
```

Erro:

```txt
Error: Error in Schema engine:
```

Provavel causa:

Prisma 7 mudou parte da configuracao de datasource/migrations. O schema atual valida e gera client, mas o fluxo de `migrate diff` precisa ser ajustado, possivelmente criando `prisma.config.ts` com datasource/url conforme a documentacao da versao 7.

## Proximo passo recomendado

1. Resolver configuracao de migrations do Prisma 7.
2. Gerar migration SQL localmente.
3. Revisar o SQL antes de aplicar.
4. Confirmar novamente:

```txt
sacf_university|sacf_university_app
```

5. Aplicar migration somente no banco `sacf_university`.
6. Criar seed inicial com:
   - organizacao SACF/admin plataforma;
   - organizacao Zasso;
   - grupos operadores/mecanicos/eletrico/treinadores/representantes;
   - usuarios atuais;
   - cursos atuais;
   - modulos/aulas;
   - regras de visibilidade.
7. Depois trocar telas para ler do banco.

## Regras de seguranca

Nao fazer:

- Nao rodar `prisma migrate reset`.
- Nao rodar comandos no banco `postgres`.
- Nao rodar SQL sem `-d sacf_university`.
- Nao alterar outros bancos da instancia.
- Nao imprimir senha.
- Nao rodar `npm audit fix --force`.
- Nao usar `git reset`, `git checkout --` ou limpar worktree sem autorizacao.

## Comando de checagem segura

Com proxy ligado, rodar:

```bash
node -e "const fs=require('fs'); const {spawnSync}=require('child_process'); const match=fs.readFileSync('.env.local','utf8').match(/^DATABASE_URL=\"?(.+?)\"?$/m); if(!match){console.error('DATABASE_URL not found'); process.exit(1)} const url=new URL(match[1]); const args=['-h',url.hostname,'-p',url.port||'5432','-U',decodeURIComponent(url.username),'-d',url.pathname.slice(1),'-tAc','select current_database(), current_user;']; const result=spawnSync('/usr/local/opt/libpq/bin/psql', args, {env:{...process.env, PGPASSWORD: decodeURIComponent(url.password)}, encoding:'utf8'}); process.stdout.write(result.stdout); process.stderr.write(result.stderr); process.exit(result.status ?? 0);"
```

Esperado:

```txt
sacf_university|sacf_university_app
```

## Deploy visual atual

Aplicacao publicada:

```txt
https://sacf-university.vercel.app
```

Observacao:

O deploy atual ainda usa dados mockados em `lib/courses.ts`. Prisma esta preparado localmente, mas ainda nao integrado nas telas.
