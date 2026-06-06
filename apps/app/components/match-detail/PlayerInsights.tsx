import type { PlayerInsight } from "@matchgoal/shared";
import { pct } from "@/lib/format";

const kindMeta: Record<string, { icon: string; cls: string }> = {
  scorer: { icon: "⚽", cls: "pin--score" },
  card: { icon: "🟨", cls: "pin--card" },
  assist: { icon: "🅰️", cls: "pin--score" },
  shots: { icon: "🎯", cls: "pin--score" },
};

/** Destaques de jogador (chance de marcar, risco de cartão). */
export function PlayerInsights({ insights }: { insights: PlayerInsight[] }) {
  if (insights.length === 0) return null;
  return (
    <article className="card pins">
      {insights.map((pi) => {
        const meta = kindMeta[pi.kind] ?? kindMeta.scorer;
        return (
          <div className={`pin ${meta.cls}`} key={pi.id}>
            <span className="pin__icon">{meta.icon}</span>
            <div className="pin__body">
              <div className="pin__top">
                <span className="pin__player">
                  {pi.player}
                  <span className="pin__team">{pi.team}</span>
                </span>
                <span className="pin__val">{pct(pi.probability)}</span>
              </div>
              <div className="pin__label">{pi.label}</div>
              <div className="prob-bar" style={{ marginTop: 6 }}>
                <div
                  className="prob-bar__fill prob-bar__fill--lead"
                  style={{ width: pct(pi.probability) }}
                />
              </div>
              <div className="pin__detail">{pi.detail}</div>
            </div>
          </div>
        );
      })}
    </article>
  );
}
