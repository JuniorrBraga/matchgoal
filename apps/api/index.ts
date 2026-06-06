// @matchgoal/api — camada de backend (integração API-Football + análise).

export { isConfigured, getApiKey, WORLD_CUP_LEAGUE_ID, WORLD_CUP_SEASON } from "./lib/config";
export { apiGet } from "./lib/client";
export {
  getWorldCupFixtures,
  getFixtureById,
  getTeamPlayers,
} from "./services/fixtures";
export { mapFixture, buildSignals, slugify } from "./services/mappers";
export { getLiveMatchAnalysis } from "./services/analysis";
export type { LiveMatchAnalysis } from "./services/analysis";
export type { ApiFixture, ApiPlayerRow, ApiTeam } from "./types";
