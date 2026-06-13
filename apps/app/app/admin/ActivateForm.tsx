"use client";

import { useState } from "react";

export function ActivateForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setIsError(false);

    try {
      const res = await fetch("/api/admin/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      const data = await res.json();

      if (!res.ok) {
        setIsError(true);
        setMessage(data.error ?? "Erro desconhecido");
      } else if (data.duplicate) {
        setMessage("Essa transação já tinha sido processada antes (nada foi alterado).");
      } else {
        const date = new Date(data.periodEnd).toLocaleDateString("pt-BR");
        setMessage(
          `${data.renewal ? "Renovado" : "Ativado"} com sucesso até ${date}. Email de acesso enviado para ${email}.`
        );
        setEmail("");
        setName("");
      }
    } catch {
      setIsError(true);
      setMessage("Erro de rede — tenta de novo.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "1.5px solid #e5e7eb",
    fontSize: 15,
    color: "#111",
    boxSizing: "border-box",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#333" }}>
          Email do cliente
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="cliente@email.com"
          style={inputStyle}
        />
      </div>
      <div>
        <label style={{ display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#333" }}>
          Nome (opcional)
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do cliente"
          style={inputStyle}
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          background: loading ? "#fdba74" : "#f97316",
          color: "#fff",
          fontWeight: 700,
          fontSize: 15,
          border: "none",
          borderRadius: 8,
          padding: "12px",
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Ativando..." : "Ativar acesso por 30 dias"}
      </button>
      {message && (
        <p style={{ color: isError ? "#dc2626" : "#16a34a", fontSize: 14, margin: 0 }}>{message}</p>
      )}
    </form>
  );
}
