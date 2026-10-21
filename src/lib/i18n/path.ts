import type { Locale } from "@/lib/i18n/dictionaries";

export const locales: Locale[] = ["en", "th"];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return value === "en" || value === "th";
}

/** Prefix a site path with the active locale (`/about` → `/en/about`). */
export function withLocale(locale: Locale, href: string) {
  const path = href.startsWith("/") ? href : `/${href}`;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

/** `/en/about` → `/about`, `/th` → `/` */
export function stripLocale(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] && isLocale(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname || "/";
}
