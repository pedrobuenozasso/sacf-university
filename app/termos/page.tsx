import type { Metadata } from "next";
import Link from "next/link";
import { LegalDocument } from "@/components/legal-document";

export const metadata: Metadata = { title: "Termos de Uso | SACF Academy" };

export default function TermsPage() {
  return (
    <LegalDocument
      active="terms"
      title="Termos de Uso"
      description="Regras aplicáveis ao acesso e à utilização da SACF Academy por empresas, administradores, instrutores, alunos e parceiros autorizados."
    >
      <h2>1. Aceitação e vigência</h2>
      <p>Ao solicitar a implantação, ativar uma conta ou utilizar a SACF Academy (“Academy”, “Plataforma” ou “Serviço”), você declara que leu e concorda com estes Termos de Uso e com a <Link href="/privacidade">Política de Privacidade</Link>. Quem aceita em nome de uma empresa declara possuir autorização para representá-la.</p>
      <p>A versão vigente passa a valer em 24 de julho de 2026. Alterações materiais poderão exigir novo aceite. A data e a versão do documento aplicável poderão ser registradas junto à conta ou à solicitação correspondente.</p>

      <h2>2. Quem somos</h2>
      <p>A Plataforma é operada por <strong>SACF CONSULTORIA LTDA</strong>, sociedade empresária limitada, inscrita no CNPJ sob o nº <strong>20.699.303/0001-51</strong>, com sede na Est Dois, nº 65, Parque Nacional de Viracopos, CEP 13.337-123, Indaiatuba/SP, acessível em <strong>sacf.io</strong>.</p>

      <h2>3. Finalidade da SACF Academy</h2>
      <p>A Academy é uma plataforma de educação corporativa que permite criar e administrar ambientes privados, usuários, grupos, cursos, módulos, aulas, avaliações, progresso, certificados, prazos de validade e relatórios de treinamento.</p>
      <p>Cada organização cliente possui ambiente próprio e define quais pessoas, conteúdos e regras são adequados à sua operação. A SACF pode disponibilizar conteúdos oficiais e administrar a infraestrutura e a governança geral do Serviço.</p>

      <h2>4. Contas, organizações e permissões</h2>
      <ul>
        <li>O acesso é pessoal e não pode ser compartilhado.</li>
        <li>O usuário deve fornecer dados corretos e manter suas credenciais protegidas.</li>
        <li>Administradores da empresa podem convidar pessoas, atribuir papéis e grupos, publicar conteúdos e acompanhar progresso e certificados dentro do próprio ambiente.</li>
        <li>A empresa é responsável por autorizar seus administradores e por manter atualizada a relação de pessoas que podem acessar o ambiente.</li>
        <li>Ações realizadas com uma conta autenticada poderão ser registradas para segurança, auditoria e responsabilização.</li>
      </ul>

      <h2>5. Uso aceitável</h2>
      <p>É proibido usar a Plataforma para praticar atos ilícitos, violar direitos de terceiros, inserir malware, tentar acessar outra organização, explorar falhas, contornar controles de segurança, compartilhar credenciais ou publicar conteúdo sem as autorizações necessárias.</p>
      <p>A SACF poderá bloquear conteúdo ou acesso diante de risco de segurança, violação destes Termos, determinação legal ou solicitação válida do titular dos direitos afetados.</p>

      <h2>6. Conteúdos, arquivos e serviços externos</h2>
      <p>A empresa e seus usuários mantêm os direitos sobre materiais próprios enviados à Academy e concedem à SACF licença limitada para armazená-los, processá-los e exibi-los apenas para operar o Serviço. Quem envia um arquivo, texto, vídeo, imagem ou avaliação declara possuir autorização para utilizá-lo.</p>
      <p>Conteúdos oficiais, marcas, software, interface e materiais produzidos pela SACF permanecem protegidos pela legislação de propriedade intelectual e não podem ser reproduzidos fora das permissões contratadas.</p>
      <p>Aulas podem conter links ou players de terceiros, como YouTube. O uso desses serviços também pode estar sujeito aos termos e políticas do respectivo fornecedor.</p>

      <h2>7. Avaliações e certificados</h2>
      <p>Notas e conclusões são calculadas conforme as regras configuradas no curso. Certificados comprovam a conclusão registrada na Academy, mas não substituem licença, habilitação profissional, diploma ou certificação regulatória, salvo quando isso estiver expressamente indicado e amparado pelo responsável competente.</p>
      <p>A autenticidade de um certificado pode ser verificada por código. A verificação pública exibe apenas nome do titular, curso, organização emissora, datas e situação do certificado.</p>

      <h2>8. Disponibilidade, alterações e suporte</h2>
      <p>A SACF busca manter o Serviço disponível e seguro, mas poderá realizar manutenções, correções e atualizações. Funcionalidades podem evoluir desde que a finalidade principal do produto e os direitos aplicáveis sejam preservados.</p>
      <p>Incidentes ou indisponibilidades serão tratados conforme criticidade, obrigações contratuais e legislação aplicável.</p>

      <h2>9. Suspensão e encerramento</h2>
      <p>A empresa poderá solicitar o encerramento do ambiente conforme o contrato comercial. Contas individuais podem ser bloqueadas pela empresa responsável ou pela SACF quando houver perda de vínculo, solicitação válida, risco de segurança ou violação destes Termos.</p>
      <p>A retenção e a exclusão de dados seguem a Política de Privacidade, obrigações legais, necessidade de preservação de certificados e exercício regular de direitos.</p>

      <h2>10. Responsabilidades</h2>
      <p>Cada organização é responsável pelas decisões de treinamento, conteúdos internos, atribuições, prazos e uso dos relatórios em seu ambiente. A SACF responde pela operação da Plataforma nos limites da legislação e dos contratos aplicáveis.</p>
      <p>Nenhuma disposição destes Termos exclui direitos irrenunciáveis, responsabilidade por dolo ou culpa grave, nem direitos do consumidor quando a relação estiver sujeita ao Código de Defesa do Consumidor.</p>

      <h2>11. Privacidade e proteção de dados</h2>
      <p>O tratamento de dados pessoais é descrito na <Link href="/privacidade">Política de Privacidade</Link> e no <Link href="/lgpd">Portal LGPD</Link>. Solicitações de titulares podem ser encaminhadas a <a href="mailto:privacy@sacf.io">privacy@sacf.io</a>.</p>

      <h2>12. Lei aplicável e foro</h2>
      <p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de <strong>Indaiatuba/SP</strong>, ressalvado o foro do domicílio do usuário quando aplicável a legislação de proteção ao consumidor.</p>
    </LegalDocument>
  );
}
