import type { Metadata } from "next";
import { CheckoutForm } from "./CheckoutForm";

export const metadata: Metadata = {
  title: "Assinar MatchGoal — Copa 2026",
  description: "Acesso ilimitado às análises da Copa 2026 por R$ 29,90/mês.",
};

export default function CheckoutPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", background: "var(--color-bg, #f9f9f9)" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 6px" }}>
            MatchGoal · Copa 2026
          </h1>
          <p className="muted" style={{ fontSize: 14, margin: 0 }}>
            Acesso ilimitado · R$ 29,90/mês · Cancele quando quiser
          </p>
        </div>

        <div className="card" style={{ padding: "28px 24px" }}>
          <CheckoutForm />
        </div>
      </div>
    </main>
  );
}
