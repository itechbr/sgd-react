'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  // Estado para controlar a visibilidade da Sidebar no Mobile
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-[#121212] overflow-hidden">
      {/* Sidebar: Recebe o estado e a função para fechar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Área de Conteúdo Principal (à direita da Sidebar) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300">
        
        {/* Header: Recebe a função para abrir a Sidebar (botão hamburger) */}
        <Header onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Conteúdo Dinâmico (children) injetado pelo Next.js */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 relative scroll-smooth">
           {children}
        </main>
      </div>
    </div>
  )
}