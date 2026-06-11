import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ComplianceBar } from "./ComplianceBar";
import { HeaderAuth } from "./HeaderAuth";
import { LoginNudge } from "@/components/marketing/LoginNudge";

const tickerItems = [
  "Copa do Mundo 2026 • Análise com IA",
  "Probabilidades por mercado",
  "Cenários estatísticos",
  "Bilhetes montados pela IA",
  "Análise de dados — não promessa de resultado",
];

type ActiveSection = "matches" | "grupos" | "paywall";

/**
 * Shell raiz do app (aberto). ESTÁTICO de propósito: não chama getAuthState,
 * então as páginas que o usam (grupos, planos, obrigado) são pré-renderizadas
 * e o Next consegue fazer prefetch → navegação instantânea. O estado de login
 * (Entrar/Sair e o nudge) é resolvido no client, sem travar a navegação.
 */
export function AppShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: ActiveSection;
}) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="container topbar__row">
          <Link href="/matches" className="brand" aria-label="MatchGoal">
            <Image
              className="brand__logo"
              src="/brand/logo-white.png"
              alt="MatchGoal"
              width={84}
              height={48}
              priority
            />
          </Link>
          <nav className="topbar__nav">
            <Link href="/matches" className={active === "matches" ? "active" : undefined}>
              Partidas
            </Link>
            <Link href="/grupos" className={active === "grupos" ? "active" : undefined}>
              Grupos
            </Link>
            <Link href="/paywall" className={active === "paywall" ? "active" : undefined}>
              Planos
            </Link>
          </nav>
          <span className="topbar__spacer" />
          <HeaderAuth />
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

      {/* Popup de login no canto (se esconde sozinho para quem já está logado) */}
      <LoginNudge />
    </div>
  );
}
