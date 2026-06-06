// MatchGoal — engine de análise profunda (puro, sem I/O).
// Modelo: distribuição de POISSON sobre taxas REAIS (gols/jogo, cartões/jogo,
// escanteios/jogo). Probabilidade de "marcar pelo menos 1 gol" = 1 − e^(−λ),
// padrão de mercado para anytime goalscorer. Usado pelos mocks (app) e pela
// integração real (apps/api), garantindo a MESMA leitura e embasamento.

import type { Prediction, ProbabilityOutcome } from "./types/prediction";
import type { PlayerInsight } from "./types/player";

export interface PlayerSignal {
  name: string;
  position?: string;
  /** Gols por jogo na temporada (taxa real). */
  goalsPerGame: number;
  /** Cartões por jogo na temporada (taxa real). */
  cardsPerGame: number;
}

export interface TeamDeepSignals {
  shortName: string;
  /** Força ofensiva 0..1 (relativa ao confronto). */
  attack: number;
  /** Força defensiva 0..1 (relativa ao confronto). */
  defense: number;
  /** Média de cartões da equipe por jogo (~1.5..2.6). */
  teamCardsPerGame: number;
  /** Média de escanteios a favor por jogo (~3.5..6). */
  cornersForPerGame: number;
  keyPlayers: PlayerSignal[];
}

export interface MatchDeepSignals {
  matchId: string;
  home: TeamDeepSignals;
  away: TeamDeepSignals;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const r2 = (v: number) => Math.round(v * 100) / 100;
const io = (p: number) => r2(1 / p);

/** P(X ≥ k) para X ~ Poisson(mean). Base dos mercados de cartões/escanteios. */
export function poissonAtLeast(k: number, mean: number): number {
  let cdf = 0;
  let term = Math.exp(-mean); // i = 0
  for (let i = 0; i < k; i++) {
    cdf += term;
    term *= mean / (i + 1);
  }
  return clamp(1 - cdf, 0.02, 0.98);
}

/** P(marcar ≥ 1 gol) = 1 − e^(−λ). */
export function anytimeScorer(lambda: number): number {
  return clamp(1 - Math.exp(-lambda), 0.04, 0.74);
}

function outcome(label: string, p: number): ProbabilityOutcome {
  return { label, probability: r2(p), impliedOdds: io(p) };
}

function confFromEdge(p: number) {
  const edge = Math.abs(p - 0.5);
  return edge > 0.18 ? "high" : edge > 0.08 ? "medium" : "low";
}

/** Mercado de cartões (over/under 4.5) — Poisson sobre a média real de cartões. */
export function deriveCardsMarket(s: MatchDeepSignals): Prediction {
  // soma das médias das equipes + leve viés de arbitragem em jogos de Copa.
  const expected = s.home.teamCardsPerGame + s.away.teamCardsPerGame + 0.4;
  const over = poissonAtLeast(5, expected); // > 4.5 ⇔ ≥ 5
  return {
    id: `${s.matchId}-cards`,
    matchId: s.matchId,
    market: "cards",
    marketLabel: "Total de cartões (4.5)",
    confidence: confFromEdge(over),
    summary: `Projeção de ~${expected.toFixed(1)} cartões (médias reais das equipes; ref. Copa 2022 = 3,3 amarelos/jogo). Modelo de Poisson.`,
    outcomes: [outcome("Over 4.5", over), outcome("Under 4.5", 1 - over)],
  };
}

/** Mercado de escanteios (over/under 9.5) — Poisson sobre escanteios/jogo. */
export function deriveCornersMarket(s: MatchDeepSignals): Prediction {
  const expected = s.home.cornersForPerGame + s.away.cornersForPerGame;
  const over = poissonAtLeast(10, expected); // > 9.5 ⇔ ≥ 10
  return {
    id: `${s.matchId}-corners`,
    matchId: s.matchId,
    market: "corners",
    marketLabel: "Total de escanteios (9.5)",
    confidence: confFromEdge(over),
    summary: `Projeção de ~${expected.toFixed(1)} escanteios (média real das duas seleções; ref. Copa 2022 = 9,4/jogo). Modelo de Poisson.`,
    outcomes: [outcome("Over 9.5", over), outcome("Under 9.5", 1 - over)],
  };
}

/**
 * Destaques de jogador com EMBASAMENTO:
 * chance de marcar via Poisson da taxa real de gols, ajustada pela defesa
 * adversária; risco de cartão via taxa real de cartões.
 */
export function derivePlayerInsights(s: MatchDeepSignals): PlayerInsight[] {
  const out: PlayerInsight[] = [];
  const pairs: [TeamDeepSignals, TeamDeepSignals][] = [
    [s.home, s.away],
    [s.away, s.home],
  ];

  for (const [team, opp] of pairs) {
    // fator do adversário: defesa forte (0.8) reduz; defesa fraca (0.3) aumenta
    const oppFactor = clamp(1.3 - 0.6 * opp.defense, 0.7, 1.32);
    const minutesShare = 0.9;

    const scorer = [...team.keyPlayers].sort((a, b) => b.goalsPerGame - a.goalsPerGame)[0];
    if (scorer) {
      const lambda = scorer.goalsPerGame * oppFactor * minutesShare;
      const p = anytimeScorer(lambda);
      out.push({
        id: `${s.matchId}-pi-${team.shortName}-score`,
        matchId: s.matchId,
        player: scorer.name,
        team: team.shortName,
        position: scorer.position,
        kind: "scorer",
        label: "Chance de marcar",
        probability: r2(p),
        detail: `${scorer.goalsPerGame.toFixed(2)} gol/jogo na temporada, ajustado pela defesa adversária — modelo de Poisson (anytime scorer).`,
      });
    }

    const risky = [...team.keyPlayers].sort((a, b) => b.cardsPerGame - a.cardsPerGame)[0];
    if (risky && risky.cardsPerGame >= 0.2) {
      const p = clamp(1 - Math.exp(-(risky.cardsPerGame * 0.92)), 0.05, 0.5);
      out.push({
        id: `${s.matchId}-pi-${team.shortName}-card`,
        matchId: s.matchId,
        player: risky.name,
        team: team.shortName,
        position: risky.position,
        kind: "card",
        label: "Risco de cartão",
        probability: r2(p),
        detail: `${risky.cardsPerGame.toFixed(2)} cartão/jogo na temporada — função de marcação e histórico disciplinar.`,
      });
    }
  }
  return out;
}

export interface DeepAnalysis {
  markets: Prediction[];
  playerInsights: PlayerInsight[];
}

export function deriveDeepAnalysis(s: MatchDeepSignals): DeepAnalysis {
  return {
    markets: [deriveCardsMarket(s), deriveCornersMarket(s)],
    playerInsights: derivePlayerInsights(s),
  };
}
