import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

type Profile = {
  status: 'active' | 'expired'
  period_end: string | null
}

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: usar getUser() — getSession() usa cache e pode estar desatualizado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/paywall', request.url))
  }

  // Verifica assinatura ativa
  const { data: profile } = await supabase
    .from('profiles')
    .select('status, period_end')
    .eq('id', user.id)
    .maybeSingle() as { data: Profile | null; error: unknown }

  const isActive =
    profile?.status === 'active' &&
    profile?.period_end != null &&
    new Date(profile.period_end) > new Date()

  if (!isActive) {
    return NextResponse.redirect(new URL('/paywall', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    // Protege tudo exceto: assets estáticos, paywall, auth, webhooks e cron
    '/((?!_next/static|_next/image|favicon\\.ico|paywall|auth|jogo-responsavel|api/webhooks|api/cron|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
