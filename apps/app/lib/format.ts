// MatchGoal — helpers de formatação para a UI.

/** Probabilidade 0..1 → "67%". */
export function pct(p: number): string {
  return `${Math.round(p * 100)}%`;
}

/** Odd de referência → "1.34". */
export function odds(value?: number): string {
  return value == null ? "—" : value.toFixed(2);
}

/** ISO 8601 → "qua, 11 jun · 18:00" (horário de Brasília). */
export function kickoffLabel(iso: string): string {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
  const day = date.toLocaleDateString("pt-BR", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    timeZone: "America/Sao_Paulo",
  });
  return `${day} · ${time}`;
}

/** ISO 8601 → { day: "11 jun", time: "18:00" } (horário de Brasília). */
export function kickoffShort(iso: string): { day: string; time: string } {
  const date = new Date(iso);
  return {
    day: date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      timeZone: "America/Sao_Paulo",
    }),
    time: date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "America/Sao_Paulo",
    }),
  };
}

/** "conservative" → "Conservador" etc. */
export function riskLabel(risk: string): string {
  const map: Record<string, string> = {
    conservative: "Conservador",
    balanced: "Equilibrado",
    aggressive: "Agressivo",
  };
  return map[risk] ?? risk;
}

/** Nível de confiança → rótulo PT. */
export function confidenceLabel(c: string): string {
  const map: Record<string, string> = {
    low: "Baixa",
    medium: "Média",
    high: "Alta",
  };
  return map[c] ?? c;
}
