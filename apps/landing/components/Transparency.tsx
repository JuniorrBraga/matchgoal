import { Reveal } from "./Reveal";
import { TrackBars } from "./TrackBars";

const testimonials = [
  '[ DEPOIMENTO 1 — "decidi com dado pela 1ª vez" ]',
  "[ DEPOIMENTO 2 — foco na transparência / track record aberto ]",
  "[ DEPOIMENTO 3 — foco na imagem compartilhável ]",
];

export function Transparency() {
  return (
    <section className="section-pad dark" id="transparencia">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow on-dark">Transparência · track record</span>
          <h2 className="sec-title">
            A única que mostra
            <br />
            quando a IA erra.
          </h2>
          <p className="lead on-dark">
            Num mercado cheio de quem só aparece pra contar o que acertou, a gente faz o
            contrário: publica o histórico completo — acertos e erros. Você não precisa confiar
            na nossa palavra. Você confere.
          </p>
        </Reveal>

        <div className="track-wrap">
          <Reveal className="chart-card">
            <div className="ch-head">
              <h4>Histórico recente de análises</h4>
              <div className="chart-legend">
                <span>
                  <i style={{ background: "var(--br-green)" }} />
                  Acerto
                </span>
                <span>
                  <i style={{ background: "rgba(216,73,43,.85)" }} />
                  Erro
                </span>
              </div>
            </div>
            <TrackBars />
            <p
              className="placeholder-note"
              style={{ textAlign: "left", color: "var(--muted-d)", marginTop: 14 }}
            >
              [ Dados ilustrativos — substituir pelo track record real antes de publicar ]
            </p>
          </Reveal>

          <Reveal className="stats">
            <div className="stat">
              <span className="v">
                <span className="ph">[ —— ]</span>
              </span>
              <span className="k">análises geradas</span>
            </div>
            <div className="stat">
              <span className="v">
                <span className="ph">[ —— ]</span>
              </span>
              <span className="k">usuários ativos</span>
            </div>
            <div className="stat">
              <span className="v">100%</span>
              <span className="k">histórico público, erros inclusos</span>
            </div>
          </Reveal>
        </div>

        <div className="tess">
          {testimonials.map((quote, i) => (
            <Reveal as="div" className="tcard" key={i}>
              <div className="ph-quote">{quote}</div>
              <div className="who">
                <div className="avatar">[ foto ]</div>
                <div className="meta">
                  <div className="nm">Nome do usuário</div>
                  <div className="role">capturar antes de publicar</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal as="p" className="authority">
          Dados via <b>[ inserir provedores ]</b> · Leitura processada por IA. Nunca inventamos
          números — só publicamos com lastro real.
        </Reveal>
      </div>
    </section>
  );
}
