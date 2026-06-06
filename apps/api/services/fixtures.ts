// Serviços de leitura da API-Football (somente quando há chave).

import { apiGet } from "../lib/client";
import { WORLD_CUP_LEAGUE_ID, WORLD_CUP_SEASON } from "../lib/config";
import type { ApiFixture, ApiPlayerRow } from "../types";

/** Os 104 jogos da Copa 2026 (league=1, season=2026). */
export async function getWorldCupFixtures(): Promise<ApiFixture[]> {
  return apiGet<ApiFixture>(
    "/fixtures",
    { league: WORLD_CUP_LEAGUE_ID, season: WORLD_CUP_SEASON },
    { revalidate: 6 * 3600 }
  );
}

export async function getFixtureById(id: number): Promise<ApiFixture | undefined> {
  const rows = await apiGet<ApiFixture>("/fixtures", { id });
  return rows[0];
}

/** Elenco + estatísticas de uma seleção (1ª página para o MVP). */
export async function getTeamPlayers(teamId: number): Promise<ApiPlayerRow[]> {
  return apiGet<ApiPlayerRow>("/players", {
    team: teamId,
    season: WORLD_CUP_SEASON,
    page: 1,
  });
}
