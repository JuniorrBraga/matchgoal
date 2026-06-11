"use client";

import { useMemo, useState } from "react";
import type { Match } from "@matchgoal/shared";
import { FeaturedCard } from "./FeaturedCard";
import { MatchRow } from "./MatchRow";
import { BuyModal } from "@/components/marketing/BuyModal";

/**
 * Navegação da lista: filtro por grupo + destaques + jogos.
 * `locked` = visitante sem assinatura → cards mostram cadeado e o clique
 * abre o popup de compra (em vez de abrir a análise).
 */
export function MatchExplorer({
  matches,
  locked = false,
}: {
  matches: Match[];
  locked?: boolean;
}) {
  const [group, setGroup] = useState<string | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);

  const groups = useMemo(
    () => Array.from(new Set(matches.map((m) => m.group))),
    [matches]
  );

  const filtered = group ? matches.filter((m) => m.group === group) : matches;
  const featured = filtered.filter((m) => m.marquee);
  const openBuy = () => setBuyOpen(true);

  return (
    <div className="stack">
      {featured.length > 0 && (
        <section className="rise">
          <div className="section-head">
            <h2 className="section-title">Em destaque</h2>
            <span className="eyebrow">{featured.length} jogos</span>
          </div>
          <div className="featured-grid">
            {featured.map((m) => (
              <FeaturedCard key={m.id} match={m} locked={locked} onLockedClick={openBuy} />
            ))}
          </div>
        </section>
      )}

      <section className="rise" style={{ animationDelay: "0.08s" }}>
        <div className="section-head">
          <h2 className="section-title">Todos os jogos</h2>
        </div>

        <div className="chips-row" style={{ marginBottom: "var(--space-4)" }}>
          <button
            className={`chip chip--orange${group === null ? " chip--active" : ""}`}
            onClick={() => setGroup(null)}
          >
            Todos
          </button>
          {groups.map((g) => (
            <button
              key={g}
              className={`chip chip--orange${group === g ? " chip--active" : ""}`}
              onClick={() => setGroup(g)}
            >
              {g}
            </button>
          ))}
        </div>

        <div className="match-rows">
          {filtered.map((m) => (
            <MatchRow key={m.id} match={m} locked={locked} onLockedClick={openBuy} />
          ))}
        </div>
      </section>

      <BuyModal open={buyOpen} onClose={() => setBuyOpen(false)} />
    </div>
  );
}
