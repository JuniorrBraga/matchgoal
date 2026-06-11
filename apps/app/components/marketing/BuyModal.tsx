"use client";

import Link from "next/link";
import { ABACATE_CHECKOUT } from "@/lib/links";

/** Popup de compra — abre quando um não-assinante clica numa partida travada. */
export function BuyModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <div className="modal-lock">🔒</div>
        <h3 className="modal-title">Análise bloqueada</h3>
        <p className="modal-text">
          Assine o <b>Pro Copa</b> e abra as análises de todas as 104 partidas.
          Probabilidades, cenários estatísticos e bilhetes montados pela IA.
        </p>
        <div className="modal-price">
          R$ 29<small>,90 / mês</small>
        </div>
        <a
          href={ABACATE_CHECKOUT}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary btn--block"
        >
          Assinar agora →
        </a>
        <Link href="/paywall" className="modal-link" onClick={onClose}>
          Ver tudo que está incluso
        </Link>
        <p className="modal-foot">
          Já é assinante?{" "}
          <Link href="/login" onClick={onClose}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
