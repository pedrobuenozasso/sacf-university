# Prompt para gerar a apresentação da SACF University

> Como usar: copie tudo **dentro do bloco** abaixo e cole na IA de sua preferência
> (Gamma, Canva Magic, ChatGPT, Claude, Beautiful.ai, Tome…). Antes de enviar,
> ajuste os campos marcados com `«…»` no início. O resto já está pronto.

---

```
Você é um especialista em storytelling de produto e design de apresentações B2B SaaS.
Crie uma apresentação profissional, moderna e persuasiva sobre a plataforma "SACF University".

### Parâmetros (ajuste conforme a necessidade)
- Público-alvo: «liderança da SACF + Zasso (cliente piloto)»   [outras opções: investidores | equipe interna | clientes potenciais]
- Objetivo: «conseguir aprovação e patrocínio para levar o piloto à produção»
- Nº de slides: «12 a 14»
- Idioma: Português (Brasil)
- Formato de saída: para cada slide, entregue → Título · 3 a 5 bullets curtos · sugestão de visual/imagem · nota do apresentador (2 a 3 frases).
- Duração da fala estimada: «10 a 12 minutos»

### Identidade visual a seguir
- Tom: tecnológico, premium, confiante e direto. Nada de clichê corporativo.
- **Tema escuro** (fundo quase preto azulado, ~#04070F), com destaque em **azul SACF #2F5BFF** e **ciano #58D9FF**. Texto branco/azul-claro.
- Estética "produto de verdade", referência **Udemy corporativo**: limpo, alinhado, com cards, ícones de linha e bastante respiro.
- **Logo oficial:** lockup vertical da SACF — símbolo hexagonal "S" (azul + branco) sobre "SACF" e a tagline "AI REVENUE INFRASTRUCTURE", em fundo escuro. Use-o no slide de capa.
  - Arquivo: `sacf-lockup-dark.jpg`. Para marcas pequenas (rodapé/cantos), use só o símbolo: `sacf-app-icon-v2.png`. Versão clara do lockup: `sacf-lockup-white.png`.
  - Todos os assets estão na pasta `public/brand/` do projeto (anexe ao gerador de slides se ele aceitar upload de imagens).
- Hierarquia de marca: **SACF** é a marca-mãe ("AI Revenue Infrastructure"); **SACF University** é o produto. Mantenha os dois claros, sem misturar.

---

### CONTEXTO DO PRODUTO (use como fonte da verdade)

**O que é:** SACF University é uma plataforma SaaS B2B privada de educação corporativa.
Empresas criam, gerenciam e certificam treinamentos profissionalizantes para seus
funcionários, equipes, clientes e parceiros — no estilo "Udemy corporativo", mas
privado e isolado por empresa.

**Frase de efeito:** "Treinamento corporativo com controle real de certificação."

**O problema que resolve:** empresas industriais e de campo treinam gente em segurança,
operação, manutenção e alta tensão usando planilhas, PDFs e controles soltos. Ninguém
sabe com clareza quem está certificado, quem está prestes a vencer e quem precisa
reciclar — o que vira risco operacional, de segurança e de conformidade.

**A solução:** uma plataforma única para treinar, avaliar, certificar e acompanhar
equipes, com catálogo visual de cursos, trilhas por função, provas, certificados
verificáveis e controle automático de validade e reciclagem.

### DIFERENCIAIS (destaque estes)
1. **Certificação verificável + controle de validade/reciclagem** — o diferencial central:
   saber exatamente quem está certificado, quem vai vencer e quem precisa reciclar.
2. **Multiempresa de verdade** — cada empresa é um ambiente isolado; permissões por
   papel (admin da empresa, instrutor, gestor, aluno, parceiro externo) e por grupo.
3. **Experiência de produto** — catálogo visual estilo Udemy, capas por área, player de
   aula, progresso e "meus cursos". Não tem cara de planilha.
4. **Multilíngue** — preparado para pt-BR, pt-PT, inglês, espanhol, alemão e francês.
5. **Escalável** — base pensada para muitos clientes, não só um.

### CLIENTE PILOTO: ZASSO
A Zasso é o primeiro cliente e o ponto de partida. Verticais iniciais de treinamento:
Operador, Mecânico, Elétrico/Alta Tensão e Treinador. Foco no conhecimento crítico de
campo: operação segura, manutenção preventiva, segurança em alta tensão e formação de
multiplicadores internos.

### STATUS ATUAL (seja confiante, mas honesto)
Já existe um **protótipo navegável e visualmente pronto** (MVP visual), com:
- catálogo filtrado por empresa, papel e grupo (permissões funcionando);
- login simulado por perfil, navegação completa, páginas de curso, player, certificados,
  "meus cursos", ajuda e painel administrativo;
- design system completo e responsivo.
Posicione como: "a experiência está validada; o próximo passo é ligar banco de dados,
autenticação e as ações reais para virar produto em produção."

### VISÃO E ROADMAP
- **Curto prazo:** levar o piloto Zasso à produção — PostgreSQL no Google Cloud SQL,
  CRUD real de cursos/usuários, player com vídeo, emissão de certificado e reciclagem.
- **Médio prazo:** relatórios executivos, multi-idioma completo, certificado com QR Code
  e página pública de validação, integração com o futuro SACF Hub (login central).
- **Longo prazo (a grande visão):** evoluir de LMS corporativo privado para um
  **marketplace de cursos profissionais** — onde instrutores publicam e vendem cursos
  na plataforma (com curadoria e comissão SACF), e empresas compram cursos públicos
  para suas equipes. A Zasso é o start de tudo.

### STACK (1 slide técnico leve, opcional)
Next.js + TypeScript no app; PostgreSQL/Google Cloud SQL; deploy na Vercel; storage
externo para vídeos e certificados; e-mails transacionais; autenticação futura via
SACF Hub com permissões por empresa.

---

### ESTRUTURA SUGERIDA DOS SLIDES (refine se fizer sentido)
1. Capa — SACF University + frase de efeito.
2. O problema — treinamento e certificação sem controle = risco.
3. A solução — uma plataforma para treinar, certificar e acompanhar.
4. Como funciona — fluxo do aluno (catálogo → curso → aula → conclusão → certificado).
5. O diferencial — certificação verificável + validade e reciclagem.
6. Experiência do produto — catálogo "Udemy corporativo" (mostrar a cara do produto).
7. Multiempresa e permissões — privado, isolado, por papel e grupo.
8. Multilíngue e alcance.
9. Cliente piloto: Zasso — verticais e cursos iniciais.
10. Onde estamos hoje — protótipo navegável + o que falta para produção.
11. Roadmap — do piloto à produção.
12. A grande visão — de LMS corporativo a marketplace de cursos.
13. Próximos passos / pedido (call to action claro para o público definido acima).

Entregue a apresentação completa seguindo o formato de saída definido nos parâmetros.
```

---

## Dicas de uso

- **Para o CEO/Zasso:** mantenha 12–14 slides e foco em valor, risco resolvido e visão.
- **Para investidores:** reduza o slide técnico, reforce mercado, modelo de marketplace e oportunidade.
- **Para gerar slides prontos:** ferramentas como Gamma ou Canva Magic transformam esse
  prompt direto em deck editável. Em ChatGPT/Claude, peça o conteúdo e depois exporte.
- **Capturas reais do produto** deixam o deck muito mais forte — tire prints das telas
  (home, catálogo, página de curso) e peça para inseri-los nos slides 4 e 6.
