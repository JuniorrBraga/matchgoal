import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Server-only admin client — never expose SUPABASE_SERVICE_ROLE_KEY client-side.
//
// IMPORTANTE: instanciação LAZY. Se o client fosse criado no topo do módulo,
// o `next build` quebraria ("supabaseKey is required") ao coletar as rotas que
// importam este arquivo quando o env não está disponível. O Proxy abaixo só
// cria o client de verdade no primeiro acesso (em runtime), mantendo as rotas
// inalteradas (`supabaseAdmin.from(...)`, `supabaseAdmin.auth.admin...`).
let cached: SupabaseClient<Database> | null = null

function getClient(): SupabaseClient<Database> {
  if (cached) return cached
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Supabase admin não configurado: defina NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.'
    )
  }
  cached = createClient<Database>(url, key, {
    db: { schema: 'matchgoal' },
    auth: { autoRefreshToken: false, persistSession: false },
  })
  return cached
}

export const supabaseAdmin = new Proxy({} as SupabaseClient<Database>, {
  get(_target, prop) {
    const client = getClient() as unknown as Record<string | symbol, unknown>
    const value = client[prop]
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value
  },
})
