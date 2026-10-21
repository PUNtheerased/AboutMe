"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { SamplePhoto } from "@/lib/data/sample-photos";

export function Lightbox({
  photos,
  index,
  onClose,
  onIndexChange,
}: {
  photos: SamplePhoto[];
  index: number;
  onClose: () => void;
  onIndexChange: (index: number) => void;
}) {
  const photo = photos[index];
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft")
        onIndexChange((index - 1 + photos.length) % photos.length);
      if (e.key === "ArrowRight")
        onIndexChange((index + 1) % photos.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [index, onClose, onIndexChange, photos.length]);

  useEffect(() => {
    const next = photos[(index + 1) % photos.length];
    const prev = photos[(index - 1 + photos.length) % photos.length];
    [next, prev].forEach((p) => {
      if (p.imageUrl) {
        const img = new Image();
        img.src = p.imageUrl;
      }
    });
  }, [index, photos]);

  if (!photo) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={photo.title}
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(10,12,18,0.8)] p-5 backdrop-blur-md"
      onClick={onClose}
    >
      <button
        type="button"
        className="absolute top-[calc(18px+env(safe-area-inset-top,0px))] right-5 inline-flex size-11 items-center justify-center rounded-full glass"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="size-4" />
      </button>
      <button
        type="button"
        className="absolute left-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full glass sm:inline-flex"
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((index - 1 + photos.length) % photos.length);
        }}
        aria-label="Previous"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        type="button"
        className="absolute right-4 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full glass sm:inline-flex"
        onClick={(e) => {
          e.stopPropagation();
          onIndexChange((index + 1) % photos.length);
        }}
        aria-label="Next"
      >
        <ChevronRight className="size-5" />
      </button>
      <div
        className="w-[min(520px,90vw)]"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => {
          touchX.current = e.changedTouches[0]?.clientX ?? null;
        }}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (dx > 50)
            onIndexChange((index - 1 + photos.length) % photos.length);
          if (dx < -50) onIndexChange((index + 1) % photos.length);
          touchX.current = null;
        }}
      >
        <div
          className="aspect-3/4 max-h-[70vh] w-full rounded-[26px] border-8 border-white bg-cover bg-center"
          style={{
            backgroundImage: photo.imageUrl
              ? `url(${photo.imageUrl})`
              : photo.gradient,
          }}
          role="img"
          aria-label={photo.caption || photo.title}
        />
        <div className="mt-4 text-bg">
          <h2 className="text-xl font-extrabold text-white">{photo.title}</h2>
          <p className="text-sm text-white/70">
            {photo.category}
            {photo.takenAt ? ` · ${photo.takenAt}` : ""}
          </p>
          {photo.caption ? (
            <p className="mt-2 text-sm text-white/80">{photo.caption}</p>
          ) : null}
          {(photo.camera || photo.lens || photo.iso || photo.aperture || photo.shutter) && (
            <p className="mt-2 text-xs text-white/60">
              {[photo.camera, photo.lens, photo.iso ? `ISO ${photo.iso}` : null, photo.aperture, photo.shutter]
                .filter(Boolean)
                .join(" · ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
