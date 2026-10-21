"use client";

import { Check, ChevronDown, Globe } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { requestLocaleSwitch } from "@/components/locale-switch-overlay";
import { useLocale } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { markLocaleSwitch } from "@/lib/i18n/locale-switch";
import { stripLocale, withLocale } from "@/lib/i18n/path";
import { cn } from "@/lib/utils";

const LANG_MENU_ID = "pun-lang-menu";

const options: { locale: Locale; label: string; short: string }[] = [
  { locale: "en", label: "English", short: "EN" },
  { locale: "th", label: "ไทย", short: "TH" },
];

export function LanguageToggle({ className }: { className?: string }) {
  const { locale } = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = options.find((o) => o.locale === locale) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const go = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }
    const currentPath =
      pathname ||
      (typeof window !== "undefined" ? window.location.pathname : "/");
    const nextPath = withLocale(nextLocale, stripLocale(currentPath));
    requestLocaleSwitch({ from: locale, to: nextLocale });
    markLocaleSwitch();
    setOpen(false);
    document.cookie = `pun-locale=${nextLocale};path=/;max-age=31536000;samesite=lax`;
    router.push(nextPath, { scroll: false });
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-ink"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={LANG_MENU_ID}
        onClick={() => setOpen((v) => !v)}
      >
        <Globe className="size-4 text-ink/80" aria-hidden />
        <span>{current.short}</span>
        <ChevronDown
          className={cn(
            "size-3.5 text-ink/70 transition-transform duration-200",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={LANG_MENU_ID}
            role="listbox"
            aria-label="Language"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="glass-strong absolute top-[calc(100%+8px)] right-0 z-50 min-w-[148px] rounded-3xl p-2"
          >
            {options.map((option) => {
              const selected = option.locale === locale;
              return (
                <button
                  key={option.locale}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={cn(
                    "flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm",
                    selected ? "font-semibold text-ink" : "text-muted"
                  )}
                  onClick={() => go(option.locale)}
                >
                  <span
                    className={cn(
                      "inline-flex size-5 items-center justify-center rounded-full",
                      selected ? "bg-ink text-bg" : "bg-transparent"
                    )}
                  >
                    {selected ? (
                      <Check className="size-3" strokeWidth={3} />
                    ) : null}
                  </span>
                  {option.label}
                </button>
              );
            })}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
