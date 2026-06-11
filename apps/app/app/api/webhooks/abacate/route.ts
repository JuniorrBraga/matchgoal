import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.matchgoal.site'
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'MatchGoal <noreply@matchgoal.com.br>'

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

  // Reserva a transação ANTES de processar (dedup atômico via unique).
  // Corrida de entregas duplicadas: a segunda bate no 23505 e sai.
  const { error: reserveErr } = await supabaseAdmin
    .from('processed_transactions')
    .insert({ checkout_id: txId, email })
  if (reserveErr) {
    if (reserveErr.code === '23505') {
      return NextResponse.json({ ok: true, duplicate: true })
    }
    console.error('[webhook] erro ao reservar transação:', reserveErr.message)
    return NextResponse.json({ error: 'db error' }, { status: 500 })
  }

  // Se a ativação falhar, LIBERA a reserva e devolve 500 — a Abacate
  // reenvia e o cliente não fica pago-sem-acesso.
  const releaseAndFail = async (reason: string) => {
    console.error('[webhook] ativação falhou (%s) — liberando p/ retry', reason)
    await supabaseAdmin.from('processed_transactions').delete().eq('checkout_id', txId)
    return NextResponse.json({ error: reason }, { status: 500 })
  }

  const name = str(customer, ['name']) ?? ''

  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id, period_end')
    .eq('email', email)
    .maybeSingle()

  // Renovação ESTENDE o período: 30 dias a partir do vencimento atual
  // (se ainda ativo) ou de agora — pagar antes não perde dias.
  const base = Math.max(
    Date.now(),
    existingProfile?.period_end ? Date.parse(existingProfile.period_end) : 0
  )
  const periodEnd = new Date(base + 30 * 24 * 60 * 60 * 1000)

  if (existingProfile) {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ status: 'active', period_end: periodEnd.toISOString() })
      .eq('id', existingProfile.id)
    if (error) return releaseAndFail(`update profile: ${error.message}`)
  } else {
    // Novo cliente — cria no Auth e usa o id RETORNADO pelo createUser.
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    let uid = created?.user?.id
    if (!uid) {
      // Usuário já existia no Auth (ex.: logou antes de pagar) — localiza.
      if (createErr) console.warn('[webhook] createUser:', createErr.message)
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
      uid = list?.users?.find((u) => u.email?.toLowerCase() === email)?.id
    }

    if (!uid) return releaseAndFail('não consegui criar/achar usuário no Auth')

    const { error: upsertErr } = await supabaseAdmin.from('profiles').upsert({
      id: uid,
      email,
      status: 'active',
      period_end: periodEnd.toISOString(),
    })
    if (upsertErr) return releaseAndFail(`upsert profile: ${upsertErr.message}`)
  }

  // Email de acesso (novo cliente E renovação) — não bloqueia o webhook.
  try {
    const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${APP_URL}/auth/confirm` },
    })
    const tokenHash = linkData?.properties?.hashed_token
    if (tokenHash) {
      // Link via NOSSA rota /auth/confirm (verifyOtp + cookies de sessão).
      // O action_link cru da Supabase devolve tokens no fragmento (#...),
      // que o callback de servidor não enxerga.
      // type=magiclink: confirmado que é o que o verifyOtp aceita para o
      // token de admin.generateLink (type=email falha).
      const accessLink = `${APP_URL}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}&type=magiclink`
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: existingProfile
          ? 'MatchGoal — sua assinatura foi renovada!'
          : 'Bem-vindo ao MatchGoal — seu acesso está pronto!',
        html: welcomeEmail(name, accessLink, Boolean(existingProfile)),
      })
    }
  } catch (err) {
    console.error('[webhook] falha ao enviar email de acesso:', err)
  }

  console.log('[webhook] OK — acesso liberado (tx %s)', txId)
  return NextResponse.json({ ok: true })
}

function welcomeEmail(name: string, accessLink: string, isRenewal: boolean): string {
  const first = name?.split(' ')[0] || 'craque'
  const title = isRenewal ? 'Assinatura renovada! 🔁' : 'Pagamento confirmado! ⚽'
  const sub = isRenewal
    ? `Olá, ${first}. Sua assinatura do MatchGoal foi estendida.`
    : `Olá, ${first}. Seu acesso ao MatchGoal está liberado.`
  return `
  <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
  <body style="font-family:sans-serif;background:#f4f6f9;padding:40px 20px;margin:0;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:14px;padding:40px;border:1px solid #e5e8ee;">
      <h1 style="color:#FF6A00;margin:0 0 8px;font-size:26px;">${title}</h1>
      <p style="color:#5a6573;margin:0 0 28px;font-size:15px;">${sub}</p>
      <a href="${accessLink}" style="display:inline-block;background:#FF6A00;color:#fff;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:16px;">
        Acessar minhas análises →
      </a>
      <p style="color:#8a93a1;font-size:12px;margin:28px 0 0;">
        Link de uso único, expira em 1 hora. Depois é só entrar com seu email em
        <a href="${APP_URL}/login" style="color:#FF6A00;">${APP_URL.replace('https://', '')}/login</a>.
      </p>
    </div>
  </body></html>`
}
