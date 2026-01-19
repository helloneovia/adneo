import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide",
  {
    variants: {
      variant: {
        solid: "bg-slate-800 text-slate-200 border border-slate-700",
        outline: "border border-slate-700 text-slate-300",
        glow: "bg-cyan-500/15 text-cyan-200 border border-cyan-500/40",
        success: "bg-emerald-500/15 text-emerald-200 border border-emerald-500/40",
      },
    },
    defaultVariants: {
      variant: "solid",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, className }))} {...props} />;
}

export { Badge, badgeVariants };
