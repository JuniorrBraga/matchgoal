import Link from "next/link";
import type { Match } from "@matchgoal/shared";
import { kickoffShort, pct } from "@/lib/format";

/** Linha compacta estilo "broadcast" para a lista completa de jogos. */
export function MatchRow({ match }: { match: Match }) {
  const s = match.snapshot;
  const lead = s ? Math.max(s.home, s.draw, s.away) : 0;
  const when = kickoffShort(match.kickoff);

  return (
    <Link href={`/matches/${match.slug}`} className="mrow">
      <div className="mrow__when">
        {when.day}
        <small>{when.time}</small>
      </div>

      <div className="mrow__teams">
        <div className="mrow__team">
          <span className="flag">{match.home.flag}</span>
          {match.home.name}
        </div>
        <div className="mrow__team">
          <span className="flag">{match.away.flag}</span>
          {match.away.name}
        </div>
        <div className="mrow__group">
          {match.group}
          {match.analysisTier === "free" && " · Análise grátis"}
        </div>
      </div>

      {s && (
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
      )}
    </Link>
  );
}
