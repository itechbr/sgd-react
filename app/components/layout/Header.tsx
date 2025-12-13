'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Menu, User as UserIcon } from 'lucide-react'

interface HeaderProps {
  onToggleSidebar: () => void
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const [userName, setUserName] = useState<string>('Usuário')
  const [userEmail, setUserEmail] = useState<string>('')
  
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        setUserEmail(user.email)
        setUserName(extractNames(user.email))
      }
    }
    getUser()
  }, []) // Executa apenas uma vez na montagem

  // Lógica de extração de nome (migrada do header.js antigo)
  const extractNames = (email: string) => {
    const namePart = email.split('@')[0]
    const firstName = namePart.split('.')[0]
    return firstName.charAt(0).toUpperCase() + firstName.slice(1)
  }

  // URL do Avatar gerado automaticamente (mesma lógica do legado)
  const avatarUrl = `https://ui-avatars.com/api/?name=${userName}&background=C0A040&color=1F1F1F&bold=true`

  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-5 bg-[#000000] border-b border-[#333333] sticky top-0 z-30 h-20">
      <div className="flex items-center gap-4">
        
        {/* Botão Hamburger (Mobile) */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-[#C0A040] w-10 h-10 flex items-center justify-center hover:bg-[#1F1F1F] rounded focus:outline-none transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        
        {/* Identificação Mobile (Logo + Boas-vindas) */}
        <div className="flex items-center gap-3 md:hidden">
          <img 
            src="/logo_sgd.webp" 
            alt="Logo Mobile" 
            className="w-8 h-8 rounded object-cover border border-[#333333]" 
          />
          <h1 className="text-lg font-semibold text-[#E0E0E0] truncate max-w-[150px]">
            Olá, {userName}!
          </h1>
        </div>

        {/* Boas-vindas Desktop */}
        <h1 className="hidden md:block text-2xl font-semibold text-[#E0E0E0]">
          Bem-vindo, {userName}!
        </h1>
      </div>
      
      {/* Área do Usuário (Direita) */}
      <div className="flex items-center text-sm gap-3">
        <div className="text-right hidden sm:block">
          <span className="block text-[#E0E0E0] font-medium">{userName}</span>
          <span className="block text-[#AAAAAA] text-xs" title={userEmail}>
            Coordenador
          </span>
        </div>
        
        {/* Avatar */}
        <div className="relative w-8 h-8 sm:w-10 sm:h-10">
            <img
              src={avatarUrl}
              alt="Avatar"
              className="rounded-full border-2 border-[#C0A040] object-cover w-full h-full"
            />
        </div>
      </div>
    </header>
  )
}