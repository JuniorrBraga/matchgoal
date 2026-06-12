"use client";

import { useEffect, useMemo, useState } from "react";
import type { Match } from "@matchgoal/shared";
import { FeaturedCard } from "./FeaturedCard";
import { MatchRow } from "./MatchRow";
import { BuyModal } from "@/components/marketing/BuyModal";
import { matchPhase } from "@/lib/matchTime";

/**
 * Navegação da lista: filtro por grupo + destaques + jogos.
 * `locked` = visitante sem assinatura → cards mostram cadeado e o clique
 * abre o popup de compra (em vez de abrir a análise).
 * `serverNow` mantém o status (ao vivo/encerrado) consistente no 1º render.
 */
export function MatchExplorer({
  matches,
  locked = false,
  serverNow = Date.now(),
}: {
  matches: Match[];
  locked?: boolean;
  serverNow?: number;
}) {
  const [group, setGroup] = useState<string | null>(null);
  const [buyOpen, setBuyOpen] = useState(false);

  // Relógio compartilhado: atualiza o status dos jogos sozinho (a cada 30s).
  const [now, setNow] = useState(serverNow);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // Real-time: jogos que já terminaram SAEM da lista sozinhos (re-filtra junto
  // com `now`, a cada 30s). Ao vivo sobe para o topo, depois os mais próximos.
  const visible = useMemo(() => {
    const liveFirst = (m: Match) => (matchPhase(m.kickoff, now) === "live" ? 0 : 1);
    return matches
      .filter((m) => matchPhase(m.kickoff, now) !== "finished")
      .sort(
        (a, b) =>
          liveFirst(a) - liveFirst(b) || Date.parse(a.kickoff) - Date.parse(b.kickoff)
      );
  }, [matches, now]);

  const groups = useMemo(
    () => Array.from(new Set(visible.map((m) => m.group))),
    [visible]
  );

  const filtered = group ? visible.filter((m) => m.group === group) : visible;
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
              <FeaturedCard key={m.id} match={m} now={now} locked={locked} onLockedClick={openBuy} />
            ))}
          </div>
        </section>
      )}

      <section className="rise" style={{ animationDelay: "0.08s" }}>
        <div className="section-head">
          <h2 className="section-title">Próximos jogos</h2>
          <span className="eyebrow rt-eyebrow">
            <span className="rt-dot" /> Tempo real · {visible.length} no ar
          </span>
        </div>

        {groups.length > 0 && (
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
        )}

        {filtered.length > 0 ? (
          <div className="match-rows">
            {filtered.map((m) => (
              <MatchRow key={m.id} match={m} now={now} locked={locked} onLockedClick={openBuy} />
            ))}
          </div>
        ) : (
          <div className="card" style={{ padding: "var(--space-6)", textAlign: "center" }}>
            <div style={{ fontSize: 34 }}>🏁</div>
            <p className="muted" style={{ marginTop: 8 }}>
              {visible.length === 0
                ? "Todos os jogos da Copa já aconteceram."
                : "Nenhum jogo por vir neste grupo agora."}
            </p>
          </div>
        )}
      </section>

      <BuyModal open={buyOpen} onClose={() => setBuyOpen(false)} />
    </div>
  );
}
