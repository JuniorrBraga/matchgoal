// Formatos (parciais) das respostas da API-Football v3 que usamos.

export interface ApiTeam {
  id: number;
  name: string;
  logo?: string;
}

export interface ApiFixture {
  fixture: {
    id: number;
    date: string; // ISO 8601
    venue: { name: string | null; city: string | null };
    status: { short: string }; // NS, 1H, FT...
  };
  league: {
    id: number;
    season: number;
    round: string; // "Group Stage - 1"
  };
  teams: {
    home: ApiTeam;
    away: ApiTeam;
  };
}

export interface ApiPlayerStat {
  league?: { id: number; name?: string };
  games: { appearences: number | null; position: string | null; minutes: number | null };
  goals: { total: number | null; assists: number | null };
  shots: { total: number | null; on: number | null };
  cards: { yellow: number | null; red: number | null };
}

/** Cada item de /players?team=&season= já é { player, statistics }. */
export interface ApiPlayerRow {
  player: { id: number; name: string };
  statistics: ApiPlayerStat[];
}
