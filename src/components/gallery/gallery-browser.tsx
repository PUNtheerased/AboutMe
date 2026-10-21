"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "motion/react";
import { ScrambleText } from "@/components/ui/scramble-text";
import type { SamplePhoto } from "@/lib/data/sample-photos";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

const Lightbox = dynamic(
  () =>
    import("@/components/gallery/lightbox").then((m) => m.Lightbox),
  { ssr: false }
);

const EASE = [0.22, 1, 0.36, 1] as const;

function FilterChips({
  categories,
  active,
  onChange,
  allLabel,
}: {
  categories: string[];
  active: string;
  onChange: (value: string) => void;
  allLabel: string;
}) {
  const chips = [allLabel, ...categories];
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filters">
      {chips.map((chip) => {
        const value = chip === allLabel ? "All" : chip;
        const selected = active === value;
        return (
          <button
            key={chip}
            type="button"
            role="tab"
            aria-selected={selected}
            className={cn(
              "min-h-11 rounded-full border border-edge px-4 py-2 text-sm font-semibold glass",
              selected && "bg-ink text-bg"
            )}
            onClick={() => onChange(value)}
          >
            <ScrambleText text={chip} />
          </button>
        );
      })}
    </div>
  );
}

function ViewToggle({
  view,
  onChange,
  carouselLabel,
  masonryLabel,
}: {
  view: "carousel" | "masonry";
  onChange: (view: "carousel" | "masonry") => void;
  carouselLabel: string;
  masonryLabel: string;
}) {
  return (
    <div className="inline-flex rounded-full glass p-1">
      <button
        type="button"
        className={cn(
          "min-h-10 rounded-full px-4 text-sm font-semibold",
          view === "carousel" && "bg-ink text-bg"
        )}
        onClick={() => onChange("carousel")}
      >
        <ScrambleText text={carouselLabel} />
      </button>
      <button
        type="button"
        className={cn(
          "min-h-10 rounded-full px-4 text-sm font-semibold",
          view === "masonry" && "bg-ink text-bg"
        )}
        onClick={() => onChange("masonry")}
      >
        <ScrambleText text={masonryLabel} />
      </button>
    </div>
  );
}

function CurvedCarousel({
  photos,
  onOpen,
}: {
  photos: SamplePhoto[];
  onOpen: (index: number) => void;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const curve = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const mid = stage.scrollLeft + stage.clientWidth / 2;
    const cards = stage.querySelectorAll<HTMLElement>("[data-card]");
    cards.forEach((card) => {
      if (reduce) {
        card.style.transform = "none";
        return;
      }
      const rect = card.getBoundingClientRect();
      const stageRect = stage.getBoundingClientRect();
      if (rect.right < stageRect.left - 80 || rect.left > stageRect.right + 80) {
        return;
      }
      const center = card.offsetLeft + card.offsetWidth / 2;
      const d = (center - mid) / 320;
      const abs = Math.abs(d);
      card.style.transform = `translateZ(${-abs * 110}px) rotateY(${-d * 32}deg) scale(${1 - Math.min(abs, 2) * 0.06})`;
      card.style.zIndex = String(10 - Math.round(abs));
    });
  }, [reduce]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(curve);
    };
    stage.addEventListener("scroll", onScroll, { passive: true });
    curve();
    window.addEventListener("resize", curve);
    return () => {
      stage.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", curve);
      cancelAnimationFrame(raf);
    };
  }, [curve, photos]);

  const onPointerDown = (e: ReactPointerEvent) => {
    const stage = stageRef.current;
    if (!stage) return;
    dragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = stage.scrollLeft;
    stage.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current || !stageRef.current) return;
    const dx = e.clientX - startX.current;
    stageRef.current.scrollLeft = scrollLeft.current - dx;
  };

  const onPointerUp = () => {
    dragging.current = false;
  };

  return (
    <div>
      <div
        ref={stageRef}
        className="stage flex h-[min(62vh,520px)] snap-x snap-mandatory items-center overflow-x-auto overflow-y-hidden [perspective:1100px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ paddingInline: "calc(50% - 150px)" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {photos.map((photo, index) => (
          <motion.button
            key={photo.id}
            type="button"
            data-card
            className="relative mx-[-18px] h-[min(52vh,430px)] w-[300px] shrink-0 snap-center rounded-[26px] polaroid"
            style={{
              backgroundImage: photo.imageUrl
                ? `url(${photo.imageUrl})`
                : photo.gradient,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            initial={reduce ? false : { opacity: 0, y: 24 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.45, delay: Math.min(index, 6) * 0.04, ease: EASE }}
            onClick={() => {
              if (Math.abs((stageRef.current?.scrollLeft ?? 0) - scrollLeft.current) < 6) {
                onOpen(index);
              }
            }}
            aria-label={photo.title}
          >
            <span className="absolute bottom-3.5 left-3.5 rounded-xl bg-white/90 px-3 py-1.5 text-sm font-semibold text-[#14161C]">
              {photo.title}
            </span>
          </motion.button>
        ))}
      </div>
      <div
        aria-hidden
        className="mt-[-30px] h-[70px] origin-center [mask-image:linear-gradient(transparent,#000)] [transform:perspective(300px)_rotateX(55deg)] [background:repeating-linear-gradient(90deg,var(--edge)_0_1px,transparent_1px_70px)]"
      />
    </div>
  );
}

function MasonryGrid({
  photos,
  onOpen,
}: {
  photos: SamplePhoto[];
  onOpen: (index: number) => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {photos.map((photo, index) => (
        <motion.button
          key={photo.id}
          type="button"
          className="mb-4 w-full break-inside-avoid overflow-hidden rounded-2xl polaroid text-left"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.48,
            delay: Math.min(index % 6, 5) * 0.05,
            ease: EASE,
          }}
          onClick={() => onOpen(index)}
        >
          <div
            className="h-full w-full"
            style={{
              backgroundImage: photo.imageUrl
                ? `url(${photo.imageUrl})`
                : photo.gradient,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            role="img"
            aria-label={photo.caption || photo.title}
          />
        </motion.button>
      ))}
    </div>
  );
}

export function GalleryBrowser({
  photos,
  categories,
}: {
  photos: SamplePhoto[];
  categories: string[];
}) {
  const { dict } = useLocale();
  const [filter, setFilter] = useState("All");
  const [view, setView] = useState<"carousel" | "masonry">("carousel");
  const [visible, setVisible] = useState(24);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setView(mq.matches ? "masonry" : "carousel");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const filtered = useMemo(
    () =>
      filter === "All"
        ? photos
        : photos.filter((p) => p.category === filter),
    [filter, photos]
  );
  const shown = filtered.slice(0, visible);

  return (
    <div className="mx-auto max-w-[1100px] px-5 pt-[130px] pb-10">
      <div className="glass sticky top-[calc(72px+env(safe-area-inset-top,0px))] z-20 -mx-5 mb-6 rounded-b-3xl border-x-0 border-t-0 px-5 pt-2 pb-4">
        <h1 className="mb-2 text-[clamp(2.4rem,6vw,4.5rem)] font-extrabold tracking-tight">
          <ScrambleText text={dict.gallery.title} />
        </h1>
        <p className="mb-4 text-muted">
          <ScrambleText text={dict.gallery.subtitle} />
        </p>
        {!photos.some((p) => p.imageUrl) ? (
          <p className="mb-4 text-sm text-muted">
            <ScrambleText text={dict.gallery.empty} />
          </p>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <FilterChips
            categories={categories}
            active={filter}
            onChange={(v) => {
              setFilter(v);
              setVisible(24);
            }}
            allLabel={dict.gallery.all}
          />
          <ViewToggle
            view={view}
            onChange={setView}
            carouselLabel={dict.gallery.carousel}
            masonryLabel={dict.gallery.masonry}
          />
        </div>
      </div>

      {view === "carousel" ? (
        <CurvedCarousel photos={shown} onOpen={setOpenIndex} />
      ) : (
        <MasonryGrid photos={shown} onOpen={setOpenIndex} />
      )}
      {visible < filtered.length ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            className="min-h-11 rounded-full bg-ink px-6 font-semibold text-bg"
            onClick={() => setVisible((v) => v + 24)}
          >
            <ScrambleText text={dict.gallery.loadMore} />
          </button>
        </div>
      ) : null}
      {openIndex !== null ? (
        <Lightbox
          photos={shown}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      ) : null}
    </div>
  );
}
