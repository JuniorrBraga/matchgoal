import type { Match } from "@matchgoal/shared";
import { kickoffLabel } from "@/lib/format";

/** Poster hero do detalhe + faixa com a leitura da IA. */
export function AiAnalysisHeader({
  match,
  summary,
}: {
  match: Match;
  summary: string;
}) {
  return (
    <section className="stack">
      <div
        className="poster"
        style={{ backgroundImage: `url(${match.heroImageUrl})` }}
      >
        <div className="poster__scrim" />
        <div className="poster__body">
          <div className="poster__meta">
            <span className="badge badge--dark">{kickoffLabel(match.kickoff)}</span>
            <span className="badge badge--primary">{match.group}</span>
            {match.analysisTier === "free" ? (
              <span className="badge badge--free">Análise grátis</span>
            ) : (
              <span className="badge badge--primary">Premium</span>
            )}
          </div>

          <div className="poster__teams">
            <span className="poster__team">
              <span className="flag">{match.home.flag}</span>
              {match.home.name}
            </span>
            <span className="poster__vs">VS</span>
            <span className="poster__team">
              <span className="flag">{match.away.flag}</span>
              {match.away.name}
            </span>
          </div>

          {match.venue && <p className="poster__venue">📍 {match.venue}</p>}
        </div>
      </div>

      <div className="ai-band">
        <span className="ai-band__badge">⚡ Leitura da IA</span>
        <p className="ai-band__text">{summary}</p>
      </div>
    </section>
  );
}
