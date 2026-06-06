"use client";

import { useEffect, useState } from "react";

// Brasil estreia 13/jun/2026 13h00 BRT (UTC-3) => 16:00 UTC
const TARGET = new Date("2026-06-13T16:00:00Z").getTime();

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

type Parts = { d: string; h: string; m: string; s: string };

function compute(): Parts {
  let diff = TARGET - Date.now();
  if (diff < 0) diff = 0;
  return {
    d: pad(Math.floor(diff / 86400000)),
    h: pad(Math.floor((diff % 86400000) / 3600000)),
    m: pad(Math.floor((diff % 3600000) / 60000)),
    s: pad(Math.floor((diff % 60000) / 1000)),
  };
}

export function CountdownStrip() {
  // SSR-safe: começa zerado e atualiza no cliente para evitar mismatch de hidratação
  const [t, setT] = useState<Parts>({ d: "00", h: "00", m: "00", s: "00" });

  useEffect(() => {
    setT(compute());
    const id = setInterval(() => setT(compute()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="cd-strip" id="top">
      <div className="wrap">
        <span className="flagchip" aria-hidden="true">
          <i style={{ background: "var(--br-green)" }} />
          <i style={{ background: "var(--br-yellow)" }} />
          <i style={{ background: "var(--br-blue)" }} />
        </span>
        <span className="cd-label">
          O <b>Brasil estreia</b> na Copa em
        </span>
        <div className="cd-clock" id="countdown" aria-live="polite">
          <div className="cd-unit">
            <span className="n">{t.d}</span>
            <span className="u">dias</span>
          </div>
          <div className="cd-unit g">
            <span className="n">{t.h}</span>
            <span className="u">horas</span>
          </div>
          <div className="cd-unit y">
            <span className="n">{t.m}</span>
            <span className="u">min</span>
          </div>
          <div className="cd-unit">
            <span className="n">{t.s}</span>
            <span className="u">seg</span>
          </div>
        </div>
      </div>
    </div>
  );
}
