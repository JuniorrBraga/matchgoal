"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Match } from "@matchgoal/shared";
import { matchPhase } from "@/lib/matchTime";
import { pct } from "@/lib/format";

function fmt(ms: number): string {
  let s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  s -= d * 86400;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const m = Math.floor(s / 60);
  s -= m * 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return d > 0 ? `${d}d ${p(h)}:${p(m)}:${p(s)}` : `${p(h)}:${p(m)}:${p(s)}`;
}

function pick(matches: Match[], now: number): Match | undefined {
  const live = matches.find((m) => matchPhase(m.kickoff, now) === "live");
  if (live) return live;
  const next = matches
    .filter((m) => Date.parse(m.kickoff) > now)
    .sort((a, b) => Date.parse(a.kickoff) - Date.parse(b.kickoff))[0];
  return next ?? matches[matches.length - 1];
}

/**
 * Card do hero — DINÂMICO: destaca o jogo AO VIVO ou o próximo confronto da
 * Copa, com contagem regressiva que anda sozinha. Substitui o troféu estático.
 * `serverNow` mantém o 1º render igual no server/client (sem mismatch).
 */
export function HeroSpotlight({
  matches,
  serverNow,
}: {
  matches: Match[];
  serverNow: number;
}) {
  const [now, setNow] = useState(serverNow);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const m = pick(matches, now);
  if (!m) return null;

  const phase = matchPhase(m.kickoff, now);
  const s = m.snapshot;

  return (
    <Link href={`/matches/${m.slug}`} className="spotlight">
      <div className="spotlight__head">
        {phase === "live" ? (
          <span className="spotlight__live">
            <i /> AO VIVO
          </span>
        ) : (
          <span className="spotlight__tag">⚡ Próximo jogo</span>
        )}
        <span className="spotlight__group">{m.group}</span>
      </div>

      <div className="spotlight__mid">
        <div className="spotlight__teams">
          <div className="spotlight__team">
            <span className="spotlight__flag">{m.home.flag}</span>
            <b>{m.home.name}</b>
          </div>
          <span className="spotlight__vs">VS</span>
          <div className="spotlight__team">
            <span className="spotlight__flag">{m.away.flag}</span>
            <b>{m.away.name}</b>
          </div>
        </div>

        <div className="spotlight__clock-label">
          {phase === "live" ? "Bola rolando" : "Começa em"}
        </div>
        <div className="spotlight__clock">
          {phase === "live" ? "AGORA" : fmt(Date.parse(m.kickoff) - now)}
        </div>

        {s && (
          <div className="spotlight__odds">
            {(["home", "draw", "away"] as const).map((k, i) => (
              <div className="spotlight__odd" key={k}>
                <span>{["1", "X", "2"][i]}</span>
                <b>{pct(s[k])}</b>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="spotlight__cta">Ver análise da IA →</div>
    </Link>
  );
}
