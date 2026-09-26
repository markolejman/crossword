import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush focus-visible:ring-offset-2 focus-visible:ring-offset-lavender-blush",
          "disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-blush text-white shadow-blush hover:bg-blush-hover hover:shadow-blush-lg hover:-translate-y-0.5 active:translate-y-0":
              variant === "default",
            "border border-border bg-white/80 text-foreground hover:bg-white hover:border-blush":
              variant === "outline",
            "text-muted hover:bg-blush-soft/60 hover:text-foreground":
              variant === "ghost",
            "bg-destructive text-white hover:bg-destructive-hover shadow-destructive":
              variant === "destructive",
          },
          {
            "h-10 px-4 py-2": size === "default",
            "h-9 px-3 text-sm": size === "sm",
            "h-12 px-8 text-base": size === "lg",
            "h-10 w-10": size === "icon",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
