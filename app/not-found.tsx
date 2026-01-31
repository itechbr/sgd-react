'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Home } from 'lucide-react'
import NotFoundAnimation from './components/ui/NotFoundAnimation'

export default function NotFound() {
  return (
    // Fundo Geral do Sistema (Preto Absoluto)
    <div className="min-h-screen w-full bg-black flex items-center justify-center p-4 md:p-8 font-sans selection:bg-[#C0A040] selection:text-black">
      
      {/* Container Principal (Card) */}
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-[#121212] rounded-[2rem] overflow-hidden shadow-2xl shadow-[#C0A040]/5 border border-[#333333] relative">
        
        {/* --- LADO ESQUERDO: Animação (Visual Claro) --- */}
        <div className="w-full lg:w-1/2 bg-gray-50 flex flex-col items-center justify-center p-12 relative overflow-hidden group">
          
          {/* Elementos Decorativos de Fundo (Blobs suaves) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-60 translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C0A040] rounded-full blur-3xl opacity-20 -translate-x-1/2 translate-y-1/2"></div>
          
          {/* Grid sutil no fundo branco para dar textura técnica */}
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]"></div>

          {/* A Animação */}
          <div className="relative z-10 w-full max-w-md transform transition-transform duration-700 hover:scale-105">
            <NotFoundAnimation />
          </div>

          <p className="mt-8 text-sm font-medium text-gray-400 uppercase tracking-widest text-center">
            System Error &bull; 404
          </p>
        </div>

        {/* --- LADO DIREITO: Conteúdo (Identidade SGD) --- */}
        <div className="w-full lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative bg-[#121212]">
           
           {/* Efeito de luz ambiente dourada no topo */}
           <div className="absolute top-0 right-0 w-full h-px bg-gradient-to-l from-[#C0A040]/50 to-transparent"></div>
           
           {/* LOGO com efeito de brilho traseiro */}
           <div className="relative mb-10 self-center lg:self-start group">
              <div className="absolute inset-0 bg-[#C0A040] blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rounded-full"></div>
              <Image 
                src="/logo_sgd.webp" 
                alt="Logo SGD" 
                width={100} 
                height={100}
                className="relative z-10 w-24 h-24 object-contain drop-shadow-xl"
              />
           </div>

           {/* Badge de Status */}
           <div className="inline-flex items-center gap-2 self-center lg:self-start px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider mb-6">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
             Página não localizada
           </div>
           
           <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight text-center lg:text-left">
             Ops! Caminho <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C0A040] via-yellow-200 to-[#C0A040]">
               inválido.
             </span>
           </h1>

           <p className="text-gray-400 text-lg mb-10 leading-relaxed text-center lg:text-left max-w-lg">
             A URL que você tentou acessar não existe no mapeamento do sistema. 
             Verifique o endereço ou retorne à base segura.
           </p>

           {/* Botões de Ação */}
           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
             
             {/* Botão Principal (Dourado) */}
             <Link 
               href="/dashboard"
               className="flex items-center justify-center gap-3 px-8 py-4 bg-[#C0A040] hover:bg-[#d4b046] text-black font-bold rounded-xl shadow-lg shadow-[#C0A040]/20 transition-all transform hover:-translate-y-1 active:scale-95"
             >
               <Home size={20} strokeWidth={2.5} />
               Voltar ao Início
             </Link>

             {/* Botão Secundário (Outline) */}
             <button 
               onClick={() => window.history.back()}
               className="flex items-center justify-center gap-3 px-8 py-4 border border-[#333333] bg-[#1a1a1a] hover:bg-[#252525] text-gray-300 font-semibold rounded-xl transition-all hover:border-gray-600"
             >
               <ArrowLeft size={20} />
               Voltar
             </button>
           </div>
        </div>

      </div>
      
      {/* Footer Tecnológico */}
      <div className="fixed bottom-4 md:bottom-8 text-[#444] text-xs font-mono tracking-wider flex items-center gap-2">
        <span>SGD SYSTEM v2.0</span>
        <span className="w-1 h-1 bg-[#C0A040] rounded-full"></span>
        <span>SECURE CONNECTION</span>
      </div>

    </div>
  )
}