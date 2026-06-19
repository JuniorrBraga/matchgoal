"use client";

import Link from "next/link";
import type { Match } from "@matchgoal/shared";
import { kickoffShort, pct } from "@/lib/format";
import { matchPhase } from "@/lib/matchTime";
import { CountryFlag } from "@/components/ui/CountryFlag";

/** Linha compacta da lista. `locked` = não-assinante (abre popup de compra). */
export function MatchRow({
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
  const when = kickoffShort(match.kickoff);
  const phase = matchPhase(match.kickoff, now ?? Date.now());
  const finished = phase === "finished" && match.result;

  const inner = (
    <>
      <div className={`mrow__when mrow__when--${phase}`}>
        {phase === "live" ? (
          <>
            <span className="livedot" />
            <small>Ao vivo</small>
          </>
        ) : phase === "finished" ? (
          <small>Encerrado</small>
        ) : (
          <>
            {when.day}
            <small>{when.time}</small>
          </>
        )}
      </div>

      <div className="mrow__teams">
        <div className="mrow__team">
          <CountryFlag code={match.home.shortName} name={match.home.name} size={18} className="flag" />
          {match.home.name}
        </div>
        <div className="mrow__team">
          <CountryFlag code={match.away.shortName} name={match.away.name} size={18} className="flag" />
          {match.away.name}
        </div>
        <div className="mrow__group">
          {match.group}
          {locked && <span className="mrow__lock"> · 🔒 Assine para abrir</span>}
        </div>
      </div>

      {finished ? (
        <div className="mrow__score" aria-label="Placar final">
          <b>{match.result!.home}</b>
          <i>×</i>
          <b>{match.result!.away}</b>
        </div>
      ) : (
        s && (
          <div className="mrow__odds">
            {(["home", "draw", "away"] as const).map((k, i) => (
              <div
                key={k}
                className={`mini-odd${s[k] === lead ? " mini-odd--lead" : ""}`}
              >
                <span className="mini-odd__k">{["1", "X", "2"][i]}</span>
                <span className="mini-odd__v">{pct(s[k])}</span>
              </div>
            ))}
          </div>
        )
      )}
    </>
  );

  if (locked) {
    return (
      <div
        className="mrow mrow--locked"
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
    <Link href={`/matches/${match.slug}`} className="mrow">
      {inner}
    </Link>
  );
}
