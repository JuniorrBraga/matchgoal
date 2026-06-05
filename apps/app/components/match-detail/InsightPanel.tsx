import Link from "next/link";
import type { Prediction } from "@matchgoal/shared";
import { pct } from "@/lib/format";

function topOf(p?: Prediction) {
  if (!p) return null;
  return p.outcomes.reduce((a, b) => (b.probability > a.probability ? b : a));
}

/** Painel lateral: leituras rápidas da IA + CTA para os planos. */
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

      <div className="card" style={{ padding: "var(--space-5)" }}>
        <h3 className="prob-card__market" style={{ marginBottom: 8 }}>
          Quer tudo liberado?
        </h3>
        <p className="muted" style={{ fontSize: 14, marginBottom: "var(--space-4)" }}>
          Assine o Pro e desbloqueie todas as análises premium da Copa.
        </p>
        <Link href="/paywall" className="btn btn--primary btn--block">
          Conhecer planos
        </Link>
      </div>
    </aside>
  );
}
