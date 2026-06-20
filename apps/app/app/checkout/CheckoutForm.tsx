"use client";

import { useState } from "react";

type Step = "form" | "pix" | "error";

interface PixData {
  brCode: string;
  qrCodeImage: string;
  expiresAt: string;
}

export function CheckoutForm() {
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pix, setPix] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [taxId, setTaxId] = useState("");
  const [cellphone, setCellphone] = useState("");

  function maskCPF(v: string) {
    return v.replace(/\D/g, "").slice(0, 11)
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function maskPhone(v: string) {
    return v.replace(/\D/g, "").slice(0, 11)
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, taxId, cellphone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erro ao gerar PIX. Tente novamente.");
        return;
      }
      setPix(data);
      setStep("pix");
    } catch {
      setError("Erro de rede. Verifique sua conexão e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  async function copiarPIX() {
    if (!pix) return;
    await navigator.clipboard.writeText(pix.brCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid var(--color-border, #e5e7eb)",
    fontSize: 15,
    boxSizing: "border-box",
    background: "var(--color-bg-input, #fff)",
    color: "var(--color-text, #111)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 4,
    color: "var(--color-text-muted, #555)",
  };

  if (step === "pix" && pix) {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32 }}>📱</div>
          <h2 style={{ margin: "8px 0 4px", fontSize: 20, fontWeight: 700 }}>Pague com PIX</h2>
          <p className="muted" style={{ fontSize: 14, margin: 0 }}>
            Escaneie o QR code no seu banco ou copie o código abaixo
          </p>
        </div>

        {pix.qrCodeImage && (
          <img
            src={pix.qrCodeImage}
            alt="QR Code PIX"
            style={{ width: 200, height: 200, borderRadius: 8, border: "1px solid #eee" }}
          />
        )}

        <div style={{ width: "100%", maxWidth: 400 }}>
          <button
            onClick={copiarPIX}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: copied ? "#16a34a" : "var(--color-primary, #f97316)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            {copied ? "✓ Código copiado!" : "Copiar código PIX"}
          </button>
        </div>

        <div
          style={{
            background: "var(--color-bg-subtle, #f9f9f9)",
            borderRadius: 8,
            padding: "16px",
            width: "100%",
            maxWidth: 400,
            fontSize: 13,
            color: "var(--color-text-muted, #666)",
            lineHeight: 1.6,
          }}
        >
          <p style={{ margin: "0 0 8px", fontWeight: 600 }}>Após pagar:</p>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            <li>Você vai receber um email com o link de acesso</li>
            <li>Verifique também a caixa de spam</li>
            <li>O acesso é liberado em instantes após o pagamento</li>
          </ul>
        </div>

        <p style={{ fontSize: 12, color: "var(--color-text-muted, #999)", textAlign: "center" }}>
          Valor: R$ 29,90 · PIX gerado para {email}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={labelStyle}>Nome completo</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Seu nome"
          style={inputStyle}
          autoComplete="name"
        />
      </div>

      <div>
        <label style={labelStyle}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          style={inputStyle}
          autoComplete="email"
        />
      </div>

      <div>
        <label style={labelStyle}>CPF</label>
        <input
          type="text"
          required
          value={taxId}
          onChange={(e) => setTaxId(maskCPF(e.target.value))}
          placeholder="000.000.000-00"
          style={inputStyle}
          inputMode="numeric"
          autoComplete="off"
        />
      </div>

      <div>
        <label style={labelStyle}>Celular</label>
        <input
          type="tel"
          required
          value={cellphone}
          onChange={(e) => setCellphone(maskPhone(e.target.value))}
          placeholder="(11) 99999-9999"
          style={inputStyle}
          autoComplete="tel"
        />
      </div>

      {error && (
        <p style={{ color: "#dc2626", fontSize: 14, margin: 0 }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "13px",
          borderRadius: 8,
          border: "none",
          background: loading ? "#fdba74" : "var(--color-primary, #f97316)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 16,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Gerando PIX..." : "Gerar PIX — R$ 29,90"}
      </button>

      <p style={{ fontSize: 12, color: "var(--color-text-muted, #999)", textAlign: "center", margin: 0 }}>
        Pagamento processado pela AbacatePay · PIX instantâneo · Acesso imediato após pagamento
      </p>
    </form>
  );
}
