// Mapeadores puros: resposta da API-Football -> tipos do @matchgoal/shared.
// Sem I/O (testáveis sobre amostras reais).

import type { Match, MatchStatus, Team } from "@matchgoal/shared";
import type {
  MatchDeepSignals,
  PlayerSignal,
  TeamDeepSignals,
} from "@matchgoal/shared";
import type { ApiFixture, ApiPlayerRow } from "../types";
import { WORLD_CUP_LEAGUE_ID } from "../lib/config";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Bandeira por nome de seleção (as principais; fallback neutro).
const FLAGS: Record<string, string> = {
  Brazil: "🇧🇷", Brasil: "🇧🇷", Morocco: "🇲🇦", Marrocos: "🇲🇦",
  Argentina: "🇦🇷", France: "🇫🇷", França: "🇫🇷", England: "🏴",
  Spain: "🇪🇸", Espanha: "🇪🇸", Germany: "🇩🇪", Alemanha: "🇩🇪",
  Mexico: "🇲🇽", México: "🇲🇽", Portugal: "🇵🇹", Netherlands: "🇳🇱",
  USA: "🇺🇸", "United States": "🇺🇸",
};

export function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function code3(name: string): string {
  return name.normalize("NFD").replace(/[^A-Za-z]/g, "").slice(0, 3).toUpperCase();
}

function mapStatus(short: string): MatchStatus {
  if (["NS", "TBD", "PST"].includes(short)) return "scheduled";
  if (["FT", "AET", "PEN", "WO", "ABD"].includes(short)) return "finished";
  return "live";
}

function team(name: string, id: number): Team {
  return {
    id: String(id),
    name,
    shortName: code3(name),
    flag: FLAGS[name] ?? "🏳️",
  };
}

export function mapFixture(f: ApiFixture): Match {
  const slug = `${slugify(f.teams.home.name)}-${slugify(f.teams.away.name)}`;
  const group = f.league.round.replace(/Group Stage.*/i, "Fase de grupos");
  return {
    id: `api-${f.fixture.id}`,
    slug,
    competition: "Copa do Mundo 2026",
    group,
    stage: f.league.round,
    kickoff: f.fixture.date,
    status: mapStatus(f.fixture.status.short),
    venue: [f.fixture.venue.name, f.fixture.venue.city].filter(Boolean).join(", "),
    home: team(f.teams.home.name, f.teams.home.id),
    away: team(f.teams.away.name, f.teams.away.id),
    analysisTier: "premium",
    hasAnalysis: true,
    heroImageUrl: `/matches/${slug}.svg`,
  };
}

function playerSignal(row: ApiPlayerRow): PlayerSignal {
  // /players traz uma entrada de stats por competição — preferimos a da Copa.
  const stats = row.statistics ?? [];
  const st =
    stats.find((s) => s.league?.id === WORLD_CUP_LEAGUE_ID) ?? stats[0];
  const apps = Math.max(1, st?.games.appearences ?? 1);
  const goals = st?.goals.total ?? 0;
  const cards = (st?.cards.yellow ?? 0) + (st?.cards.red ?? 0);
  return {
    name: row.player.name,
    position: st?.games.position ?? undefined,
    goalsPerGame: clamp(goals / apps, 0, 1.6),
    cardsPerGame: clamp(cards / apps, 0, 0.8),
  };
}

function teamSignals(shortName: string, rows: ApiPlayerRow[]): TeamDeepSignals {
  const players = rows.map(playerSignal).sort((a, b) => b.goalsPerGame - a.goalsPerGame);
  const top = players.slice(0, 4);
  const meanScore = top.length ? top.reduce((s, p) => s + p.goalsPerGame, 0) / top.length : 0.35;
  const meanCard = players.length ? players.reduce((s, p) => s + p.cardsPerGame, 0) / players.length : 0.2;
  return {
    shortName,
    attack: clamp(0.45 + meanScore * 0.6, 0.3, 0.92),
    defense: 0.55, // viria de team statistics (gols sofridos); default neutro
    // média de cartões da equipe estimada a partir dos jogadores (~11 em campo)
    teamCardsPerGame: clamp(meanCard * 4.5, 1.4, 2.6),
    cornersForPerGame: 4.6, // /players não traz escanteios; viria de team statistics
    keyPlayers: top,
  };
}

export function buildSignals(
  f: ApiFixture,
  homePlayers: ApiPlayerRow[],
  awayPlayers: ApiPlayerRow[]
): MatchDeepSignals {
  return {
    matchId: `api-${f.fixture.id}`,
    home: teamSignals(code3(f.teams.home.name), homePlayers),
    away: teamSignals(code3(f.teams.away.name), awayPlayers),
  };
}
