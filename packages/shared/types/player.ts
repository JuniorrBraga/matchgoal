// MatchGoal — destaques de jogador (análise mais profunda).

export type PlayerInsightKind = "scorer" | "card" | "assist" | "shots";

export interface PlayerInsight {
  id: string;
  matchId: string;
  /** Nome do jogador. */
  player: string;
  /** Sigla da seleção, ex.: "BRA". */
  team: string;
  position?: string;
  kind: PlayerInsightKind;
  /** Rótulo do mercado/leitura, ex.: "Chance de marcar". */
  label: string;
  /** Probabilidade 0..1. */
  probability: number;
  /** Frase explicando a leitura (base estatística). */
  detail: string;
}
