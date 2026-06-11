"use client";

import { useState } from "react";
import Link from "next/link";

/** Popup discreto no canto pedindo login (para visitantes não logados). */
export function LoginNudge() {
  const [closed, setClosed] = useState(false);
  if (closed) return null;
  return (
    <div className="login-nudge">
      <button
        className="login-nudge__x"
        onClick={() => setClosed(true)}
        aria-label="Fechar"
      >
        ×
      </button>
      <div className="login-nudge__title">
        <span className="login-nudge__dot">●</span> Já é assinante?
      </div>
      <p className="login-nudge__text">
        Entre para abrir as análises das partidas.
      </p>
      <Link href="/login" className="btn btn--primary btn--sm btn--block">
        Entrar
      </Link>
    </div>
  );
}
