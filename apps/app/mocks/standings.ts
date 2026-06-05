import type { GroupStanding } from "@matchgoal/shared";
import { groupTeams } from "./fixtures";

// Pré-Copa: nenhum jogo disputado ainda (estreia em 11/06/2026).
// A ordem segue a cabeça de chave / pote de cada grupo.
export const standings: GroupStanding[] = groupTeams.map((g) => ({
  group: g.group,
  rows: g.teams.map((t) => ({
    ...t,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    points: 0,
  })),
}));
