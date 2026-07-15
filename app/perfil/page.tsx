"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { LoginRequiredPanel } from "@/components/access-panels";
import { useLocale } from "@/components/locale-provider";
import { useSessionUser } from "@/components/use-session-user";
import { updateProfile } from "@/lib/profile-actions";

export default function ProfilePage() {
  const user = useSessionUser();
  const { update } = useSession();
  const { dict } = useLocale();
  const t = dict.profile;
  const [name, setName] = useState(user?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return <LoginRequiredPanel />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    const result = await updateProfile({
      name
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || t.errorGeneric);
      return;
    }

    await update({ name });
    setSuccess(true);
  }

  return (
    <div className="profilePage">
      <section className="sectionHead profilePageHead">
        <div>
          <p className="eyebrow">{t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
      </section>

      <section className="detailPanel profilePanel">
        <form onSubmit={handleSubmit}>
          <div className="profileFields">
            <label>
              {t.nameLabel}
              <input
                className="field"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            </label>

            <label>
              {t.emailLabel}
              <input className="field" value={user.email} disabled />
              <small>{t.emailHint}</small>
            </label>
          </div>

          <div className="profilePanelFoot">
            {error ? <p className="formError" role="alert">{error}</p> : null}
            {success ? <p className="formSuccess" role="status">{t.saved}</p> : null}
            <button className="button fullButton" type="submit" disabled={submitting}>
              {submitting ? t.saving : t.save}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
