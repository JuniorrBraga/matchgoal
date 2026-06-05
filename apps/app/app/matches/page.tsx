import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Countdown } from "@/components/matches/Countdown";
import { MatchExplorer } from "@/components/matches/MatchExplorer";
import { getMatches } from "@/mocks";

export const metadata = {
  title: "Partidas — MatchGoal",
};

export default function MatchesPage() {
  const matches = getMatches();
  const opener = matches[0];

  return (
    <AppShell>
      <section className="hero rise" style={{ marginBottom: "var(--space-6)" }}>
        <div className="hero__inner">
          <div>
            <span className="hero__eyebrow">⚽ Copa do Mundo FIFA 2026</span>
            <h1 className="hero__title">
              Leia o jogo<br />
              <span>antes do apito</span>
            </h1>
            <p className="hero__sub">
              Probabilidades, cenários estatísticos e bilhetes montados por IA
              para cada partida. Análise de dados — nunca promessa de resultado.
            </p>
            <div className="hero__actions">
              <Link href={`/matches/${opener.slug}`} className="btn btn--dark">
                Ver análise da abertura
              </Link>
              <Link href="/grupos" className="btn btn--light">
                Tabela dos grupos
              </Link>
            </div>
          </div>

          <Countdown targetISO={opener.kickoff} label="Pontapé inicial em" />
        </div>
      </section>

      <MatchExplorer matches={matches} />
    </AppShell>
  );
}
