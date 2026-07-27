export const PASSWORD_MIN_LENGTH = 12;

export function passwordPolicyError(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return "A senha precisa ter pelo menos 12 caracteres.";
  }

  const categories = [/[a-z]/.test(password), /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean).length;
  if (categories < 3) {
    return "Use ao menos três tipos de caracteres: maiúsculas, minúsculas, números e símbolos.";
  }

  return null;
}
