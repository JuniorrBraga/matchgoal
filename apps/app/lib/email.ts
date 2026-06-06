import { Resend } from 'resend'

// Cliente Resend LAZY — mesma razão do supabaseAdmin: instanciar no topo do
// módulo quebra o `next build` quando RESEND_API_KEY não está disponível.
// O Proxy só cria a instância no primeiro acesso (runtime), sem mudar as rotas.
let cached: Resend | null = null

function getResend(): Resend {
  if (cached) return cached
  const key = process.env.RESEND_API_KEY
  if (!key) {
    throw new Error('RESEND_API_KEY não configurado.')
  }
  cached = new Resend(key)
  return cached
}

export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResend() as unknown as Record<string | symbol, unknown>
    const value = client[prop]
    return typeof value === 'function'
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value
  },
})
