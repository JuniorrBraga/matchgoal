'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Mostra o motivo quando o usuário cai aqui vindo de um link quebrado
  // (?error=link_expired | auth_failed). Lido via window pra não forçar
  // Suspense/dynamic no build (useSearchParams exigiria).
  useEffect(() => {
    const err = new URLSearchParams(window.location.search).get('error')
    if (err === 'link_expired' || err === 'auth_failed') {
      setError('Seu link de acesso expirou ou já foi usado. Digite seu email abaixo para receber um novo.')
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Cria o client só no submit (não no build) — evita quebrar a build
    // estática quando a env NEXT_PUBLIC_* não está no ambiente (ex.: Preview).
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // Só quem comprou (criado no Supabase pelo webhook da Abacate) pode logar.
        shouldCreateUser: false,
      },
    })

    if (error) {
      // Com shouldCreateUser:false, email inexistente volta como
      // otp_disabled/signup_disabled — código estável, não prosa do erro.
      const code = (error as { code?: string }).code
      const notBuyer =
        code === 'otp_disabled' ||
        code === 'signup_disabled' ||
        code === 'user_not_found' ||
        /signups? not allowed|user not found/i.test(error.message)
      setError(
        notBuyer
          ? 'Esse email não tem assinatura ativa. Assine primeiro para liberar o acesso.'
          : error.message
      )
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }}>
      {/* Lado esquerdo — laranja */}
      <div style={{
        background: 'var(--color-primary, #f97316)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '40px 48px',
      }}>
        <Link href="/matches">
          <Image src="/brand/logo-white.png" alt="MatchGoal" width={84} height={48} priority />
        </Link>

        <div>
          <h1 style={{
            fontFamily: 'Anton, sans-serif',
            fontSize: 'clamp(48px, 5vw, 72px)',
            lineHeight: 1,
            color: '#fff',
            margin: '0 0 16px',
            textTransform: 'uppercase',
          }}>
            Análise<br />estatística<br />de futebol<br />com IA.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16, margin: 0 }}>
            Copa do Mundo 2026 — 104 partidas com probabilidades, cenários e bilhetes montados pela IA.
          </p>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>
          Análise de dados — não promessa de resultado.
        </p>
      </div>

      {/* Lado direito — formulário */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px 48px',
        background: '#fff',
      }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          {!sent ? (
            <>
              <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px', color: '#111' }}>
                Acessar minha conta
              </h2>
              <p style={{ color: '#888', fontSize: 14, margin: '0 0 32px' }}>
                Digite seu email e enviaremos um link de acesso direto — sem precisar de senha.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#333', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: 10,
                      padding: '12px 16px',
                      fontSize: 15,
                      color: '#111',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {error && (
                  <p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#fdba74' : '#f97316',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 15,
                    border: 'none',
                    borderRadius: 10,
                    padding: '13px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                    width: '100%',
                  }}
                >
                  {loading ? 'Enviando...' : 'Enviar link de acesso →'}
                </button>
              </form>

              <p style={{ color: '#aaa', fontSize: 12, textAlign: 'center', marginTop: 24 }}>
                Ainda não tem acesso?{' '}
                <a
                  href="https://matchgoal.site/#planos"
                  style={{ color: '#f97316', fontWeight: 600 }}
                >
                  Assinar →
                </a>
              </p>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: '#fff7ed', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 28, margin: '0 auto 24px',
              }}>
                📬
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 700, margin: '0 0 12px', color: '#111' }}>
                Verifique seu email
              </h2>
              <p style={{ color: '#666', fontSize: 14, margin: '0 0 8px' }}>
                Enviamos um link de acesso para
              </p>
              <p style={{ color: '#111', fontWeight: 600, fontSize: 15, margin: '0 0 32px' }}>
                {email}
              </p>
              <p style={{ color: '#aaa', fontSize: 13, margin: '0 0 24px' }}>
                O link expira em 1 hora. Verifique também o spam.
              </p>
              <button
                onClick={() => { setSent(false); setEmail('') }}
                style={{
                  background: 'none', border: '1.5px solid #e5e7eb',
                  borderRadius: 10, padding: '10px 24px',
                  fontSize: 14, color: '#555', cursor: 'pointer',
                }}
              >
                Usar outro email
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
