import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend } from '@/lib/email'

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
  // 1. Valida o secret da Abacate Pay
  const secret = req.nextUrl.searchParams.get('webhookSecret')
  if (!secret || secret !== process.env.ABACATE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse do body
  let body: AbacateWebhookBody
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // 3. Ignora eventos que não sejam checkout.completed
  if (body.event !== 'checkout.completed') {
    return NextResponse.json({ ok: true, ignored: true })
  }

  const { checkout } = body.data
  const checkoutId = checkout.id
  const email = checkout.customer.email.toLowerCase().trim()
  const externalId = checkout.externalId ?? ''
  const isRenewal = externalId.startsWith('renewal:')

  // 4. Idempotência — a Abacate reenvia webhooks, nunca processa duas vezes
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

  // 5. Verifica se o usuário já tem perfil
  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existingProfile) {
    // Usuário existente — só atualiza o período
    await supabaseAdmin
      .from('profiles')
      .update({ status: 'active', period_end: periodEnd.toISOString() })
      .eq('id', existingProfile.id)
  } else if (!isRenewal) {
    // Novo usuário — cria conta no Supabase Auth e gera magic link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })

    if (!linkError && linkData?.user) {
      // Cria o perfil vinculado ao usuário do Auth
      await supabaseAdmin.from('profiles').insert({
        id: linkData.user.id,
        email,
        status: 'active',
        period_end: periodEnd.toISOString(),
      })

      // Envia email de boas-vindas com o magic link
      const magicLink = linkData.properties?.action_link
      if (magicLink) {
        await resend.emails.send({
          from: 'MatchGoal <noreply@matchgoal.com.br>',
          to: email,
          subject: 'Acesse o MatchGoal — seu link chegou!',
          html: buildWelcomeEmail(checkout.customer.name, magicLink),
        })
      }
    }
  }
  // Renovação sem perfil = edge case, só registra a transação

  // 6. Registra o checkout para garantir idempotência futura
  await supabaseAdmin.from('processed_transactions').insert({
    checkout_id: checkoutId,
    email,
  })

  return NextResponse.json({ ok: true })
}

function buildWelcomeEmail(name: string, magicLink: string): string {
  const firstName = name?.split(' ')[0] ?? 'atleta'
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family: sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 40px 20px; margin: 0;">
      <div style="max-width: 480px; margin: 0 auto; background: #111; border-radius: 12px; padding: 40px; border: 1px solid #222;">
        <h1 style="color: #22c55e; margin: 0 0 8px; font-size: 28px;">Pagamento confirmado!</h1>
        <p style="color: #aaa; margin: 0 0 32px;">Olá, ${firstName}. Seu acesso ao MatchGoal está pronto.</p>
        <a href="${magicLink}"
           style="display: inline-block; background: #22c55e; color: #000; font-weight: 700;
                  text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px;">
          Acessar minha conta →
        </a>
        <p style="color: #555; font-size: 12px; margin: 32px 0 0;">
          Este link é de uso único e expira em 1 hora.<br>
          Se não solicitou, ignore este email.
        </p>
      </div>
    </body>
    </html>
  `
}
