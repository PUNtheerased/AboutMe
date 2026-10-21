"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import {
  dictionaries,
  localeStorageKey,
  type Dictionary,
  type Locale,
} from "@/lib/i18n/dictionaries";

type LocaleContextValue = {
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
  ready: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  useEffect(() => {
    window.localStorage.setItem(localeStorageKey, locale);
    document.cookie = `pun-locale=${locale};path=/;max-age=31536000;samesite=lax`;
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    void next;
    // Locale changes are driven by navigation (`/en` ↔ `/th`).
  }, []);

  const value = useMemo(
    () => ({
      locale,
      dict: dictionaries[locale] as Dictionary,
      setLocale,
      ready: true,
    }),
    [locale, setLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}

export function useLocalizedHref() {
  const { locale } = useLocale();
  return useCallback(
    (href: string) => {
      const path = href.startsWith("/") ? href : `/${href}`;
      if (path === "/") return `/${locale}`;
      return `/${locale}${path}`;
    },
    [locale]
  );
}
