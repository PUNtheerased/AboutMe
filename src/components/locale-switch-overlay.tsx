"use client";

import type { Locale } from "@/lib/i18n/dictionaries";

export const LOCALE_SWITCH_EVENT = "pun:locale-switch";

export type LocaleSwitchDetail = {
  from: Locale;
  to: Locale;
};

/** Optional signal before locale navigation (liquid text listens via locale prop). */
export function requestLocaleSwitch(detail: LocaleSwitchDetail) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<LocaleSwitchDetail>(LOCALE_SWITCH_EVENT, { detail })
  );
}

export function LocaleSwitchOverlay() {
  return null;
}
