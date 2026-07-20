"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/components/locale-provider";
import { setLocale } from "@/lib/i18n/actions";
import { locales, localeLabels } from "@/lib/i18n/locales";

export function LanguageSwitcher({ variant = "light" }: { variant?: "light" | "dark" | "links" }) {
  const { locale, dict } = useLocale();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const containerRef = useRef<HTMLDivElement>(null);

  function selectLocale(next: string) {
    setOpen(false);
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  }

  if (variant === "links") {
    return (
      <nav className="languageLinks" aria-label={dict.languageSwitcher.label}>
        {locales.map((code) => (
          <button
            type="button"
            key={code}
            data-active={code === locale}
            aria-current={code === locale ? "true" : undefined}
            disabled={isPending}
            onClick={() => selectLocale(code)}
          >
            {localeLabels[code].name}
          </button>
        ))}
      </nav>
    );
  }

  return (
    <div
      className="languageSwitcher"
      data-variant={variant}
      ref={containerRef}
      onBlur={(event) => {
        if (!containerRef.current?.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <button
        type="button"
        className="languageSwitcherButton"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={dict.languageSwitcher.label}
        disabled={isPending}
      >
        <svg
          className="languageSwitcherIcon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9s1.3-6.4 3.8-9Z" />
        </svg>
      </button>
      {open ? (
        <ul className="languageSwitcherMenu" role="listbox">
          {locales.map((code) => (
            <li key={code}>
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                data-active={code === locale}
                onClick={() => selectLocale(code)}
              >
                <span className="languageSwitcherCode">{localeLabels[code].short}</span>
                <span className="languageSwitcherName">{localeLabels[code].name}</span>
                <svg
                  className="languageSwitcherCheck"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M4 10.5 8 14l8-9" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
