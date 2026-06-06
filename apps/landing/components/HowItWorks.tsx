import { CalendarIcon, ChartIcon, ListSearchIcon } from "./icons";
import { Reveal } from "./Reveal";

const steps = [
  {
    ghost: "01",
    num: "PASSO 01",
    Icon: CalendarIcon,
    title: "Escolha a partida",
    body: (
      <>
        Selecione qualquer jogo da Copa. São <b>104 partidas</b> cobertas, da fase de grupos à
        final.
      </>
    ),
  },
  {
    ghost: "02",
    num: "PASSO 02",
    Icon: ChartIcon,
    title: "A IA analisa os dados",
    body: (
      <>
        Nossa IA, ligada a APIs de dados esportivos, processa histórico, contexto e os números
        que importam.
      </>
    ),
  },
  {
    ghost: "03",
    num: "PASSO 03",
    Icon: ListSearchIcon,
    title: "Receba cenários e bilhetes prontos",
    body: (
      <>
        Em segundos: probabilidades, cenários prováveis, recortes históricos e uma imagem pronta
        pra compartilhar.
      </>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="section-pad" id="como">
      <div className="wrap">
        <Reveal className="sec-head">
          <span className="eyebrow">Como funciona</span>
          <h2 className="sec-title">
            Do jogo ao dado
            <br />
            em três passos.
          </h2>
        </Reveal>
        <div className="steps">
          {steps.map(({ ghost, num, Icon, title, body }) => (
            <Reveal as="article" className="step" key={ghost}>
              <span className="big-ghost">{ghost}</span>
              <span className="num">{num}</span>
              <div className="ic">
                <Icon />
              </div>
              <h3>{title}</h3>
              <p>{body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
