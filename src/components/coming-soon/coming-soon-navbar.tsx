"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Glass } from "@/components/glass";
import { LanguageToggle } from "@/components/language-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { ScrambleText } from "@/components/ui/scramble-text";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const MENU_PANEL_ID = "pun-coming-soon-menu";
const EASE = [0.22, 1, 0.36, 1] as const;

const TOGGLE_BTN_CLASS =
  "glass-strong inline-flex h-[clamp(2.125rem,9.75vw,2.75rem)] w-[clamp(4.5rem,21.75vw,6rem)] shrink-0 items-center justify-center rounded-full px-0 text-[clamp(0.75rem,3.25vw,0.875rem)] font-semibold whitespace-nowrap text-ink";

export function ComingSoonNavbar() {
  const { dict, locale } = useLocale();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState({ x: "calc(100% - 50px)", y: "40px" });
  const menuSlotRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const updateOrigin = () => {
    const slot = menuSlotRef.current;
    if (!slot) return;
    const rect = slot.getBoundingClientRect();
    setOrigin({
      x: `${rect.left + rect.width / 2}px`,
      y: `${rect.top + rect.height / 2}px`,
    });
  };

  useLayoutEffect(() => {
    updateOrigin();
  }, []);

  useEffect(() => {
    const onResize = () => updateOrigin();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [open]);

  const openMenu = () => {
    updateOrigin();
    setOpen(true);
  };

  const closeMenu = () => setOpen(false);

  const layoutTransition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 380, damping: 32, mass: 0.8 };

  return (
    <>
      <Glass
        as="header"
        className="navbar-glass fixed top-[calc(0.75rem+env(safe-area-inset-top,0px))] left-1/2 z-30 flex w-auto max-w-[calc(100%-12.5%)] -translate-x-1/2 items-center gap-x-[max(2.75rem,min(14vw,5rem))] rounded-full p-[0.35rem] sm:max-w-[min(26.25rem,calc(100%-6%))] sm:p-1.5"
      >
        <span
          className="shrink-0 rounded-full px-2.5 py-1.5 text-[clamp(1.1rem,4.2vw,1.35rem)] font-extrabold tracking-tight"
          aria-label="PUNtheerased"
        >
          P.
        </span>

        <div className="flex shrink-0 items-center gap-0.5">
          <ThemeToggle className="size-9! sm:size-10!" />
          <LanguageToggle className="max-[380px]:[&_span]:hidden [&_button]:h-9 [&_button]:gap-1 [&_button]:px-2 sm:[&_button]:h-10" />
          <div
            ref={menuSlotRef}
            className="relative flex h-[clamp(2.125rem,9.75vw,2.75rem)] items-center"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {!open ? (
                <motion.button
                  key="menu"
                  layoutId="coming-soon-nav-toggle"
                  type="button"
                  initial={false}
                  transition={layoutTransition}
                  className={TOGGLE_BTN_CLASS}
                  aria-expanded={false}
                  aria-controls={MENU_PANEL_ID}
                  onClick={openMenu}
                >
                  <ScrambleText text={dict.nav.menu} />
                </motion.button>
              ) : (
                <span
                  key="menu-spacer"
                  className={cn(TOGGLE_BTN_CLASS, "invisible")}
                  aria-hidden
                >
                  {dict.nav.menu}
                </span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Glass>

      <AnimatePresence>
        {open ? (
          <motion.button
            key="close"
            ref={closeButtonRef}
            layoutId="coming-soon-nav-toggle"
            type="button"
            initial={false}
            transition={layoutTransition}
            className={cn(
              TOGGLE_BTN_CLASS,
              "fixed top-[calc(0.75rem+env(safe-area-inset-top,0px))] right-[6.25%] z-50 sm:right-5"
            )}
            aria-expanded={true}
            aria-controls={MENU_PANEL_ID}
            onClick={closeMenu}
          >
            <ScrambleText text={dict.nav.close} />
          </motion.button>
        ) : null}
      </AnimatePresence>

      <div
        id={MENU_PANEL_ID}
        role="dialog"
        aria-modal="true"
        aria-label={dict.comingSoon.menuTitle}
        className={cn(
          "fixed inset-0 z-40 flex flex-col items-center justify-center gap-4 bg-bg text-ink transition-[clip-path] duration-500 ease-[cubic-bezier(.7,0,.2,1)]",
          open ? "visible" : "invisible pointer-events-none"
        )}
        style={{
          clipPath: open
            ? `circle(150% at ${origin.x} ${origin.y})`
            : `circle(0 at ${origin.x} ${origin.y})`,
          transitionDuration: open ? undefined : "0ms",
        }}
      >
        <motion.p
          initial={reduce || !open ? false : { opacity: 0, y: 28 }}
          animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.42, delay: open ? 0.12 : 0, ease: EASE }
          }
          className={cn(
            "text-[clamp(2.4rem,10vw,6rem)] tracking-tight",
            locale === "th"
              ? "font-[family-name:var(--font-noto-thai)] font-bold"
              : "font-[family-name:var(--font-archivo)]"
          )}
        >
          <ScrambleText text={dict.comingSoon.menuTitle} />
        </motion.p>
        <motion.p
          initial={reduce || !open ? false : { opacity: 0, y: 16 }}
          animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.4, delay: open ? 0.22 : 0, ease: EASE }
          }
          className="max-w-[28ch] px-6 text-center text-base text-muted sm:text-lg"
        >
          {dict.comingSoon.menuBody}
        </motion.p>
        <motion.p
          initial={reduce || !open ? false : { opacity: 0 }}
          animate={open ? { opacity: 1 } : { opacity: 0 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.35, delay: open ? 0.32 : 0, ease: EASE }
          }
          className="mt-2 font-[family-name:var(--font-jetbrains)] text-sm tracking-wide text-muted"
        >
          {dict.comingSoon.menuCredit}
        </motion.p>
      </div>
    </>
  );
}
