"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  /** Tag a renderizar (mantém o layout original: article, div, p...) */
  as?: ElementType;
  className?: string;
  children: ReactNode;
} & Record<string, unknown>;

/**
 * Envolve um elemento e adiciona a classe `in` quando ele entra na viewport,
 * disparando a animação de reveal definida em globals.css.
 */
export function Reveal({ as: Tag = "div", className = "", children, ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
