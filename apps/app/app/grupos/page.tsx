import { AppShell } from "@/components/layout/AppShell";
import { StandingsTable } from "@/components/groups/StandingsTable";
import { getStandings } from "@/mocks";

export const metadata = {
  title: "Grupos — MatchGoal",
};

export default function GruposPage() {
  const standings = getStandings();

  return (
    <AppShell>
      <section className="hero rise" style={{ marginBottom: "var(--space-6)" }}>
        <div className="hero__inner" style={{ gridTemplateColumns: "1fr" }}>
          <div>
            <span className="hero__eyebrow">🏆 Fase de grupos</span>
            <h1 className="hero__title">Os 12 grupos<br /><span>da Copa 2026</span></h1>
            <p className="hero__sub">
              48 seleções, 12 grupos. A competição começa em 11 de junho de 2026 —
              ainda sem jogos disputados.
            </p>
          </div>
        </div>
      </section>

      <div className="groups-grid">
        {standings.map((s) => (
          <StandingsTable key={s.group} standing={s} />
        ))}
      </div>
    </AppShell>
  );
}
