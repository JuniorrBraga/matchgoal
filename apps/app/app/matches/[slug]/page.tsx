import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { AiAnalysisHeader } from "@/components/match-detail/AiAnalysisHeader";
import { FormGuide } from "@/components/match-detail/FormGuide";
import { ProbabilityCard } from "@/components/match-detail/ProbabilityCard";
import { ScenarioCard } from "@/components/match-detail/ScenarioCard";
import { PlayerInsights } from "@/components/match-detail/PlayerInsights";
import { InsightPanel } from "@/components/match-detail/InsightPanel";
import { BetSlipCard } from "@/components/bet-slip/BetSlipCard";
import { getMatchAnalysis, getMatches } from "@/mocks";

export function generateStaticParams() {
  return getMatches().map((m) => ({ slug: m.slug }));
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const analysis = getMatchAnalysis(slug);
  if (!analysis) notFound();

  const { match, predictions, deepMarkets, scenarios, playerInsights, betSlips } =
    analysis;
  const headline =
    predictions.find((p) => p.market === "1x2")?.summary ??
    "Análise em preparação.";

  return (
    <AppShell active="matches">
      <Link href="/matches" className="back-link" style={{ marginBottom: "var(--space-4)", display: "inline-flex" }}>
        ← Voltar para partidas
      </Link>

      <div className="stack">
        <AiAnalysisHeader match={match} summary={headline} />

        <div className="detail-grid">
          <div className="stack">
            <FormGuide match={match} />

            <section>
              <div className="section-head">
                <h2 className="section-title">Probabilidades</h2>
              </div>
              <div className="cards-2">
                {predictions.map((p) => (
                  <ProbabilityCard key={p.id} prediction={p} />
                ))}
              </div>
            </section>

            {deepMarkets.length > 0 && (
              <section>
                <div className="section-head">
                  <h2 className="section-title">Mercados avançados</h2>
                  <span className="eyebrow">Cartões · Escanteios</span>
                </div>
                <div className="cards-2">
                  {deepMarkets.map((p) => (
                    <ProbabilityCard key={p.id} prediction={p} />
                  ))}
                </div>
              </section>
            )}

            {playerInsights.length > 0 && (
              <section>
                <div className="section-head">
                  <h2 className="section-title">Destaques de jogadores</h2>
                  <span className="eyebrow">por IA</span>
                </div>
                <PlayerInsights insights={playerInsights} />
              </section>
            )}

            {scenarios.length > 0 && (
              <section>
                <div className="section-head">
                  <h2 className="section-title">Cenários</h2>
                </div>
                <div className="cards-2">
                  {scenarios.map((s) => (
                    <ScenarioCard key={s.id} scenario={s} />
                  ))}
                </div>
              </section>
            )}
          </div>

          <InsightPanel predictions={predictions} />
        </div>

        <section>
          <div className="section-head">
            <h2 className="section-title">Bilhetes da IA</h2>
            <span className="eyebrow">{betSlips.length} sugestões</span>
          </div>
          <div className="cards-2">
            {betSlips.map((b) => (
              <BetSlipCard key={b.id} slip={b} matchSlug={match.slug} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
