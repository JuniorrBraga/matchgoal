import { Reveal } from "./Reveal";
import { TrackBars } from "./TrackBars";

const testimonials = [
  {
    quote:
      "Pela primeira vez parei de apostar no achismo. Bati o olho na análise e entendi onde tinha valor de verdade, e onde era cilada. Mudou minha forma de montar os jogos.",
    name: "Rafael Mendes",
    role: "@rafa.mendes",
    initials: "RM",
  },
  {
    quote:
      "O que me ganhou foi o histórico aberto: eles mostram acerto e erro, sem maquiar. Aí eu confio na leitura que tô recebendo. Hoje só fecho bilhete depois de ver os dados.",
    name: "Juliana Costa",
    role: "@ju.costa",
    initials: "JC",
  },
  {
    quote:
      "Em 10 segundos eu tenho a leitura da partida pronta. Viraram minha referência quando o assunto é analisar palpite com cabeça, não com sorte.",
    name: "Diego Almeida",
    role: "@diegoalmeida",
    initials: "DA",
  },
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
            contrário: publica o histórico completo: acertos e erros. Você não precisa confiar
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
          </Reveal>

          <Reveal className="stats">
            <div className="stat">
              <span className="v">12.480</span>
              <span className="k">análises geradas</span>
            </div>
            <div className="stat">
              <span className="v">2.140</span>
              <span className="k">usuários ativos</span>
            </div>
            <div className="stat">
              <span className="v">100%</span>
              <span className="k">histórico público, erros inclusos</span>
            </div>
          </Reveal>
        </div>

        <div className="tess">
          {testimonials.map((t, i) => (
            <Reveal as="div" className="tcard" key={i}>
              <p className="quote">“{t.quote}”</p>
              <div className="who">
                <div className="avatar">{t.initials}</div>
                <div className="meta">
                  <div className="nm">{t.name}</div>
                  <div className="role">{t.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
