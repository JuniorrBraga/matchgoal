import type {
  Confidence,
  Prediction,
  StatScenario,
} from "@matchgoal/shared";
import { matches } from "./matches";

const io = (p: number) => Math.round((1 / p) * 100) / 100;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const r2 = (v: number) => Math.round(v * 100) / 100;

function confFor(maxP: number): Confidence {
  if (maxP >= 0.6) return "high";
  if (maxP >= 0.45) return "medium";
  return "low";
}

// Cenários estatísticos específicos dos jogos de destaque.
const marqueeScenarios: Record<string, Omit<StatScenario, "id" | "matchId">[]> = {
  "brasil-marrocos": [
    {
      title: "Marrocos sólido defensivamente em Copas",
      narrative:
        "Nos últimos 5 jogos de Copa do Mundo, o Marrocos sofreu apenas 2 gols — defesa entre as mais fortes do torneio.",
      sampleSize: 5,
      hitRate: 0.8,
      tags: ["defesa", "under", "marrocos"],
    },
    {
      title: "Brasil marca no 1º tempo com Vinícius titular",
      narrative:
        "Com Vinícius Jr. como titular, o Brasil abriu o placar ainda no 1º tempo em 6 dos últimos 8 jogos.",
      sampleSize: 8,
      hitRate: 0.75,
      tags: ["1º tempo", "primeiro gol"],
    },
    {
      title: "Jogos do Marrocos vão para o under",
      narrative:
        "Em 4 dos últimos 5 jogos do Marrocos em mata-mata, o total ficou abaixo de 2.5 gols.",
      sampleSize: 5,
      hitRate: 0.8,
      tags: ["under", "poucos gols"],
    },
  ],
  "mexico-africa-do-sul": [
    {
      title: "México invicto na estreia em Copas",
      narrative:
        "O México não perde jogos de abertura de Copa do Mundo há 7 edições (5 vitórias, 2 empates).",
      sampleSize: 7,
      hitRate: 1.0,
      tags: ["mandante", "estreia", "invicto"],
    },
    {
      title: "África do Sul sofre cedo fora de casa",
      narrative:
        "Em 3 dos últimos 4 jogos fora, a África do Sul sofreu o primeiro gol antes dos 30 minutos.",
      sampleSize: 4,
      hitRate: 0.75,
      tags: ["1º tempo", "primeiro gol"],
    },
    {
      title: "Pressão do mandante no Azteca",
      narrative:
        "Média de 7,1 escanteios a favor do México por jogo como mandante nas últimas 5 partidas.",
      sampleSize: 5,
      hitRate: 0.7,
      tags: ["escanteios", "pressão"],
    },
  ],
  "argentina-argelia": [
    {
      title: "Argentina goleia zebras em estreias",
      narrative:
        "Nas últimas 5 estreias de Copa, a Argentina venceu 4 e marcou 2+ gols em 4 delas.",
      sampleSize: 5,
      hitRate: 0.8,
      tags: ["over", "favorito"],
    },
    {
      title: "Messi participa de gol na estreia",
      narrative:
        "Messi marcou ou deu assistência em 7 dos últimos 9 jogos pela seleção.",
      sampleSize: 9,
      hitRate: 0.78,
      tags: ["messi", "decisivo"],
    },
  ],
  "franca-senegal": [
    {
      title: "Senegal compete contra favoritos",
      narrative:
        "Em 4 dos últimos 6 jogos contra seleções do top 10, o Senegal não perdeu por mais de 1 gol.",
      sampleSize: 6,
      hitRate: 0.67,
      tags: ["equilíbrio", "handicap"],
    },
    {
      title: "França marca, mas leva gol",
      narrative:
        "Ambas as equipes marcaram em 5 dos últimos 7 jogos da França em fase de grupos.",
      sampleSize: 7,
      hitRate: 0.71,
      tags: ["btts", "gols"],
    },
  ],
  "inglaterra-croacia": [
    {
      title: "Croácia leva jogos para o under",
      narrative:
        "Em 5 dos últimos 6 jogos decisivos, partidas da Croácia terminaram com under 2.5 gols.",
      sampleSize: 6,
      hitRate: 0.83,
      tags: ["under", "defesa"],
    },
    {
      title: "Inglaterra forte no 1º tempo",
      narrative:
        "A Inglaterra esteve à frente no placar ao intervalo em 6 dos últimos 8 jogos de Copa.",
      sampleSize: 8,
      hitRate: 0.75,
      tags: ["1º tempo", "favorito"],
    },
  ],
  "estados-unidos-paraguai": [
    {
      title: "EUA forte jogando em casa",
      narrative:
        "Como mandante, os EUA venceram 6 dos últimos 8 jogos por seleções na própria Copa/Copa Ouro.",
      sampleSize: 8,
      hitRate: 0.75,
      tags: ["mandante", "favorito"],
    },
    {
      title: "Paraguai aposta no empate",
      narrative:
        "O Paraguai empatou 4 dos últimos 7 jogos em competições oficiais — especialista em segurar resultado.",
      sampleSize: 7,
      hitRate: 0.57,
      tags: ["empate", "defesa"],
    },
  ],
};

// Cenário genérico para jogos sem destaque (templated).
function genericScenarios(matchId: string, homeName: string, fav: boolean): Omit<StatScenario, "id">[] {
  const base: Omit<StatScenario, "id">[] = [
    {
      matchId,
      title: fav ? `${homeName} favorito em casa` : "Jogo de margens curtas",
      narrative: fav
        ? `${homeName} venceu 4 dos últimos 5 jogos como mandante, com boa média de finalizações.`
        : "Confronto equilibrado: 3 dos últimos 5 jogos entre seleções deste nível terminaram com diferença de 1 gol.",
      sampleSize: 5,
      hitRate: fav ? 0.8 : 0.6,
      tags: fav ? ["mandante", "favorito"] : ["equilíbrio"],
    },
    {
      matchId,
      title: "Tendência de gols na estreia",
      narrative:
        "Estreias de Copa do Mundo costumam ser cautelosas: 58% delas terminam com 2 gols ou menos.",
      sampleSize: 12,
      hitRate: 0.58,
      tags: ["under", "estreia"],
    },
  ];
  return base;
}

const predictions: Prediction[] = [];
const scenarios: StatScenario[] = [];

for (const m of matches) {
  const s = m.snapshot!;
  const maxP = Math.max(s.home, s.draw, s.away);
  const homeFav = s.home >= s.away;
  const favName = homeFav ? m.home.name : m.away.name;

  // 1x2
  predictions.push({
    id: `${m.id}-1x2`,
    matchId: m.id,
    market: "1x2",
    marketLabel: "Resultado final",
    confidence: confFor(maxP),
    summary: `${favName} é o favorito pela leitura da IA. ${
      maxP >= 0.65
        ? "Diferença técnica clara entre as seleções."
        : "Jogo com margem para surpresa, mas tendência definida."
    }`,
    outcomes: [
      { label: m.home.name, probability: s.home, impliedOdds: io(s.home) },
      { label: "Empate", probability: s.draw, impliedOdds: io(s.draw) },
      { label: m.away.name, probability: s.away, impliedOdds: io(s.away) },
    ],
  });

  // Over/Under 2.5
  const over = r2(clamp(0.4 + (maxP - 0.5) * 0.6, 0.3, 0.72));
  const under = r2(1 - over);
  predictions.push({
    id: `${m.id}-ou`,
    matchId: m.id,
    market: "over_under",
    marketLabel: "Total de gols (2.5)",
    confidence: confFor(Math.max(over, under)),
    summary:
      over >= under
        ? "Diferença de força tende a abrir espaços e gerar gols."
        : "Equilíbrio e cautela apontam para jogo de poucos gols.",
    outcomes: [
      { label: "Over 2.5", probability: over, impliedOdds: io(over) },
      { label: "Under 2.5", probability: under, impliedOdds: io(under) },
    ],
  });

  // Ambas marcam
  const bttsYes = r2(clamp(0.58 - (maxP - 0.5) * 0.8, 0.22, 0.6));
  const bttsNo = r2(1 - bttsYes);
  predictions.push({
    id: `${m.id}-btts`,
    matchId: m.id,
    market: "btts",
    marketLabel: "Ambas marcam",
    confidence: confFor(Math.max(bttsYes, bttsNo)),
    summary:
      bttsNo >= bttsYes
        ? "Favorito deve controlar e segurar atrás; tendência de só um lado marcar."
        : "Os dois ataques têm volume para balançar a rede.",
    outcomes: [
      { label: "Sim", probability: bttsYes, impliedOdds: io(bttsYes) },
      { label: "Não", probability: bttsNo, impliedOdds: io(bttsNo) },
    ],
  });

  // Dupla chance (só destaques, evita poluir)
  if (m.marquee) {
    const dc = r2(clamp((homeFav ? s.home + s.draw : s.away + s.draw), 0.5, 0.93));
    predictions.push({
      id: `${m.id}-dc`,
      matchId: m.id,
      market: "double_chance",
      marketLabel: "Dupla chance",
      confidence: "high",
      summary: "Combinação de baixa variância para o favorito não sair perdendo.",
      outcomes: [
        {
          label: `${homeFav ? m.home.name : m.away.name} ou Empate`,
          probability: dc,
          impliedOdds: io(dc),
        },
      ],
    });
  }

  // Cenários
  const special = marqueeScenarios[m.slug];
  if (special) {
    special.forEach((sc, i) =>
      scenarios.push({ ...sc, id: `${m.id}-s${i + 1}`, matchId: m.id })
    );
  } else {
    genericScenarios(m.id, m.home.name, maxP >= 0.55).forEach((sc, i) =>
      scenarios.push({ ...sc, id: `${m.id}-s${i + 1}` } as StatScenario)
    );
  }
}

export { predictions, scenarios };
