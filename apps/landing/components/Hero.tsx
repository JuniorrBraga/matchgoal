import { DottedSurface } from "./DottedSurface";
import { ProbBar } from "./ProbBar";
import { Reveal } from "./Reveal";
import { ABACATE_CHECKOUT, APP_LOGIN_URL } from "../lib/links";

export function Hero() {
  return (
    <section className="hero">
      <DottedSurface color={[0.988, 0.365, 0.02]} opacity={0.28} size={6} fog="#FBF8F3" />
      <div className="wrap">
        <div className="hero-copy">
          <h1 className="display" id="hero-headline">
            Sem achismo, <span className="accent">sem picaretagem.</span>
          </h1>
          <span className="eyebrow" style={{ display: "block", marginTop: 16 }}>
            Análise de futebol com I.A.
          </span>
          <p className="lead sub" id="hero-sub">
            O MatchGoal usa IA conectada a dados esportivos pra ler cada partida da Copa:
            probabilidades, cenários e recortes históricos. Você decide com inteligência, não
            com palpite de grupo de WhatsApp.
          </p>
          <div className="hero-cta">
            <a className="btn big" href={ABACATE_CHECKOUT}>
              Assinar agora <span className="arrow">→</span>
            </a>
            <a className="btn ghost" href={APP_LOGIN_URL}>
              Já sou assinante
            </a>
          </div>
          <div className="hero-foot">
            <span className="seal18">+18</span>
            <span className="micro">
              Acesso imediato após o pagamento · Cancele quando quiser · Aposte com responsabilidade
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
                  style={{ background: "linear-gradient(135deg,#C8102E,#7a0f1f)" }}
                >
                  MAR
                </div>
                <span className="nm">Marrocos</span>
              </div>
            </div>
            <div className="match-meta">Grupo C · 13 jun · 19h00 · processado por IA há 2 min</div>
            <div className="prob-block">
              <h4>Probabilidade de resultado</h4>
              <div className="prob">
                <div className="top">
                  <span>Vitória Brasil</span>
                  <span className="pct">52%</span>
                </div>
                <ProbBar value={52} variant="o" />
              </div>
              <div className="prob">
                <div className="top">
                  <span>Empate</span>
                  <span className="pct">26%</span>
                </div>
                <ProbBar value={26} variant="c" />
              </div>
              <div className="prob">
                <div className="top">
                  <span>Vitória Marrocos</span>
                  <span className="pct">22%</span>
                </div>
                <ProbBar value={22} variant="g" />
              </div>
            </div>
            <div className="scn">
              <span className="chip">
                Ambas marcam <b>56%</b>
              </span>
              <span className="chip">
                +2.5 gols <b>41%</b>
              </span>
              <span className="chip">
                Brasil sem sofrer <b>44%</b>
              </span>
            </div>
            <div className="app-foot">
              <a className="btn" style={{ padding: "11px 18px", fontSize: 14 }} href={ABACATE_CHECKOUT}>
                Gerar imagem
              </a>
              <span className="share">card pronto em 8s</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
