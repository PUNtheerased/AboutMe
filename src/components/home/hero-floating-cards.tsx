"use client";

import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { GreetingRotate } from "@/components/home/greeting-rotate";
import { Glass } from "@/components/glass";
import { Button } from "@/components/ui/button";
import { ScrambleText } from "@/components/ui/scramble-text";
import { useLocale, useLocalizedHref } from "@/lib/i18n/provider";
import type { SamplePhoto } from "@/lib/data/sample-photos";

function FeaturedProfileCard({
  coverUrl,
  coverGradient,
}: {
  coverUrl?: string;
  coverGradient?: string;
}) {
  const { dict } = useLocale();
  const href = useLocalizedHref();

  return (
    <div className="glass-strong flex h-full min-h-0 w-full flex-col overflow-hidden rounded-[20px] sm:rounded-[24px] md:rounded-[28px]">
      <p className="shrink-0 px-5 pt-5 text-left text-[0.7rem] font-medium tracking-wide text-muted sm:px-7 sm:pt-6 sm:text-xs md:px-8">
        <ScrambleText
          text={`${dict.home.featuredLabel} · ${dict.about.legalName}`}
        />
      </p>
      <div className="grid min-h-0 flex-1 gap-5 p-5 pt-3 sm:gap-6 sm:p-7 sm:pt-4 md:grid-cols-[1fr_1.15fr] md:gap-8 md:p-8 md:pt-4">
        <div className="flex min-h-0 flex-col text-left">
          <div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
            <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-pink to-blue text-xl font-extrabold text-white shadow-[0_8px_24px_rgba(91,124,255,0.35)] sm:size-[4.5rem] sm:text-2xl">
              P
              <span className="absolute right-0.5 bottom-0.5 size-3 rounded-full border-2 border-bg bg-emerald-400 sm:size-3.5" />
            </span>
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight sm:text-3xl md:text-[2.1rem]">
                Pun
              </h3>
              <p className="text-sm text-muted">@pun · Bangkok</p>
            </div>
          </div>
          <p className="mb-5 max-w-[42ch] text-base leading-relaxed text-muted sm:mb-6 sm:text-lg">
            <ScrambleText text={dict.home.featuredBio} />
          </p>
          <div className="mb-5 grid grid-cols-3 gap-2 sm:mb-6 sm:gap-3">
            {[
              { value: "3+", label: dict.home.featuredStatProjects },
              { value: "12+", label: dict.home.featuredStatPhotos },
              { value: "CODE×CAP", label: dict.home.featuredStatFocus },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass rounded-xl px-2 py-2.5 text-center sm:rounded-2xl sm:px-3 sm:py-3.5"
              >
                <p className="text-base font-extrabold tracking-tight sm:text-lg md:text-xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[0.65rem] text-muted sm:text-xs">
                  <ScrambleText text={stat.label} />
                </p>
              </div>
            ))}
          </div>
          <div className="mt-auto flex flex-wrap gap-2.5 pb-1">
            <Button asChild>
              <Link href={href("/about")}>
                <ScrambleText text={dict.home.aboutMe} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={href("/gallery")}>
                <ScrambleText text={dict.home.viewGallery} />
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative min-h-[200px] flex-1 overflow-hidden rounded-[18px] sm:min-h-[280px] sm:rounded-[22px] md:min-h-0">
          {coverUrl ? (
            <Image
              src={coverUrl}
              alt=""
              fill
              sizes="(max-width:768px) 100vw, 55vw"
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  coverGradient ??
                  "linear-gradient(135deg,#FF8FB1,#5B7CFF 55%,#7C5CFF)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/55 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 text-sm font-bold tracking-[0.18em] text-white sm:bottom-5 sm:left-5 sm:text-base">
            <ScrambleText text={dict.home.codeIdentity} />
          </p>
        </div>
      </div>
    </div>
  );
}

export function HeroFloatingCards({ featured }: { featured: SamplePhoto[] }) {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const zeroProgress = useMotionValue(0);
  const cover = featured[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const activeProgress = reduce ? zeroProgress : scrollYProgress;

  // Long blur on chapter 1, then dwell, then chapter 2
  const centerBlur = useTransform(
    activeProgress,
    [0, 0.08, 0.22, 0.38, 0.5],
    [0, 0, 8, 16, 22]
  );
  const centerOpacity = useTransform(
    activeProgress,
    [0, 0.1, 0.28, 0.42, 0.52],
    [1, 1, 0.55, 0.15, 0]
  );
  const centerY = useTransform(activeProgress, [0, 0.5], [0, -40]);
  const centerScale = useTransform(activeProgress, [0, 0.5], [1, 0.95]);
  const centerFilter = useMotionTemplate`blur(${centerBlur}px)`;
  // Don't fade with CSS opacity — it washes #000 to gray. Toggle visibility instead.
  const [showScrollHint, setShowScrollHint] = useState(true);
  useMotionValueEvent(activeProgress, "change", (v) => {
    setShowScrollHint(v < 0.08);
  });

  // Chapter 2 enters after blur; stays until sticky section releases into Two ways
  const chapterOpacity = useTransform(
    activeProgress,
    [0, 0.58, 0.66, 0.78, 1],
    [0, 0, 0.45, 1, 1]
  );
  const chapterY = useTransform(activeProgress, [0.58, 0.78], [80, 0]);
  const chapterScale = useTransform(activeProgress, [0.58, 0.78], [0.95, 1]);
  const chapterBlur = useTransform(activeProgress, [0.58, 0.72], [14, 0]);
  const chapterFilter = useMotionTemplate`blur(${chapterBlur}px)`;
  const heroPointer = useTransform(activeProgress, (v) =>
    v > 0.5 ? "none" : "auto"
  );

  const scrollToChapter = () => {
    if (reduce) {
      document
        .getElementById("featured-profile")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    const el = sectionRef.current;
    if (!el) return;
    // Map to scrollYProgress ≈ 0.82 (chapter 2 fully sharp in sticky frame)
    const travel = Math.max(el.offsetHeight - window.innerHeight, 0);
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({
      top: top + travel * 0.82,
      behavior: "smooth",
    });
  };

  if (reduce) {
    return (
      <section className="relative px-4 pb-10 sm:px-5">
        <div className="mx-auto flex min-h-svh w-full flex-col items-center justify-center px-3 text-center">
          <GreetingRotate />
          <button
            type="button"
            onClick={scrollToChapter}
            className="glass-strong mt-12 inline-flex max-w-[min(92vw,24rem)] items-center gap-2 rounded-full px-6 py-3.5 text-center text-base leading-snug font-semibold sm:px-7 sm:py-4 sm:text-lg"
            style={{ color: "#000" }}
            aria-label={dict.home.scroll}
          >
            <span style={{ color: "#000" }}>{dict.home.scroll}</span>
            <ChevronDown
              className="size-5 shrink-0 sm:size-6"
              style={{ color: "#000" }}
              aria-hidden
            />
          </button>
        </div>
        <div
          id="featured-profile"
          className="mx-auto mt-6 h-[min(78svh,780px)] w-full max-w-[min(90vw,1080px)] scroll-mt-24"
        >
          <FeaturedProfileCard
            coverUrl={cover?.imageUrl}
            coverGradient={cover?.gradient}
          />
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative h-[200svh] md:h-[300svh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden px-3 text-center sm:px-5">
        <motion.div
          className="relative z-10 flex w-full max-w-[min(98vw,1400px)] items-center justify-center will-change-[filter,opacity,transform]"
          style={{
            filter: centerFilter,
            opacity: centerOpacity,
            scale: centerScale,
            y: centerY,
            pointerEvents: heroPointer,
          }}
        >
          <GreetingRotate className="w-full" />
        </motion.div>

        <motion.div
          className="pointer-events-none absolute inset-x-0 top-[calc(1.25rem+env(safe-area-inset-top,0px)+3.5rem)] right-0 bottom-[1.25rem] left-0 z-20 flex items-center justify-center overflow-hidden px-4 will-change-[filter,opacity,transform] sm:top-[calc(1.5rem+env(safe-area-inset-top,0px)+4rem)] sm:px-6 sm:bottom-6 md:px-8"
          style={{
            opacity: chapterOpacity,
            y: chapterY,
            scale: chapterScale,
            filter: chapterFilter,
          }}
        >
          <div className="pointer-events-auto h-[min(78svh,780px)] w-full max-w-[min(90vw,1080px)]">
            <FeaturedProfileCard
              coverUrl={cover?.imageUrl}
              coverGradient={cover?.gradient}
            />
          </div>
        </motion.div>

        {showScrollHint ? (
          <div className="absolute bottom-5 left-1/2 z-30 -translate-x-1/2">
            <button
              type="button"
              onClick={scrollToChapter}
              className="glass-strong inline-flex max-w-[min(92vw,24rem)] items-center gap-2 rounded-full px-6 py-3.5 text-center text-base leading-snug font-semibold sm:px-7 sm:py-4 sm:text-lg"
              style={{ color: "#000" }}
              aria-label={dict.home.scroll}
            >
              <span style={{ color: "#000" }}>{dict.home.scroll}</span>
              <ChevronDown
                className="scroll-hint-chevron size-5 shrink-0 sm:size-6"
                style={{ color: "#000" }}
                aria-hidden
              />
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function TwoWays() {
  const { dict } = useLocale();
  const href = useLocalizedHref();
  return (
    <section
      id="two-ways"
      className="relative z-10 mx-auto max-w-[1100px] scroll-mt-24 px-5 pt-16 pb-[90px] md:pt-24"
    >
      <p className="mb-8 text-sm font-semibold tracking-wide text-blue">
        <ScrambleText text={dict.home.codeIdentity} />
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        <Link href={href("/portfolio")} className="block">
          <Glass className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-3xl p-8 transition hover:-translate-y-1">
            <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
              {["React", "Python", "3D"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-edge bg-glass px-3.5 py-1.5 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="mb-1 text-3xl font-extrabold">
              <ScrambleText text={dict.home.codeTitle} />
            </h3>
            <p className="text-muted">
              <ScrambleText text={dict.home.codeBody} />
            </p>
          </Glass>
        </Link>
        <Link href={href("/gallery")} className="block">
          <Glass className="relative flex min-h-[260px] flex-col justify-end overflow-hidden rounded-3xl p-8 transition hover:-translate-y-1">
            <div className="absolute top-5 left-5 flex flex-wrap gap-1.5">
              {["Street", "Portrait", "Film"].map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-edge bg-glass px-3.5 py-1.5 text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
            <h3 className="mb-1 text-3xl font-extrabold">
              <ScrambleText text={dict.home.captureTitle} />
            </h3>
            <p className="text-muted">
              <ScrambleText text={dict.home.captureBody} />
            </p>
          </Glass>
        </Link>
      </div>
    </section>
  );
}

export function CtaBand() {
  const { dict } = useLocale();
  const href = useLocalizedHref();
  return (
    <section className="mx-auto max-w-[1100px] px-5 pb-[90px]">
      <Glass className="flex flex-col items-start gap-4 rounded-3xl p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold tracking-tight">
            <ScrambleText text={dict.home.ctaTitle} />
          </h2>
          <p className="mt-1 max-w-[40ch] text-muted">
            <ScrambleText text={dict.home.ctaBody} />
          </p>
        </div>
        <Button asChild>
          <Link href={href("/contact")}>
            <ScrambleText text={dict.home.ctaButton} />
          </Link>
        </Button>
      </Glass>
    </section>
  );
}
