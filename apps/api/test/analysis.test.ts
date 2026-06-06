// Teste do pipeline real: amostra da API-Football -> mapeadores -> engine
// de análise profunda. Roda sem chave/rede (tsx test/analysis.test.ts).

import assert from "node:assert/strict";
import { deriveDeepAnalysis } from "@matchgoal/shared";
import { buildSignals, mapFixture } from "../services/mappers";
import {
  sampleFixture,
  sampleHomePlayers,
  sampleAwayPlayers,
} from "../sample/fixture-sample";

let passed = 0;
const ok = (cond: boolean, msg: string) => {
  assert.ok(cond, msg);
  passed++;
};

// 1) Mapeamento do fixture
const match = mapFixture(sampleFixture);
ok(match.home.name === "Brazil", "home = Brazil");
ok(match.away.name === "Morocco", "away = Morocco");
ok(match.slug === "brazil-morocco", `slug correto (${match.slug})`);
ok(match.group === "Fase de grupos", `grupo mapeado (${match.group})`);
ok(match.kickoff === "2026-06-13T18:00:00-04:00", "kickoff preservado");
ok((match.venue ?? "").includes("MetLife"), "estádio mapeado");
ok(match.home.shortName === "BRA", `sigla BRA (${match.home.shortName})`);

// 2) Sinais a partir das estatísticas reais de jogador (taxas reais)
const signals = buildSignals(sampleFixture, sampleHomePlayers, sampleAwayPlayers);
ok(signals.home.keyPlayers.length > 0, "keyPlayers do mandante");
ok(
  signals.home.keyPlayers[0].name === "Vinícius Júnior",
  "principal artilheiro ordenado por gols/jogo"
);
// Vinícius: 9 gols / 20 jogos = 0.45 gol/jogo
ok(
  Math.abs(signals.home.keyPlayers[0].goalsPerGame - 0.45) < 0.01,
  `gols/jogo real calculado (${signals.home.keyPlayers[0].goalsPerGame})`
);

// 3) Engine de análise profunda
const deep = deriveDeepAnalysis(signals);
ok(deep.markets.length === 2, "2 mercados avançados (cartões + escanteios)");
const cards = deep.markets.find((m) => m.market === "cards");
const corners = deep.markets.find((m) => m.market === "corners");
ok(!!cards && !!corners, "mercados de cartões e escanteios presentes");

for (const mkt of deep.markets) {
  const sum = mkt.outcomes.reduce((s, o) => s + o.probability, 0);
  ok(Math.abs(sum - 1) < 0.02, `probabilidades de ${mkt.market} somam ~1 (${sum.toFixed(2)})`);
  for (const o of mkt.outcomes) {
    ok(o.probability >= 0 && o.probability <= 1, `prob 0..1 em ${mkt.market}`);
    ok((o.impliedOdds ?? 0) > 1, `odd implícita > 1 em ${mkt.market}`);
  }
}

// Cartões Over 4.5 deve ser MINORITÁRIO (média real ~3,3/jogo)
const cardsOver = cards!.outcomes.find((o) => o.label === "Over 4.5")!;
ok(cardsOver.probability < 0.5, `Over 4.5 cartões realista < 50% (${cardsOver.probability})`);

ok(deep.playerInsights.length >= 2, "pelo menos 2 destaques de jogador");
for (const pi of deep.playerInsights) {
  ok(pi.probability >= 0 && pi.probability <= 1, `prob 0..1 em insight ${pi.player}`);
}
const scorer = deep.playerInsights.find((p) => p.kind === "scorer");
ok(!!scorer, "há insight de artilheiro");
// anytime scorer deve ser realista (não inflado): <= 60%
ok(scorer!.probability <= 0.6, `anytime scorer realista <= 60% (${scorer!.probability})`);

console.log(`\n✅ ${passed} asserções passaram.`);
console.log("Mercado de cartões:", JSON.stringify(cards?.outcomes));
console.log("Mercado de escanteios:", JSON.stringify(corners?.outcomes));
console.log(
  "Destaques:",
  deep.playerInsights.map((p) => `${p.player} ${p.label} ${Math.round(p.probability * 100)}%`)
);
