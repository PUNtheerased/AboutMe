"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { restoreLocaleScroll } from "@/lib/i18n/locale-switch";

/** Restores scroll after EN ↔ TH navigation on the same page. */
export function LocaleScrollRestore() {
  const pathname = usePathname();

  useEffect(() => {
    restoreLocaleScroll();
  }, [pathname]);

  return null;
}
