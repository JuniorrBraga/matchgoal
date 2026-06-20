import { NextRequest, NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CPF_RE = /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/

function validarCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(digits[i]) * (10 - i)
  let r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  if (r !== Number(digits[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(digits[i]) * (11 - i)
  r = (sum * 10) % 11
  if (r === 10 || r === 11) r = 0
  return r === Number(digits[10])
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ABACATE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Configuração interna ausente' }, { status: 500 })
  }

  let body: { name?: string; email?: string; taxId?: string; cellphone?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const name = body.name?.trim()
  const email = body.email?.toLowerCase().trim()
  const taxId = body.taxId?.trim()
  const cellphone = body.cellphone?.trim()

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Nome inválido' }, { status: 400 })
  }
  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }
  if (!taxId || !CPF_RE.test(taxId) || !validarCPF(taxId)) {
    return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
  }
  if (!cellphone || cellphone.replace(/\D/g, '').length < 10) {
    return NextResponse.json({ error: 'Celular inválido' }, { status: 400 })
  }

  const abacateRes = await fetch('https://api.abacatepay.com/v2/transparents/create', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      method: 'PIX',
      data: {
        amount: 2990,
        description: 'MatchGoal — Acesso Copa 2026',
        customer: { name, email, taxId, cellphone },
      },
    }),
  })

  if (!abacateRes.ok) {
    const err = await abacateRes.text()
    console.error('[checkout/create] Abacate error:', err)
    return NextResponse.json({ error: 'Erro ao gerar PIX. Tente novamente.' }, { status: 502 })
  }

  const { data } = await abacateRes.json()

  return NextResponse.json({
    id: data.id,
    brCode: data.brCode,
    qrCodeImage: data.brCodeBase64,
    amount: data.amount,
    expiresAt: data.expiresAt,
  })
}
