import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "./providers"; // Importando o novo Provider
import "./globals.css";

// Configuração da fonte Poppins
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
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
        {/* Envolvendo a aplicação com o Provider Global */}
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}