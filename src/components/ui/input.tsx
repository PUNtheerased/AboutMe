import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "glass flex h-11 w-full rounded-2xl px-4 text-sm text-ink outline-none placeholder:text-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Input };
