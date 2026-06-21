import { NextRequest, NextResponse } from 'next/server'
import { activateSubscription } from '@/lib/subscription'

// Eventos de pagamento confirmado configurados no painel da Kiwify.
const PAID_EVENTS = new Set(['order_approved', 'subscription_renewed'])

export async function POST(req: NextRequest) {
  const token = process.env.KIWIFY_WEBHOOK_TOKEN
  if (!token) {
    console.error('[webhook kiwify] KIWIFY_WEBHOOK_TOKEN não configurado')
    return NextResponse.json({ error: 'misconfigured' }, { status: 500 })
  }

  const tokenParam = req.nextUrl.searchParams.get('token')
  if (tokenParam !== token) {
    console.warn('[webhook kiwify] AUTH FALHOU')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = String(body.webhook_event_type ?? '')

  if (!PAID_EVENTS.has(event)) {
    console.log('[webhook kiwify] evento ignorado: %s', event)
    return NextResponse.json({ ok: true, ignored: true, event })
  }

  const customer = body.Customer as Record<string, unknown> | undefined
  const email = (typeof customer?.email === 'string' ? customer.email : '')
    .toLowerCase()
    .trim()
  const name = typeof customer?.full_name === 'string' ? customer.full_name : ''

  console.log(
    '[webhook kiwify] hit event=%s temEmail=%s orderId=%s',
    event,
    Boolean(email),
    String(body.order_id ?? '?')
  )

  if (!email) {
    console.warn('[webhook kiwify] pagamento SEM EMAIL — pulado. keys=%s', Object.keys(body).join(','))
    return NextResponse.json({ ok: true, skipped: 'sem email' })
  }

  const txId = String(body.order_id ?? `kiwify::${email}::${Date.now()}`)

  const result = await activateSubscription({ email, name, txId })
  if (!result.ok) {
    console.error('[webhook kiwify] ativação falhou (%s) — Kiwify reenvia', result.error)
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  if (result.duplicate) {
    return NextResponse.json({ ok: true, duplicate: true })
  }

  console.log('[webhook kiwify] OK — acesso liberado (tx %s)', txId)
  return NextResponse.json({ ok: true })
}
