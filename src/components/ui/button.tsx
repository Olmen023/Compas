import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold ring-offset-background transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary via-primary to-primary bg-[length:200%_100%] bg-left hover:bg-right text-primary-foreground shadow-[0_4px_16px_hsla(var(--primary),0.4)] hover:shadow-[0_6px_24px_hsla(var(--primary),0.6)] hover:-translate-y-[2px] active:translate-y-0 active:shadow-[0_4px_16px_hsla(var(--primary),0.5)] rounded-[12px]",
        destructive:
          "bg-gradient-to-r from-destructive via-destructive to-destructive bg-[length:200%_100%] bg-left hover:bg-right text-destructive-foreground shadow-[0_4px_16px_hsla(var(--destructive),0.4)] hover:shadow-[0_6px_24px_hsla(var(--destructive),0.6)] hover:-translate-y-[2px] active:translate-y-0 rounded-[12px]",
        outline:
          "border-2 border-white/20 bg-white/5 backdrop-blur-[10px] hover:bg-white/10 hover:border-white/30 hover:-translate-y-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)] rounded-[12px]",
        secondary:
          "bg-white/8 backdrop-blur-[10px] border border-white/15 hover:bg-white/12 hover:border-white/25 shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_4px_12px_rgba(0,0,0,0.2)] rounded-[12px]",
        ghost: "hover:bg-white/10 hover:backdrop-blur-[10px] rounded-[8px]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-auto min-h-[44px] px-6 py-3",
        sm: "h-auto min-h-[36px] px-4 py-2 text-xs",
        lg: "h-auto min-h-[52px] px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
