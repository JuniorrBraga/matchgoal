import { AssinarLink } from "./AssinarLink";
import { DottedSurface } from "./DottedSurface";
import { NextBrazilMatch } from "./NextBrazilMatch";
import { Reveal } from "./Reveal";
import { APP_LOGIN_URL } from "../lib/links";

export function Hero() {
  return (
    <section className="hero">
      <DottedSurface color={[0.988, 0.365, 0.02]} opacity={0.28} size={6} fog="#FBF8F3" />
      <div className="wrap">
        <div className="hero-copy">
          <h1 className="display" id="hero-headline">
            Sem achismo,<br />
            <span className="accent">sem picaretagem.</span>
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
            <AssinarLink className="btn big">
              Assinar agora <span className="arrow">→</span>
            </AssinarLink>
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

        {/* APP MOCKUP — próximo jogo do Brasil (dinâmico) */}
        <Reveal className="mock-stack">
          <NextBrazilMatch />
        </Reveal>
      </div>
    </section>
  );
}
