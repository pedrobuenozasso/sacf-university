export const supportedLocales = [
  { code: "pt-BR", label: "Português Brasil" },
  { code: "pt-PT", label: "Português Portugal" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" }
] as const;

export type SupportedLocale = (typeof supportedLocales)[number]["code"];
