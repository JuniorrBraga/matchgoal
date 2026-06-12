"use client";

import Link from "next/link";
import type { Match } from "@matchgoal/shared";
import { kickoffLabel, pct } from "@/lib/format";
import { matchPhase } from "@/lib/matchTime";

/** Card grande de jogo em destaque. `locked` = não-assinante (abre popup de compra). */
export function FeaturedCard({
  match,
  now,
  locked,
  onLockedClick,
}: {
  match: Match;
  now?: number;
  locked?: boolean;
  onLockedClick?: () => void;
}) {
  const s = match.snapshot;
  const lead = s ? Math.max(s.home, s.draw, s.away) : 0;
  const phase = matchPhase(match.kickoff, now ?? Date.now());
  const when =
    phase === "live" ? (
      <span className="fcard__when fcard__when--live">
        <span className="livedot" /> Ao vivo
      </span>
    ) : phase === "finished" ? (
      <span className="fcard__when fcard__when--done">Encerrado</span>
    ) : (
      <span className="fcard__when">{kickoffLabel(match.kickoff)}</span>
    );

  const inner = (
    <>
      <div
        className="fcard__hero"
        style={{ backgroundImage: `url(${match.heroImageUrl})` }}
      >
        <div className="fcard__top">
          {when}
          {locked ? (
            <span className="badge badge--lock">🔒 Bloqueada</span>
          ) : (
            <span className="badge badge--primary">Análise IA</span>
          )}
        </div>
        <div className="fcard__teams">
          <span className="fcard__team">
            <span className="flag">{match.home.flag}</span>
            {match.home.name}
          </span>
          <span className="fcard__team">
            <span className="flag">{match.away.flag}</span>
            {match.away.name}
          </span>
        </div>
      </div>

      <div className="fcard__body">
        <div className="fcard__meta">
          <span>{match.group}</span>
          <span>{locked ? "🔒 Assine para abrir" : "Análise da IA →"}</span>
        </div>
        {s && (
          <div className="odds-row">
            {(["home", "draw", "away"] as const).map((k, i) => (
              <div
                key={k}
                className={`odds-cell${s[k] === lead ? " odds-cell--lead" : ""}`}
              >
                <span className="odds-cell__k">{["1", "X", "2"][i]}</span>
                <span className="odds-cell__v">{pct(s[k])}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );

  if (locked) {
    return (
      <div
        className="fcard fcard--locked"
        role="button"
        tabIndex={0}
        onClick={onLockedClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onLockedClick?.();
          }
        }}
      >
        {inner}
      </div>
    );
  }

  return (
    <Link href={`/matches/${match.slug}`} className="fcard">
      {inner}
    </Link>
  );
}
