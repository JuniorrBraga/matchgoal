import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

interface AbacateWebhookBody {
  event: string
  devMode?: boolean
  data: {
    checkout: {
      id: string
      customer: {
        name: string
        email: string
        taxId?: string
        cellphone?: string
      }
      externalId?: string
      paidAmount: number
      status: string
    }
  }
}

export async function POST(req: NextRequest) {
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

  if (body.event !== 'checkout.completed') {
    return NextResponse.json({ ok: true, ignored: true })
  }

  const { checkout } = body.data
  const checkoutId = checkout.id
  const email = checkout.customer.email.toLowerCase().trim()
  const externalId = checkout.externalId ?? ''
  const isRenewal = externalId.startsWith('renewal:')

  // Idempotência — a Abacate reenvia webhooks, nunca processa duas vezes
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
    // Usuário existente — atualiza o período
    await supabaseAdmin
      .from('profiles')
      .update({ status: 'active', period_end: periodEnd.toISOString() })
      .eq('id', existingProfile.id)
  } else if (!isRenewal) {
    // Novo usuário — cria conta no Supabase Auth
    // O usuário vai fazer login pelo magic link na página /login
    const { data: userData } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true,
    })

    if (userData?.user) {
      await supabaseAdmin.from('profiles').insert({
        id: userData.user.id,
        email,
        status: 'active',
        period_end: periodEnd.toISOString(),
      })
    }
  }

  await supabaseAdmin.from('processed_transactions').insert({
    checkout_id: checkoutId,
    email,
  })

  return NextResponse.json({ ok: true })
}
