import type { Prediction } from "@matchgoal/shared";
import { confidenceLabel, odds, pct } from "@/lib/format";

/** Card de um mercado: barras de probabilidade animadas por resultado. */
export function ProbabilityCard({ prediction }: { prediction: Prediction }) {
  const lead = prediction.outcomes.reduce((a, b) =>
    b.probability > a.probability ? b : a
  );

  return (
    <article className="card prob-card">
      <div className="prob-card__head">
        <h3 className="prob-card__market">{prediction.marketLabel}</h3>
        <span className="badge badge--muted">
          Confiança {confidenceLabel(prediction.confidence)}
        </span>
      </div>

      {prediction.outcomes.map((o, i) => {
        const isLead = o.label === lead.label;
        return (
          <div className="prob-outcome" key={`${o.label}-${i}`}>
            <div className="prob-outcome__row">
              <span className="prob-outcome__label">{o.label}</span>
              <span>
                <span className="prob-outcome__val">{pct(o.probability)}</span>
                {o.impliedOdds != null && (
                  <span className="prob-outcome__odds">{odds(o.impliedOdds)}</span>
                )}
              </span>
            </div>
            <div className="prob-bar">
              <div
                className={`prob-bar__fill ${
                  isLead ? "prob-bar__fill--lead" : "prob-bar__fill--rest"
                }`}
                style={{ width: pct(o.probability) }}
              />
            </div>
          </div>
        );
      })}

      <p className="prob-card__summary">{prediction.summary}</p>
    </article>
  );
}
