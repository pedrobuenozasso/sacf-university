# Prompt para gerar um novo design da SACF University (Claude / design)

> Como usar: copie tudo **dentro do bloco de código** abaixo e cole no Claude (ou em
> qualquer IA de design/UI). Ajuste os campos `«…»` no topo se quiser. O resto já está
> pronto, com todas as telas, funcionalidades e o branding da SACF.

---

```
Você é um designer de produto sênior especialista em SaaS B2B e plataformas de educação online.
Crie uma proposta de design de alta fidelidade para a plataforma "SACF University".

### Parâmetros (ajuste se quiser)
- Entregável: «mockups de alta fidelidade das telas principais + um mini design system (cores, tipografia, componentes)»
- Formato: «telas em HTML/CSS (ou imagens), tema escuro, responsivo (desktop + mobile)»
- Profundidade: «desktop primeiro; mostrar mobile nas telas-chave (catálogo, curso, player)»
- Idioma da interface: Português (Brasil)

### O QUE É O PRODUTO
SACF University é uma plataforma SaaS B2B **privada de educação corporativa**: empresas criam,
gerenciam e certificam treinamentos profissionalizantes para funcionários, equipes, clientes e
parceiros. Pense em "**Udemy/Coursera corporativo**", porém **privado e isolado por empresa**.
Cliente piloto: Zasso (treinamentos de operação, manutenção, alta tensão e formação de treinadores).
Visão futura: virar também um **marketplace** onde profissionais publicam e vendem cursos.

Diferencial central: **certificação verificável com controle de validade e reciclagem** — saber
quem está certificado, quem vai vencer e quem precisa reciclar.

### IDENTIDADE VISUAL (SACF) — siga à risca
- **Tema escuro premium.** Fundo quase preto azulado (~#060B16 / #04070F). Nada de fundo claro/bege.
- **Paleta:** azul SACF `#2F5BFF` (primária), ciano `#58D9FF` (destaque), verde `#55E7A8` (sucesso/
  concluído), violeta `#8A75FF` (alta tensão/elétrico). Texto branco `#F7FBFF`, secundário `#9AA8C3`.
- **Acento por vertical** (usado nas capas de curso): Operador = azul, Mecânico = ciano,
  Elétrico/alta tensão = violeta, Treinador = verde.
- **Logo:** símbolo hexagonal "S" da SACF (azul + branco) sobre fundo escuro; existe um lockup
  "SACF" com a tagline "AI Revenue Infrastructure". A marca-mãe é SACF; o produto é SACF University.
- **Multiempresa/branding por empresa:** cada curso/ambiente pode exibir a marca da empresa cliente
  (ex.: logo da Zasso) ao lado da marca SACF.
- **Tom:** tecnológico, premium, confiante, limpo, muito alinhado ao grid, com cards, ícones de
  linha e bastante respiro. **Evite cara de template genérico de IA** (nada de linhas/barras
  decorativas sob títulos, gradientes exagerados ou layouts repetitivos).
- **Estrutura de navegação e catálogo:** referência Udemy/Coursera (cards com capa, filtros, página
  de curso rica, player com sidebar de módulos), mas com a estética escura e premium da SACF.

### PERSONAS / PAPÉIS (o design precisa servir a todos)
- **Aluno / funcionário** — consome cursos, faz provas, recebe certificados.
- **Parceiro externo** — como o aluno, mas com acesso limitado (representantes/prestadores).
- **Admin da empresa** — cria/gerencia cursos, convida funcionários, vê relatórios da sua empresa.
- **Instrutor** — cria e edita conteúdo de cursos.
- **Admin SACF (plataforma)** — gerencia empresas-clientes, conteúdo global e operação.

### TELAS A DESENHAR

Público / acesso
1. **Landing / produto** — hero com proposta de valor, métricas, cursos em destaque, CTA.
2. **Login / cadastro** — acesso por **email corporativo** (o domínio define a empresa: @zasso →
   Zasso). Fluxo: digita email → recebe link de confirmação → cria senha → entra. Tela de "sua
   empresa ainda não está na SACF" para domínios não cadastrados.

Aluno
3. **Home / dashboard do aluno** — boas-vindas, ambiente da empresa, progresso, próximos cursos
   (continuar de onde parou), certificados, avisos de vencimento.
4. **Catálogo** — grade de cards estilo Udemy (capa por vertical, nível, duração, idioma, progresso,
   selo de certificado, status), **busca** e **filtros** (vertical, nível, idioma, com certificado),
   filtrado por empresa/grupo/papel.
5. **Página do curso** — capa, descrição, "o que você vai aprender", conteúdo programático
   (módulos/aulas), instrutor, requisitos, duração, idioma, regra de certificado, botão
   matricular/iniciar; barra lateral "incluído neste curso".
6. **Player de aula** — área de vídeo, sidebar com módulos/aulas e progresso, próxima aula, anexos,
   transcrição/legendas, marcar como concluída.
7. **Quiz / prova** — perguntas, navegação, resultado, nota mínima, aprovado/reprovado.
8. **Meus cursos** — em andamento, concluídos, com progresso.
9. **Certificados** — lista de certificados; **certificado individual** com código único, QR Code,
   data de emissão, validade e status (válido/vencendo/vencido); **página pública de validação**.
10. **Perfil / configurações** — dados, **seletor de idioma** (pt-BR, pt-PT, en, es, de, fr),
    notificações.

Admin (empresa e SACF)
11. **Painel admin — visão geral** — métricas (empresas, usuários, certificados, vencendo), filas
    de atenção, atividade recente.
12. **Empresas** (admin SACF) — lista de empresas-clientes (status, usuários, cursos, vencendo) +
    criar/editar empresa (nome, domínio de email, admin inicial, idioma, branding).
13. **Usuários / funcionários** — lista (papel, grupo, status, progresso) + **convidar** por email
    (papel + grupos definem o acesso).
14. **Cursos + editor de curso** — lista e o **editor completo**: identidade (capa, título, vertical,
    idioma, carga horária, instrutor, nível), conteúdo (módulos, aulas, vídeos, anexos, quiz, prova),
    acesso (empresa inteira / grupo / usuários), governança (rascunho, publicar, arquivar).
15. **Certificações** — regras de validade e reciclagem por curso/função; lista de vencimentos.
16. **Relatórios** — conclusão por aluno/curso, certificados emitidos/vencidos/vencendo, uso,
    export CSV, resumo executivo.
17. **Grupos / trilhas** — trilhas de formação por cargo, área ou unidade.

Marketplace (visão futura — 1 ou 2 telas conceituais)
18. **Catálogo público + página de venda do curso** (preço, instrutor, avaliações) e **painel do
    instrutor** (cursos publicados, vendas).

### FUNCIONALIDADES QUE O DESIGN DEVE REFLETIR
- Multiempresa com isolamento e branding por empresa.
- Acesso por domínio de email corporativo; permissões por papel e por grupo.
- Catálogo visual + busca + filtros; progresso por curso e por aula.
- Provas/quiz com nota e aprovação.
- Certificação verificável (código + QR + validação pública) com validade e reciclagem.
- Multilíngue (6 idiomas).
- Relatórios e exportação.
- Base preparada para marketplace (cursos públicos, venda, instrutor).

### O QUE ENTREGAR
- Um **mini design system**: paleta (com os HEX acima), tipografia, escala de espaçamento,
  componentes-chave (botões, inputs, cards de curso, badges/selos de status e certificado, tabelas,
  chips de filtro, barra de progresso, navegação).
- **Mockups de alta fidelidade** das telas acima (priorize: landing, login, dashboard do aluno,
  catálogo, página do curso, player, certificados, painel admin e editor de curso).
- Estados importantes: vazio, em andamento, concluído, sem permissão.
- Versão **mobile** das telas-chave (catálogo, curso, player).

Mantenha consistência total entre as telas, alinhamento ao grid e a estética escura premium da SACF.
Pode propor melhorias de UX, desde que respeite a identidade e as funcionalidades acima.
```

---

## Dica
- Cole o bloco no Claude e peça uma tela por vez se ele truncar (ex.: "comece pelo catálogo e a página do curso").
- Se a ferramenta aceitar imagens, anexe os logos de `public/brand/` (`sacf-lockup-dark.jpg`,
  `sacf-app-icon-v2.png`) e prints das telas atuais como referência de marca.
