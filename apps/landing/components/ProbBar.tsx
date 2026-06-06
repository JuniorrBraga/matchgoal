"use client";

import { useEffect, useState } from "react";

type ProbBarProps = {
  /** percentual final da barra (0–100) */
  value: number;
  /** variante de cor: o (laranja), c (charcoal), g (verde) */
  variant: "o" | "c" | "g";
};

/** Barra de probabilidade que anima a largura de 0% até `value` ao montar. */
export function ProbBar({ value, variant }: ProbBarProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(value), 120);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div className="bar">
      <i className={variant} style={{ width: `${width}%` }} />
    </div>
  );
}
