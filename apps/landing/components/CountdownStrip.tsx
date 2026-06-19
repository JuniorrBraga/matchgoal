"use client";

import { useEffect, useState } from "react";
import { CountryFlag } from "./CountryFlag";
import {
  brasilFixtures,
  brasilLastResult,
  selectNextBrasilFixture,
} from "../lib/brasilFixtures";

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
type Parts = { d: string; h: string; m: string; s: string };

function computeTo(target: number): Parts {
  let diff = target - Date.now();
  if (diff < 0) diff = 0;
  return {
    d: pad(Math.floor(diff / 86400000)),
    h: pad(Math.floor((diff % 86400000) / 3600000)),
    m: pad(Math.floor((diff % 3600000) / 60000)),
    s: pad(Math.floor((diff % 60000) / 1000)),
  };
}

/**
 * Faixa "Brasil na Copa": a estreia já passou (1-1 com o Marrocos), então em vez
 * do antigo "Brasil estreia em…" mostramos o resultado REAL + a contagem para o
 * PRÓXIMO jogo do Brasil. As leituras que bateram ficam no card do Hero
 * (EstreiaReads), para esta faixa não ficar poluída.
 *
 * SSR-safe: 1º render usa o último fixture (= próximo jogo) e o relógio zerado;
 * o cliente ajusta no useEffect, evitando mismatch de hidratação.
 */
export function CountdownStrip() {
  const lr = brasilLastResult;
  const [next, setNext] = useState(brasilFixtures[brasilFixtures.length - 1]);
  const [t, setT] = useState<Parts>({ d: "00", h: "00", m: "00", s: "00" });

  useEffect(() => {
    const fx = selectNextBrasilFixture();
    setNext(fx);
    const target = new Date(fx.kickoff).getTime();
    const tick = () => setT(computeTo(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="cd-strip" id="top">
      <div className="wrap">
        <span className="cd-info">
          <span className="cd-flag">
            <CountryFlag code="BRA" name="Brasil" size={18} />
          </span>
          <span className="cd-label">
            <b>Brasil na Copa</b> · estreia {lr.score.bra}–{lr.score.opp} {lr.opponentName}
          </span>
        </span>

        <div className="cd-next">
          <span className="cd-next__label">Próximo: Brasil × {next.opponentName} em</span>
          <div className="cd-clock" aria-live="polite">
            <div className="cd-unit">
              <span className="n">{t.d}</span>
              <span className="u">dias</span>
            </div>
            <div className="cd-unit g">
              <span className="n">{t.h}</span>
              <span className="u">h</span>
            </div>
            <div className="cd-unit y">
              <span className="n">{t.m}</span>
              <span className="u">min</span>
            </div>
            <div className="cd-unit">
              <span className="n">{t.s}</span>
              <span className="u">s</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
