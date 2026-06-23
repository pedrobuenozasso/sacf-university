# Product Spec: SACF University

## Visão

SACF University será uma plataforma de educação corporativa para empresas que precisam criar cursos profissionalizantes, treinar funcionários, controlar reciclagens e emitir certificados internos ou externos.

A plataforma deve funcionar como um SaaS B2B modular dentro do ecossistema SACF. Cada empresa terá seu próprio ambiente, usuários, cursos, trilhas, reciclagens e certificados.

A experiência do aluno deve seguir uma referência próxima da **Udemy**, mas com foco corporativo:

- Catálogo de cursos por empresa.
- Cards visuais com capa, título, categoria, vertical, nível, idioma, duração e progresso.
- Página detalhada do curso antes de iniciar.
- Player de curso com módulos, aulas, progresso e próxima aula.
- Área "Meus cursos".
- Certificado ao concluir.
- Administração privada por empresa, sem marketplace público no MVP.

## Cliente piloto

Primeiro cliente:

- **Zasso**

Uso inicial:

- Treinar funcionários.
- Criar trilhas internas por vertical.
- Certificar operadores, mecânicos, técnicos elétricos, treinadores, representantes e prestadores de serviço.
- Controlar vencimento de certificações e reciclagens.
- Acompanhar progresso e conclusão.

Verticais iniciais:

- Operador.
- Mecânico.
- Elétrico / alta tensão.
- Treinador.

Conteúdo inicial:

- Dúvidas recorrentes de operação.
- Dúvidas recorrentes de manutenção.
- Segurança e alta tensão.
- Procedimentos de campo.
- Treinamento de representantes/prestadores.

## Usuários alvo

- Empresas com treinamento interno.
- RH e desenvolvimento organizacional.
- Operações industriais/agro/field teams.
- Franquias e redes com equipes distribuídas.
- Empresas que precisam certificar funcionários.
- Times comerciais que precisam treinar representantes.
- Empresas de tecnologia com onboarding interno.
- Operações com prestadores de serviço que precisam comprovar treinamento.

## Personas

### SACF Admin

Equipe interna da SACF que gerencia clientes, ambientes, planos, módulos e suporte.

### Company Admin

Responsável da empresa cliente. Cria cursos, convida usuários, define trilhas e acompanha relatórios.

### Instructor / Content Manager

Pessoa que cria aulas, materiais, perguntas, provas e critérios de aprovação.

### Student / Employee

Funcionário que assiste aulas, realiza avaliações, acompanha progresso e recebe certificado.

## Experiência estilo Udemy

### Catálogo

O aluno deve conseguir navegar pelos cursos disponíveis como em um catálogo:

- Cursos em cards.
- Busca por nome.
- Filtro por vertical.
- Filtro por nível.
- Filtro por idioma.
- Status: não iniciado, em andamento, concluído.
- Destaque para cursos obrigatórios.

### Página do curso

Antes ou depois da matrícula, o curso deve ter uma página própria com:

- Capa do curso.
- Título.
- Descrição.
- O que o aluno vai aprender.
- Público-alvo.
- Requisitos.
- Carga horária.
- Nível.
- Idioma.
- Instrutor/responsável.
- Conteúdo programático.
- Certificação e validade.
- Botão iniciar/continuar.

### Player

O player deve ser direto e profissional:

- Vídeo/texto/conteúdo principal no centro.
- Lista de módulos e aulas na lateral.
- Progresso visível.
- Botão concluir aula.
- Próxima aula.
- Quiz quando aplicável.

## MVP

O MVP deve resolver o básico com qualidade:

1. Empresa cria ambiente.
2. Admin cadastra usuários.
3. Admin cria cursos.
4. Curso possui módulos e aulas.
5. Aulas podem ter vídeo, texto, anexos e quiz.
6. Aluno acessa trilha, conclui aulas e faz avaliação.
7. Sistema calcula progresso.
8. Sistema emite certificado ao concluir.
9. Sistema controla vencimento/reciclagem.
10. Admin acompanha relatórios.

## Funcionalidades MVP

### Organizações

- Criar organização.
- Configurar nome, logo e domínio futuro.
- Definir admins.
- Separar dados por empresa.

### Usuários

- Criar usuários manualmente.
- Convidar por email.
- Associar usuários a organização.
- Papéis: admin, instrutor, aluno.

### Cursos

- Criar curso.
- Título, descrição, categoria, carga horária, nível.
- Vertical do curso.
- Idioma.
- Capa do curso.
- Instrutor/responsável.
- O que o aluno vai aprender.
- Público-alvo.
- Requisitos.
- Publicado ou rascunho.
- Curso obrigatório ou opcional.

Verticais MVP:

- Operador.
- Mecânico.
- Elétrico / alta tensão.
- Treinador.

### Módulos e aulas

- Curso dividido em módulos.
- Módulo dividido em aulas.
- Tipos de aula:
  - vídeo
  - texto
  - arquivo/anexo
  - quiz simples

Vídeos no MVP:

- Link de vídeo não listado.
- Link de plataforma terceira.
- Upload próprio entra como fase posterior.

### Matrículas

- Admin matricula alunos.
- Aluno vê cursos atribuídos.
- Status:
  - não iniciado
  - em andamento
  - concluído
  - reprovado

### Progresso

- Marcar aula como concluída.
- Calcular percentual do curso.
- Registrar tempo e data de conclusão.

### Avaliação

- Quiz por aula ou avaliação final.
- Perguntas de múltipla escolha.
- Nota mínima configurável.
- Tentativas limitadas ou ilimitadas.

### Certificados

- Emitir certificado ao concluir curso.
- Código único de validação.
- Página pública de validação futura.
- PDF futuro.
- Data de emissão.
- Data de vencimento opcional.
- Status de reciclagem.

### Reciclagem

- Cursos/certificados podem ter validade.
- Admin vê certificações vencidas ou próximas do vencimento.
- Sistema pode enviar lembretes futuros.
- Aluno pode ser rematriculado em reciclagem.

### Relatórios

- Cursos ativos.
- Alunos matriculados.
- Progresso por curso.
- Conclusões.
- Certificados emitidos.
- Certificados vencidos.
- Certificados próximos do vencimento.
- Export CSV.

### Catálogo e Meus Cursos

- Catálogo interno por organização.
- Área "Meus cursos" para aluno.
- Cards com progresso.
- Cursos obrigatórios destacados.
- Curso em andamento com botão continuar.

### Multilíngue

MVP deve nascer preparado para múltiplos idiomas.

Prioridade:

- Português.
- Inglês.
- Espanhol.

No MVP, pode começar com estrutura pronta e conteúdo inicial em português.

## Fora do MVP

Não entrar agora:

- Marketplace público de cursos.
- Pagamento por curso.
- Comunidade/forum.
- Live classes.
- Gamificação complexa.
- SCORM/xAPI.
- White-label completo por domínio.
- App mobile nativo.
- Tradução automática completa.

## Diferencial

O diferencial não é apenas hospedar vídeos. O diferencial é:

- Treinamento corporativo organizado.
- Certificação rastreável.
- Reciclagem e vencimento por função.
- Gestão por empresa.
- Relatórios simples.
- Integração futura com Hub SACF.
- Possibilidade de IA para gerar quizzes, resumos e planos de treinamento.

## Nome e posicionamento

Nome: **SACF University**

Descrição curta:

> Plataforma corporativa para criar cursos, treinar equipes e emitir certificados profissionais.

Descrição comercial:

> A SACF University ajuda empresas a transformar conhecimento interno em trilhas de treinamento, acompanhar o desenvolvimento de funcionários e emitir certificados rastreáveis de conclusão.
