import type { StatScenario } from "@matchgoal/shared";
import { pct } from "@/lib/format";

/** Cenário estatístico em linguagem natural (histórico observado). */
export function ScenarioCard({ scenario }: { scenario: StatScenario }) {
  return (
    <article className="card scenario-card">
      <div className="scenario-card__top">
        <h3 className="scenario-card__title">{scenario.title}</h3>
        <div className="scenario-card__hit">
          <b>{pct(scenario.hitRate)}</b>
          <small>{scenario.sampleSize} jogos</small>
        </div>
      </div>
      <p className="scenario-card__narr">{scenario.narrative}</p>
      <div className="scenario-card__tags">
        {scenario.tags.map((t) => (
          <span className="tag" key={t}>
            #{t}
          </span>
        ))}
      </div>
    </article>
  );
}
