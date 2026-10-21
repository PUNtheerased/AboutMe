"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { stripLocale } from "@/lib/i18n/path";
import { cn } from "@/lib/utils";

const MIN_VISIBLE_MS = 280;
const MAX_HOLD_MS = 750;
const EASE = [0.22, 1, 0.36, 1] as const;

export function BrandLoadingMark({
  className,
  animated = false,
}: {
  className?: string;
  animated?: boolean;
}) {
  if (!animated) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-3 text-center",
          className
        )}
        aria-hidden
      >
        <span className="text-5xl font-extrabold tracking-tight text-ink sm:text-6xl">
          P.
        </span>
        <span className="text-[0.7rem] font-semibold tracking-[0.28em] text-blue uppercase">
          CODE × CAPTURE
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 text-center",
        className
      )}
      aria-hidden
    >
      <motion.span
        className="text-5xl font-extrabold tracking-tight text-ink sm:text-6xl"
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.22, ease: EASE }}
      >
        P.
      </motion.span>
      <div className="relative overflow-hidden">
        <motion.span
          className="block text-[0.7rem] font-semibold tracking-[0.28em] text-blue uppercase"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, delay: 0.12, ease: EASE }}
        >
          CODE × CAPTURE
        </motion.span>
        <motion.span
          className="absolute inset-x-0 bottom-0 h-px origin-center bg-blue/70"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.32, delay: 0.18, ease: EASE }}
        />
      </div>
    </div>
  );
}

function isInternalNavLink(anchor: HTMLAnchorElement, pathname: string) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
    return false;
  }
  if (href.startsWith("http://") || href.startsWith("https://")) {
    try {
      const url = new URL(href);
      if (url.origin !== window.location.origin) return false;
      if (url.pathname === pathname && url.search === window.location.search) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
  if (href.startsWith("/")) {
    const path = href.split("?")[0]?.split("#")[0] ?? href;
    // Locale-only swaps use scramble decode — skip the full-page loader
  }
  return false;
}

export function RouteLoadingOverlay() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const shownAt = useRef(0);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (maxTimer.current) clearTimeout(maxTimer.current);
    hideTimer.current = null;
    maxTimer.current = null;
  };

  const show = useCallback(() => {
    if (reduce) return;
    clearTimers();
    shownAt.current = Date.now();
    setVisible(true);
    maxTimer.current = setTimeout(() => {
      setVisible(false);
    }, MAX_HOLD_MS + MIN_VISIBLE_MS);
  }, [reduce]);

  const hide = useCallback(() => {
    if (reduce) {
      setVisible(false);
      return;
    }
    const elapsed = Date.now() - shownAt.current;
    const wait = Math.max(MIN_VISIBLE_MS - elapsed, 0);
    clearTimers();
    hideTimer.current = setTimeout(() => {
      setVisible(false);
    }, wait);
  }, [reduce]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNavLink(anchor, pathname)) return;
      show();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [pathname, show]);

  useEffect(() => {
    hide();
    return clearTimers;
  }, [pathname, hide]);

  if (reduce) return null;

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="route-loading"
          role="status"
          aria-live="polite"
          aria-label="Loading"
          className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-12%" }}
          transition={{ duration: 0.28, ease: EASE }}
        >
          <motion.div
            className="glass absolute inset-0 rounded-none border-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
          />
          <motion.div
            className="relative z-10"
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <BrandLoadingMark animated />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
