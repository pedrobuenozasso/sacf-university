import { VerifyPasswordForm } from "@/components/verify-password-form";

export default async function VerifyPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string; email?: string }>;
}) {
  const { token = "", email = "" } = await searchParams;

  return (
    <section className="loginShell">
      <div className="loginHero">
        <div>
          <p className="eyebrow">SACF Academy</p>
          <h1>Crie sua senha.</h1>
          <p className="lead">
            Email confirmado. Defina uma senha para acessar a plataforma nas próximas vezes.
          </p>
        </div>

        <div className="loginForm">
          <div className="formStatus">
            <span className="statusDot" />
            <div>
              <strong>Confirmação de email</strong>
              <small>Última etapa do cadastro</small>
            </div>
          </div>
          <h2>Definir senha</h2>
          <VerifyPasswordForm token={token} email={email} />
        </div>
      </div>
    </section>
  );
}
