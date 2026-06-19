import type { Match } from "@matchgoal/shared";
import { CountryFlag } from "@/components/ui/CountryFlag";

const pillClass: Record<string, string> = { W: "fp fp--w", D: "fp fp--d", L: "fp fp--l" };
const pillText: Record<string, string> = { W: "V", D: "E", L: "D" };

function Pills({ results }: { results: ("W" | "D" | "L")[] }) {
  return (
    <div className="form-pills">
      {results.map((r, i) => (
        <span className={pillClass[r]} key={i}>
          {pillText[r]}
        </span>
      ))}
    </div>
  );
}

/** Momento das seleções (últimos 5) + confronto direto. */
export function FormGuide({ match }: { match: Match }) {
  if (!match.form && !match.h2h) return null;

  return (
    <article className="card prob-card">
      <div className="prob-card__head">
        <h3 className="prob-card__market">Momento &amp; confronto</h3>
        <span className="badge badge--muted">Últimos 5</span>
      </div>

      {match.form && (
        <div className="stack" style={{ marginBottom: "var(--space-4)" }}>
          <div className="formline" style={{ justifyContent: "space-between" }}>
            <span className="form-team">
              <CountryFlag code={match.home.shortName} name={match.home.name} size={20} className="flag" />
              {match.home.name}
            </span>
            <Pills results={match.form.home} />
          </div>
          <div className="formline" style={{ justifyContent: "space-between", marginTop: 10 }}>
            <span className="form-team">
              <CountryFlag code={match.away.shortName} name={match.away.name} size={20} className="flag" />
              {match.away.name}
            </span>
            <Pills results={match.form.away} />
          </div>
        </div>
      )}

      {match.h2h && (
        <p className="prob-card__summary">
          <strong>Confronto direto:</strong> {match.h2h.summary} — {match.home.shortName}{" "}
          {match.h2h.homeWins}V · {match.h2h.draws}E · {match.h2h.awayWins}V{" "}
          {match.away.shortName}.
        </p>
      )}
    </article>
  );
}
