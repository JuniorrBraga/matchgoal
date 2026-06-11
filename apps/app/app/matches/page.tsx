import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Countdown } from "@/components/matches/Countdown";
import { MatchExplorer } from "@/components/matches/MatchExplorer";
import { getMatchesData } from "@/lib/data";
import { getAuthState } from "@/lib/auth";

export const metadata = {
  title: "Partidas — MatchGoal",
};

export default async function MatchesPage() {
  const matches = await getMatchesData();
  const { active } = await getAuthState();
  const opener = matches[0];

  return (
    <AppShell active="matches">
      <section className="hero hero--home rise" style={{ marginBottom: "var(--space-6)" }}>
        <div className="hero__inner">
          <div className="hero__copy">
            <span className="hero__eyebrow">⚽ Copa do Mundo FIFA 2026</span>
            <h1 className="hero__title">
              Leia o jogo<br />
              <span>antes do apito</span>
            </h1>
            <p className="hero__sub">
              Probabilidades, cenários estatísticos e bilhetes montados por IA
              para cada partida. Análise de dados — nunca promessa de resultado.
            </p>
            <Countdown targetISO={opener.kickoff} label="Pontapé inicial em" />
            <div className="hero__actions">
              <Link
                href={active ? `/matches/${opener.slug}` : "/paywall"}
                className="btn btn--dark"
              >
                {active ? "Ver análise da abertura" : "Assinar para ver análises"}
              </Link>
              <Link href="/grupos" className="btn btn--light">
                Tabela dos grupos
              </Link>
            </div>
          </div>

          <div className="hero__art">
            <div className="hero__trophy-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/trofeu.png"
                alt="Troféu da Copa do Mundo"
                className="hero__trophy"
              />
              <span className="hero__trophy-shine" aria-hidden="true" />
            </div>
          </div>
        </div>
      </section>

      <MatchExplorer matches={matches} locked={!active} />
    </AppShell>
  );
}
