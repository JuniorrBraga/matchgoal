// Camada de dados do app — escolhe entre dados REAIS (API-Football) e mocks.
// Sem chave configurada → usa os mocks (app 100% funcional para desenvolvimento).
// Com API_FOOTBALL_KEY no ambiente → busca os jogos reais da Copa 2026.
//
// Tudo roda server-side (server components). A chave NUNCA vai para o cliente.

import { isConfigured, getWorldCupFixtures, mapFixture } from "@matchgoal/api";
import type { Match } from "@matchgoal/shared";
import {
  getMatches,
  getMatchAnalysis,
  type MatchAnalysis,
} from "@/mocks";

/** Há integração real ativa? (exibido como selo na UI) */
export function liveEnabled(): boolean {
  return isConfigured();
}

/**
 * Lista de jogos. Live: os 104 jogos reais da Copa (league=1, season=2026),
 * com fallback automático para os mocks se a API não responder/sem cobertura.
 */
export async function getMatchesData(): Promise<Match[]> {
  if (!isConfigured()) return getMatches();
  try {
    const fixtures = await getWorldCupFixtures();
    if (!fixtures.length) return getMatches();
    return fixtures
      .map(mapFixture)
      .sort((a, b) => a.kickoff.localeCompare(b.kickoff));
  } catch {
    return getMatches();
  }
}

/**
 * Análise completa de uma partida. Hoje usa os mocks (que já passam pelo MESMO
 * engine de análise profunda do shared). Com a chave, a etapa de mercados
 * avançados/destaques é substituída por dados reais via
 * `getLiveMatchAnalysis(fixtureId)` de @matchgoal/api.
 */
export function getMatchAnalysisData(slug: string): MatchAnalysis | undefined {
  return getMatchAnalysis(slug);
}
