// MatchGoal — tipos de grupo e classificação da Copa 2026.

export interface GroupTeam {
  name: string;
  code: string; // sigla FIFA
  flag: string; // emoji
}

export interface StandingRow extends GroupTeam {
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  points: number;
}

export interface GroupStanding {
  /** Ex.: "Grupo C". */
  group: string;
  rows: StandingRow[];
}
