import * as React from "react";
import styles from "./badge.module.css";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={`${styles.badge} ${styles[variant]} ${className || ""}`.trim()}
      {...props}
    />
  );
}

export { Badge };
