import type { BetSlip, BetSlipLeg } from "@matchgoal/shared";
import { matches } from "./matches";

const AFF = "https://parceiro.exemplo/afiliado?ref=matchgoal&slip=";
const io = (p: number) => Math.round((1 / p) * 100) / 100;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const r2 = (v: number) => Math.round(v * 100) / 100;
const combine = (legs: BetSlipLeg[]) =>
  r2(legs.reduce((acc, l) => acc * (l.odds ?? 1), 1));

const betSlips: BetSlip[] = [];

for (const m of matches) {
  const s = m.snapshot!;
  const homeFav = s.home >= s.away;
  const favName = homeFav ? m.home.name : m.away.name;
  const favProb = Math.max(s.home, s.away);
  const dcProb = clamp((homeFav ? s.home + s.draw : s.away + s.draw), 0.5, 0.93);
  const over = r2(clamp(0.4 + (favProb - 0.5) * 0.6, 0.3, 0.72));
  const under = r2(1 - over);

  // Conservador: dupla chance + total mais provável
  const consLegs: BetSlipLeg[] = [
    {
      predictionId: `${m.id}-dc`,
      market: "double_chance",
      selectionLabel: `${favName} ou Empate`,
      probability: r2(dcProb),
      odds: io(dcProb),
    },
    {
      predictionId: `${m.id}-ou`,
      market: "over_under",
      selectionLabel: under >= over ? "Under 2.5 gols" : "Over 2.5 gols",
      probability: Math.max(under, over),
      odds: io(Math.max(under, over)),
    },
  ];
  betSlips.push({
    id: `${m.id}-cons`,
    matchId: m.id,
    title: "Bilhete conservador",
    rationale:
      "Baixa variância: protege contra zebra do favorito e segue a tendência de gols do confronto.",
    riskLevel: "conservative",
    affiliateUrl: `${AFF}${m.id}-cons`,
    combinedOdds: combine(consLegs),
    legs: consLegs,
  });

  // Equilibrado: vitória do favorito + total
  const balLegs: BetSlipLeg[] = [
    {
      predictionId: `${m.id}-1x2`,
      market: "1x2",
      selectionLabel: `${favName} vence`,
      probability: r2(favProb),
      odds: io(favProb),
    },
    {
      predictionId: `${m.id}-ou`,
      market: "over_under",
      selectionLabel: over >= under ? "Over 2.5 gols" : "Under 2.5 gols",
      probability: Math.max(over, under),
      odds: io(Math.max(over, under)),
    },
  ];
  betSlips.push({
    id: `${m.id}-bal`,
    matchId: m.id,
    title: "Bilhete equilibrado",
    rationale: `Aposta no favoritismo de ${favName} combinada à leitura de gols da IA.`,
    riskLevel: "balanced",
    affiliateUrl: `${AFF}${m.id}-bal`,
    combinedOdds: combine(balLegs),
    legs: balLegs,
  });

  // Agressivo: só nos jogos de destaque
  if (m.marquee) {
    const aggLegs: BetSlipLeg[] = [
      {
        predictionId: `${m.id}-1x2`,
        market: "1x2",
        selectionLabel: `${favName} vence`,
        probability: r2(favProb),
        odds: io(favProb),
      },
      {
        predictionId: `${m.id}-ou`,
        market: "over_under",
        selectionLabel: "Over 2.5 gols",
        probability: over,
        odds: io(over),
      },
      {
        predictionId: `${m.id}-btts`,
        market: "btts",
        selectionLabel: "Ambas marcam — Sim",
        probability: r2(clamp(0.58 - (favProb - 0.5) * 0.8, 0.22, 0.6)),
        odds: io(r2(clamp(0.58 - (favProb - 0.5) * 0.8, 0.22, 0.6))),
      },
    ];
    betSlips.push({
      id: `${m.id}-agg`,
      matchId: m.id,
      title: "Bilhete agressivo",
      rationale: "Maior retorno potencial: vitória do favorito em jogo movimentado.",
      riskLevel: "aggressive",
      affiliateUrl: `${AFF}${m.id}-agg`,
      combinedOdds: combine(aggLegs),
      legs: aggLegs,
    });
  }
}

export { betSlips };
