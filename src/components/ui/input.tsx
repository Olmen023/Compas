import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-auto min-h-[40px] w-full rounded-[10px] border-[1.5px] border-white/15 bg-white/8 px-4 py-3 text-[0.95rem] backdrop-blur-[10px] shadow-[inset_0_2px_4px_rgba(0,0,0,0.15)] text-foreground placeholder:text-muted-foreground/60 transition-all duration-300 hover:border-white/25 hover:bg-white/12 hover:shadow-[inset_0_2px_4px_rgba(0,0,0,0.15),0_0_0_4px_rgba(0,144,255,0.08)] focus-visible:outline-none focus-visible:border-primary focus-visible:bg-white/12 focus-visible:shadow-[0_0_0_3px_hsla(var(--primary),0.2),0_4px_16px_hsla(var(--primary),0.3),inset_0_2px_4px_rgba(0,0,0,0.15)] focus-visible:-translate-y-[1px] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
