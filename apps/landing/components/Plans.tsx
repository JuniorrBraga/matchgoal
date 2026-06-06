import type { ReactNode } from "react";
import { CheckIcon } from "./icons";
import { Reveal } from "./Reveal";

function Tick() {
  return (
    <span className="tick">
      <CheckIcon size={13} strokeWidth={3.2} />
    </span>
  );
}

const avulsaFeatures: ReactNode[] = [
  "Análise estatística completa de 1 partida",
  "Card com probabilidades + cenários",
  "Imagem pronta pra compartilhar",
];

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
            Sem cartão, sem pegadinha.
          </h2>
        </Reveal>
        <div className="plans">
          <Reveal as="article" className="plan">
            <span className="ptag">Por análise · pra testar</span>
            <h3>Análise avulsa</h3>
            <p className="desc">O jeito mais barato de ver o produto funcionando.</p>
            <ul>
              {avulsaFeatures.map((f, i) => (
                <li key={i}>
                  <Tick />
                  {f}
                </li>
              ))}
            </ul>
            <div className="price">
              <span className="amt">R$ 2,99</span>
              <span className="per">por análise</span>
            </div>
            <div className="price-sub">sem cadastrar cartão</div>
            <a
              className="btn ghost"
              style={{ border: "1.5px solid var(--line)", justifyContent: "center" }}
              href="/apps/app"
            >
              Testar uma análise
            </a>
          </Reveal>

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
            <a className="btn block" href="/apps/app">
              Assinar o MatchGoal <span className="arrow">→</span>
            </a>
          </Reveal>
        </div>

        <Reveal className="risk">
          <h4>Por que o risco de testar é baixo</h4>
          <p>
            Não prometemos resultado, então não tratamos aposta como aplicação. Comece pela
            análise avulsa de <b>R$ 2,99</b>, sem cadastrar cartão. Não gostou? Não gastou quase
            nada e não ficou preso a nada.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
