import * as React from "react";
import { cn } from "@/lib/utils";

type GlassProps<T extends React.ElementType = "div"> = {
  as?: T;
  className?: string;
  children?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

export function Glass<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...props
}: GlassProps<T>) {
  const Comp = as || "div";
  return (
    <Comp className={cn("glass", className)} {...props}>
      {children}
    </Comp>
  );
}
