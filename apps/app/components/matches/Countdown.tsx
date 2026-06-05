"use client";

import { useEffect, useState } from "react";

function diff(targetISO: string) {
  const target = new Date(targetISO).getTime();
  const now = Date.now();
  let delta = Math.max(0, Math.floor((target - now) / 1000));
  const d = Math.floor(delta / 86400);
  delta -= d * 86400;
  const h = Math.floor(delta / 3600);
  delta -= h * 3600;
  const m = Math.floor(delta / 60);
  const s = delta - m * 60;
  return { d, h, m, s };
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Contagem regressiva para o pontapé inicial (estilo Betano). */
export function Countdown({ targetISO, label }: { targetISO: string; label: string }) {
  const [t, setT] = useState(() => diff(targetISO));

  useEffect(() => {
    const id = setInterval(() => setT(diff(targetISO)), 1000);
    return () => clearInterval(id);
  }, [targetISO]);

  const cells: [number, string][] = [
    [t.d, "Dias"],
    [t.h, "Horas"],
    [t.m, "Min"],
    [t.s, "Seg"],
  ];

  return (
    <div className="countdown">
      <div className="countdown__label">{label}</div>
      <div className="countdown__row">
        {cells.map(([n, k]) => (
          <div className="cd-cell" key={k}>
            <span className="cd-cell__n">{pad(n)}</span>
            <span className="cd-cell__k">{k}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
