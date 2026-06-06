// MatchGoal — tipos de predição e cenários estatísticos da IA.

export type MarketKey =
  | "1x2"
  | "over_under"
  | "btts"
  | "double_chance"
  | "correct_score"
  | "cards"
  | "corners";

export type Confidence = "low" | "medium" | "high";

export interface ProbabilityOutcome {
  /** Rótulo legível, ex.: "Casa", "Over 2.5", "Ambas marcam — Sim". */
  label: string;
  /** Probabilidade estimada pela IA, 0..1. */
  probability: number;
  /** Odd implícita (1/probabilidade) — referência, NUNCA promessa de retorno. */
  impliedOdds?: number;
}

/** Distribuição de probabilidade da IA para um mercado da partida. */
export interface Prediction {
  id: string;
  matchId: string;
  market: MarketKey;
  /** Nome do mercado, ex.: "Resultado final", "Total de gols". */
  marketLabel: string;
  outcomes: ProbabilityOutcome[];
  confidence: Confidence;
  /** Texto curto da IA explicando a leitura do mercado. */
  summary: string;
}

/**
 * Cenário estatístico em linguagem natural baseado em histórico observado.
 * Ex.: "Nos últimos 5 jogos com o goleiro X, deu under 1.5".
 */
export interface StatScenario {
  id: string;
  matchId: string;
  title: string; // "Under 1.5 com o goleiro X"
  narrative: string; // frase completa do cenário
  /** Tamanho da amostra histórica, ex.: 5. */
  sampleSize: number;
  /** Frequência observada do evento na amostra, 0..1. */
  hitRate: number;
  tags: string[]; // ["under", "goleiro", "defesa"]
}
