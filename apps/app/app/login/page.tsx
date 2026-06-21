'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
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

    try {
      const res = await fetch('/api/auth/quick-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Erro ao entrar. Tente novamente.')
        setLoading(false)
        return
      }
      router.push('/matches')
      router.refresh()
    } catch {
      setError('Erro de rede. Verifique sua conexão e tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      {/* Lado esquerdo — laranja (vira barra compacta no mobile) */}
      <div className="auth__art">
        <Link href="/matches" className="auth__logo">
          <Image src="/brand/logo-white.png" alt="MatchGoal" width={84} height={48} priority />
        </Link>

        <div className="auth__art-mid">
          <h1 className="auth__title">
            Análise<br />estatística<br />de futebol<br />com IA.
          </h1>
          <p className="auth__art-sub">
            Copa do Mundo 2026 — 104 partidas com probabilidades, cenários e bilhetes montados pela IA.
          </p>
        </div>

        <p className="auth__art-foot">
          Análise de dados — não promessa de resultado.
        </p>
      </div>

      {/* Lado direito — formulário */}
      <div className="auth__form-wrap">
        <div className="auth__form">
          <h2 style={{ fontSize: 28, fontWeight: 700, margin: '0 0 8px', color: '#111' }}>
            Acessar minha conta
          </h2>
          <p style={{ color: '#888', fontSize: 14, margin: '0 0 32px' }}>
            Digite o email usado na compra para entrar direto — sem precisar de senha.
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
              {loading ? 'Entrando...' : 'Entrar →'}
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
        </div>
      </div>
    </div>
  )
}
