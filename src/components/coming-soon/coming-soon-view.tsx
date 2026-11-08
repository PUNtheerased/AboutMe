"use client";

import { ComingSoonNavbar } from "@/components/coming-soon/coming-soon-navbar";
import { ComingSoonParticles } from "@/components/coming-soon/coming-soon-particles";

export function ComingSoonView() {
  return (
    <div className="relative z-1 flex min-h-svh flex-col">
      <ComingSoonNavbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 text-center sm:px-5">
        <ComingSoonParticles className="w-full" />
      </main>
    </div>
  );
}
