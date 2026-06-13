import type { Prediction } from "@matchgoal/shared";
import { pct } from "@/lib/format";

function topOf(p?: Prediction) {
  if (!p) return null;
  return p.outcomes.reduce((a, b) => (b.probability > a.probability ? b : a));
}

/** Painel lateral: leituras rápidas da IA. */
export function InsightPanel({ predictions }: { predictions: Prediction[] }) {
  const byMarket = (k: string) => predictions.find((p) => p.market === k);
  const rows: { label: string; outcome: ReturnType<typeof topOf> }[] = [
    { label: "Resultado", outcome: topOf(byMarket("1x2")) },
    { label: "Total de gols", outcome: topOf(byMarket("over_under")) },
    { label: "Ambas marcam", outcome: topOf(byMarket("btts")) },
  ];

  return (
    <aside className="side-panel">
      <div className="insight">
        <h3>Leituras rápidas</h3>
        {rows.map(
          (r) =>
            r.outcome && (
              <div className="insight__row" key={r.label}>
                <span>
                  <span className="muted" style={{ fontSize: 12, display: "block" }}>
                    {r.label}
                  </span>
                  {r.outcome.label}
                </span>
                <b>{pct(r.outcome.probability)}</b>
              </div>
            )
        )}
      </div>
    </aside>
  );
}
