// MatchGoal — engine de análise profunda (puro, sem I/O).
// Modelo: distribuição de POISSON sobre taxas REAIS (gols/jogo, cartões/jogo,
// escanteios/jogo, faltas/jogo). Probabilidade de "marcar pelo menos 1 gol" =
// 1 − e^(−λ), padrão de mercado para anytime goalscorer. Usado pelos mocks (app)
// e pela integração real (apps/api), garantindo a MESMA leitura e embasamento.

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
  /** Média de faltas cometidas por jogo (~9..13). Opcional (proxy via cartões). */
  teamFoulsPerGame?: number;
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

/** P(X ≥ k) para X ~ Poisson(mean). Base dos mercados de cartões/escanteios/faltas. */
export function poissonAtLeast(k: number, mean: number): number {
  let cdf = 0;
  let term = Math.exp(-mean); // i = 0
  for (let i = 0; i < k; i++) {
    cdf += term;
    term *= mean / (i + 1);
  }
  return clamp(1 - cdf, 0.02, 0.98);
}

/** P(X = k) para X ~ Poisson(mean). */
function poissonPmf(k: number, mean: number): number {
  let p = Math.exp(-mean);
  for (let i = 1; i <= k; i++) p *= mean / i;
  return p;
}

/** P(marcar ≥ 1 gol) = 1 − e^(−λ). */
export function anytimeScorer(lambda: number): number {
  return clamp(1 - Math.exp(-lambda), 0.04, 0.74);
}

function outcome(label: string, p: number): ProbabilityOutcome {
  return { label, probability: r2(p), impliedOdds: io(p) };
}

function confFromEdge(p: number): "low" | "medium" | "high" {
  const edge = Math.abs(p - 0.5);
  return edge > 0.18 ? "high" : edge > 0.08 ? "medium" : "low";
}

/** Gols esperados (λ) de um time considerando a defesa adversária. */
function teamLambda(team: TeamDeepSignals, opp: TeamDeepSignals): number {
  return clamp(0.6 + team.attack * 1.8 - opp.defense * 0.9, 0.2, 3.3);
}

/** Card de over/under com VÁRIAS linhas (uma barra por linha = chance do "Mais de"). */
function overUnderLines(
  id: string,
  matchId: string,
  market: Prediction["market"],
  marketLabel: string,
  expected: number,
  lines: number[],
  summary: string,
  mainLine: number
): Prediction {
  return {
    id,
    matchId,
    market,
    marketLabel,
    confidence: confFromEdge(poissonAtLeast(Math.floor(mainLine) + 1, expected)),
    summary,
    outcomes: lines.map((l) =>
      outcome(`Mais de ${l}`, poissonAtLeast(Math.floor(l) + 1, expected))
    ),
  };
}

/** Cartões (várias linhas) — Poisson sobre a média real de cartões. */
export function deriveCardsMarket(s: MatchDeepSignals): Prediction {
  const expected = s.home.teamCardsPerGame + s.away.teamCardsPerGame + 0.4;
  return overUnderLines(
    `${s.matchId}-cards`,
    s.matchId,
    "cards",
    "Total de cartões",
    expected,
    [3.5, 4.5, 5.5],
    `~${expected.toFixed(1)} cartões projetados (médias reais; ref. Copa 2022 = 3,3 amarelos/jogo). Poisson.`,
    4.5
  );
}

/** Escanteios (várias linhas) — Poisson sobre escanteios/jogo das duas seleções. */
export function deriveCornersMarket(s: MatchDeepSignals): Prediction {
  const expected = s.home.cornersForPerGame + s.away.cornersForPerGame;
  return overUnderLines(
    `${s.matchId}-corners`,
    s.matchId,
    "corners",
    "Total de escanteios",
    expected,
    [8.5, 9.5, 10.5],
    `~${expected.toFixed(1)} escanteios projetados (média real das duas seleções; ref. Copa 2022 = 9,4/jogo). Poisson.`,
    9.5
  );
}

/** Faltas (várias linhas) — Poisson sobre a média de faltas. */
export function deriveFoulsMarket(s: MatchDeepSignals): Prediction {
  const expected = (s.home.teamFoulsPerGame ?? 10.5) + (s.away.teamFoulsPerGame ?? 10.5);
  return overUnderLines(
    `${s.matchId}-fouls`,
    s.matchId,
    "fouls",
    "Total de faltas",
    expected,
    [19.5, 21.5, 23.5],
    `~${expected.toFixed(0)} faltas projetadas (perfil das equipes; faltas puxam cartões). Poisson.`,
    21.5
  );
}

/** Equipe com mais escanteios — grade Poisson sobre escanteios de cada lado. */
export function deriveMostCornersMarket(s: MatchDeepSignals): Prediction {
  const lh = s.home.cornersForPerGame;
  const la = s.away.cornersForPerGame;
  let home = 0;
  let draw = 0;
  let away = 0;
  for (let i = 0; i <= 16; i++) {
    const pi = poissonPmf(i, lh);
    for (let j = 0; j <= 16; j++) {
      const p = pi * poissonPmf(j, la);
      if (i > j) home += p;
      else if (i < j) away += p;
      else draw += p;
    }
  }
  return {
    id: `${s.matchId}-most-corners`,
    matchId: s.matchId,
    market: "most_corners",
    marketLabel: "Equipe com mais escanteios",
    confidence: confFromEdge(Math.max(home, away)),
    summary: `Quem bate mais escanteios (médias ${lh.toFixed(1)} × ${la.toFixed(1)}). Poisson.`,
    outcomes: [
      outcome(s.home.shortName, home),
      outcome("Empate", draw),
      outcome(s.away.shortName, away),
    ],
  };
}

/**
 * Handicap asiático (linhas do favorito) — margem estimada por grade de placares
 * Poisson. Linhas de "meio gol" (sem push): -0.5 (vencer) e -1.5 (vencer por 2+).
 */
export function deriveAsianHandicapMarket(s: MatchDeepSignals): Prediction {
  const lh = teamLambda(s.home, s.away);
  const la = teamLambda(s.away, s.home);
  let home = 0;
  let away = 0;
  let homeBy2 = 0;
  let awayBy2 = 0;
  for (let i = 0; i <= 8; i++) {
    const pi = poissonPmf(i, lh);
    for (let j = 0; j <= 8; j++) {
      const p = pi * poissonPmf(j, la);
      const d = i - j;
      if (d > 0) home += p;
      else if (d < 0) away += p;
      if (d >= 2) homeBy2 += p;
      if (d <= -2) awayBy2 += p;
    }
  }
  const homeFav = home >= away;
  const favName = homeFav ? s.home.shortName : s.away.shortName;
  const favWin = clamp(homeFav ? home : away, 0.05, 0.95);
  const favBy2 = clamp(homeFav ? homeBy2 : awayBy2, 0.03, 0.92);
  return {
    id: `${s.matchId}-ah`,
    matchId: s.matchId,
    market: "asian_handicap",
    marketLabel: "Handicap asiático",
    confidence: confFromEdge(favWin),
    summary: `Domínio do favorito (${favName}) por linha — margem por grade de placares (Poisson).`,
    outcomes: [outcome(`${favName} -0.5`, favWin), outcome(`${favName} -1.5`, favBy2)],
  };
}

/** Resultado correto — placares mais prováveis (grade Poisson, top 5). */
export function deriveCorrectScoreMarket(s: MatchDeepSignals): Prediction {
  const lh = teamLambda(s.home, s.away);
  const la = teamLambda(s.away, s.home);
  const scores: { label: string; p: number }[] = [];
  for (let i = 0; i <= 5; i++) {
    for (let j = 0; j <= 5; j++) {
      scores.push({ label: `${i}-${j}`, p: poissonPmf(i, lh) * poissonPmf(j, la) });
    }
  }
  scores.sort((a, b) => b.p - a.p);
  return {
    id: `${s.matchId}-cs`,
    matchId: s.matchId,
    market: "correct_score",
    marketLabel: "Resultado correto (mais prováveis)",
    confidence: confFromEdge(scores[0].p),
    summary: `Placares mais prováveis pela grade de gols (λ ${lh.toFixed(2)} × ${la.toFixed(2)}). Poisson.`,
    outcomes: scores.slice(0, 5).map((x) => outcome(x.label, x.p)),
  };
}

/** Gols por equipe — chance de cada seleção marcar 2+ (Mais de 1.5). */
export function deriveTeamGoalsMarket(s: MatchDeepSignals): Prediction {
  const lh = teamLambda(s.home, s.away);
  const la = teamLambda(s.away, s.home);
  const homeOver = clamp(1 - poissonPmf(0, lh) - poissonPmf(1, lh), 0.03, 0.95);
  const awayOver = clamp(1 - poissonPmf(0, la) - poissonPmf(1, la), 0.03, 0.95);
  return {
    id: `${s.matchId}-team-goals`,
    matchId: s.matchId,
    market: "team_goals",
    marketLabel: "Gols por equipe (Mais de 1.5)",
    confidence: confFromEdge(Math.max(homeOver, awayOver)),
    summary: `Chance de cada seleção marcar 2+ gols (λ ${lh.toFixed(2)} × ${la.toFixed(2)}). Poisson.`,
    outcomes: [
      outcome(`${s.home.shortName} +1.5`, homeOver),
      outcome(`${s.away.shortName} +1.5`, awayOver),
    ],
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

    const scorers = [...team.keyPlayers]
      .sort((a, b) => b.goalsPerGame - a.goalsPerGame)
      .slice(0, 2);
    scorers.forEach((scorer, idx) => {
      if (scorer.goalsPerGame < 0.2) return;
      const lambda = scorer.goalsPerGame * oppFactor * minutesShare;
      const p = anytimeScorer(lambda);
      out.push({
        id: `${s.matchId}-pi-${team.shortName}-score-${idx}`,
        matchId: s.matchId,
        player: scorer.name,
        team: team.shortName,
        position: scorer.position,
        kind: "scorer",
        label: idx === 0 ? "Chance de marcar" : "Marca a qualquer momento",
        probability: r2(p),
        detail: `${scorer.goalsPerGame.toFixed(2)} gol/jogo na temporada, ajustado pela defesa adversária — modelo de Poisson (anytime scorer).`,
      });
    });

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
    markets: [
      deriveCardsMarket(s),
      deriveCornersMarket(s),
      deriveMostCornersMarket(s),
      deriveFoulsMarket(s),
      deriveAsianHandicapMarket(s),
      deriveCorrectScoreMarket(s),
      deriveTeamGoalsMarket(s),
    ],
    playerInsights: derivePlayerInsights(s),
  };
}
