"use client";

import type { CSSProperties, ReactNode } from "react";
import { ABACATE_CHECKOUT } from "../lib/links";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export function AssinarLink({
  className,
  style,
  children,
}: {
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <a
      className={className}
      style={style}
      href={ABACATE_CHECKOUT}
      onClick={() => window.fbq?.("track", "InitiateCheckout")}
    >
      {children}
    </a>
  );
}
