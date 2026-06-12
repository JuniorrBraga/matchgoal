// Estado de uma partida derivado da DATA (sem precisar de feed externo).
// Atualiza sozinho com o tempo: a cada carregamento, jogos passam de
// "upcoming" → "live" → "finished" automaticamente.

export type MatchPhase = "upcoming" | "live" | "finished";

/** Janela em que tratamos a partida como "ao vivo" (90' + intervalo + acréscimos). */
export const LIVE_WINDOW_MS = 125 * 60 * 1000;

export function matchPhase(kickoffISO: string, now: number = Date.now()): MatchPhase {
  const start = Date.parse(kickoffISO);
  if (Number.isNaN(start) || now < start) return "upcoming";
  if (now < start + LIVE_WINDOW_MS) return "live";
  return "finished";
}

export const phaseLabel: Record<MatchPhase, string> = {
  upcoming: "Em breve",
  live: "Ao vivo",
  finished: "Encerrado",
};
