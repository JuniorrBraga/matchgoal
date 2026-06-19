import type { Match } from "@matchgoal/shared";
import { kickoffLabel } from "@/lib/format";
import { matchPhase } from "@/lib/matchTime";
import { CountryFlag } from "@/components/ui/CountryFlag";

/** Poster hero do detalhe + faixa com a leitura da IA. */
export function AiAnalysisHeader({
  match,
  summary,
}: {
  match: Match;
  summary: string;
}) {
  const finished = match.result && matchPhase(match.kickoff) === "finished";

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
            {finished && <span className="badge badge--dark">Encerrado</span>}
          </div>

          <div className="poster__teams">
            <span className="poster__team">
              <CountryFlag code={match.home.shortName} name={match.home.name} size={42} className="flag" />
              {match.home.name}
            </span>
            <span className="poster__vs">
              {finished ? `${match.result!.home} × ${match.result!.away}` : "VS"}
            </span>
            <span className="poster__team">
              <CountryFlag code={match.away.shortName} name={match.away.name} size={42} className="flag" />
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
