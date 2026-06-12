import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ActivateForm } from "./ActivateForm";

/**
 * Painel mínimo para ativar/renovar assinatura manualmente quando o webhook
 * automático da Abacate não recebe o email do cliente (ex.: conta em
 * Sandbox). Acesso restrito a ADMIN_EMAIL — qualquer outro usuário vê 404.
 */
export default async function AdminPage() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!adminEmail || !user || user.email?.toLowerCase() !== adminEmail) {
    notFound();
  }

  return (
    <main style={{ maxWidth: 480, margin: "60px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8, color: "#111" }}>
        Ativar assinatura manualmente
      </h1>
      <p style={{ color: "#666", fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
        Use quando um pagamento real não cair automaticamente (webhook sem email do
        cliente). Libera 30 dias de acesso a partir de hoje (ou estende, se já tiver
        assinatura ativa) e manda o email de acesso.
      </p>
      <ActivateForm />
    </main>
  );
}
