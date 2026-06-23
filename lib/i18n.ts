export const supportedLocales = [
  { code: "pt-BR", label: "Portugues Brasil" },
  { code: "pt-PT", label: "Portugues Portugal" },
  { code: "en", label: "English" },
  { code: "es", label: "Espanol" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Francais" }
] as const;

export type SupportedLocale = (typeof supportedLocales)[number]["code"];
