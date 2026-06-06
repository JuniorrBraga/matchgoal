// Configuração da integração API-Football (API-Sports v3).
// Plano grátis: 100 req/dia. Copa do Mundo 2026 = league id 1, season 2026.

export const API_BASE = "https://v3.football.api-sports.io";
export const WORLD_CUP_LEAGUE_ID = 1;

// Season configurável: o plano grátis só libera 2022–2024 (a Copa real é 2022).
// A Copa 2026 (season 2026) exige plano Pro. Default 2026; para testar ao vivo
// no grátis, use API_FOOTBALL_SEASON=2022.
export const WORLD_CUP_SEASON = Number(process.env.API_FOOTBALL_SEASON ?? 2026);

/** Lê a chave do ambiente (NUNCA commitar a chave real). */
export function getApiKey(): string | undefined {
  return process.env.API_FOOTBALL_KEY;
}

/** Há chave configurada? Decide entre dados reais e mocks. */
export function isConfigured(): boolean {
  return Boolean(getApiKey());
}
