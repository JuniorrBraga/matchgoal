// Jogos do Brasil na Copa 2026 — calendário real do projeto
// (espelha apps/app/mocks/fixtures.ts). Probabilidades de resultado são reais
// (estimativas de leitura do projeto); os 3 chips são ilustrativos por jogo.
// O card do Hero escolhe dinamicamente o próximo jogo pela data (ver NextBrazilMatch).
//
// Para adicionar jogos futuros (3º de grupo / mata-mata), basta acrescentar
// novas entradas em ordem de data.

export interface BrasilFixture {
  /** ISO 8601 com fuso (real). */
  kickoff: string;
  opponentName: string;
  opponentCode: string;
  /** Gradiente CSS do escudo do adversário. */
  opponentCrest: string;
  /** Linha de metadados pronta: "Grupo C · 13 jun · 19h00 · processado por IA há 2 min". */
  meta: string;
  /** Probabilidades de resultado em % (Brasil / empate / adversário). */
  prob: { bra: number; empate: number; opp: number };
  /** 3 chips de cenário (ilustrativos por jogo). */
  chips: { label: string; value: string }[];
}

export const brasilFixtures: BrasilFixture[] = [
  {
    kickoff: "2026-06-13T18:00:00-04:00",
    opponentName: "Marrocos",
    opponentCode: "MAR",
    opponentCrest: "linear-gradient(135deg,#C8102E,#7a0f1f)",
    meta: "Grupo C · 13 jun · 19h00 · processado por IA há 2 min",
    prob: { bra: 52, empate: 26, opp: 22 },
    chips: [
      { label: "Ambas marcam", value: "56%" },
      { label: "+2.5 gols", value: "41%" },
      { label: "Brasil sem sofrer", value: "44%" },
    ],
  },
  {
    kickoff: "2026-06-19T20:30:00-04:00",
    opponentName: "Haiti",
    opponentCode: "HAI",
    opponentCrest: "linear-gradient(135deg,#1B3A8B,#D21034)",
    meta: "Grupo C · 19 jun · 21h30 · processado por IA há 2 min",
    prob: { bra: 86, empate: 10, opp: 4 },
    chips: [
      { label: "Ambas marcam", value: "28%" },
      { label: "+2.5 gols", value: "64%" },
      { label: "Brasil sem sofrer", value: "58%" },
    ],
  },
];

/**
 * Próximo jogo do Brasil pela data informada: o 1º com kickoff no futuro.
 * Se todos já passaram, retorna o último (mantém o card preenchido).
 */
export function selectNextBrasilFixture(now: number = Date.now()): BrasilFixture {
  return (
    brasilFixtures.find((f) => new Date(f.kickoff).getTime() > now) ??
    brasilFixtures[brasilFixtures.length - 1]
  );
}
