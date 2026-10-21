import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-transform disabled:pointer-events-none disabled:opacity-50 min-h-11 px-6 py-3 [&_svg]:pointer-events-none [&_svg]:size-4",
  {
    variants: {
      variant: {
        default: "bg-ink text-bg hover:-translate-y-[3px] hover:scale-[1.03]",
        glass:
          "glass text-ink hover:-translate-y-[3px] hover:scale-[1.03]",
        outline:
          "border border-edge bg-transparent hover:-translate-y-[3px] hover:scale-[1.03]",
        ghost: "hover:bg-edge/40",
        link: "underline-offset-4 hover:underline px-0",
      },
      size: {
        default: "min-h-11 px-6 py-3",
        sm: "min-h-10 px-4 text-sm",
        lg: "min-h-12 px-8 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
