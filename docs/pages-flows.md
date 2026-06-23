# Páginas e Fluxos

## Rotas principais

### Público / entrada

- `/`
  - Vitrine pública da SACF University.
  - Apresenta o produto, proposta de valor e acesso à plataforma.
  - Deve apresentar a SACF University como produto do ecossistema SACF, com Zasso como primeiro caso de uso.

- `/login`
  - Login com aparência real no MVP.
  - Email/senha ainda mockados.
  - Perfis de demonstração ficam separados como recurso temporário para testar permissões.
  - O perfil demo define empresa, papel e grupos.
  - Depois será substituído pelo login real do SACF Hub.

- `/home`
  - Dashboard pós-login.
  - Mostra informações do usuário, empresa, grupos e cursos liberados.
  - Deve ser a primeira tela depois de autenticar.

### Dashboard

- `/inicio`
  - Visão geral da organização.
  - Cursos ativos.
  - Alunos em andamento.
  - Certificados emitidos.
  - Pendências.
  - Reciclagens próximas do vencimento.

- `/catalogo`
  - Catálogo de cursos estilo Udemy, porém privado por organização.
  - Cards visuais por curso.
  - Filtros por vertical, nível, idioma, duração, certificação e status.
  - Busca por título, função, módulo, instrutor ou dúvida recorrente.
  - No MVP, filtra cursos de acordo com o usuário mockado selecionado.

- `/catalogo/[slug]`
  - Página de apresentação do curso.
  - Mostra capa, descrição, público-alvo, objetivos, módulos, carga horária, idioma, nível e validade do certificado.
  - Ação principal: iniciar curso, continuar curso ou solicitar matrícula.

- `/meus-cursos`
  - Área do aluno.
  - Cursos matriculados.
  - Progresso, próximos passos, prazos e certificados pendentes.

- `/aprender/[courseId]`
  - Player do curso estilo Udemy.
  - Vídeo/conteúdo principal, trilha lateral com módulos/aulas, progresso e avaliação.

- `/certificados`
  - Certificados do usuário ou da organização.
  - Status de validade.
  - Alertas de reciclagem.

- `/reciclagens`
  - Certificações vencidas ou próximas do vencimento.
  - Lista de pessoas que precisam reciclar treinamento.
  - Ações para rematricular em curso de reciclagem.

- `/relatorios`
  - Relatórios gerenciais.
  - Export CSV.

- `/usuarios`
  - Usuários da organização.
  - Convites e papéis.

- `/ajuda`
  - Suporte e dúvidas.

### Admin da organização

- `/admin/cursos`
  - Lista administrativa de cursos.
  - Filtros por status, vertical, idioma, nível e certificação.
  - Ações: criar, editar, publicar, arquivar.

- `/admin/cursos/novo`
  - Criação de curso.

- `/admin/cursos/[id]`
  - Detalhe administrativo do curso.
  - Módulos, aulas, matrículas e relatórios.

- `/admin/cursos/[id]/editor`
  - Editor do conteúdo.
  - Módulos e aulas.

### Admin SACF

- `/admin`
  - Visão geral de clientes.

- `/admin/organizacoes`
  - Empresas cadastradas.

- `/admin/suporte`
  - Mensagens de suporte.

- `/admin/logs`
  - Logs de auditoria.

## Fluxo: empresa cria treinamento

1. Admin acessa SACF University.
2. Cria um curso.
3. Adiciona foto/capa do curso.
4. Define vertical: operador, mecânico, elétrico/alta tensão, treinador ou representante.
5. Define idioma, nível, carga horária e validade do certificado.
6. Adiciona módulos.
7. Adiciona aulas em vídeo, texto, arquivo ou quiz.
8. Configura avaliação.
9. Define regras de acesso por empresa, grupo ou usuário.
10. Publica curso no catálogo da organização.
11. Matricula funcionários, representantes ou prestadores.
12. Usuários recebem convite/email.
13. Usuários completam curso.
14. Sistema emite certificado.
15. Admin acompanha relatório e vencimentos.

## Fluxo: aluno descobre curso

1. Aluno entra em `/login`.
2. Entra com email/senha ou usa perfil de demonstração no MVP.
3. Sistema identifica empresa, papel e grupos.
4. Aluno cai em `/home`.
5. Aluno entra em `/catalogo`.
6. Catálogo mostra apenas cursos liberados para aquele perfil.
7. Filtra por vertical, idioma, nível ou certificação.
8. Abre `/catalogo/[slug]`.
9. Vê módulos, objetivos, duração, certificado e requisitos.
10. Inicia ou continua o curso.
11. Sistema leva para o player em `/aprender/[courseId]`.

## Fluxo: aluno conclui curso

1. Aluno entra em `/meus-cursos`.
2. Abre curso atribuído.
3. Assiste aulas.
4. Marca aulas como concluídas.
5. Faz avaliação.
6. Se atingir nota mínima, curso é concluído.
7. Certificado é emitido.
8. Certificado aparece em `/certificados` com status de validade.
9. Se houver prazo de expiração, o curso entra no controle de reciclagem.

## Fluxo: certificado

MVP:

1. Sistema cria certificado com código único.
2. Usuário vê certificado em tela.
3. Certificado tem data de emissão.
4. Certificado pode ter data de vencimento.
5. Admin consegue confirmar validade.

Futuro:

1. PDF gerado automaticamente.
2. Página pública `/certificados/validar/[code]`.
3. QR Code no certificado.

## Fluxo: suporte

1. Usuário acessa `/ajuda`.
2. Envia dúvida, sugestão, proposta ou problema.
3. Sistema envia email para SACF.
4. Sistema salva mensagem em `support_messages`.
5. Admin responde pelo painel ou por email.

## Catálogo estilo Udemy

O catálogo deve ser visual e direto. A sensação deve ser de uma plataforma madura de cursos, não de uma tabela administrativa.

Cards de curso:

- Capa/imagem.
- Título.
- Vertical.
- Nível.
- Idioma.
- Carga horária.
- Quantidade de aulas.
- Status do aluno: não iniciado, em andamento, concluído.
- Progresso.
- Badge de certificado.
- Badge de reciclagem quando aplicável.

Filtros:

- Vertical.
- Nível.
- Idioma.
- Duração.
- Certificação.
- Status do aluno.
- Curso obrigatório/opcional.

## Página de curso estilo Udemy

Deve mostrar:

- Hero com capa, título e resumo.
- O que o aluno vai aprender.
- Para quem é o curso.
- Requisitos.
- Conteúdo do curso por módulos.
- Carga horária.
- Idioma.
- Instrutor/responsável técnico.
- Validade do certificado.
- Botão iniciar/continuar.

## Tela inicial ideal

Deve ser operacional, não landing page.

Cards úteis:

- Cursos publicados.
- Funcionários matriculados.
- Conclusões no mês.
- Certificados emitidos.
- Certificados vencendo.
- Cursos pendentes de publicação.
- Alunos atrasados.

## Curso player

Layout:

- Sidebar com módulos/aulas.
- Conteúdo principal.
- Botão concluir aula.
- Progresso visível.
- Próxima aula.
- Quiz/avaliação no fluxo.
- Certificado liberado ao concluir requisitos.

## Mobile

Mobile é essencial porque muitos funcionários podem fazer treinamento pelo celular.

Prioridades:

- Player simples.
- Botões grandes.
- Progresso claro.
- Quiz fácil de responder.
- Certificado acessível.
