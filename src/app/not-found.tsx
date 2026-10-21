import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative z-1 flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="max-w-[12ch] text-[clamp(2.4rem,7vw,4.5rem)] font-extrabold tracking-tight">
        This page wandered off.
      </h1>
      <p className="text-muted">Maybe it went looking for golden hour.</p>
      <Button asChild>
        <Link href="/en">Back home</Link>
      </Button>
    </div>
  );
}
