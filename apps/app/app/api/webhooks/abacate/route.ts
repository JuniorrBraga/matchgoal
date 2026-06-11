import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend } from '@/lib/email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.matchgoal.site'
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'MatchGoal <noreply@matchgoal.com.br>'

// Estrutura REAL do webhook da Abacate Pay (checkout.completed):
// { event, data: { checkout: {...}, customer: { name, email, ... } } }
// ATENÇÃO: o email fica em data.customer.email (NÃO em data.checkout.customer).
interface AbacateWebhookBody {
  event: string
  devMode?: boolean
  data: {
    checkout?: {
      id?: string
      externalId?: string
      paidAmount?: number
      status?: string
    }
    customer?: {
      name?: string
      email?: string
      taxId?: string
    }
  }
}

export async function POST(req: NextRequest) {
  // 1. Valida o secret (Abacate manda como ?webhookSecret=)
  const secret = req.nextUrl.searchParams.get('webhookSecret')
  if (!secret || secret !== process.env.ABACATE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: AbacateWebhookBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 2. Só processa pagamento confirmado (checkout normal ou transparente)
  if (body.event !== 'checkout.completed' && body.event !== 'transparent.completed') {
    return NextResponse.json({ ok: true, ignored: true, event: body.event })
  }

  // 3. Extrai os campos nos caminhos REAIS da Abacate
  const checkout = body.data?.checkout
  const customer = body.data?.customer
  const email = customer?.email?.toLowerCase().trim()
  const checkoutId = checkout?.id
  const name = customer?.name ?? ''
  const externalId = checkout?.externalId ?? ''
  const isRenewal = externalId.startsWith('renewal:')

  if (!email || !checkoutId) {
    console.error('[webhook] payload sem email/checkoutId:', JSON.stringify(body.data))
    return NextResponse.json({ error: 'payload sem email/checkoutId' }, { status: 422 })
  }

  // 4. Idempotência — a Abacate reenvia webhooks
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
    // Renovação — só estende o período
    await supabaseAdmin
      .from('profiles')
      .update({ status: 'active', period_end: periodEnd.toISOString() })
      .eq('id', existingProfile.id)
  } else if (!isRenewal) {
    // Novo cliente — garante a conta no Auth, ativa o perfil e manda o acesso por email.
    const { error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    })
    if (createErr) {
      // Pode já existir (ex.: logou antes de pagar) — seguimos para achar o id.
      console.warn('[webhook] createUser:', createErr.message)
    }

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

    // Email de boas-vindas com link de acesso (não bloqueia o webhook se falhar).
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

  await supabaseAdmin.from('processed_transactions').insert({
    checkout_id: checkoutId,
    email,
  })

  return NextResponse.json({ ok: true })
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
        Este link é de uso único e expira em 1 hora. Depois disso, é só entrar com seu email em
        <a href="${APP_URL}/login" style="color:#FF6A00;">${APP_URL.replace('https://', '')}/login</a>.
      </p>
    </div>
  </body></html>`
}
