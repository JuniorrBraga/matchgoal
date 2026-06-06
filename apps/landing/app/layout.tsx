import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Archivo, Space_Mono } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MatchGoal — Análise de futebol com IA",
  description:
    "Análise estatística de futebol por IA, sem achismo. Probabilidades, cenários e histórico público — você confere cada acerto e cada erro.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${archivo.variable} ${spaceMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
