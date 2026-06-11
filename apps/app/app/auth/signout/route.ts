import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Logout — encerra a sessão e volta para o /login. POST para não ser disparado
// por prefetch/GET acidental.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    await supabase.auth.signOut()
  } catch {
    // segue para o redirect mesmo se falhar
  }
  return NextResponse.redirect(new URL('/login', request.url), { status: 303 })
}
