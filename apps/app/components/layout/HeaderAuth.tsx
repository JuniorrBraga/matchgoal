"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ABACATE_CHECKOUT } from "@/lib/links";

/**
 * Botões de auth do header — resolvidos no CLIENT via getSession (cookie local,
 * sem round-trip). Mantém o AppShell estático para a navegação ser instantânea.
 */
export function HeaderAuth() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    let alive = true;
    supabase.auth.getSession().then(({ data }) => {
      if (alive) setLoggedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (loggedIn) {
    return (
      <form action="/auth/signout" method="post">
        <button type="submit" className="topbar__cta">
          Sair
        </button>
      </form>
    );
  }

  return (
    <>
      <Link
        href="/login"
        style={{
          color: "var(--color-text-inverse)",
          fontSize: 14,
          fontWeight: 600,
          marginRight: 12,
        }}
      >
        Entrar
      </Link>
      <a href={ABACATE_CHECKOUT} target="_blank" rel="noopener noreferrer" className="topbar__cta">
        Assinar
      </a>
    </>
  );
}
