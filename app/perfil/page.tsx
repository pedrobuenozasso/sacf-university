"use client";

import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { LoginRequiredPanel } from "@/components/access-panels";
import { useLocale } from "@/components/locale-provider";
import { useSessionUser } from "@/components/use-session-user";
import { updateProfile } from "@/lib/profile-actions";

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const AVATAR_SIZE = 256;

function resizeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("decode-failed"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("canvas-failed"));
          return;
        }
        const scale = Math.max(AVATAR_SIZE / img.width, AVATAR_SIZE / img.height);
        const width = img.width * scale;
        const height = img.height * scale;
        ctx.drawImage(img, (AVATAR_SIZE - width) / 2, (AVATAR_SIZE - height) / 2, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const user = useSessionUser();
  const { update } = useSession();
  const { dict } = useLocale();
  const t = dict.profile;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name ?? "");
  const [avatarPreview, setAvatarPreview] = useState<string | null | undefined>(user?.avatarUrl);
  const [pendingAvatar, setPendingAvatar] = useState<string | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!user) {
    return <LoginRequiredPanel />;
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setError(null);
    setSuccess(false);

    if (!file.type.startsWith("image/")) {
      setError(t.errorFileType);
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setError(t.errorFileSize);
      return;
    }

    try {
      const dataUrl = await resizeImage(file);
      setAvatarPreview(dataUrl);
      setPendingAvatar(dataUrl);
    } catch {
      setError(t.errorFileType);
    }
  }

  function handleRemovePhoto() {
    setAvatarPreview(null);
    setPendingAvatar(null);
    setError(null);
    setSuccess(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    const result = await updateProfile({
      name,
      avatarUrl: pendingAvatar
    });

    setSubmitting(false);

    if (!result.ok) {
      setError(result.error || t.errorGeneric);
      return;
    }

    await update({ name, avatarUrl: pendingAvatar ?? avatarPreview ?? null });
    setPendingAvatar(undefined);
    setSuccess(true);
  }

  const initial = (name || user.name).slice(0, 1).toUpperCase();

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
          <div className="profileAvatarRow">
            <div className="profileAvatarPreview" aria-hidden="true">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="" />
              ) : (
                <span>{initial}</span>
              )}
            </div>
            <div className="profileAvatarActions">
              <p className="formHint">{t.photoLabel}</p>
              <div className="actions noTopMargin">
                <button type="button" className="buttonGhost" onClick={() => fileInputRef.current?.click()}>
                  {t.changePhoto}
                </button>
                {avatarPreview ? (
                  <button type="button" className="buttonGhost" onClick={handleRemovePhoto}>
                    {t.removePhoto}
                  </button>
                ) : null}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleFileChange}
                hidden
              />
            </div>
          </div>

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
            {error ? <p className="formError">{error}</p> : null}
            {success ? <p className="formSuccess">{t.saved}</p> : null}
            <button className="button fullButton" type="submit" disabled={submitting}>
              {submitting ? t.saving : t.save}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
