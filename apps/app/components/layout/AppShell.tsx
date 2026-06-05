import Link from "next/link";
import type { ReactNode } from "react";
import { ComplianceBar } from "./ComplianceBar";

const tickerItems = [
  "Copa do Mundo 2026 • Análise com IA",
  "Probabilidades por mercado",
  "Cenários estatísticos",
  "Bilhetes montados pela IA",
  "Análise de dados — não promessa de resultado",
];

/** Shell raiz do app: top bar laranja + ticker + conteúdo + conformidade. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar__row">
          <Link href="/matches" className="brand">
            <span className="brand__mark">⚽</span>
            <span className="brand__name">
              Match<span style={{ color: "var(--color-ink)" }}>Goal</span>
            </span>
          </Link>
          <nav className="topbar__nav">
            <Link href="/matches">Partidas</Link>
            <Link href="/grupos">Grupos</Link>
            <Link href="/paywall">Planos</Link>
          </nav>
          <span className="topbar__spacer" />
          <Link href="/paywall" className="topbar__cta">
            Assinar Pro
          </Link>
        </div>
      </header>

      <div className="ticker" aria-hidden="true">
        <div className="container">
          <div className="ticker__track">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span className="ticker__item" key={i}>
                <span className="ticker__dot">●</span>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <main className="app-main">
        <div className="container">{children}</div>
      </main>

      <ComplianceBar />
    </div>
  );
}
