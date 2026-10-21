"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { shouldLocaleScramble } from "@/lib/i18n/locale-switch";
import { cn } from "@/lib/utils";

type ScrambleTextProps = {
  text: string;
  className?: string;
  speed?: number;
  as?: "span" | "p";
  "aria-label"?: string;
};

const CIPHER_CHARS = "!<>-_\\/[]{}—=+*^?#_0123456789ABCDEF";
const TOTAL_MS = 400;

function graphemesOf(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    try {
      const segmenter = new Intl.Segmenter(undefined, {
        granularity: "grapheme",
      });
      return Array.from(segmenter.segment(text), (part) => part.segment);
    } catch {
      /* fall through */
    }
  }
  return Array.from(text);
}

export function ScrambleText({
  text,
  className = "",
  speed = 28,
  as: Tag = "span",
  "aria-label": ariaLabel,
}: ScrambleTextProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);
  const targetRef = useRef<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const reduce = Boolean(reduceMotion);
    if (reduce) {
      targetRef.current = text;
      setDisplayText(text);
      setIsScrambling(false);
      return;
    }

    const isFirstPaint = targetRef.current === null;
    if (isFirstPaint) {
      targetRef.current = text;
      if (!shouldLocaleScramble()) {
        setDisplayText(text);
        setIsScrambling(false);
        return;
      }
    } else if (targetRef.current === text) {
      return;
    }

    targetRef.current = text;
    const units = graphemesOf(text);
    setIsScrambling(true);
    setDisplayText(
      units
        .map((unit) =>
          unit === " " || unit === "\n"
            ? unit
            : CIPHER_CHARS[Math.floor(Math.random() * CIPHER_CHARS.length)]!
        )
        .join("")
    );

    if (timerRef.current) clearInterval(timerRef.current);

    const ticks = Math.max(Math.ceil(TOTAL_MS / speed), 1);
    const step = Math.max(units.length, 1) / ticks;
    let iteration = 0;

    timerRef.current = setInterval(() => {
      const resolved = Math.min(Math.floor(iteration), units.length);
      setDisplayText(
        units
          .map((unit, index) => {
            if (index < resolved) return unit;
            if (unit === " " || unit === "\n") return unit;
            return CIPHER_CHARS[
              Math.floor(Math.random() * CIPHER_CHARS.length)
            ]!;
          })
          .join("")
      );

      iteration += step;

      if (iteration >= units.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [text, speed, reduceMotion, mounted]);

  return (
    <Tag
      className={cn(isScrambling && "opacity-90", className)}
      aria-label={ariaLabel ?? text}
    >
      {displayText}
    </Tag>
  );
}
