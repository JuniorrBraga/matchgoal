import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Anton, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

// Display condensado, cara de pôster de torneio — títulos, números, placares.
const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Corpo limpo e moderno.
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MatchGoal — Análise da Copa 2026 com IA",
  description:
    "Leitura estatística das partidas da Copa do Mundo 2026 com IA. Probabilidades, cenários e bilhetes — análise de dados, não promessa de resultado.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${hanken.variable}`}>
      <body>{children}</body>
    </html>
  );
}
