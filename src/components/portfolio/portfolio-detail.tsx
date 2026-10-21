"use client";

import Link from "next/link";
import { Glass } from "@/components/glass";
import { Button } from "@/components/ui/button";
import { ScrambleText } from "@/components/ui/scramble-text";
import type { PortfolioItem } from "@/lib/data/portfolio";
import { useLocale, useLocalizedHref } from "@/lib/i18n/provider";

export function PortfolioDetail({ item }: { item: PortfolioItem }) {
  const { dict } = useLocale();
  const href = useLocalizedHref();

  return (
    <div className="mx-auto max-w-[900px] px-5 pt-[130px] pb-[90px]">
      <Button asChild variant="ghost" className="mb-6 px-0">
        <Link href={href("/portfolio")}>
          ← <ScrambleText text={dict.portfolio.back} />
        </Link>
      </Button>

      <div
        className="mb-8 h-[220px] overflow-hidden rounded-[28px] sm:h-[300px]"
        style={{ backgroundImage: item.coverGradient }}
      />

      <p className="mb-2 text-sm font-semibold tracking-wide text-blue">
        {item.year} · {item.role}
      </p>
      <h1 className="mb-4 text-[clamp(2.2rem,6vw,4rem)] font-extrabold tracking-tight">
        {item.title}
      </h1>
      <p className="mb-8 max-w-[52ch] text-lg text-muted">{item.overview}</p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Glass className="rounded-3xl p-6">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted uppercase">
            <ScrambleText text={dict.portfolio.tools} />
          </p>
          <ul className="space-y-1 text-ink">
            {item.tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Glass>
        <Glass className="rounded-3xl p-6">
          <p className="mb-3 text-xs font-semibold tracking-wide text-muted uppercase">
            <ScrambleText text={dict.portfolio.links} />
          </p>
          <div className="flex flex-wrap gap-2">
            {item.github ? (
              <Button asChild size="sm" variant="outline">
                <a href={item.github} target="_blank" rel="noreferrer">
                  <ScrambleText text={dict.portfolio.github} />
                </a>
              </Button>
            ) : null}
            {item.live && item.live !== "#" ? (
              <Button asChild size="sm">
                <a href={item.live} target="_blank" rel="noreferrer">
                  <ScrambleText text={dict.portfolio.live} />
                </a>
              </Button>
            ) : null}
          </div>
        </Glass>
      </div>
    </div>
  );
}
