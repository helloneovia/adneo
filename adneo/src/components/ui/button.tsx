import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/40",
  {
    variants: {
      variant: {
        primary:
          "bg-white text-slate-950 shadow-sm hover:bg-slate-200/90",
        secondary:
          "bg-slate-900 text-slate-100 border border-slate-800 hover:border-slate-600 hover:bg-slate-800",
        ghost:
          "text-slate-200 hover:bg-white/10",
        outline:
          "border border-slate-700 text-slate-100 hover:border-slate-400 hover:bg-white/5",
        accent:
          "bg-gradient-to-r from-indigo-500 via-sky-500 to-cyan-400 text-slate-950 shadow-lg shadow-sky-500/20 hover:brightness-105",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
