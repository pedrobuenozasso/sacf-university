"use client";

import { useActionState } from "react";
import { useLocale, interpolate } from "@/components/locale-provider";
import { inviteUser, type InviteUserResult } from "@/app/admin/usuarios/actions";

const initialState: InviteUserResult | null = null;

export function InviteUserForm({
  organizations,
  showOrgSelect
}: {
  organizations: { slug: string; name: string }[];
  showOrgSelect: boolean;
}) {
  const { dict } = useLocale();
  const t = dict.admin.usuarios;
  const [state, formAction, pending] = useActionState(inviteUser, initialState);

  const errorMessage =
    state && !state.ok
      ? state.errorCode === "seat_limit"
        ? interpolate(t.errorSeatLimit, { count: state.seatLimit ?? 0 })
        : {
            forbidden: t.errorForbidden,
            missing_name: t.errorMissingName,
            invalid_email: t.errorInvalidEmail,
            missing_role: t.errorMissingRole,
            missing_org: t.errorMissingOrg,
            org_not_found: t.errorOrgNotFound,
            already_member: t.errorAlreadyMember
          }[state.errorCode]
      : null;

  return (
    <form className="stackForm" action={formAction} key={state?.ok ? "sent" : "form"}>
      <label>{t.nameLabel}<input className="field" name="name" placeholder={t.namePlaceholder} required /></label>
      <label>{t.emailLabel}<input className="field" name="email" type="email" placeholder={t.emailPlaceholder} required /></label>
      {showOrgSelect ? (
        <label>{t.companyLabel}<select className="field" name="organizationSlug" defaultValue="" required>
          <option value="" disabled>
            {t.companySelect}
          </option>
          {organizations.map((org) => (
            <option key={org.slug} value={org.slug}>
              {org.name}
            </option>
          ))}
        </select></label>
      ) : null}
      <label>{t.accessProfile}<select className="field" name="role" defaultValue="" required>
        <option value="" disabled>
          {t.roleSelect}
        </option>
        <option value="admin">{t.companyAdmin}</option>
        <option value="trainer">{t.trainer}</option>
        <option value="student">{t.student}</option>
        <option value="partner">{t.externalPartner}</option>
      </select></label>
      {errorMessage ? <p className="formError">{errorMessage}</p> : null}
      {state?.ok ? <p className="formSuccess">{t.inviteSuccess}</p> : null}
      <button className="button" type="submit" disabled={pending}>
        {pending ? t.sending : t.sendInvite}
      </button>
      <p className="formHint">{t.hint}</p>
    </form>
  );
}
