// Orquestra a análise profunda a partir de dados REAIS da API-Football.

import { deriveDeepAnalysis } from "@matchgoal/shared";
import type { Match, PlayerInsight, Prediction } from "@matchgoal/shared";
import { getFixtureById, getTeamPlayers } from "./fixtures";
import { buildSignals, mapFixture } from "./mappers";

export interface LiveMatchAnalysis {
  match: Match;
  deepMarkets: Prediction[];
  playerInsights: PlayerInsight[];
}

/**
 * Busca fixture + elencos das duas seleções e roda o engine de análise
 * profunda (mercados de cartões/escanteios + destaques de jogador).
 */
export async function getLiveMatchAnalysis(
  fixtureId: number
): Promise<LiveMatchAnalysis | undefined> {
  const fixture = await getFixtureById(fixtureId);
  if (!fixture) return undefined;

  const [home, away] = await Promise.all([
    getTeamPlayers(fixture.teams.home.id),
    getTeamPlayers(fixture.teams.away.id),
  ]);

  const signals = buildSignals(fixture, home, away);
  const deep = deriveDeepAnalysis(signals);

  return {
    match: mapFixture(fixture),
    deepMarkets: deep.markets,
    playerInsights: deep.playerInsights,
  };
}
