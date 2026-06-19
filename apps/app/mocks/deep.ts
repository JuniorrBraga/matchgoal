import type { PlayerInsight, Prediction } from "@matchgoal/shared";
import {
  deriveDeepAnalysis,
  type MatchDeepSignals,
  type PlayerSignal,
  type TeamDeepSignals,
} from "@matchgoal/shared";
import { matches } from "./matches";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Craques reais por seleção com TAXAS REAIS (gols/jogo e cartões/jogo) da
// temporada 2025/26 (fontes: Transfermarkt/FBref/FotMob via pesquisa).
const rosters: Record<string, PlayerSignal[]> = {
  BRA: [
    { name: "Vinícius Jr.", position: "ATA", goalsPerGame: 0.45, cardsPerGame: 0.16 },
    { name: "Rodrygo", position: "ATA", goalsPerGame: 0.32, cardsPerGame: 0.1 },
    { name: "Bruno Guimarães", position: "VOL", goalsPerGame: 0.12, cardsPerGame: 0.32 },
  ],
  ARG: [
    { name: "Lionel Messi", position: "ATA", goalsPerGame: 0.6, cardsPerGame: 0.06 },
    { name: "Julián Álvarez", position: "ATA", goalsPerGame: 0.45, cardsPerGame: 0.12 },
    { name: "Enzo Fernández", position: "VOL", goalsPerGame: 0.15, cardsPerGame: 0.3 },
  ],
  FRA: [
    { name: "Kylian Mbappé", position: "ATA", goalsPerGame: 0.85, cardsPerGame: 0.12 },
    { name: "Ousmane Dembélé", position: "ATA", goalsPerGame: 0.42, cardsPerGame: 0.14 },
    { name: "Aurélien Tchouaméni", position: "VOL", goalsPerGame: 0.08, cardsPerGame: 0.32 },
  ],
  ENG: [
    { name: "Harry Kane", position: "ATA", goalsPerGame: 1.05, cardsPerGame: 0.1 },
    { name: "Jude Bellingham", position: "MEI", goalsPerGame: 0.45, cardsPerGame: 0.24 },
    { name: "Bukayo Saka", position: "ATA", goalsPerGame: 0.4, cardsPerGame: 0.12 },
  ],
  POR: [
    { name: "Cristiano Ronaldo", position: "ATA", goalsPerGame: 0.68, cardsPerGame: 0.12 },
    { name: "Rafael Leão", position: "ATA", goalsPerGame: 0.4, cardsPerGame: 0.14 },
    { name: "Bruno Fernandes", position: "MEI", goalsPerGame: 0.35, cardsPerGame: 0.3 },
  ],
  ESP: [
    { name: "Lamine Yamal", position: "ATA", goalsPerGame: 0.45, cardsPerGame: 0.12 },
    { name: "Pedri", position: "MEI", goalsPerGame: 0.15, cardsPerGame: 0.2 },
    { name: "Rodri", position: "VOL", goalsPerGame: 0.1, cardsPerGame: 0.28 },
  ],
  GER: [
    { name: "Jamal Musiala", position: "MEI", goalsPerGame: 0.45, cardsPerGame: 0.1 },
    { name: "Florian Wirtz", position: "MEI", goalsPerGame: 0.4, cardsPerGame: 0.1 },
    { name: "Kai Havertz", position: "ATA", goalsPerGame: 0.4, cardsPerGame: 0.14 },
  ],
  NED: [
    { name: "Memphis Depay", position: "ATA", goalsPerGame: 0.45, cardsPerGame: 0.16 },
    { name: "Cody Gakpo", position: "ATA", goalsPerGame: 0.4, cardsPerGame: 0.12 },
    { name: "Frenkie de Jong", position: "MEI", goalsPerGame: 0.12, cardsPerGame: 0.24 },
  ],
  MEX: [
    { name: "Santiago Giménez", position: "ATA", goalsPerGame: 0.4, cardsPerGame: 0.12 },
    { name: "Raúl Jiménez", position: "ATA", goalsPerGame: 0.35, cardsPerGame: 0.14 },
    { name: "Edson Álvarez", position: "VOL", goalsPerGame: 0.08, cardsPerGame: 0.34 },
  ],
  USA: [
    { name: "Christian Pulisic", position: "ATA", goalsPerGame: 0.32, cardsPerGame: 0.14 },
    { name: "Folarin Balogun", position: "ATA", goalsPerGame: 0.35, cardsPerGame: 0.12 },
    { name: "Tyler Adams", position: "VOL", goalsPerGame: 0.05, cardsPerGame: 0.32 },
  ],
  MAR: [
    { name: "Youssef En-Nesyri", position: "ATA", goalsPerGame: 0.38, cardsPerGame: 0.14 },
    { name: "Achraf Hakimi", position: "LAT", goalsPerGame: 0.18, cardsPerGame: 0.22 },
    { name: "Sofyan Amrabat", position: "VOL", goalsPerGame: 0.04, cardsPerGame: 0.36 },
  ],
  CRO: [
    { name: "Andrej Kramarić", position: "ATA", goalsPerGame: 0.35, cardsPerGame: 0.12 },
    { name: "Luka Modrić", position: "MEI", goalsPerGame: 0.12, cardsPerGame: 0.22 },
    { name: "Marcelo Brozović", position: "VOL", goalsPerGame: 0.08, cardsPerGame: 0.3 },
  ],
};

function genericRoster(code: string): PlayerSignal[] {
  return [
    { name: `Camisa 9 (${code})`, position: "ATA", goalsPerGame: 0.3, cardsPerGame: 0.12 },
    { name: `Camisa 10 (${code})`, position: "MEI", goalsPerGame: 0.22, cardsPerGame: 0.16 },
    { name: `Camisa 5 (${code})`, position: "VOL", goalsPerGame: 0.05, cardsPerGame: 0.3 },
  ];
}

// Médias de equipe (cartões e escanteios por jogo) — calibradas em refs reais
// (Copa 2022: ~3,3 amarelos/jogo no total, ~9,4 escanteios/jogo no total).
const traits: Record<string, { teamCardsPerGame: number; cornersForPerGame: number }> = {
  ARG: { teamCardsPerGame: 2.3, cornersForPerGame: 5.4 },
  URU: { teamCardsPerGame: 2.5, cornersForPerGame: 4.6 },
  MAR: { teamCardsPerGame: 2.2, cornersForPerGame: 4.2 },
  BRA: { teamCardsPerGame: 1.8, cornersForPerGame: 5.4 },
  ESP: { teamCardsPerGame: 1.7, cornersForPerGame: 5.8 },
  ENG: { teamCardsPerGame: 1.8, cornersForPerGame: 5.4 },
  FRA: { teamCardsPerGame: 1.9, cornersForPerGame: 5.0 },
  GER: { teamCardsPerGame: 1.8, cornersForPerGame: 5.2 },
  CRO: { teamCardsPerGame: 2.2, cornersForPerGame: 4.4 },
  MEX: { teamCardsPerGame: 2.0, cornersForPerGame: 4.6 },
  USA: { teamCardsPerGame: 1.9, cornersForPerGame: 4.6 },
};

function teamSignals(shortName: string, matchProb: number): TeamDeepSignals {
  const t = traits[shortName] ?? { teamCardsPerGame: 1.9, cornersForPerGame: 4.4 };
  return {
    shortName,
    attack: clamp(0.4 + (matchProb - 0.33) * 0.7, 0.3, 0.92),
    defense: clamp(0.45 + (matchProb - 0.33) * 0.5, 0.3, 0.9),
    teamCardsPerGame: t.teamCardsPerGame,
    cornersForPerGame: t.cornersForPerGame,
    // Faltas estimadas pelo perfil disciplinar (faltas puxam cartões).
    teamFoulsPerGame: clamp(8 + t.teamCardsPerGame * 1.6, 8.5, 13),
    keyPlayers: rosters[shortName] ?? genericRoster(shortName),
  };
}

function signalsFor(matchId: string): MatchDeepSignals | undefined {
  const m = matches.find((x) => x.id === matchId);
  if (!m || !m.snapshot) return undefined;
  return {
    matchId: m.id,
    home: teamSignals(m.home.shortName, m.snapshot.home),
    away: teamSignals(m.away.shortName, m.snapshot.away),
  };
}

const deepMarkets: Prediction[] = [];
const playerInsights: PlayerInsight[] = [];
for (const m of matches) {
  const s = signalsFor(m.id);
  if (!s) continue;
  const deep = deriveDeepAnalysis(s);
  deepMarkets.push(...deep.markets);
  playerInsights.push(...deep.playerInsights);
}

export function getDeepMarkets(matchId: string): Prediction[] {
  return deepMarkets.filter((p) => p.matchId === matchId);
}

export function getPlayerInsights(matchId: string): PlayerInsight[] {
  return playerInsights.filter((p) => p.matchId === matchId);
}
