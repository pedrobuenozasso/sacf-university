# Brief para Apresentação: SACF University

## Nome do produto

SACF University

## Frase curta

Uma plataforma corporativa de cursos, certificações e reciclagens para empresas treinarem equipes, representantes e prestadores de serviço com controle real de progresso e validade.

## Ideia central

A SACF University funciona como uma Udemy corporativa privada. Cada empresa tem seu próprio ambiente, seus próprios usuários, grupos, cursos, certificados e relatórios. A SACF administra a plataforma e cada empresa administra seus treinamentos.

## Visão de evolução

O MVP nasce como uma plataforma para empresas. Primeiro resolvemos o problema B2B: cada empresa treina e certifica seus próprios colaboradores, representantes e prestadores.

No futuro, a SACF University pode evoluir para uma plataforma híbrida:

- cursos privados por empresa;
- cursos públicos no marketplace SACF;
- instrutores/profissionais vendendo cursos;
- empresas comprando cursos públicos para seus colaboradores;
- usuários corporativos acessando cursos internos e também adquirindo cursos públicos;
- SACF cobrando uma porcentagem sobre vendas;
- empresas mantendo áreas privadas, mesmo dentro de uma plataforma maior.

Exemplo:

- Todo usuário com email `@zasso.com` entra automaticamente no ambiente Zasso.
- Esse usuário vê os cursos internos obrigatórios da Zasso.
- Além disso, pode acessar ou comprar cursos públicos do marketplace SACF.
- A empresa pode pagar por cursos públicos para equipes específicas.
- Um profissional externo pode publicar um curso aprovado pela SACF e vender para empresas ou usuários.

Essa visão permite começar com um produto corporativo seguro e evoluir para um ecossistema maior de educação profissional.

## Problema

Empresas que operam equipes técnicas precisam garantir que pessoas certas tenham feito treinamentos certos, dentro do prazo certo.

Hoje isso costuma ficar espalhado em:

- vídeos não organizados;
- planilhas;
- PDFs;
- treinamentos presenciais sem rastreabilidade;
- certificados difíceis de controlar;
- reciclagens esquecidas;
- representantes e prestadores sem padronização.

## Solução

Uma plataforma SaaS onde a empresa pode:

- cadastrar usuários;
- dividir pessoas por grupos;
- criar cursos por função ou vertical;
- liberar cursos apenas para quem deve ver;
- acompanhar progresso;
- aplicar avaliações;
- emitir certificados;
- controlar vencimentos e reciclagens;
- gerar relatórios para liderança.

Em uma fase futura, a mesma base poderá permitir venda de cursos públicos, com curadoria e comissão para a SACF.

## Público-alvo

- Empresas industriais.
- Equipes de operação.
- Times de manutenção.
- Técnicos elétricos e de alta tensão.
- Treinadores internos.
- Representantes comerciais/técnicos.
- Prestadores de serviço autorizados.
- Clientes que precisam comprovar capacitação.

## Primeiro caso de uso

Zasso como primeiro cliente/tenant.

Verticais iniciais:

- Operador.
- Mecânico.
- Elétrico / alta tensão.
- Treinador.
- Representantes.
- Prestadores de serviço.

## Como funciona o acesso

1. A SACF cria uma empresa.
2. A empresa cria grupos internos.
3. Usuários entram por login.
4. Cada usuário pertence a uma empresa e a um ou mais grupos.
5. Cada curso possui regra de visibilidade.
6. O catálogo mostra apenas os cursos liberados para aquele usuário.
7. O aluno faz curso, prova e recebe certificado.
8. O admin acompanha progresso e vencimentos.

Login de empresa:

- Cada empresa terá administradores próprios.
- O admin da empresa acessa um painel privado.
- Esse admin consegue criar, editar, publicar, arquivar e apagar cursos.
- Também consegue alterar foto/capa do curso, conteúdo, módulos, aulas, idioma e regras de acesso.
- A SACF mantém controle superior para suporte, auditoria, planos e governança.

Futuro:

9. O usuário também pode ver cursos públicos liberados fora da empresa.
10. A empresa pode adquirir cursos públicos para grupos internos.
11. Instrutores/profissionais podem publicar cursos mediante aprovação.
12. A SACF pode cobrar percentual sobre vendas.

## Divisão de permissões

### SACF Admin

Controla toda a plataforma, empresas, suporte, logs e visão geral.

### Admin da Empresa

Gerencia usuários, cursos, matrículas, grupos, certificados e relatórios da própria empresa.

### Instrutor

Cria e edita conteúdos autorizados.

### Gestor

Acompanha progresso e certificados da equipe.

### Aluno

Acessa cursos liberados, assiste aulas, faz avaliações e recebe certificados.

### Parceiro externo

Acesso limitado para representantes e prestadores de serviço.

## Catálogo estilo Udemy

O catálogo é privado por empresa. Ele mostra cards de cursos com:

- capa;
- título;
- vertical;
- nível;
- idioma;
- duração;
- quantidade de aulas;
- progresso;
- certificado;
- status do curso.

## Página de curso

Cada curso mostra:

- resumo;
- público-alvo;
- instrutor/responsável técnico;
- módulos e aulas;
- carga horária;
- requisitos;
- validade do certificado;
- botão iniciar/continuar.

## Player de curso

O player tem:

- vídeo ou conteúdo principal;
- trilha lateral com módulos e aulas;
- progresso;
- botão concluir aula;
- próxima aula;
- acesso à prova quando aplicável.

## Painel Admin

O painel admin tem:

- visão geral;
- empresas;
- cursos;
- usuários;
- certificações;
- relatórios;
- fila de atenção com certificados vencendo, convites pendentes e cursos em revisão.

O admin da empresa deve conseguir:

- adicionar novos cursos;
- alterar fotos/capas;
- editar descrições e conteúdo programático;
- adicionar vídeos, anexos, textos, quizzes e provas;
- definir idioma do curso;
- liberar cursos por empresa, grupo ou usuário;
- publicar, arquivar ou apagar cursos;
- acompanhar progresso, certificados e vencimentos.

## Diferenciais

- Não é só hospedagem de vídeo.
- Controla certificação e vencimento.
- Divide acesso por empresa e grupo.
- Pode treinar funcionários, representantes e prestadores.
- Suporte internacional planejado: inglês, português Brasil, português Portugal, espanhol, alemão e francês.
- Tem visão operacional para administradores.
- Permite escalar para vários clientes SACF.
- Fica integrada futuramente ao SACF Hub.
- Pode evoluir para marketplace de cursos profissionais.
- Permite combinar cursos internos privados e cursos públicos pagos.

## Stack proposta

- Next.js + TypeScript.
- PostgreSQL / Google Cloud SQL.
- Vercel para app e previews.
- Storage externo para vídeos e anexos.
- Resend para emails.
- Autenticação futura via SACF Hub.

## Estado atual do MVP

Já existe protótipo navegável com:

- home;
- catálogo;
- login mockado;
- catálogo filtrado por usuário;
- página de curso;
- player mockado;
- meus cursos;
- certificados;
- ajuda;
- painel admin;
- documentação técnica inicial.

## Próximos passos

1. Validar visual e fluxo com a Zasso.
2. Definir identidade visual final.
3. Ligar autenticação real.
4. Conectar banco PostgreSQL/Cloud SQL.
5. Implementar CRUD de empresas, usuários, grupos e cursos.
6. Implementar matrícula e progresso real.
7. Implementar avaliações.
8. Implementar certificados e vencimentos.
9. Implementar emails de convite, conclusão e reciclagem.
10. Preparar piloto real com cursos da Zasso.

## Objetivo futuro: marketplace SACF University

Depois do MVP corporativo, a plataforma pode evoluir para um marketplace de cursos profissionais.

Modelo:

- Empresas continuam com ambientes privados.
- Usuários corporativos acessam cursos internos obrigatórios.
- Usuários podem adquirir cursos públicos complementares.
- Empresas podem comprar cursos públicos para times.
- Instrutores/profissionais podem vender cursos na plataforma.
- A SACF aprova conteúdos antes de publicar.
- A SACF cobra comissão por venda.
- Certificados podem ser emitidos tanto para cursos privados quanto públicos.

Essa evolução transforma a SACF University de uma plataforma de treinamento corporativo em um ecossistema de capacitação profissional.

## Prompt para gerar apresentação

Use o prompt abaixo em uma IA de apresentações:

```text
Crie uma apresentação profissional, moderna e objetiva sobre a plataforma SACF University.

Contexto:
A SACF University é uma plataforma SaaS de educação corporativa, inspirada na experiência da Udemy, mas inicialmente privada por empresa. O objetivo é permitir que empresas criem, organizem, distribuam e monitorem cursos profissionalizantes para funcionários, representantes, prestadores de serviço e equipes técnicas.

Visão futura:
No futuro, além dos cursos privados por empresa, a SACF University poderá evoluir para um marketplace de cursos profissionais. Usuários corporativos, como pessoas com email @zasso.com, entram automaticamente no ambiente da empresa e acessam os cursos internos da Zasso, mas também podem adquirir cursos públicos da plataforma. Empresas poderão comprar cursos públicos para grupos internos. Profissionais/instrutores poderão publicar cursos aprovados pela SACF, e a SACF poderá cobrar uma porcentagem sobre as vendas.

Primeiro cliente/tenant:
Zasso.

Problema:
Empresas técnicas e industriais precisam treinar operadores, mecânicos, técnicos elétricos, treinadores e parceiros externos, mas normalmente esse controle fica espalhado em vídeos, planilhas, PDFs, treinamentos presenciais e certificados difíceis de rastrear. Isso causa falta de padronização, baixa rastreabilidade, treinamentos vencidos e risco operacional.

Solução:
Uma plataforma corporativa onde cada empresa tem seu próprio ambiente, usuários, grupos, cursos, certificados e relatórios. Cada usuário faz login e vê apenas os cursos liberados para sua empresa, grupo ou matrícula direta.

Funcionalidades principais:
- Login por usuário.
- Empresas/tenants separados.
- Grupos por função ou área.
- Catálogo privado de cursos estilo Udemy.
- Página de curso com descrição, módulos, aulas, instrutor, requisitos e certificado.
- Player de aula com progresso.
- Avaliações e provas teóricas.
- Emissão de certificados.
- Controle de vencimento e reciclagem.
- Treinamento de funcionários, representantes e prestadores.
- Painel admin para empresas.
- Login de empresa com permissões para criar, editar, publicar e apagar cursos.
- Edição de capa/foto, conteúdo, módulos, aulas, vídeos, anexos e avaliações.
- Painel SACF para gerenciar clientes.
- Relatórios de progresso, conclusão e certificações.
- Suporte multilíngue: inglês, português Brasil, português Portugal, espanhol, alemão e francês.

Objetivo futuro:
- Marketplace de cursos profissionais.
- Cursos públicos pagos.
- Instrutores externos aprovados.
- Empresas comprando cursos para times.
- Usuários corporativos acessando cursos internos e cursos públicos.
- Comissão da SACF sobre vendas.

Papéis:
- SACF Admin: controla toda a plataforma.
- Admin da empresa: gerencia usuários, cursos e relatórios da própria empresa.
- Instrutor: cria e edita conteúdo.
- Gestor: acompanha progresso da equipe.
- Aluno: faz cursos e recebe certificados.
- Parceiro externo: acesso limitado a cursos e certificados.

Primeiro caso de uso Zasso:
Cursos por vertical:
- Operador.
- Mecânico.
- Elétrico / alta tensão.
- Treinador.
- Representantes.
- Prestadores de serviço.

Diferenciais:
- Não é apenas uma biblioteca de vídeos.
- Controla quem assistiu, quem passou, quem recebeu certificado e quem precisa reciclar.
- Catálogo é personalizado por empresa e grupo.
- Pode escalar para vários clientes dentro do ecossistema SACF.
- Futuramente integrado ao SACF Hub com login central e billing.

Stack:
- Next.js + TypeScript.
- PostgreSQL / Google Cloud SQL.
- Vercel.
- Storage externo para vídeos.
- Resend para emails.
- Autenticação futura via SACF Hub.

Crie uma apresentação de 10 a 12 slides:
1. Capa.
2. Problema.
3. Oportunidade.
4. Solução SACF University.
5. Experiência estilo Udemy corporativo.
6. Como funciona o acesso por empresa, grupos e usuários.
7. Funcionalidades principais.
8. Painel admin e relatórios.
9. Caso de uso Zasso.
10. Arquitetura técnica resumida.
11. Roadmap MVP.
12. Visão futura: marketplace de cursos.
13. Próximos passos.

Tom visual:
Profissional, futurista, clean, corporativo, escuro com azul SACF, visual premium, sem parecer genérico.

Tom de texto:
Direto, executivo, claro, sem exagero comercial.
```
