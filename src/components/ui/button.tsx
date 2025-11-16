import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import styles from "./button.module.css";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variantClass = variant === "default" ? styles.variantDefault :
                        variant === "destructive" ? styles.variantDestructive :
                        variant === "outline" ? styles.variantOutline :
                        variant === "secondary" ? styles.variantSecondary :
                        variant === "ghost" ? styles.variantGhost :
                        variant === "link" ? styles.variantLink : "";

    const sizeClass = size === "default" ? styles.sizeDefault :
                     size === "sm" ? styles.sizeSm :
                     size === "lg" ? styles.sizeLg :
                     size === "icon" ? styles.sizeIcon : "";

    return (
      <Comp
        className={`${styles.button} ${variantClass} ${sizeClass} ${className || ''}`.trim()}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
