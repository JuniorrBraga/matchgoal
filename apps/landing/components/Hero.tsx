import { DottedSurface } from "./DottedSurface";
import { ProbBar } from "./ProbBar";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="hero">
      <DottedSurface color={[0.988, 0.365, 0.02]} opacity={0.28} size={6} fog="#FBF8F3" />
      <div className="wrap">
        <div className="hero-copy">
          <span className="eyebrow">Análise de futebol · Inteligência artificial</span>
          <h1 className="display" id="hero-headline" style={{ marginTop: 16 }}>
            Análise de futebol com IA.{" "}
            <span className="accent">Sem achismo, sem picaretagem.</span>
          </h1>
          <p className="lead sub" id="hero-sub">
            O MatchGoal usa IA conectada a dados esportivos pra ler cada partida da Copa:
            probabilidades, cenários e recortes históricos. Você decide com inteligência — não
            com palpite de grupo de WhatsApp.
          </p>
          <p className="valprop">
            A maioria das &quot;dicas&quot; de futebol é chute disfarçado de ciência. Aqui é o
            contrário: leitura estatística por IA, em segundos. Não prometemos resultado —
            prometemos clareza. E mostramos nosso histórico, erros inclusos.
          </p>
          <div className="hero-cta">
            <a className="btn big" href="/apps/app">
              Ver análise grátis <span className="arrow">→</span>
            </a>
            <a className="btn ghost" href="/apps/app">
              Ler os dados da partida
            </a>
          </div>
          <div className="hero-foot">
            <span className="seal18">+18</span>
            <span className="micro">
              Sem cartão pra começar · Cancele quando quiser · Aposte com responsabilidade
            </span>
          </div>
        </div>

        {/* APP MOCKUP */}
        <Reveal className="mock-stack">
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
                <div
                  className="crest"
                  style={{ background: "linear-gradient(135deg,#2B2934,#000)" }}
                >
                  CRO
                </div>
                <span className="nm">Croácia</span>
              </div>
            </div>
            <div className="match-meta">Grupo · 13 jun · 13h00 · processado por IA há 2 min</div>
            <div className="prob-block">
              <h4>Probabilidade de resultado</h4>
              <div className="prob">
                <div className="top">
                  <span>Vitória Brasil</span>
                  <span className="pct">54%</span>
                </div>
                <ProbBar value={54} variant="o" />
              </div>
              <div className="prob">
                <div className="top">
                  <span>Empate</span>
                  <span className="pct">27%</span>
                </div>
                <ProbBar value={27} variant="c" />
              </div>
              <div className="prob">
                <div className="top">
                  <span>Vitória Croácia</span>
                  <span className="pct">19%</span>
                </div>
                <ProbBar value={19} variant="g" />
              </div>
            </div>
            <div className="scn">
              <span className="chip">
                Ambas marcam <b>61%</b>
              </span>
              <span className="chip">
                +2.5 gols <b>48%</b>
              </span>
              <span className="chip">
                Brasil sem sofrer <b>33%</b>
              </span>
            </div>
            <div className="app-foot">
              <a className="btn" style={{ padding: "11px 18px", fontSize: 14 }} href="/apps/app">
                Gerar imagem
              </a>
              <span className="share">card pronto em 8s</span>
            </div>
          </div>
          <div className="float-card">
            <div className="k">Cenário mais provável</div>
            <div className="v">
              Brasil <span>2 × 1</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
