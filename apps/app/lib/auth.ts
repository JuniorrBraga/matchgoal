import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface AuthState {
  loggedIn: boolean;
  /** Logado E com assinatura ativa — pode ver as análises. */
  active: boolean;
  email?: string;
}

/**
 * Estado de acesso do visitante (server-side). App é ABERTO: qualquer um navega;
 * só as análises (detalhe da partida) exigem `active`.
 * `cache()` deduplica: AppShell + página chamam, mas só 1 request de auth por render.
 */
export const getAuthState = cache(async (): Promise<AuthState> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // Sem Supabase configurado: por padrão BLOQUEADO (o paywall vale, igual à
    // produção). Apenas para PREVIEW local explícito liberamos, via flag opt-in
    // NEXT_PUBLIC_DEV_UNLOCK=true — e nunca em produção (trava dupla por NODE_ENV).
    if (
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_DEV_UNLOCK === "true"
    ) {
      return { loggedIn: true, active: true, email: "preview@local" };
    }
    return { loggedIn: false, active: false };
  }
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { loggedIn: false, active: false };

    const { data: profile } = (await supabase
      .from("profiles")
      .select("status, period_end")
      .eq("id", user.id)
      .maybeSingle()) as {
      data: { status: string | null; period_end: string | null } | null;
    };

    const active =
      profile?.status === "active" &&
      profile?.period_end != null &&
      new Date(profile.period_end) > new Date();

    return { loggedIn: true, active: !!active, email: user.email ?? undefined };
  } catch {
    // Falha de auth não deve quebrar o app aberto.
    return { loggedIn: false, active: false };
  }
});
