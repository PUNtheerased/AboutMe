import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "glass flex min-h-32 w-full rounded-2xl px-4 py-3 text-sm text-ink outline-none placeholder:text-muted focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
