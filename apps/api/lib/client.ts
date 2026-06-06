// Cliente HTTP da API-Football. REST/JSON, auth por header x-apisports-key.
// Trata o gotcha "HTTP 200 + array vazio" como ausência de cobertura.

import { API_BASE, getApiKey } from "./config";

export interface ApiEnvelope<T> {
  get: string;
  results: number;
  errors: unknown;
  response: T[];
}

export interface ApiGetOptions {
  /** Segundos de cache (usado quando rodando no Next.js). */
  revalidate?: number;
}

/**
 * GET genérico. Retorna sempre um array (vazio = sem cobertura).
 * Lança erro se a chave estiver ausente ou em falha HTTP.
 */
export async function apiGet<T>(
  path: string,
  params: Record<string, string | number> = {},
  opts: ApiGetOptions = {}
): Promise<T[]> {
  const key = getApiKey();
  if (!key) throw new Error("API_FOOTBALL_KEY ausente — configure no .env.local");

  const url = new URL(API_BASE + path);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }

  // `next` só existe no runtime do Next.js; cast evita erro de tipo fora dele.
  const init = {
    headers: { "x-apisports-key": key },
    next: { revalidate: opts.revalidate ?? 3 * 3600 },
  } as RequestInit;

  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`API-Football respondeu ${res.status} em ${path}`);
  }
  const data = (await res.json()) as ApiEnvelope<T>;
  return Array.isArray(data.response) ? data.response : [];
}
