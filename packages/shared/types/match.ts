// MatchGoal — tipos de partida (compartilhados entre app e landing).

export type MatchStatus = "scheduled" | "live" | "finished";

/** Disponibilidade da análise da IA para a partida. */
export type AnalysisTier = "free" | "premium";

export interface Team {
  id: string;
  name: string;
  /** Sigla curta, ex.: "BRA". */
  shortName: string;
  /** Emoji da bandeira ou URL de escudo (mock por enquanto). */
  flag: string;
}

/**
 * Resumo do mercado 1x2 em PROBABILIDADES (0..1) — usado nos cards da lista.
 * São leitura de dados, não cotações garantidas.
 */
export interface MatchSnapshot {
  home: number;
  draw: number;
  away: number;
}

/** Resultado de um jogo recente para o "form guide". */
export type FormResult = "W" | "D" | "L";

export interface TeamForm {
  home: FormResult[];
  away: FormResult[];
}

/** Confronto direto (histórico) entre as duas seleções. */
export interface HeadToHead {
  summary: string;
  homeWins: number;
  draws: number;
  awayWins: number;
}

export interface Match {
  id: string;
  /** Slug usado em rotas e nomes de assets, ex.: "brasil-marrocos". */
  slug: string;
  competition: string; // "Copa do Mundo 2026"
  /** Grupo curto, ex.: "Grupo C". */
  group: string;
  stage: string; // "Fase de grupos — Grupo C"
  /** Data/hora do pontapé inicial em ISO 8601. */
  kickoff: string;
  status: MatchStatus;
  venue?: string;
  home: Team;
  away: Team;
  analysisTier: AnalysisTier;
  hasAnalysis: boolean;
  /** Jogo de destaque (recebe card grande na lista). */
  marquee?: boolean;
  /** Imagem de fundo do card (foto dos jogadores / estádio). */
  heroImageUrl: string;
  /** Prévia do mercado 1x2 para exibir no card da lista. */
  snapshot?: MatchSnapshot;
  /** Últimos resultados de cada seleção. */
  form?: TeamForm;
  /** Histórico de confrontos diretos. */
  h2h?: HeadToHead;
}
