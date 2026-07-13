export const locales = ["pt", "en", "es", "fr", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pt";
export const localeCookieName = "sacf_locale";

export const localeLabels: Record<Locale, { name: string; short: string }> = {
  pt: { name: "Português", short: "PT" },
  en: { name: "English", short: "EN" },
  es: { name: "Español", short: "ES" },
  fr: { name: "Français", short: "FR" },
  de: { name: "Deutsch", short: "DE" }
};

export const supportedLocales = [
  { code: "pt-BR", label: "Português Brasil" },
  { code: "pt-PT", label: "Português Portugal" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Français" }
] as const;

export type SupportedLocale = (typeof supportedLocales)[number]["code"];

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}
