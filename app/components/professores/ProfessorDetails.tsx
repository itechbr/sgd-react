'use client'

import { IProfessor } from '@/app/type/index'
import { X, ExternalLink, User } from 'lucide-react'

interface ProfessorDetailsProps {
  professor: IProfessor
  onClose: () => void
}

export function ProfessorDetails({ professor, onClose }: ProfessorDetailsProps) {
  
  // Função auxiliar para estilo da categoria (igual à listagem)
  const getCategoriaStyle = (tipo: string) => {
    switch(tipo) {
      case 'Permanente': return 'bg-[#C0A040]/20 text-[#C0A040] border-[#C0A040]/50'
      case 'Colaborador': return 'bg-blue-900/30 text-blue-400 border-blue-800'
      case 'Visitante': return 'bg-purple-900/30 text-purple-400 border-purple-800'
      default: return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  // Separa as áreas de pesquisa (string) em um array para criar as tags
  const areasList = professor.areas ? professor.areas.split(',').map(a => a.trim()) : []

  return (
    <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] w-full max-w-2xl mx-auto shadow-2xl relative flex flex-col max-h-[90vh]">
      
      {/* --- Cabeçalho --- */}
      <div className="flex justify-between items-center p-6 border-b border-[#333333] bg-[#1A1A1A] rounded-t-lg">
        <h3 className="text-xl font-semibold text-[#C0A040] flex items-center gap-2">
          <User className="opacity-70" />
          Ficha do Professor
        </h3>
        <button onClick={onClose} className="text-[#AAAAAA] hover:text-white transition p-1 bg-[#333333] rounded-full">
          <X size={20} />
        </button>
      </div>

      {/* --- Conteúdo com Scroll --- */}
      <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-[#121212] space-y-8">
        
        {/* Bloco Principal (Avatar + Nome) */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 bg-[#333333] rounded-full flex items-center justify-center border-2 border-[#C0A040] shrink-0">
            <User size={48} className="text-[#AAAAAA]" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-white mb-1">{professor.nome}</h2>
            <p className="text-[#C0A040] font-medium mb-4">{professor.titulacao}</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-left">
              <div>
                <span className="text-[#AAAAAA] block text-xs uppercase tracking-wider mb-1">E-mail</span>
                <span className="text-[#E0E0E0] break-all">{professor.email}</span>
              </div>
              <div>
                <span className="text-[#AAAAAA] block text-xs uppercase tracking-wider mb-1">Instituição</span>
                <span className="text-[#E0E0E0]">{professor.instituicao}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco de Status e Categoria */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-black/20 rounded-lg border border-[#333333]">
          <div>
            <span className="text-[#AAAAAA] block text-xs uppercase tracking-wider mb-2">Categoria</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoriaStyle(professor.tipo)}`}>
              {professor.tipo}
            </span>
          </div>
          <div>
            <span className="text-[#AAAAAA] block text-xs uppercase tracking-wider mb-2">Status no Sistema</span>
            {professor.ativo ? (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-900/30 text-green-400 border border-green-800">
                Ativo
              </span>
            ) : (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-900/30 text-red-400 border border-red-800">
                Inativo
              </span>
            )}
          </div>
          <div className="flex flex-col justify-center">
            {professor.lattes ? (
              <a 
                href={professor.lattes} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#C0A040] hover:underline flex items-center gap-2 text-sm font-medium"
              >
                <ExternalLink size={16} />
                Currículo Lattes
              </a>
            ) : (
              <span className="text-[#666] text-sm italic flex items-center gap-2">
                <ExternalLink size={16} />
                Sem Lattes
              </span>
            )}
          </div>
        </div>

        {/* Áreas de Pesquisa */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#AAAAAA] font-semibold mb-3 border-b border-[#333333] pb-2">
            Áreas de Pesquisa & Atuação
          </h4>
          <div className="flex flex-wrap gap-2">
            {areasList.length > 0 ? (
              areasList.map((area, index) => (
                <span key={index} className="px-3 py-1 bg-[#333333] text-[#E0E0E0] text-sm rounded-full border border-[#444444]">
                  {area}
                </span>
              ))
            ) : (
              <span className="text-[#666] italic text-sm">Nenhuma área registrada.</span>
            )}
          </div>
        </div>

      </div>

      {/* --- Rodapé --- */}
      <div className="p-4 border-t border-[#333333] bg-[#1A1A1A] flex justify-end rounded-b-lg">
        <button 
          onClick={onClose} 
          className="bg-[#C0A040] text-black px-6 py-2 rounded font-bold hover:bg-[#E6C850] transition"
        >
          Fechar Ficha
        </button>
      </div>

    </div>
  )
}