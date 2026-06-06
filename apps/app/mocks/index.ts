// MatchGoal — API mockada (frontend-first). Simula o backend que virá depois.
// Dados no formato dos tipos de @matchgoal/shared. Jogos REAIS da Copa 2026.

import type {
  BetSlip,
  GroupStanding,
  Match,
  PlayerInsight,
  Prediction,
  StatScenario,
} from "@matchgoal/shared";
import { matches } from "./matches";
import { predictions, scenarios } from "./predictions";
import { betSlips } from "./bet-slips";
import { standings } from "./standings";
import { getDeepMarkets, getPlayerInsights } from "./deep";

export function getMatches(): Match[] {
  return [...matches].sort((a, b) => a.kickoff.localeCompare(b.kickoff));
}

export function getMarqueeMatches(): Match[] {
  return getMatches().filter((m) => m.marquee);
}

export function getMatch(slug: string): Match | undefined {
  return matches.find((m) => m.slug === slug);
}

/** Próximo jogo a acontecer a partir de uma data (para a contagem regressiva). */
export function getNextMatch(fromISO: string): Match | undefined {
  return getMatches().find((m) => m.kickoff >= fromISO) ?? getMatches()[0];
}

export function getGroups(): string[] {
  return Array.from(new Set(getMatches().map((m) => m.group)));
}

export function getPredictions(matchId: string): Prediction[] {
  return predictions.filter((p) => p.matchId === matchId);
}

export function getScenarios(matchId: string): StatScenario[] {
  return scenarios.filter((s) => s.matchId === matchId);
}

export function getBetSlips(matchId: string): BetSlip[] {
  return betSlips.filter((b) => b.matchId === matchId);
}

export function getBetSlip(slipId: string): BetSlip | undefined {
  return betSlips.find((b) => b.id === slipId);
}

export function getStandings(): GroupStanding[] {
  return standings;
}

export function getDeepAnalysis(matchId: string): Prediction[] {
  return getDeepMarkets(matchId);
}

export function getInsights(matchId: string): PlayerInsight[] {
  return getPlayerInsights(matchId);
}

/** Análise completa de uma partida, agregada para a tela de detalhe. */
export interface MatchAnalysis {
  match: Match;
  predictions: Prediction[];
  deepMarkets: Prediction[];
  scenarios: StatScenario[];
  playerInsights: PlayerInsight[];
  betSlips: BetSlip[];
}

export function getMatchAnalysis(slug: string): MatchAnalysis | undefined {
  const match = getMatch(slug);
  if (!match) return undefined;
  return {
    match,
    predictions: getPredictions(match.id),
    deepMarkets: getDeepMarkets(match.id),
    scenarios: getScenarios(match.id),
    playerInsights: getPlayerInsights(match.id),
    betSlips: getBetSlips(match.id),
  };
}
