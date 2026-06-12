"use client";

import { useEffect, useState } from "react";
import { LIVE_WINDOW_MS } from "@/lib/matchTime";

type State =
  | { mode: "countdown"; d: number; h: number; m: number; s: number }
  | { mode: "live" }
  | { mode: "done" };

function compute(kickoffs: number[], now: number): State {
  // Tem jogo rolando agora?
  if (kickoffs.some((k) => now >= k && now < k + LIVE_WINDOW_MS)) {
    return { mode: "live" };
  }
  // Próximo jogo no futuro.
  const next = kickoffs.filter((k) => k > now).sort((a, b) => a - b)[0];
  if (next == null) return { mode: "done" };
  let delta = Math.max(0, Math.floor((next - now) / 1000));
  const d = Math.floor(delta / 86400);
  delta -= d * 86400;
  const h = Math.floor(delta / 3600);
  delta -= h * 3600;
  const m = Math.floor(delta / 60);
  const s = delta - m * 60;
  return { mode: "countdown", d, h, m, s };
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Relógio do hero — DINÂMICO: mira sempre o próximo jogo da Copa, mostra
 * "AO VIVO" quando tem jogo rolando e se reconfigura sozinho ao longo do
 * torneio. Recebe a lista de todos os kickoffs.
 */
export function Countdown({ kickoffs }: { kickoffs: string[] }) {
  const ks = kickoffs.map((k) => Date.parse(k)).filter((n) => !Number.isNaN(n));
  // Inicia nulo para não dar mismatch de hidratação (server vs client).
  const [st, setSt] = useState<State | null>(null);

  useEffect(() => {
    setSt(compute(ks, Date.now()));
    const id = setInterval(() => setSt(compute(ks, Date.now())), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kickoffs.join("|")]);

  if (!st || st.mode === "done") {
    return (
      <div className="countdown">
        <div className="countdown__label">Copa do Mundo 2026</div>
        <div className="countdown__live">
          <span className="countdown__live-dot" /> Em andamento
        </div>
      </div>
    );
  }

  if (st.mode === "live") {
    return (
      <div className="countdown countdown--live">
        <div className="countdown__label">Tem jogo rolando</div>
        <div className="countdown__live">
          <span className="countdown__live-dot" /> AO VIVO AGORA
        </div>
      </div>
    );
  }

  const cells: [number, string][] = [
    [st.d, "Dias"],
    [st.h, "Horas"],
    [st.m, "Min"],
    [st.s, "Seg"],
  ];

  return (
    <div className="countdown">
      <div className="countdown__label">Próximo jogo começa em</div>
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
