'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  LayoutDashboard,
  Calendar,
  ClipboardList,
  FileText,
  GraduationCap,
  Users,
  Briefcase,
  Settings,
  User,
  LogOut,
  X
} from 'lucide-react'

// Definição das props para controlar o menu mobile
interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  // Função de Logout migrada
  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  // Função auxiliar para classes de link ativo
  const getLinkClass = (path: string) => {
    const isActive = pathname === path
    return `flex items-center px-3 py-2 rounded transition-colors duration-200 ${
      isActive
        ? 'bg-[#C0A040] text-black font-bold'
        : 'text-[#E0E0E0] hover:bg-[#1F1F1F] hover:text-[#E6C850]'
    }`
  }

  return (
    <>
      {/* Overlay para Mobile (fundo escuro quando o menu abre) */}
      {isOpen && (
        <div 
          className="fixed inset-0 top-0 bg-black/50 z-30 md:hidden glass-effect"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed left-0 top-20 md:top-0 bottom-0 w-[260px] z-40 bg-[#000000] border-r border-[#333333] flex flex-col transition-transform duration-300 shadow-2xl md:shadow-none
          md:translate-x-0 md:static md:h-screen
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Cabeçalho da Sidebar (Logo) */}
        <div className="hidden md:flex flex-col justify-between items-center mb-6 pt-5 px-5">
          <div className="text-center w-full relative">
            {/* Botão fechar (apenas mobile, caso necessário ajuste de layout) */}
            <button onClick={onClose} className="md:hidden absolute right-0 top-0 text-[#AAAAAA]">
               <X size={20} />
            </button>
            
            {/* Logo do SGD */}
            <img
              src="/logo_sgd.webp"
              alt="Logo SGD"
              className="w-20 h-20 rounded-xl object-cover mx-auto mb-3 border-2 border-[#333333]"
            />
            <h2 className="text-[#C0A040] text-lg font-bold tracking-wider">SGD IFPB</h2>
          </div>
        </div>

        {/* Navegação */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 md:py-0">
          <ul className="space-y-1 text-sm">
            
            {/* Seção PRINCIPAL */}
            <li className="px-3 text-[#AAAAAA] uppercase tracking-widest text-[0.65rem] font-bold mt-2 md:mt-4 mb-2">
              Principal
            </li>
            <li>
              <Link href="/dashboard" className={getLinkClass('/dashboard')} onClick={onClose}>
                <LayoutDashboard className="w-5 h-5 mr-3 opacity-70" />
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/agenda" className={getLinkClass('/agenda')} onClick={onClose}>
                <Calendar className="w-5 h-5 mr-3 opacity-70" />
                Agenda
              </Link>
            </li>

            {/* Seção PROCESSOS */}
            <li className="px-3 text-[#AAAAAA] uppercase tracking-widest text-[0.65rem] font-bold mt-6 mb-2">
              Processos
            </li>
            <li>
              <Link href="/solicitacoes" className={getLinkClass('/solicitacoes')} onClick={onClose}>
                <ClipboardList className="w-5 h-5 mr-3 opacity-70" />
                Solicitações
              </Link>
            </li>
            <li>
              <Link href="/documentos" className={getLinkClass('/documentos')} onClick={onClose}>
                <FileText className="w-5 h-5 mr-3 opacity-70" />
                Documentos
              </Link>
            </li>

            {/* Seção CADASTROS */}
            <li className="px-3 text-[#AAAAAA] uppercase tracking-widest text-[0.65rem] font-bold mt-6 mb-2">
              Cadastros
            </li>
            <li>
              <Link href="/alunos" className={getLinkClass('/alunos')} onClick={onClose}>
                <GraduationCap className="w-5 h-5 mr-3 opacity-70" />
                Alunos
              </Link>
            </li>
            <li>
              <Link href="/professores" className={getLinkClass('/professores')} onClick={onClose}>
                <Users className="w-5 h-5 mr-3 opacity-70" />
                Professores
              </Link>
            </li>

            {/* Seção ADMINISTRAÇÃO */}
            <li className="px-3 text-[#AAAAAA] uppercase tracking-widest text-[0.65rem] font-bold mt-6 mb-2">
              Administração
            </li>
            <li>
              <Link href="/secretarios" className={getLinkClass('/secretarios')} onClick={onClose}>
                <Briefcase className="w-5 h-5 mr-3 opacity-70" />
                Secretaria
              </Link>
            </li>

            {/* Seção SISTEMA */}
            <li className="px-3 text-[#AAAAAA] uppercase tracking-widest text-[0.65rem] font-bold mt-6 mb-2">
              Sistema
            </li>
            <li>
              <Link href="/configuracoes" className={getLinkClass('/configuracoes')} onClick={onClose}>
                <Settings className="w-5 h-5 mr-3 opacity-70" />
                Configurações
              </Link>
            </li>
            <li>
              <Link href="/profile" className={getLinkClass('/profile')} onClick={onClose}>
                <User className="w-5 h-5 mr-3 opacity-70" />
                Meu Perfil
              </Link>
            </li>

            {/* Botão Sair */}
            <li className="mt-6 pt-4 border-t border-[#333333]">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 rounded text-red-400 hover:bg-red-900/20 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5 mr-3 opacity-70" />
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  )
}