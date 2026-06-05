import type { HeadToHead, Match, TeamForm } from "@matchgoal/shared";
import { fixtures } from "./fixtures";

// Detalhes extras (form guide + confronto direto) para jogos de destaque.
const extras: Record<string, { form: TeamForm; h2h: HeadToHead }> = {
  "mexico-africa-do-sul": {
    form: { home: ["W", "W", "D", "L", "W"], away: ["W", "D", "W", "W", "L"] },
    h2h: { summary: "4 jogos, equilíbrio histórico", homeWins: 2, draws: 1, awayWins: 1 },
  },
  "estados-unidos-paraguai": {
    form: { home: ["W", "D", "W", "W", "D"], away: ["L", "W", "D", "W", "L"] },
    h2h: { summary: "Confronto raro em Copas", homeWins: 1, draws: 1, awayWins: 1 },
  },
  "brasil-marrocos": {
    form: { home: ["W", "W", "W", "D", "W"], away: ["W", "D", "W", "W", "W"] },
    h2h: { summary: "Marrocos venceu o último amistoso (2023)", homeWins: 1, draws: 0, awayWins: 1 },
  },
  "franca-senegal": {
    form: { home: ["W", "W", "L", "W", "D"], away: ["W", "W", "D", "L", "W"] },
    h2h: { summary: "Senegal surpreendeu na Copa de 2002", homeWins: 0, draws: 0, awayWins: 1 },
  },
  "argentina-argelia": {
    form: { home: ["W", "W", "W", "D", "W"], away: ["D", "W", "L", "W", "D"] },
    h2h: { summary: "Histórico amplamente argentino", homeWins: 3, draws: 1, awayWins: 0 },
  },
  "inglaterra-croacia": {
    form: { home: ["W", "D", "W", "W", "L"], away: ["D", "W", "D", "L", "W"] },
    h2h: { summary: "Croácia eliminou a Inglaterra em 2018", homeWins: 2, draws: 1, awayWins: 2 },
  },
};

export const matches: Match[] = fixtures.map((f, i) => {
  const ex = extras[f.slug];
  return {
    id: `m${i + 1}`,
    slug: f.slug,
    competition: "Copa do Mundo 2026",
    group: `Grupo ${f.group}`,
    stage: `Fase de grupos — Grupo ${f.group}`,
    kickoff: f.kickoff,
    status: "scheduled",
    venue: `${f.venueStadium}, ${f.venueCity}`,
    home: { id: f.home.code.toLowerCase(), name: f.home.name, shortName: f.home.code, flag: f.home.flag },
    away: { id: f.away.code.toLowerCase(), name: f.away.name, shortName: f.away.code, flag: f.away.flag },
    analysisTier: f.tier,
    hasAnalysis: true,
    marquee: f.marquee,
    heroImageUrl: `/matches/${f.slug}.svg`,
    snapshot: { home: f.prob[0], draw: f.prob[1], away: f.prob[2] },
    form: ex?.form,
    h2h: ex?.h2h,
  };
});
