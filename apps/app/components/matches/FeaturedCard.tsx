import Link from "next/link";
import type { Match } from "@matchgoal/shared";
import { kickoffLabel, pct } from "@/lib/format";

/** Card grande de jogo em destaque (foto + odds 1X2 em %). */
export function FeaturedCard({ match }: { match: Match }) {
  const s = match.snapshot;
  const lead = s ? Math.max(s.home, s.draw, s.away) : 0;

  return (
    <Link href={`/matches/${match.slug}`} className="fcard">
      <div
        className="fcard__hero"
        style={{ backgroundImage: `url(${match.heroImageUrl})` }}
      >
        <div className="fcard__top">
          <span className="fcard__when">{kickoffLabel(match.kickoff)}</span>
          {match.analysisTier === "free" ? (
            <span className="badge badge--free">Grátis</span>
          ) : (
            <span className="badge badge--primary">Premium</span>
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
          <span>Análise da IA →</span>
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
    </Link>
  );
}
