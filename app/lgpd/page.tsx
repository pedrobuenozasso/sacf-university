import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = { title: "Portal LGPD | SACF Academy" };

export default function LgpdPage() {
  return (
    <LegalDocument
      active="lgpd"
      title="Portal LGPD"
      description="Resumo transparente dos papéis, direitos e canais relacionados ao tratamento de dados pessoais na SACF Academy."
    >
      <h2>Quem controla meus dados?</h2>
      <p>Para cadastro, autenticação, segurança, suporte e operação geral, a controladora é a <strong>SACF CONSULTORIA LTDA</strong>, CNPJ 20.699.303/0001-51. Para treinamentos definidos pela sua empresa, ela normalmente é a controladora e a SACF atua como operadora.</p>

      <h2>Quais dados de aprendizagem ficam registrados?</h2>
      <p>Vínculo com empresa e grupos, cursos atribuídos, progresso, aulas concluídas, tentativas e respostas de avaliações, notas, prazos e certificados. Esses registros permitem comprovar treinamento e acompanhar reciclagens.</p>

      <h2>Quem consegue visualizar?</h2>
      <p>Você, administradores autorizados da sua organização e a equipe SACF estritamente quando necessário para suporte, segurança e operação. Cada empresa possui ambiente isolado. A verificação pública de certificado exige o respectivo código e mostra apenas os dados mínimos descritos na Política de Privacidade.</p>

      <h2>Quais são meus direitos?</h2>
      <div className="legalRightsGrid">
        <div><strong>Confirmar e acessar</strong><span>Saber se tratamos dados e obter acesso.</span></div>
        <div><strong>Corrigir</strong><span>Atualizar informações incompletas ou incorretas.</span></div>
        <div><strong>Entender</strong><span>Conhecer finalidades e compartilhamentos.</span></div>
        <div><strong>Eliminar ou bloquear</strong><span>Solicitar quando houver fundamento legal.</span></div>
        <div><strong>Opor-se</strong><span>Questionar tratamentos incompatíveis com a lei.</span></div>
        <div><strong>Revogar consentimento</strong><span>Quando essa for a base aplicável.</span></div>
      </div>

      <h2>Como fazer uma solicitação?</h2>
      <ol>
        <li>Envie o pedido para <a href="mailto:privacy@sacf.io">privacy@sacf.io</a> usando, de preferência, o e-mail cadastrado.</li>
        <li>Descreva o direito que deseja exercer e os dados ou conta envolvidos.</li>
        <li>Poderemos solicitar confirmação de identidade. Quando a empresa for controladora, encaminharemos ou coordenaremos o atendimento com ela.</li>
        <li>Você receberá retorno dentro dos prazos aplicáveis à solicitação e à legislação.</li>
      </ol>

      <h2>Decisões automatizadas</h2>
      <p>A nota de avaliações e a emissão de certificados podem ser calculadas automaticamente conforme respostas e regras objetivas configuradas no curso. O usuário pode procurar o administrador da empresa ou o canal de privacidade para pedir esclarecimentos ou revisão quando cabível.</p>

      <h2>Canal de privacidade</h2>
      <p><a href="mailto:privacy@sacf.io">privacy@sacf.io</a> recebe solicitações de titulares, dúvidas sobre compartilhamento, retenção, segurança e esta Política. O titular também pode procurar a Autoridade Nacional de Proteção de Dados após tentar exercer o direito perante o controlador.</p>
    </LegalDocument>
  );
}
