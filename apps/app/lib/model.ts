// Modelo de gols do MatchGoal.
//
// Antes, o over/under saía de uma reta ligada SÓ ao favoritismo, o que empurrava
// quase todo jogo para "under 2.5" (não importa o confronto). Aqui usamos um
// Poisson sobre o total esperado de gols (λ) da partida: jogos parelhos ficam
// ~50/50 e desníveis grandes puxam o over — gerando leituras variadas, não um
// "under" automático.

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Total esperado de gols (λ) do jogo. Base ≈ média de fase de grupos de Copa
 * (~2,5 gols) e cresce com o desnível entre as seleções (favorito goleia mais).
 * `favProb` = maior probabilidade entre mandante e visitante (0..1).
 * `override` permite cravar o λ de um jogo específico (ex.: adversário ferrolho).
 */
export function expectedGoals(favProb: number, override?: number): number {
  if (override != null) return override;
  return clamp(2.5 + (favProb - 0.5) * 1.7, 2.1, 3.5);
}

function poissonCdf(k: number, lambda: number): number {
  let term = Math.exp(-lambda);
  let sum = term;
  for (let i = 1; i <= k; i++) {
    term *= lambda / i;
    sum += term;
  }
  return sum;
}

/** P(total de gols > `line`) sob Poisson(λ). Ex.: line 2.5 → P(≥ 3). */
export function goalsOverProb(lambda: number, line: number): number {
  const need = Math.floor(line) + 1; // gols mínimos para bater o "over"
  return clamp(1 - poissonCdf(need - 1, lambda), 0.03, 0.97);
}

/** P(over 2.5) = P(total de gols ≥ 3) sob Poisson(λ). */
export function overProb(lambda: number): number {
  return goalsOverProb(lambda, 2.5);
}

/**
 * P(ambas marcam = Sim): reparte o λ entre os dois times conforme o favoritismo
 * e combina P(cada time marca ≥ 1). Coerente com o mesmo modelo de gols.
 */
export function bttsYesProb(favProb: number, lambda: number): number {
  const share = clamp(0.5 + (favProb - 0.5) * 0.6, 0.5, 0.82); // fatia do favorito
  const pFav = 1 - Math.exp(-lambda * share);
  const pDog = 1 - Math.exp(-lambda * (1 - share));
  return clamp(pFav * pDog, 0.18, 0.62);
}
