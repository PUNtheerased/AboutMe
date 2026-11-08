"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { useLocale } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const HOLD_MS = 3200;

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
};

type ParticleBudget = {
  min: number;
  max: number;
  sampleStep: number;
  sizeMin: number;
  sizeMax: number;
  dprCap: number;
  fillRatio: number;
  label: "phone" | "tablet" | "desktop";
};

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function fontVarForLocale(locale: Locale) {
  return locale === "th" ? "--font-noto-thai" : "--font-archivo";
}

function analyzeParticleBudget(
  canvasW: number,
  canvasH: number,
  viewportW: number
): ParticleBudget {
  const area = Math.max(canvasW * canvasH, 1);
  const areaScale = clamp(area / (1200 * 420), 0.35, 1.35);
  const max = Math.round(clamp(2600 * areaScale, 1200, 3200));
  const min = Math.min(1000, max);

  if (viewportW < 640) {
    return {
      min,
      max,
      sampleStep: 1,
      sizeMin: 0.65,
      sizeMax: 1.25,
      dprCap: 2,
      fillRatio: 0.82,
      label: "phone",
    };
  }

  if (viewportW < 1024) {
    return {
      min,
      max,
      sampleStep: 1,
      sizeMin: 0.95,
      sizeMax: 1.7,
      dprCap: 2,
      fillRatio: 0.86,
      label: "tablet",
    };
  }

  return {
    min,
    max,
    sampleStep: 1,
    sizeMin: 1.2,
    sizeMax: 2.1,
    dprCap: 2,
    fillRatio: 0.9,
    label: "desktop",
  };
}

function readInkColor() {
  if (typeof window === "undefined") return "#14161c";
  const styles = getComputedStyle(document.documentElement);
  return (
    styles.getPropertyValue("--ink").trim() ||
    styles.getPropertyValue("--color-ink").trim() ||
    "#14161c"
  );
}

function resolveFontVar(fontVar: string) {
  const probe = document.createElement("span");
  probe.style.cssText = `position:absolute;left:-9999px;top:0;visibility:hidden;font-family:var(${fontVar})`;
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();
  return family || "sans-serif";
}

function shuffleInPlace<T>(arr: T[]) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

function pickTargetPoints(points: { x: number; y: number }[], count: number) {
  if (!points.length) return [] as { x: number; y: number }[];

  if (points.length >= count) {
    const pool = points.slice();
    shuffleInPlace(pool);
    return pool.slice(0, count);
  }

  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const pt = points[i % points.length]!;
    out.push({
      x: pt.x + (Math.random() - 0.5) * 1.2,
      y: pt.y + (Math.random() - 0.5) * 1.2,
    });
  }
  return out;
}

function fitFontSize(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontFamily: string,
  weight: number,
  maxFont: number,
  maxWidth: number
) {
  let size = maxFont;
  const minSize = Math.max(22, maxFont * 0.22);
  while (size > minSize) {
    ctx.font = `${weight} ${size}px ${fontFamily}`;
    if (ctx.measureText(text).width <= maxWidth) break;
    size *= 0.92;
  }
  return size;
}

function normalizeGlyphPoints(
  points: { x: number; y: number }[],
  width: number,
  height: number
) {
  if (points.length < 8) return points;

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  }

  const bw = Math.max(maxX - minX, 1);
  const bh = Math.max(maxY - minY, 1);
  const targetW = width * 0.9;
  const targetH = height * 0.5;
  const scale = Math.min(targetW / bw, targetH / bh);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  return points.map((p) => ({
    x: width / 2 + (p.x - cx) * scale,
    y: height / 2 + (p.y - cy) * scale,
  }));
}

function sampleWordPoints(
  text: string,
  fontVar: string,
  weight: number,
  width: number,
  height: number,
  baseFontSize: number,
  sampleStep: number
) {
  const fontFamily = resolveFontVar(fontVar);
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [] as { x: number; y: number }[];

  const padX = Math.max(12, width * 0.04);
  const fitted = fitFontSize(
    ctx,
    text,
    fontFamily,
    weight,
    baseFontSize,
    width - padX * 2
  );

  ctx.clearRect(0, 0, width, height);
  ctx.font = `${weight} ${fitted}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const raw: { x: number; y: number }[] = [];
  const step = Math.max(1, sampleStep);
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (data[(y * width + x) * 4 + 3]! > 200) {
        raw.push({ x, y });
      }
    }
  }
  return normalizeGlyphPoints(raw, width, height);
}

function ensureParticleCount(
  particles: Particle[],
  count: number,
  cx: number,
  cy: number,
  sizeMin: number,
  sizeMax: number
) {
  if (particles.length < count) {
    const need = count - particles.length;
    for (let i = 0; i < need; i++) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 24,
        targetX: cx,
        targetY: cy,
        size: sizeMin + Math.random() * (sizeMax - sizeMin),
        alpha: 0.92 + Math.random() * 0.08,
      });
    }
  } else if (particles.length > count) {
    particles.length = count;
  }
}

export function ComingSoonParticles({ className }: { className?: string }) {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const words = dict.comingSoon.particles;
  const fontVar = fontVarForLocale(locale);
  const fontWeight = locale === "th" ? 700 : 400;

  useEffect(() => {
    if (reduce) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let holdTimer = 0;
    let resizeTimer = 0;
    let wordIndex = 0;
    let ink = readInkColor();
    let width = 900;
    let height = 320;
    let budget = analyzeParticleBudget(width, height, window.innerWidth);
    let particles: Particle[] = [];

    const morphTo = (index: number) => {
      const text = words[index % words.length]!;
      budget = analyzeParticleBudget(width, height, window.innerWidth);
      const fontSize = Math.min(height * 0.72, width * 0.18);
      const points = sampleWordPoints(
        text,
        fontVar,
        fontWeight,
        width,
        height,
        fontSize,
        budget.sampleStep
      );
      if (!points.length) return;

      const fromGlyph = Math.floor(points.length * budget.fillRatio);
      const count = clamp(fromGlyph, budget.min, budget.max);

      ensureParticleCount(
        particles,
        count,
        width / 2,
        height / 2,
        budget.sizeMin,
        budget.sizeMax
      );

      const targets = pickTargetPoints(points, count);
      const sizeSpan = budget.sizeMax - budget.sizeMin;
      for (let i = 0; i < count; i++) {
        const pt = targets[i]!;
        const p = particles[i]!;
        p.targetX = pt.x;
        p.targetY = pt.y;
        p.size = budget.sizeMin + Math.random() * sizeSpan;
      }
    };

    const resize = () => {
      budget = analyzeParticleBudget(
        Math.max(wrap.clientWidth, 1),
        Math.max(wrap.clientHeight, 1),
        window.innerWidth
      );
      const dpr = Math.min(window.devicePixelRatio || 1, budget.dprCap);
      const bounds = wrap.getBoundingClientRect();
      width = Math.max(Math.floor(bounds.width), 280);
      height = Math.max(Math.floor(bounds.height), 160);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      morphTo(wordIndex);
    };

    const scheduleResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(
        resize,
        budget.label === "phone" ? 120 : 40
      );
    };

    const render = () => {
      if (disposed || !ctx) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = ink;

      for (const p of particles) {
        p.x += (p.targetX - p.x) * 0.16;
        p.y += (p.targetY - p.y) * 0.16;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(render);
    };

    const cycle = () => {
      wordIndex = (wordIndex + 1) % words.length;
      morphTo(wordIndex);
    };

    let started = false;
    const startLoop = () => {
      if (disposed || started) return;
      started = true;
      resize();
      particles.forEach((p) => {
        p.x = p.targetX;
        p.y = p.targetY;
      });
      render();
      window.clearInterval(holdTimer);
      holdTimer = window.setInterval(cycle, HOLD_MS);
    };

    const ro = new ResizeObserver(() => {
      if (started) scheduleResize();
    });
    ro.observe(wrap);
    window.addEventListener("resize", scheduleResize);
    window.addEventListener("orientationchange", scheduleResize);

    const themeObs = new MutationObserver(() => {
      ink = readInkColor();
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    const family = resolveFontVar(fontVar);
    void document.fonts
      .load(`${fontWeight} 72px ${family}`)
      .catch(() => undefined)
      .then(() => document.fonts.ready)
      .then(startLoop);
    const boot = window.setTimeout(startLoop, 1200);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearInterval(holdTimer);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(boot);
      window.removeEventListener("resize", scheduleResize);
      window.removeEventListener("orientationchange", scheduleResize);
      ro.disconnect();
      themeObs.disconnect();
    };
  }, [reduce, words, fontVar, fontWeight]);

  if (reduce) {
    return (
      <p
        className={cn(
          "text-center text-[clamp(2.4rem,9vw,6.5rem)] tracking-tight text-ink",
          locale === "th"
            ? "font-[family-name:var(--font-noto-thai)] font-bold"
            : "font-[family-name:var(--font-archivo)]",
          className
        )}
      >
        {words[0]}
      </p>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative mx-auto h-[min(42vh,360px)] w-full max-w-[min(94vw,1400px)] overflow-hidden sm:h-[min(48vh,420px)] md:h-[min(52vh,480px)]",
        className
      )}
      aria-live="polite"
      aria-label={words[0]}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
