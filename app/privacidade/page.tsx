import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = { title: "Política de Privacidade | SACF Academy" };

export default function PrivacyPage() {
  return (
    <LegalDocument
      active="privacy"
      title="Política de Privacidade"
      description="Como a SACF Academy coleta, utiliza, compartilha, protege e conserva dados pessoais no contexto da educação corporativa."
    >
      <h2>1. Responsável e papéis no tratamento</h2>
      <p>A <strong>SACF CONSULTORIA LTDA</strong>, CNPJ <strong>20.699.303/0001-51</strong>, é controladora dos dados necessários para cadastro, autenticação, segurança, suporte, implantação e administração da própria Plataforma.</p>
      <p>Nos ambientes corporativos, a organização cliente normalmente atua como <strong>controladora</strong> dos dados de seus empregados, parceiros e alunos e define finalidades como atribuição de treinamentos e acompanhamento de certificações. Nesses casos, a SACF atua como <strong>operadora</strong>, tratando dados conforme instruções da organização e os contratos aplicáveis.</p>

      <h2>2. Dados tratados</h2>
      <ul>
        <li><strong>Identificação e contato:</strong> nome, e-mail profissional, telefone informado em pedido de implantação, foto de perfil, idioma e vínculo com empresa.</li>
        <li><strong>Dados profissionais e de acesso:</strong> organização, domínio corporativo, função, papel de acesso, departamento, cargo e grupos.</li>
        <li><strong>Autenticação e segurança:</strong> senha protegida por hash, confirmação de e-mail, tokens temporários, sessão, registros de tentativa e endereço IP transformado em identificador criptográfico para limitação de requisições.</li>
        <li><strong>Aprendizagem e certificação:</strong> cursos atribuídos, aulas acessadas e concluídas, progresso, respostas e notas de avaliações, tentativas, prazos, certificados, validade, renovação e revogação.</li>
        <li><strong>Conteúdo e administração:</strong> cursos, módulos, aulas, textos, vídeos, anexos, imagens, configurações da empresa e histórico de ações administrativas.</li>
        <li><strong>Atendimento e implantação:</strong> empresa, porte aproximado, mensagem, solicitações e comunicações operacionais.</li>
      </ul>
      <p>A Academy não solicita CPF, dados bancários nem dados de redes sociais para os fluxos atualmente disponíveis.</p>

      <h2>3. Origem dos dados</h2>
      <p>Os dados podem ser fornecidos pelo próprio titular, pela empresa que o convida ou administra seu acesso, gerados durante o uso da Plataforma ou recebidos de fornecedores técnicos necessários à autenticação, hospedagem e comunicação.</p>

      <h2>4. Finalidades e bases legais</h2>
      <ul>
        <li>criar e autenticar contas, administrar permissões e oferecer a Plataforma;</li>
        <li>disponibilizar cursos, registrar progresso, calcular resultados e emitir certificados;</li>
        <li>enviar convites, recuperação de senha, avisos de prazo e comunicações operacionais;</li>
        <li>proteger contas, prevenir abuso, investigar incidentes e manter auditoria;</li>
        <li>atender solicitações, cumprir obrigações legais e exercer direitos em processos.</li>
      </ul>
      <p>Conforme a finalidade, o tratamento se apoia na execução de contrato ou procedimentos preliminares, cumprimento de obrigação legal ou regulatória, exercício regular de direitos, legítimo interesse com avaliação de necessidade e impacto, proteção contra fraude e, quando exigido, consentimento.</p>

      <h2>5. Compartilhamento e acesso</h2>
      <p>Dados podem ser acessados pela organização cliente e seus administradores autorizados dentro do respectivo ambiente. A SACF também utiliza provedores de infraestrutura, banco de dados, armazenamento de arquivos, autenticação e e-mail transacional, limitados ao necessário para prestar o Serviço.</p>
      <p>Quando uma aula utiliza vídeo externo, como YouTube, o fornecedor poderá receber dados técnicos da conexão conforme sua própria política. Também poderemos compartilhar informações quando exigido por lei, ordem judicial ou autoridade competente. <strong>A SACF não vende dados pessoais.</strong></p>

      <h2>6. Transferências internacionais</h2>
      <p>Parte dos provedores de tecnologia e da infraestrutura pode processar ou armazenar dados fora do Brasil. A SACF adota mecanismos e salvaguardas previstos na LGPD e na regulamentação da ANPD, incluindo medidas contratuais e de segurança adequadas ao tratamento.</p>
      <p>Informações atualizadas sobre categorias de fornecedores e países envolvidos podem ser solicitadas a <a href="mailto:privacy@sacf.io">privacy@sacf.io</a>.</p>

      <h2>7. Retenção e exclusão</h2>
      <p>Os dados são mantidos enquanto a conta ou o contrato estiver ativo e pelo período necessário para cumprir as finalidades descritas. Após o encerramento, podem permanecer pelo prazo exigido por lei, contrato, auditoria, prevenção de fraude, exercício regular de direitos ou preservação da autenticidade de certificados.</p>
      <p>Dados em backups são eliminados conforme o ciclo seguro de sobrescrita. Durante esse período permanecem protegidos e não são usados operacionalmente, salvo necessidade de restauração para segurança e continuidade.</p>
      <p>Quando a SACF atuar como operadora, solicitações de exclusão ou alteração de dados corporativos poderão ser direcionadas à organização controladora para validação.</p>

      <h2>8. Verificação pública de certificados</h2>
      <p>Para permitir a validação de uma credencial, quem possuir o código do certificado poderá consultar nome do titular, título do curso, organização emissora, data de emissão, validade e situação. E-mail, respostas de prova e histórico detalhado não são exibidos publicamente.</p>

      <h2>9. Direitos do titular</h2>
      <p>Nos termos da LGPD, o titular pode solicitar confirmação e acesso, correção, informação sobre compartilhamentos, anonimização, bloqueio ou eliminação quando cabível, portabilidade conforme regulamentação, oposição, revisão de decisões automatizadas e revogação do consentimento.</p>
      <p>Para exercer direitos, envie uma mensagem a <a href="mailto:privacy@sacf.io">privacy@sacf.io</a>. Poderemos solicitar informações para confirmar a identidade e proteger os dados contra pedidos indevidos.</p>

      <h2>10. Cookies e armazenamento local</h2>
      <p>A Academy utiliza cookies estritamente necessários para autenticação, segurança e preferência de idioma. Eles não são usados para publicidade. Atualmente não utilizamos cookies de analytics ou marketing na Academy.</p>
      <p>Cookies essenciais não podem ser desativados sem comprometer login, segurança e funcionamento da Plataforma.</p>

      <h2>11. Segurança</h2>
      <p>Adotamos controles de acesso por organização e papel, senhas com hash, conexões criptografadas por TLS, validação de arquivos, limitação de tentativas, registros de auditoria e medidas de segurança de infraestrutura. Nenhum sistema é totalmente imune; incidentes relevantes serão avaliados e comunicados conforme a legislação.</p>

      <h2>12. Crianças e adolescentes</h2>
      <p>A Academy é destinada prioritariamente a treinamento profissional e corporativo. Caso uma organização necessite cadastrar adolescente, deverá observar o melhor interesse, a legislação aplicável e as autorizações necessárias, comunicando previamente a SACF quando o tratamento exigir medidas específicas.</p>

      <h2>13. Alterações e contato</h2>
      <p>Alterações serão publicadas nesta página com nova data de vigência. Mudanças materiais poderão ser comunicadas no acesso à Plataforma. Dúvidas ou solicitações: <a href="mailto:privacy@sacf.io">privacy@sacf.io</a>.</p>
    </LegalDocument>
  );
}
