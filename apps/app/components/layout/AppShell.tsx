import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ComplianceBar } from "./ComplianceBar";
import { LoginNudge } from "@/components/marketing/LoginNudge";
import { getAuthState } from "@/lib/auth";

const tickerItems = [
  "Copa do Mundo 2026 • Análise com IA",
  "Probabilidades por mercado",
  "Cenários estatísticos",
  "Bilhetes montados pela IA",
  "Análise de dados — não promessa de resultado",
];

type ActiveSection = "matches" | "grupos" | "paywall";

/** Shell raiz do app (aberto): top bar + ticker + conteúdo + conformidade. */
export async function AppShell({
  children,
  active,
}: {
  children: ReactNode;
  active?: ActiveSection;
}) {
  const auth = await getAuthState();

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
          {auth.loggedIn ? (
            <form action="/auth/signout" method="post">
              <button type="submit" className="topbar__cta">
                Sair
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/login"
                style={{
                  color: "var(--color-text-inverse)",
                  fontSize: 14,
                  fontWeight: 600,
                  marginRight: 12,
                }}
              >
                Entrar
              </Link>
              <Link href="/paywall" className="topbar__cta">
                Assinar
              </Link>
            </>
          )}
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

      {/* Popup de login no canto, só para visitantes não logados */}
      {!auth.loggedIn && <LoginNudge />}
    </div>
  );
}
