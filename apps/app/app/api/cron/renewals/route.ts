import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import { resend } from '@/lib/email'

interface AbacateBillingCreateResponse {
  data: {
    billing: {
      id: string
      url: string
      amount: number
      status: string
    }
  }
  error?: string
}

export async function GET(req: NextRequest) {
  // Protege a rota — só o Vercel Cron (com CRON_SECRET) pode chamar
  const secret =
    req.nextUrl.searchParams.get('secret') ??
    req.headers.get('x-cron-secret')

  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Busca assinantes ativos com vencimento nos próximos 3 dias
  const now = new Date()
  const threeDaysFromNow = new Date()
  threeDaysFromNow.setDate(now.getDate() + 3)

  const { data: profiles, error: dbError } = await supabaseAdmin
    .from('profiles')
    .select('id, email, period_end')
    .eq('status', 'active')
    .gte('period_end', now.toISOString())
    .lte('period_end', threeDaysFromNow.toISOString())

  if (dbError) {
    console.error('[cron/renewals] DB error:', dbError.message)
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ notified: 0, failed: 0 })
  }

  const results = await Promise.allSettled(
    profiles.map(async (profile) => {
      // Cria link de cobrança na Abacate Pay
      // Ajuste o endpoint/payload conforme a documentação da sua conta
      const res = await fetch('https://api.abacatepay.com/v1/billing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.ABACATE_API_KEY}`,
        },
        body: JSON.stringify({
          frequency: 'ONE_TIME',
          methods: ['PIX', 'CREDIT_CARD'],
          products: [
            {
              externalId: 'monthly-subscription',
              name: 'MatchGoal — Renovação Mensal',
              description: 'Análise de futebol com IA para a Copa 2026',
              quantity: 1,
              price: 2990, // centavos
            },
          ],
          returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/obrigado`,
          completionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/obrigado`,
          externalId: `renewal:${profile.email}`,
          customer: { email: profile.email },
        }),
      })

      if (!res.ok) {
        throw new Error(`Abacate API ${res.status} para ${profile.email}`)
      }

      const billing: AbacateBillingCreateResponse = await res.json()
      const billingUrl = billing.data.billing.url

      // Envia email com o link PIX/cartão para renovação
      await resend.emails.send({
        from: 'MatchGoal <noreply@matchgoal.com.br>',
        to: profile.email,
        subject: 'Renove seu acesso ao MatchGoal antes de vencer',
        html: buildRenewalEmail(billingUrl, profile.period_end),
      })

      return profile.email
    })
  )

  const notified = results.filter((r) => r.status === 'fulfilled').length
  const failed = results.filter((r) => r.status === 'rejected').length

  if (failed > 0) {
    const errors = results
      .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
      .map((r) => r.reason?.message)
    console.error('[cron/renewals] falhas:', errors)
  }

  return NextResponse.json({ notified, failed })
}

function buildRenewalEmail(billingUrl: string, periodEnd: string | null): string {
  const expiryDate = periodEnd
    ? new Date(periodEnd).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
      })
    : 'em breve'

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family: sans-serif; background: #0a0a0a; color: #f5f5f5; padding: 40px 20px; margin: 0;">
      <div style="max-width: 480px; margin: 0 auto; background: #111; border-radius: 12px; padding: 40px; border: 1px solid #222;">
        <h1 style="color: #f59e0b; margin: 0 0 8px; font-size: 24px;">Seu acesso vence ${expiryDate}</h1>
        <p style="color: #aaa; margin: 0 0 32px;">
          Renove agora por R$&nbsp;29,90 e continue com acesso completo às análises da Copa 2026.
        </p>
        <a href="${billingUrl}"
           style="display: inline-block; background: #22c55e; color: #000; font-weight: 700;
                  text-decoration: none; padding: 14px 32px; border-radius: 8px; font-size: 16px;">
          Renovar acesso — R$ 29,90 →
        </a>
        <p style="color: #555; font-size: 12px; margin: 32px 0 0;">
          Pague via PIX ou cartão. O acesso é liberado automaticamente após o pagamento.
        </p>
      </div>
    </body>
    </html>
  `
}
