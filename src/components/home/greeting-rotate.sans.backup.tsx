"use client";

/**
 * BACKUP — sans-serif particle greeting (working snapshot).
 * Restore: copy over greeting-rotate.tsx if handwriting version regresses.
 * Not imported by the app.
 */

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Particle morph — particles glide from one word shape into the next.
 * Particle count scales with each word's sampled glyph area.
 */
const WORDS = [
  "Hello",
  "สวัสดี",
  "你好",
  "こんにちは",
  "안녕하세요",
  "Hola",
  "Bonjour",
  "Hallo",
  "Ciao",
  "Olá",
] as const;

const HOLD_MS = 2600;
const MIN_PARTICLES = 900;
const MAX_PARTICLES = 3200;
const SAMPLE_STEP = 1;

type Particle = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  size: number;
  alpha: number;
};

function readInkColor() {
  if (typeof window === "undefined") return "#14161c";
  const styles = getComputedStyle(document.documentElement);
  return (
    styles.getPropertyValue("--ink").trim() ||
    styles.getPropertyValue("--color-ink").trim() ||
    "#14161c"
  );
}

/** Canvas cannot use CSS `var()` — resolve computed font-family first. */
function resolveCanvasFontFamily() {
  const probe = document.createElement("span");
  probe.style.cssText =
    "position:absolute;left:-9999px;top:0;visibility:hidden;font-family:var(--font-sans)";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily;
  probe.remove();
  return (
    family ||
    '"Segoe UI", "PingFang SC", "Hiragino Sans", "Apple SD Gothic Neo", sans-serif'
  );
}

function sampleWordPoints(
  text: string,
  width: number,
  height: number,
  fontSize: number,
  fontFamily: string
) {
  const off = document.createElement("canvas");
  off.width = width;
  off.height = height;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [] as { x: number; y: number }[];

  ctx.clearRect(0, 0, width, height);
  ctx.font = `800 ${fontSize}px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#000";
  ctx.fillText(text, width / 2, height / 2);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: { x: number; y: number }[] = [];
  for (let y = 0; y < height; y += SAMPLE_STEP) {
    for (let x = 0; x < width; x += SAMPLE_STEP) {
      if (data[(y * width + x) * 4 + 3]! > 140) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

function ensureParticleCount(
  particles: Particle[],
  count: number,
  cx: number,
  cy: number
) {
  if (particles.length < count) {
    const need = count - particles.length;
    for (let i = 0; i < need; i++) {
      particles.push({
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 24,
        targetX: cx,
        targetY: cy,
        size: Math.random() * 1.8 + 1.2,
        alpha: 0.92 + Math.random() * 0.08,
      });
    }
  } else if (particles.length > count) {
    particles.length = count;
  }
}

export function GreetingRotate({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);

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
    let wordIndex = 0;
    let ink = readInkColor();
    let fontFamily = resolveCanvasFontFamily();
    let width = 900;
    let height = 320;
    const particles: Particle[] = [];

    const morphTo = (text: string) => {
      // Fill most of the canvas — hero-scale type
      const fontSize = Math.min(height * 0.78, width * 0.2);
      const points = sampleWordPoints(
        text,
        width,
        height,
        fontSize,
        fontFamily
      );
      if (!points.length) return;

      const count = Math.min(
        MAX_PARTICLES,
        Math.max(MIN_PARTICLES, Math.floor(points.length * 0.9))
      );
      ensureParticleCount(particles, count, width / 2, height / 2);

      const step = Math.max(1, Math.floor(points.length / count));
      for (let i = 0; i < count; i++) {
        const pt = points[(i * step) % points.length]!;
        const p = particles[i]!;
        p.targetX = pt.x + (Math.random() - 0.5) * 0.5;
        p.targetY = pt.y + (Math.random() - 0.5) * 0.5;
        p.size = Math.random() * 1.7 + 1.3;
      }
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const bounds = wrap.getBoundingClientRect();
      width = Math.max(Math.floor(bounds.width), 320);
      height = Math.max(Math.floor(bounds.height), 180);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fontFamily = resolveCanvasFontFamily();
      morphTo(WORDS[wordIndex]!);
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
      // Morph straight into the next word shape — no center collapse
      wordIndex = (wordIndex + 1) % WORDS.length;
      morphTo(WORDS[wordIndex]!);
    };

    let started = false;
    const startLoop = () => {
      if (disposed || started) return;
      started = true;
      fontFamily = resolveCanvasFontFamily();
      ensureParticleCount(particles, MIN_PARTICLES, width / 2, height / 2);
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
      if (started) resize();
    });
    ro.observe(wrap);
    window.addEventListener("resize", resize);

    const themeObs = new MutationObserver(() => {
      ink = readInkColor();
    });
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-theme"],
    });

    void document.fonts.ready.then(startLoop);
    const boot = window.setTimeout(startLoop, 500);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.clearInterval(holdTimer);
      window.clearTimeout(boot);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      themeObs.disconnect();
    };
  }, [reduce]);

  if (reduce) {
    return (
      <p
        className={cn(
          "text-center font-sans text-[clamp(3rem,12vw,8rem)] font-extrabold tracking-tight text-ink",
          className
        )}
      >
        {WORDS[0]}
      </p>
    );
  }

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative mx-auto h-[min(48vh,420px)] w-full max-w-[min(98vw,1400px)] sm:h-[min(52vh,480px)]",
        className
      )}
      aria-live="polite"
      aria-label="Greeting"
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
