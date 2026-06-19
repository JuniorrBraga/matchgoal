// Calls REAIS da 1ª rodada da Copa 2026 — publicadas nos stories (o app ficou
// parado na rodada). Política "sem picaretagem": nada inventado, erros à mostra.
//
// IMPORTANTE p/ o dono: os ACERTOS abaixo são EXEMPLOS verificados. Os 5 ERROS
// são a lista COMPLETA de erros da rodada (você confirmou que só errou esses,
// considerando todos os mercados: escanteios, cartões, faltas, gols, asiático…).
// Para o histórico ficar 100% e calcular o ROI real, cole TODAS as suas calls
// vencedoras com: jogo, mercado, ODD e STAKE. Aí dá pra mostrar "+X unidades".

export interface Call {
  match: string;
  /** Seleção dada na call. "—" = preencher o pick exato. */
  pick: string;
  /** Placar final real ("" = não verificado). */
  result: string;
  hit: boolean;
}

/** Acertos verificados (exemplos — a lista completa será adicionada pelo dono). */
export const wins: Call[] = [
  { match: "México × África do Sul", pick: "México 2-0 (placar exato)", result: "2-0", hit: true },
  { match: "Alemanha × Curaçao", pick: "Mais de 4.5 gols", result: "7-1", hit: true },
  { match: "Coreia do Sul × Tchéquia", pick: "Coreia vence", result: "2-1", hit: true },
];

/** Erros: lista COMPLETA da 1ª rodada (apenas estes 5, somando todos os mercados). */
export const losses: Call[] = [
  { match: "Brasil × Marrocos", pick: "Vitória do Brasil", result: "1-1", hit: false },
  { match: "Espanha × Cabo Verde", pick: "—", result: "0-0", hit: false },
  { match: "Canadá × Bósnia", pick: "—", result: "", hit: false },
  { match: "Austrália × Turquia", pick: "—", result: "", hit: false },
  { match: "Portugal × Rep. Dem. Congo", pick: "—", result: "", hit: false },
];

export const recordSummary = {
  /** Únicos erros da rodada (número real e forte: só 5). */
  lossesTotal: losses.length,
  winsShown: wins.length,
};
