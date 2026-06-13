import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { activateSubscription } from '@/lib/subscription'

// Eventos de pagamento confirmado documentados pela Abacate Pay.
const PAID_EVENTS = new Set([
  'checkout.completed',
  'transparent.completed',
  'billing.paid',
  'pixQrCode.paid',
  'subscription.completed',
  'subscription.renewed',
])

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Procura um email válido APENAS dentro de containers de cliente/pagador —
// nunca no payload inteiro (evita ativar o email do lojista/metadata).
function findEmail(obj: unknown, depth = 0): string | undefined {
  if (!obj || depth > 4) return undefined
  if (typeof obj === 'string') return EMAIL_RE.test(obj) ? obj : undefined
  if (Array.isArray(obj)) {
    for (const v of obj) {
      const e = findEmail(v, depth + 1)
      if (e) return e
    }
    return undefined
  }
  if (typeof obj === 'object') {
    const rec = obj as Record<string, unknown>
    if (typeof rec.email === 'string' && EMAIL_RE.test(rec.email)) return rec.email
    for (const v of Object.values(rec)) {
      const e = findEmail(v, depth + 1)
      if (e) return e
    }
  }
  return undefined
}

// DEBUG TEMPORÁRIO: mapeia a "forma" do payload (chaves + tipos) sem expor
// valores (PII/secrets). Ajuda a achar onde a Abacate manda o email do
// cliente. Remover depois de confirmar o formato em produção.
function shapeOf(obj: unknown, depth = 0): unknown {
  if (depth > 4) return '…'
  if (obj === null || obj === undefined) return obj
  if (Array.isArray(obj)) return obj.length ? [shapeOf(obj[0], depth + 1)] : []
  if (typeof obj === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      out[k] = shapeOf(v, depth + 1)
    }
    return out
  }
  return typeof obj
}

function str(obj: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  if (!obj) return undefined
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v) return v
  }
  return undefined
}

function safeEq(a: string, b: string): boolean {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && timingSafeEqual(ba, bb)
}

/**
 * Autentica aceitando as formas que a Abacate usa/documenta:
 * query ?webhookSecret=, secret cru em header, ou HMAC-SHA256 do corpo
 * (hex/base64, com ou sem prefixo "sha256="). Cobre erro comum de config
 * (secret só no campo "Secret" do painel e não na URL).
 */
function authenticate(req: NextRequest, rawBody: string, secret: string): string | null {
  const qs = req.nextUrl.searchParams.get('webhookSecret')
  if (qs && safeEq(qs, secret)) return 'query'

  const headerSecret =
    req.headers.get('x-webhook-secret') ?? req.headers.get('webhook-secret')
  if (headerSecret && safeEq(headerSecret, secret)) return 'header'

  const sigRaw =
    req.headers.get('x-webhook-signature') ?? req.headers.get('x-signature')
  if (sigRaw) {
    const sig = sigRaw.replace(/^sha256=/i, '')
    const digest = createHmac('sha256', secret).update(rawBody).digest()
    if (
      safeEq(sig.toLowerCase(), digest.toString('hex')) ||
      safeEq(sig, digest.toString('base64'))
    ) {
      return 'hmac'
    }
  }
  return null
}

export async function POST(req: NextRequest) {
  const secret = process.env.ABACATE_WEBHOOK_SECRET
  if (!secret) {
    console.error('[webhook] ABACATE_WEBHOOK_SECRET não configurado')
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 })
  }

  const rawBody = await req.text()

  const authMethod = authenticate(req, rawBody, secret)
  if (!authMethod) {
    console.warn(
      '[webhook] AUTH FALHOU. temQuery=%s temHeader=%s temAssinatura=%s',
      Boolean(req.nextUrl.searchParams.get('webhookSecret')),
      Boolean(req.headers.get('x-webhook-secret') ?? req.headers.get('webhook-secret')),
      Boolean(req.headers.get('x-webhook-signature') ?? req.headers.get('x-signature'))
    )
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { event?: string; devMode?: boolean; data?: Record<string, unknown> }
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = String(body.event ?? '')
  const data = (body.data ?? {}) as Record<string, unknown>

  console.log(
    '[webhook DEBUG] event=%s devMode=%s shape=%s',
    event,
    String(body.devMode),
    JSON.stringify(shapeOf(data))
  )

  // Allowlist de eventos: só pagamento confirmado documentado entra.
  if (!PAID_EVENTS.has(event)) {
    console.log('[webhook] evento ignorado: %s', event)
    return NextResponse.json({ ok: true, ignored: true, event })
  }

  // Pagamentos simulados (devMode) podem ser bloqueados no lançamento
  // definindo ABACATE_BLOCK_DEV_MODE=true (durante testes, deixe sem).
  if (body.devMode && process.env.ABACATE_BLOCK_DEV_MODE === 'true') {
    console.log('[webhook] devMode bloqueado (ABACATE_BLOCK_DEV_MODE)')
    return NextResponse.json({ ok: true, ignored: true, devMode: true })
  }

  const checkout = (data.checkout ?? data.billing ?? data.payment ?? data.pixQrCode) as
    | Record<string, unknown>
    | undefined
  const customer = (data.customer ??
    (checkout?.customer as Record<string, unknown> | undefined)) as
    | Record<string, unknown>
    | undefined

  // Email SÓ de containers de cliente/pagador.
  const email = (
    str(customer, ['email']) ??
    findEmail(customer) ??
    findEmail(data.payerInformation)
  )
    ?.toLowerCase()
    .trim()

  console.log(
    '[webhook] hit auth=%s event=%s temEmail=%s checkoutId=%s status=%s devMode=%s',
    authMethod,
    event,
    Boolean(email),
    str(checkout, ['id']) ?? '?',
    str(checkout, ['status']) ?? '?',
    body.devMode
  )

  // Sem email = teste do painel ou pagador não identificado.
  // 200 pra não gerar "Falha"/retentativas; loga só as CHAVES (sem PII).
  if (!email) {
    console.warn(
      '[webhook] pagamento SEM EMAIL — pulado. keys(data)=%s keys(customer)=%s',
      Object.keys(data).join(','),
      customer ? Object.keys(customer).join(',') : 'null'
    )
    return NextResponse.json({ ok: true, skipped: 'sem email' })
  }

  // Idempotência por TRANSAÇÃO (bill MULTIPLE_PAYMENTS repete o checkout.id
  // p/ todos os pagadores). Fallback final tem bucket mensal pra permitir
  // renovação pelo MESMO link estático.
  const receiptUrl = str(checkout, ['receiptUrl']) ?? ''
  const tranMatch = receiptUrl.match(/tran_[A-Za-z0-9]+/)
  const monthBucket = new Date().toISOString().slice(0, 7) // YYYY-MM
  const txId =
    tranMatch?.[0] ??
    str(data.payment as Record<string, unknown> | undefined, ['id']) ??
    str(data.transaction as Record<string, unknown> | undefined, ['id']) ??
    `${str(checkout, ['id']) ?? 'bill'}::${email}::${monthBucket}`

  const name = str(customer, ['name']) ?? ''

  const result = await activateSubscription({ email, name, txId })
  if (!result.ok) {
    console.error('[webhook] ativação falhou (%s) — Abacate reenvia', result.error)
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  if (result.duplicate) {
    return NextResponse.json({ ok: true, duplicate: true })
  }

  console.log('[webhook] OK — acesso liberado (tx %s)', txId)
  return NextResponse.json({ ok: true })
}
