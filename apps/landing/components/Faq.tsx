"use client";

import { useState, type ReactNode } from "react";

type QA = { q: string; a: ReactNode };

const items: QA[] = [
  {
    q: "Garante que vou acertar / ganhar?",
    a: (
      <>
        Não, e quem garante está mentindo. Entregamos <b>probabilidades, não certeza</b>. Aposta
        sempre envolve risco.
      </>
    ),
  },
  {
    q: "É jogo responsável? E se eu perder o controle?",
    a: (
      <>
        Levamos a sério. Aposta é entretenimento para maiores de 18 anos, <b>nunca fonte de
        renda</b>. Se sentir que está perdendo o controle, use a{" "}
        <a href="#autoexclusao">autoexclusão</a> e procure ajuda. Aposte com responsabilidade e
        jogue com moderação.
      </>
    ),
  },
  {
    q: "Isso é só mais um app de palpite?",
    a: (
      <>
        Não. Não vendemos palpite: vendemos <b>leitura de dado por IA</b> sobre fontes esportivas
        reais, com histórico público pra você conferir.
      </>
    ),
  },
  {
    q: "Preciso entender de estatística?",
    a: <>Não. A IA mastiga e te entrega o card fácil de ler.</>,
  },
  {
    q: "Como pago e posso cancelar?",
    a: (
      <>
        R$ 2,99 por análise avulsa ou R$ 29,90/mês ilimitado. Assinatura <b>sem fidelidade</b> —
        cancele quando quiser.
      </>
    ),
  },
  {
    q: "Vocês mostram mesmo quando erram?",
    a: <>Mostramos. Histórico público e completo. É o nosso maior diferencial.</>,
  },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="faq" id="faq-list">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div className="qa" data-open={isOpen} key={i}>
            <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              {item.q}
              <span className="pm">+</span>
            </button>
            <div
              className="ans"
              style={{ maxHeight: isOpen ? 400 : 0 }}
            >
              <div className="inner">{item.a}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
