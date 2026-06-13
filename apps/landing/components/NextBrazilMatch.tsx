"use client";

import { useEffect, useState } from "react";
import { AssinarLink } from "./AssinarLink";
import { ProbBar } from "./ProbBar";
import { brasilFixtures, selectNextBrasilFixture } from "../lib/brasilFixtures";

/**
 * Card do Hero com o PRÓXIMO jogo do Brasil, escolhido dinamicamente pela data.
 * SSR-safe (padrão do CountdownStrip): renderiza o 1º fixture no servidor/1ª pintura
 * e ajusta para o próximo no cliente via useEffect, evitando mismatch de hidratação.
 */
export function NextBrazilMatch() {
  // Índice estável para o SSR (primeiro jogo). Ajustado no cliente.
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const next = selectNextBrasilFixture();
    setIndex(brasilFixtures.indexOf(next));
  }, []);

  const fx = brasilFixtures[index] ?? brasilFixtures[0];

  return (
    <div className="app-card">
      <div className="app-head">
        <span className="tag">Análise da partida</span>
        <span className="live">
          <i /> IA ao vivo
        </span>
      </div>
      <div className="match-row">
        <div className="team">
          <div
            className="crest"
            style={{ background: "linear-gradient(135deg,#1AA64B,#0c6e30)" }}
          >
            BRA
          </div>
          <span className="nm">Brasil</span>
        </div>
        <span className="vs">VS</span>
        <div className="team">
          <div className="crest" style={{ background: fx.opponentCrest }}>
            {fx.opponentCode}
          </div>
          <span className="nm">{fx.opponentName}</span>
        </div>
      </div>
      <div className="match-meta">{fx.meta}</div>
      <div className="prob-block">
        <h4>Probabilidade de resultado</h4>
        <div className="prob">
          <div className="top">
            <span>Vitória Brasil</span>
            <span className="pct">{fx.prob.bra}%</span>
          </div>
          <ProbBar value={fx.prob.bra} variant="o" />
        </div>
        <div className="prob">
          <div className="top">
            <span>Empate</span>
            <span className="pct">{fx.prob.empate}%</span>
          </div>
          <ProbBar value={fx.prob.empate} variant="c" />
        </div>
        <div className="prob">
          <div className="top">
            <span>Vitória {fx.opponentName}</span>
            <span className="pct">{fx.prob.opp}%</span>
          </div>
          <ProbBar value={fx.prob.opp} variant="g" />
        </div>
      </div>
      <div className="scn">
        {fx.chips.map((c) => (
          <span className="chip" key={c.label}>
            {c.label} <b>{c.value}</b>
          </span>
        ))}
      </div>
      <div className="app-foot">
        <AssinarLink className="btn" style={{ padding: "11px 18px", fontSize: 14 }}>
          Seja assinante
        </AssinarLink>
        <span className="share">card pronto em 8s</span>
      </div>
    </div>
  );
}
