import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.matchgoal.site'
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'MatchGoal <noreply@matchgoal.com.br>'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Procura recursivamente um email válido em qualquer lugar do payload.
function findEmail(obj: unknown, depth = 0): string | undefined {
  if (!obj || depth > 6) return undefined
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
    // prioriza chaves "email"
    if (typeof rec.email === 'string' && EMAIL_RE.test(rec.email)) return rec.email
    for (const v of Object.values(rec)) {
      const e = findEmail(v, depth + 1)
      if (e) return e
    }
  }
  return undefined
}

function findFirst(obj: Record<string, unknown> | undefined, keys: string[]): string | undefined {
  if (!obj) return undefined
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v) return v
  }
  return undefined
}

export async function POST(req: NextRequest) {
  // 1. Secret (Abacate manda como ?webhookSecret=)
  const secret = req.nextUrl.searchParams.get('webhookSecret')
  if (!secret || secret !== process.env.ABACATE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { event?: string; devMode?: boolean; data?: Record<string, unknown> }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const event = String(body.event ?? '')
  const data = (body.data ?? {}) as Record<string, unknown>

  // 2. Só age em pagamento CONFIRMADO. Aceita qualquer nome de evento de
  //    conclusão/pagamento (checkout.completed, transparent.completed,
  //    billing.paid, subscription.completed, etc) e ignora estorno/disputa.
  const isPaidEvent =
    (/completed|paid|succeeded|approved/i.test(event) || /paid/i.test(String(findFirst(data, ['status']) ?? ''))) &&
    !/refund|dispute|charge_?back|cancel|fail|expired/i.test(event)

  if (!isPaidEvent) {
    return NextResponse.json({ ok: true, ignored: true, event })
  }

  // 3. Extrai email e id em QUALQUER estrutura que a Abacate use.
  const checkout = (data.checkout ?? data.billing ?? data.payment ?? data.pixQrCode) as
    | Record<string, unknown>
    | undefined
  const customer = (data.customer ??
    (checkout?.customer as Record<string, unknown> | undefined)) as
    | Record<string, unknown>
    | undefined

  const email =
    (findFirst(customer, ['email']) ?? findEmail(data))?.toLowerCase().trim()
  const checkoutId =
    findFirst(checkout, ['id']) ?? findFirst(data, ['id']) ?? (email ? `evt-${email}-${Date.now()}` : undefined)
  const name = findFirst(customer, ['name']) ?? ''
  const externalId = findFirst(checkout, ['externalId']) ?? ''
  const isRenewal = externalId.startsWith('renewal:')

  if (!email || !checkoutId) {
    // Loga o corpo cru pra diagnóstico (aparece nos Runtime Logs do Vercel).
    console.error('[webhook] NÃO achei email/id. event=%s body=%s', event, JSON.stringify(body).slice(0, 1500))
    return NextResponse.json({ error: 'payload sem email/id', event }, { status: 422 })
  }

  // 4. Idempotência
  const { data: alreadyProcessed } = await supabaseAdmin
    .from('processed_transactions')
    .select('checkout_id')
    .eq('checkout_id', checkoutId)
    .maybeSingle()
  if (alreadyProcessed) {
    return NextResponse.json({ ok: true, duplicate: true })
  }

  const periodEnd = new Date()
  periodEnd.setDate(periodEnd.getDate() + 30)

  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existingProfile) {
    await supabaseAdmin
      .from('profiles')
      .update({ status: 'active', period_end: periodEnd.toISOString() })
      .eq('id', existingProfile.id)
  } else if (!isRenewal) {
    const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    })
    if (createErr) console.warn('[webhook] createUser:', createErr.message)

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    const uid = list?.users?.find((u) => u.email?.toLowerCase() === email)?.id

    if (uid) {
      await supabaseAdmin.from('profiles').upsert({
        id: uid,
        email,
        status: 'active',
        period_end: periodEnd.toISOString(),
      })
    }

    try {
      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: { redirectTo: `${APP_URL}/auth/callback` },
      })
      const magicLink = linkData?.properties?.action_link
      if (magicLink) {
        await resend.emails.send({
          from: EMAIL_FROM,
          to: email,
          subject: 'Bem-vindo ao MatchGoal — seu acesso está pronto!',
          html: welcomeEmail(name, magicLink),
        })
      }
    } catch (err) {
      console.error('[webhook] falha ao enviar email de acesso:', err)
    }
  }

  await supabaseAdmin.from('processed_transactions').insert({ checkout_id: checkoutId, email })

  return NextResponse.json({ ok: true, email })
}

function welcomeEmail(name: string, magicLink: string): string {
  const first = name?.split(' ')[0] || 'craque'
  return `
  <!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"></head>
  <body style="font-family:sans-serif;background:#f4f6f9;padding:40px 20px;margin:0;">
    <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:14px;padding:40px;border:1px solid #e5e8ee;">
      <h1 style="color:#FF6A00;margin:0 0 8px;font-size:26px;">Pagamento confirmado! ⚽</h1>
      <p style="color:#5a6573;margin:0 0 28px;font-size:15px;">Olá, ${first}. Seu acesso ao MatchGoal está liberado.</p>
      <a href="${magicLink}" style="display:inline-block;background:#FF6A00;color:#fff;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:10px;font-size:16px;">
        Acessar minhas análises →
      </a>
      <p style="color:#8a93a1;font-size:12px;margin:28px 0 0;">
        Link de uso único, expira em 1 hora. Depois é só entrar com seu email em
        <a href="${APP_URL}/login" style="color:#FF6A00;">${APP_URL.replace('https://', '')}/login</a>.
      </p>
    </div>
  </body></html>`
}
