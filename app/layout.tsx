import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

// Configuração da fonte Poppins (Substituindo o link do Google Fonts do legado)
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"], // Pesos usados no CSS legado
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "SGD - Sistema de Gerenciamento de Defesas",
  description: "Sistema de gerenciamento de defesas de TCC e Qualificação do IFPB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${poppins.variable} font-poppins bg-[#121212] text-[#E0E0E0] antialiased`}>
        {children}
      </body>
    </html>
  );
}