import type { ReactNode } from "react";
import { AssinarLink } from "./AssinarLink";
import { CheckIcon } from "./icons";
import { Reveal } from "./Reveal";

function Tick() {
  return (
    <span className="tick">
      <CheckIcon size={13} strokeWidth={3.2} />
    </span>
  );
}

const ilimitadoFeatures: ReactNode[] = [
  <>
    Análises <b>ILIMITADAS</b>, todas as partidas
  </>,
  "Recortes históricos completos",
  "Cards e imagens sem limite",
  "Track record completo sempre acessível",
];

export function Plans() {
  return (
    <section className="section-pad" id="planos">
      <div className="wrap">
        <Reveal className="sec-head" style={{ textAlign: "center", marginInline: "auto" }}>
          <span className="eyebrow">Planos</span>
          <h2 className="sec-title">
            Comece barato.
            <br />
            Sem pegadinha.
          </h2>
        </Reveal>
        <div className="plans">
          <Reveal as="article" className="plan feat">
            <span className="badge-feat">Copa inteira</span>
            <span className="ptag">Assinatura MatchGoal</span>
            <h3>Ilimitado na Copa</h3>
            <p className="desc">Pra quem vai acompanhar todos os 104 jogos.</p>
            <ul>
              {ilimitadoFeatures.map((f, i) => (
                <li key={i}>
                  <Tick />
                  {f}
                </li>
              ))}
            </ul>
            <div className="price">
              <span className="amt">R$ 29,90</span>
              <span className="per">/mês</span>
            </div>
            <div className="price-sub">menos de R$ 1 por dia · cancele quando quiser</div>
            <AssinarLink className="btn block">
              Assinar o MatchGoal <span className="arrow">→</span>
            </AssinarLink>
          </Reveal>
        </div>

        <Reveal className="risk">
          <h4>Por que o risco de testar é baixo</h4>
          <p>
            Não prometemos resultado, então não tratamos aposta como aplicação. São menos de
            <b> R$ 1 por dia</b> e você <b>cancela quando quiser</b>. Não gostou? Não ficou preso
            a nada.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
