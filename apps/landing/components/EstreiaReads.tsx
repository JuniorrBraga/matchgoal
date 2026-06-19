import { brasilLastResult } from "../lib/brasilFixtures";

/**
 * Card no Hero com a estreia do Brasil (1-1 com o Marrocos) e as leituras da IA
 * que bateram no resultado real — prova social honesta (substitui o ticker que
 * estava bugando/sobrepondo). Componente estático.
 */
export function EstreiaReads() {
  const lr = brasilLastResult;
  return (
    <div className="estreia">
      <div className="estreia__head">
        <span className="estreia__badge">
          Estreia · {lr.score.bra}–{lr.score.opp} {lr.opponentName}
        </span>
        <span className="estreia__tag">
          {lr.readsThatHit.length} leituras da IA que bateram:
        </span>
      </div>
      <div className="estreia__chips">
        {lr.readsThatHit.map((r) => (
          <span className="estreia__chip" key={r}>
            ✓ {r}
          </span>
        ))}
      </div>
    </div>
  );
}
