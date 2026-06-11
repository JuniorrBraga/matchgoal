import { DottedSurface } from "./DottedSurface";
import { WarningIcon } from "./icons";
import { Reveal } from "./Reveal";
import { ABACATE_CHECKOUT } from "../lib/links";

export function Footer() {
  return (
    <footer className="footer section-pad">
      <DottedSurface color={[0.99, 0.45, 0.08]} opacity={0.6} size={7} fog="#15131A" />
      <div className="wrap">
        <div className="cta-block">
          <Reveal>
            <h2>
              A Copa não espera.
              <br />
              <span className="accent">No dado ou no achismo?</span>
            </h2>
            <p className="urg">
              A Copa começa em <b>11 de junho</b> e o Brasil estreia em <b>13 de junho</b>. São
              104 jogos em poucas semanas, e cada um sem leitura é uma análise que não volta.
            </p>
          </Reveal>
          <Reveal
            style={{ display: "flex", flexDirection: "column", gap: 14, alignItems: "flex-start" }}
          >
            <a className="btn big" href={ABACATE_CHECKOUT}>
              Assinar agora <span className="arrow">→</span>
            </a>
            <span className="micro on-dark">
              PIX ou cartão · +18 · Aposte com responsabilidade
            </span>
          </Reveal>
        </div>

        <Reveal as="p" className="ps">
          <b>PS:</b> Não vendemos sorte nem prometemos retorno: vendemos leitura honesta, com
          histórico aberto pra conferir cada acerto e cada erro. Você vai acompanhar a Copa no
          dado ou no achismo?
        </Reveal>

        <Reveal className="foot-bands">
          <span className="seal18 on-dark">+18</span>
          <span className="respband on-dark" style={{ flex: 1, minWidth: 280 }}>
            <span className="ico">
              <WarningIcon size={18} />
            </span>
            Aposte com responsabilidade. Jogue com moderação. Proibido para menores de 18 anos.
          </span>
        </Reveal>

        <div className="foot-bottom">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/matchgoal-logo-white.png" alt="MatchGoal" />
          <a className="selfx" href="#autoexclusao" id="autoexclusao">
            Autoexclusão · pedir ajuda
          </a>
          <nav className="foot-legal">
            <a href="#termos">Termos</a>
            <a href="#privacidade">Privacidade</a>
            <a href="#responsavel">Jogo responsável</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
