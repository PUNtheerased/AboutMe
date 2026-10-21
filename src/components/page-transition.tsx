"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { stripLocale } from "@/lib/i18n/path";

/**
 * Soft enter on real route changes.
 * Locale-only swaps keep the same key so ScrambleText can decode in place.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const pageKey = stripLocale(pathname);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <motion.div
      key={pageKey}
      initial={ready && !reduce ? { opacity: 0.92 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
