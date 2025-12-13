'use client'

import { ISecretario } from '@/app/services/secretarioService'
import { X, User, Mail, Building, BadgeCheck } from 'lucide-react'

interface SecretarioDetailsProps {
  secretario: ISecretario
  onClose: () => void
}

export function SecretarioDetails({ secretario, onClose }: SecretarioDetailsProps) {
  
  // Helpers visuais iguais aos do original
  const isCoord = secretario.role === 'Coordenador'
  const roleBadgeClass = isCoord 
    ? 'bg-[#C0A040]/20 text-[#C0A040] border border-[#C0A040]/50'
    : 'bg-blue-900/30 text-blue-400 border border-blue-800'

  return (
    <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] w-full max-w-lg mx-auto shadow-2xl relative flex flex-col">
      <div className="flex justify-between items-center p-5 border-b border-[#333333] bg-[#1A1A1A] rounded-t-lg">
        <h3 className="text-xl font-semibold text-[#C0A040] flex items-center gap-2">
          <BadgeCheck className="opacity-70" />
          Ficha do Usuário
        </h3>
        <button onClick={onClose} className="text-[#AAAAAA] hover:text-white transition p-1 bg-[#333333] rounded-full">
          <X size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 bg-[#121212]">
        {/* Cabeçalho do Card */}
        <div className="flex items-center gap-4 pb-6 border-b border-[#333333]">
          <div className="w-16 h-16 bg-[#C0A040]/10 rounded-full flex items-center justify-center border border-[#C0A040]/30 text-[#C0A040] shrink-0">
            <User size={32} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">{secretario.nome}</h4>
            <p className="text-[#AAAAAA] text-sm break-all">{secretario.email}</p>
          </div>
        </div>

        {/* Grid de Informações */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="text-xs text-[#AAAAAA] block uppercase tracking-wider mb-1">SIAPE</span>
            <p className="text-white font-medium">{secretario.siape}</p>
          </div>
          <div>
            <span className="text-xs text-[#AAAAAA] block uppercase tracking-wider mb-1">Campus</span>
            <p className="text-white font-medium">{secretario.campus}</p>
          </div>
          <div>
            <span className="text-xs text-[#AAAAAA] block uppercase tracking-wider mb-1">Nível de Acesso</span>
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${roleBadgeClass}`}>
              {secretario.role}
            </span>
          </div>
          <div>
            <span className="text-xs text-[#AAAAAA] block uppercase tracking-wider mb-1">Status</span>
            {secretario.ativo ? (
              <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span> Ativo
              </span>
            ) : (
              <span className="text-red-400 text-sm font-medium flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Inativo
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#333333] bg-[#1A1A1A] flex justify-end rounded-b-lg">
        <button onClick={onClose} className="bg-[#C0A040] text-black px-6 py-2 rounded font-bold hover:bg-[#E6C850] transition">
          Fechar
        </button>
      </div>
    </div>
  )
}