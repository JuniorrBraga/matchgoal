import { supabaseAdmin } from './supabase/admin'
import { resend } from './email'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://app.matchgoal.site'
const EMAIL_FROM = process.env.EMAIL_FROM ?? 'MatchGoal <noreply@matchgoal.com.br>'

export type ActivateResult =
  | { ok: true; duplicate: true }
  | { ok: true; duplicate: false; renewal: boolean; periodEnd: string }
  | { ok: false; error: string }

/**
 * Ativa/renova 30 dias de acesso para `email`: cria conta no Auth se
 * necessário, upsert em `profiles` e envia o email de acesso (magic link).
 * Usado pelo webhook da Abacate E pela ativação manual em /admin.
 *
 * `txId` é a chave de idempotência em `processed_transactions` — gere algo
 * único por chamada para não bloquear ativações futuras.
 */
export async function activateSubscription({
  email,
  name = '',
  txId,
}: {
  email: string
  name?: string
  txId: string
}): Promise<ActivateResult> {
  // Reserva a transação ANTES de processar (dedup atômico via unique).
  const { error: reserveErr } = await supabaseAdmin
    .from('processed_transactions')
    .insert({ checkout_id: txId, email })
  if (reserveErr) {
    if (reserveErr.code === '23505') {
      return { ok: true, duplicate: true }
    }
    return { ok: false, error: `reservar transação: ${reserveErr.message}` }
  }

  const releaseAndFail = async (reason: string): Promise<ActivateResult> => {
    await supabaseAdmin.from('processed_transactions').delete().eq('checkout_id', txId)
    return { ok: false, error: reason }
  }

  const { data: existingProfile } = await supabaseAdmin
    .from('profiles')
    .select('id, period_end')
    .eq('email', email)
    .maybeSingle()

  // Renovação ESTENDE o período: 30 dias a partir do vencimento atual
  // (se ainda ativo) ou de agora — pagar/ativar antes não perde dias.
  const base = Math.max(
    Date.now(),
    existingProfile?.period_end ? Date.parse(existingProfile.period_end) : 0
  )
  const periodEnd = new Date(base + 30 * 24 * 60 * 60 * 1000)
  const renewal = Boolean(existingProfile)

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
      if (createErr) console.warn('[subscription] createUser:', createErr.message)
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

  // Email de acesso (novo cliente E renovação) — não bloqueia a ativação.
  try {
    const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: { redirectTo: `${APP_URL}/auth/confirm` },
    })
    const tokenHash = linkData?.properties?.hashed_token
    if (tokenHash) {
      // Link via NOSSA rota /auth/confirm (verifyOtp + cookies de sessão).
      const accessLink = `${APP_URL}/auth/confirm?token_hash=${encodeURIComponent(tokenHash)}&type=magiclink`
      await resend.emails.send({
        from: EMAIL_FROM,
        to: email,
        subject: renewal
          ? 'MatchGoal — sua assinatura foi renovada!'
          : 'Bem-vindo ao MatchGoal — seu acesso está pronto!',
        html: welcomeEmail(name, accessLink, renewal),
      })
    }
  } catch (err) {
    console.error('[subscription] falha ao enviar email de acesso:', err)
  }

  return { ok: true, duplicate: false, renewal, periodEnd: periodEnd.toISOString() }
}

export function welcomeEmail(name: string, accessLink: string, isRenewal: boolean): string {
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
