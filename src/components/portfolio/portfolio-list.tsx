"use client";

import Link from "next/link";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Glass } from "@/components/glass";
import type { PortfolioItem } from "@/lib/data/portfolio";
import { ScrambleText } from "@/components/ui/scramble-text";
import { useLocale, useLocalizedHref } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789···";

function useScramble(text: string, active: boolean, reduce: boolean | null) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (reduce || !active) {
      setDisplay(text);
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      frame.current += 1;
      setDisplay(
        text
          .split("")
          .map((ch, idx) => {
            if (ch === " ") return " ";
            if (idx < i) return text[idx];
            return SCRAMBLE[Math.floor(Math.random() * SCRAMBLE.length)];
          })
          .join("")
      );
      if (frame.current % 2 === 0) i += 1;
      if (i > text.length) {
        window.clearInterval(id);
        setDisplay(text);
      }
    }, 28);
    return () => window.clearInterval(id);
  }, [active, reduce, text]);

  return display;
}

function PortfolioRow({ item }: { item: PortfolioItem }) {
  const reduce = useReducedMotion();
  const href = useLocalizedHref();
  const [hover, setHover] = useState(false);
  const title = useScramble(item.title, hover, reduce);

  return (
    <Link
      href={href(`/portfolio/${item.slug}`)}
      className="group block"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
    >
      <Glass
        className={cn(
          "relative overflow-hidden rounded-3xl p-5 transition duration-300 sm:p-6",
          "hover:-translate-y-1"
        )}
      >
        <div
          className="pointer-events-none absolute inset-y-0 right-0 w-[42%] opacity-40 transition duration-500 group-hover:opacity-70"
          style={{ backgroundImage: item.coverGradient }}
          aria-hidden
        />
        <div className="relative grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="mb-1 text-xs font-semibold tracking-wide text-blue">
              {item.year} · {item.role}
            </p>
            <h2 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] leading-none tracking-tight uppercase">
              {title}
            </h2>
            <p className="mt-2 max-w-[48ch] text-sm text-muted sm:text-base">
              {item.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {item.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-edge px-2.5 py-1 text-[0.7rem] font-medium text-muted"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
          <span className="text-sm font-semibold text-ink/70 transition group-hover:translate-x-1 group-hover:text-ink">
            →
          </span>
        </div>
      </Glass>
    </Link>
  );
}

export function PortfolioList({ items }: { items: PortfolioItem[] }) {
  const { dict } = useLocale();

  return (
    <div className="mx-auto max-w-[960px] px-5 pt-[130px] pb-[90px]">
      <h1 className="mb-2 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold tracking-tight">
        <ScrambleText text={dict.portfolio.title} />
      </h1>
      <p className="mb-10 max-w-[46ch] text-muted">
        <ScrambleText text={dict.portfolio.subtitle} />
      </p>
      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <PortfolioRow key={item.slug} item={item} />
        ))}
      </div>
    </div>
  );
}
