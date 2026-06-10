import { CheckIcon } from "./icons";
import { Reveal } from "./Reveal";

const benefits = [
  <>
    Decide com cabeça, <b>não no susto.</b>
  </>,
  <>
    <b>10 segundos</b>, não meia hora garimpando print.
  </>,
  <>
    Para de ser o trouxa do bolão: você leva <b>o dado</b> pra mesa.
  </>,
  <>
    Manda a análise no grupo <b>já formatada</b>, com cara de quem entende.
  </>,
  <>
    Toda a Copa coberta, <b>partida a partida.</b>
  </>,
];

export function Differential() {
  return (
    <section className="section-pad" id="diferencial">
      <div className="wrap">
        <div className="dif-grid">
          <Reveal>
            <span className="eyebrow">O diferencial · na prática</span>
            <h2 className="sec-title" style={{ marginTop: 14 }}>
              Em vez de &quot;acho que dá esse time&quot;.
            </h2>
            <p className="lead" style={{ marginTop: 18 }}>
              Você recebe a leitura estruturada: probabilidade de cada cenário, recortes
              históricos relevantes e o card pronto pra ler em <b>10 segundos</b>.
            </p>
            <ul className="dif-list">
              {benefits.map((b, i) => (
                <li key={i}>
                  <span className="tick">
                    <CheckIcon />
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal>
            <div className="share-mock">
              <div className="sm-top">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/matchgoal-logo-white.png" alt="MatchGoal" />
                <span className="sm-tag">imagem pra compartilhar</span>
              </div>
              <div className="sm-match">
                Brasil × Croácia
                <br />
                <span
                  style={{
                    fontStretch: "100%",
                    fontWeight: 700,
                    fontSize: ".5em",
                    color: "var(--muted-d)",
                    letterSpacing: ".04em",
                  }}
                >
                  Grupo · 13 jun · 13h00
                </span>
              </div>
              <div className="sm-row">
                <div className="sm-stat">
                  <div className="k">Vitória BRA</div>
                  <div className="v o">54%</div>
                </div>
                <div className="sm-stat">
                  <div className="k">Ambas marcam</div>
                  <div className="v">61%</div>
                </div>
                <div className="sm-stat">
                  <div className="k">Cenário</div>
                  <div className="v g">2×1</div>
                </div>
              </div>
              <div className="sm-foot">
                Probabilidades, não certezas · +18 · aposte com responsabilidade
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
