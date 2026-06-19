// MatchGoal — tipos de bilhete pré-montado pela IA.

import type { MarketKey } from "./prediction";

export type RiskLevel = "conservative" | "balanced" | "aggressive";

export interface BetSlipLeg {
  predictionId: string;
  market: MarketKey;
  /** Seleção do bilhete, ex.: "Over 2.5 gols". */
  selectionLabel: string;
  /** Probabilidade estimada da seleção, 0..1. */
  probability: number;
  /** Odd de referência (não garantida). */
  odds?: number;
}

/**
 * Bilhete sugerido pela IA para uma partida. Reúne seleções (legs) e uma
 * justificativa de leitura — sem links de aposta de terceiros.
 */
export interface BetSlip {
  id: string;
  matchId: string;
  title: string; // "Bilhete equilibrado"
  /** Por que a IA montou o bilhete assim. */
  rationale: string;
  legs: BetSlipLeg[];
  /** Produto das odds das legs — referência, nunca promessa de lucro. */
  combinedOdds?: number;
  riskLevel: RiskLevel;
  /** Imagem compartilhável gerada para o bilhete. */
  shareImageUrl?: string;
}
