# Banco de Dados

Banco recomendado: PostgreSQL.

O schema abaixo é uma primeira versão para MVP SaaS multiempresa.

## Tabelas principais

### organizations

Empresas/clientes dentro da SACF University.

Campos:

- id
- name
- slug
- logo_url
- primary_color
- secondary_color
- default_locale
- allowed_locales_json
- status
- created_at
- updated_at

Status:

- active
- paused
- archived

### users

Usuários globais da plataforma.

Campos:

- id
- email
- name
- avatar_url
- preferred_locale
- hub_user_id
- created_at
- updated_at

Observação:

Se o Hub SACF virar a fonte oficial de identidade, `hub_user_id` será o vínculo principal.

### organization_members

Relaciona usuários a organizações e papéis.

Campos:

- id
- organization_id
- user_id
- role
- department
- job_title
- preferred_language
- status
- invited_at
- joined_at
- created_at

Roles:

- sacf_admin
- org_admin
- instructor
- student
- external_partner

### groups

Grupos internos de uma organização.

Campos:

- id
- organization_id
- name
- slug
- description
- created_at
- updated_at

Exemplos:

- operadores
- mecanicos
- eletrico
- treinadores
- representantes
- prestadores

### group_members

Relaciona usuários aos grupos de uma empresa.

Campos:

- id
- organization_id
- group_id
- user_id
- created_at

### courses

Cursos criados por uma organização.

Campos:

- id
- organization_id
- title
- slug
- description
- short_description
- cover_url
- category
- vertical
- level
- language
- instructor_name
- target_audience
- learning_goals_json
- requirements_json
- workload_minutes
- status
- passing_score
- certificate_enabled
- certificate_validity_days
- mandatory
- visibility_scope
- marketplace_enabled
- price_cents
- currency
- revenue_share_percent
- created_by
- published_at
- created_at
- updated_at

Status:

- draft
- published
- archived

Escopos de visibilidade:

- private_org: curso privado de uma empresa.
- group: curso liberado para grupos específicos.
- assigned: curso por matrícula direta.
- public_marketplace: curso público do marketplace SACF.
- sacf_template: curso modelo criado pela SACF para ser copiado/usado por empresas.

Verticais iniciais para Zasso:

- operator
- mechanic
- electrical_high_voltage
- trainer
- representative
- service_provider

Idiomas iniciais:

- pt-BR
- pt-PT
- en
- es
- de
- fr

### course_translations

Traduções de cursos.

Campos:

- id
- course_id
- locale
- title
- description
- short_description
- target_audience
- learning_goals_json
- requirements_json
- created_at
- updated_at

### lesson_translations

Traduções de aulas.

Campos:

- id
- lesson_id
- locale
- title
- description
- content
- attachment_url
- captions_url
- created_at
- updated_at

### course_visibility_rules

Regras que definem quem pode ver ou acessar cada curso.

Campos:

- id
- course_id
- organization_id
- group_id
- user_id
- rule_type
- created_at

Tipos:

- organization
- group
- user
- public_marketplace

Uso:

- Curso liberado para toda empresa.
- Curso liberado só para um grupo.
- Curso liberado só para usuários específicos.
- Curso público visível no marketplace futuro.

### course_modules

Módulos dentro de um curso.

Campos:

- id
- course_id
- title
- description
- position
- created_at
- updated_at

### lessons

Aulas dentro dos módulos.

Campos:

- id
- module_id
- course_id
- title
- description
- lesson_type
- video_provider
- video_url
- content
- attachment_url
- language
- duration_minutes
- preview_enabled
- position
- required
- created_at
- updated_at

Tipos:

- video
- text
- file
- quiz

Provedores de vídeo:

- unlisted_youtube
- vimeo
- mux
- cloud_storage
- external_url

### quiz_questions

Perguntas de quiz.

Campos:

- id
- lesson_id
- question
- position
- created_at

### quiz_options

Alternativas de perguntas.

Campos:

- id
- question_id
- option_text
- is_correct
- position

### enrollments

Matrículas dos alunos.

Campos:

- id
- organization_id
- course_id
- user_id
- status
- assigned_by
- assigned_at
- started_at
- completed_at
- due_date
- final_score
- certificate_expires_at
- recertification_required
- recertification_of_enrollment_id
- created_at
- updated_at

Status:

- not_started
- in_progress
- completed
- failed
- cancelled
- expired

### lesson_progress

Progresso por aula.

Campos:

- id
- enrollment_id
- lesson_id
- status
- progress_percent
- completed_at
- last_seen_at
- created_at
- updated_at

### quiz_attempts

Tentativas de quiz/avaliação.

Campos:

- id
- enrollment_id
- lesson_id
- user_id
- score
- passed
- answers_json
- started_at
- submitted_at

### certificates

Certificados emitidos.

Campos:

- id
- organization_id
- course_id
- user_id
- enrollment_id
- certificate_code
- certificate_url
- issued_at
- expires_at
- renewal_of_certificate_id
- revoked_at
- metadata_json

### certification_requirements

Regras de certificação/reciclagem por organização, função e curso.

Campos:

- id
- organization_id
- course_id
- vertical
- job_title
- required
- validity_days
- reminder_days_before_expiry
- created_at
- updated_at

Uso:

- Definir que operadores precisam de determinado curso.
- Controlar validade da certificação.
- Gerar alertas antes do vencimento.
- Criar rematrícula de reciclagem.

### support_messages

Mensagens enviadas pelo suporte da plataforma.

Campos:

- id
- organization_id
- user_id
- name
- email
- type
- message
- status
- created_at

Status:

- open
- answered

## Tabelas futuras

### instructors

Profissionais/instrutores que podem publicar cursos públicos.

Campos:

- id
- user_id
- display_name
- bio
- status
- payout_provider
- payout_account_id
- created_at
- updated_at

### course_purchases

Compras de cursos públicos por usuários ou empresas.

Campos:

- id
- course_id
- organization_id
- user_id
- buyer_type
- seats
- amount_cents
- currency
- status
- provider
- provider_payment_id
- created_at

Buyer types:

- user
- organization

### instructor_payouts

Repasse financeiro para instrutores.

Campos:

- id
- instructor_id
- course_id
- gross_amount_cents
- sacf_fee_cents
- net_amount_cents
- currency
- status
- created_at

### course_reviews

Avaliações simples estilo marketplace interno.

Campos:

- id
- organization_id
- course_id
- user_id
- rating
- comment
- created_at

### learning_paths

Trilhas agrupando cursos por função.

Campos:

- id
- organization_id
- title
- description
- vertical
- status
- created_at
- updated_at

### learning_path_courses

Cursos dentro de uma trilha.

Campos:

- id
- learning_path_id
- course_id
- position
- required

## Índices recomendados

- organizations(slug)
- organization_members(organization_id, user_id)
- groups(organization_id, slug)
- group_members(group_id, user_id)
- courses(organization_id, status)
- courses(organization_id, vertical)
- courses(organization_id, language)
- course_translations(course_id, locale)
- lesson_translations(lesson_id, locale)
- courses(organization_id, certificate_enabled)
- courses(visibility_scope)
- course_visibility_rules(course_id, organization_id)
- course_visibility_rules(group_id)
- course_visibility_rules(user_id)
- enrollments(organization_id, user_id, status)
- enrollments(course_id, status)
- lesson_progress(enrollment_id, lesson_id)
- certificates(organization_id, user_id)
- certificates(expires_at)
- certification_requirements(organization_id, vertical)
- archived

### audit_logs

Logs administrativos.

Campos:

- id
- organization_id
- actor_user_id
- action
- entity_type
- entity_id
- metadata_json
- created_at

## Índices importantes

- organizations.slug unique
- users.email unique
- organization_members(organization_id, user_id) unique
- courses(organization_id, slug) unique
- enrollments(course_id, user_id) unique
- lesson_progress(enrollment_id, lesson_id) unique
- certificates.certificate_code unique

## Regras importantes

- Todas as queries de produto devem filtrar por `organization_id`.
- Nunca buscar curso/matrícula/certificado sem checar organização.
- Certificados devem ter código único e verificável.
