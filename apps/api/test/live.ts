// Demo AO VIVO: roda o pipeline real (API-Football -> mappers -> engine) usando
// a chave de verdade. Precisa de API_FOOTBALL_KEY no ambiente.
//   API_FOOTBALL_SEASON=2022 API_FOOTBALL_KEY=... pnpm --filter @matchgoal/api live
//
// O plano grátis só libera 2022–2024, então o demo usa a Copa 2022.

import { deriveDeepAnalysis } from "@matchgoal/shared";
import { WORLD_CUP_SEASON } from "../lib/config";
import { getWorldCupFixtures, getTeamPlayers } from "../services/fixtures";
import { buildSignals, mapFixture } from "../services/mappers";

async function main() {
  console.log(`\n🔌 Buscando dados REAIS da API-Football (season ${WORLD_CUP_SEASON})...\n`);

  const fixtures = await getWorldCupFixtures();
  console.log(`Jogos retornados: ${fixtures.length}`);
  if (!fixtures.length) {
    console.log("Sem jogos (plano não cobre esta season). Tente API_FOOTBALL_SEASON=2022.");
    return;
  }

  // Pega um jogo de destaque (com seleções fortes) para a análise.
  const pick =
    fixtures.find((f) => /Argentina|Brazil|France/.test(f.teams.home.name)) ?? fixtures[0];
  const match = mapFixture(pick);
  console.log(`\nJogo: ${match.home.name} x ${match.away.name} — ${match.kickoff}`);
  console.log(`Estádio: ${match.venue}`);

  const [home, away] = await Promise.all([
    getTeamPlayers(pick.teams.home.id),
    getTeamPlayers(pick.teams.away.id),
  ]);
  console.log(`\nElencos (reais): ${match.home.shortName}=${home.length} jogadores, ${match.away.shortName}=${away.length}`);

  const signals = buildSignals(pick, home, away);
  const deep = deriveDeepAnalysis(signals);

  console.log("\n📊 Mercados avançados (a partir de stats REAIS):");
  for (const m of deep.markets) {
    console.log(`  ${m.marketLabel}: ${m.outcomes.map((o) => `${o.label} ${Math.round(o.probability * 100)}%`).join(" / ")}`);
  }
  console.log("\n⭐ Destaques de jogadores (taxas REAIS):");
  for (const pi of deep.playerInsights) {
    console.log(`  ${pi.player} (${pi.team}) — ${pi.label}: ${Math.round(pi.probability * 100)}%`);
  }
  console.log("\n✅ Pipeline real funcionando ponta a ponta.\n");
}

main().catch((e) => {
  console.error("ERRO:", e.message);
  process.exit(1);
});
