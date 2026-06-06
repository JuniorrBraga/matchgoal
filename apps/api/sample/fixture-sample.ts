// Amostra no formato REAL da API-Football v3 (Brasil x Marrocos, Grupo C).
// Usada nos testes — valida os mapeadores sem precisar de chave/rede.

import type { ApiFixture, ApiPlayerRow } from "../types";

export const sampleFixture: ApiFixture = {
  fixture: {
    id: 1390123,
    date: "2026-06-13T18:00:00-04:00",
    venue: { name: "MetLife Stadium", city: "East Rutherford" },
    status: { short: "NS" },
  },
  league: { id: 1, season: 2026, round: "Group Stage - 1" },
  teams: {
    home: { id: 6, name: "Brazil" },
    away: { id: 31, name: "Morocco" },
  },
};

export const sampleHomePlayers: ApiPlayerRow[] = [
  {
    player: { id: 1001, name: "Vinícius Júnior" },
    statistics: [
      { games: { appearences: 20, position: "Attacker", minutes: 1700 }, goals: { total: 9, assists: 6 }, shots: { total: 58, on: 28 }, cards: { yellow: 4, red: 0 } },
    ],
  },
  {
    player: { id: 1002, name: "Rodrygo" },
    statistics: [
      { games: { appearences: 20, position: "Attacker", minutes: 1600 }, goals: { total: 6, assists: 4 }, shots: { total: 40, on: 18 }, cards: { yellow: 2, red: 0 } },
    ],
  },
  {
    player: { id: 1003, name: "Bruno Guimarães" },
    statistics: [
      { games: { appearences: 22, position: "Midfielder", minutes: 1980 }, goals: { total: 2, assists: 3 }, shots: { total: 18, on: 6 }, cards: { yellow: 9, red: 1 } },
    ],
  },
];

export const sampleAwayPlayers: ApiPlayerRow[] = [
  {
    player: { id: 2001, name: "Youssef En-Nesyri" },
    statistics: [
      { games: { appearences: 20, position: "Attacker", minutes: 1750 }, goals: { total: 7, assists: 1 }, shots: { total: 42, on: 20 }, cards: { yellow: 3, red: 0 } },
    ],
  },
  {
    player: { id: 2002, name: "Achraf Hakimi" },
    statistics: [
      { games: { appearences: 24, position: "Defender", minutes: 2100 }, goals: { total: 3, assists: 5 }, shots: { total: 24, on: 9 }, cards: { yellow: 6, red: 0 } },
    ],
  },
  {
    player: { id: 2003, name: "Sofyan Amrabat" },
    statistics: [
      { games: { appearences: 22, position: "Midfielder", minutes: 1900 }, goals: { total: 0, assists: 1 }, shots: { total: 8, on: 2 }, cards: { yellow: 11, red: 1 } },
    ],
  },
];
