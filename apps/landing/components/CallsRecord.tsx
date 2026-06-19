import { wins, losses, type Call } from "../lib/callsRecord";

function Row({ c }: { c: Call }) {
  return (
    <div className={`call ${c.hit ? "call--hit" : "call--miss"}`}>
      <span className="call__verdict" aria-label={c.hit ? "acerto" : "erro"}>
        {c.hit ? "✓" : "✗"}
      </span>
      <span className="call__body">
        <span className="call__match">{c.match}</span>
        <span className="call__pick">
          {c.pick === "—" ? "call registrada nos stories" : c.pick}
        </span>
      </span>
      {c.result && <span className="call__score">{c.result}</span>}
    </div>
  );
}

/**
 * Histórico REAL de calls da 1ª rodada: exemplos de acertos + a lista COMPLETA
 * dos erros (acertos e erros à mostra — a proposta da marca).
 */
export function CallsRecord() {
  return (
    <div className="calls">
      {wins.map((c, i) => (
        <Row c={c} key={`w${i}`} />
      ))}
      <div className="calls__note">
        ↑ exemplos de acertos · ↓ os {losses.length} únicos erros da rodada
      </div>
      {losses.map((c, i) => (
        <Row c={c} key={`l${i}`} />
      ))}
    </div>
  );
}
