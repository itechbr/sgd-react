'use client'

import { IAlunoCompleto } from '@/app/services/alunoService'
import { X, Calendar, Clock, MapPin, Users, BookOpen, User } from 'lucide-react'

interface DefesaDetailsProps {
  aluno: IAlunoCompleto
  onClose: () => void
}

export function DefesaDetails({ aluno, onClose }: DefesaDetailsProps) {
  const defesa = aluno.defesas

  return (
    <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] w-full max-w-2xl mx-auto shadow-2xl relative flex flex-col max-h-[90vh]">
      {/* Header */}
      <div className="flex justify-between items-start p-6 border-b border-[#333333] bg-[#121212] rounded-t-lg">
        <div>
          <h2 className="text-xl font-bold text-[#C0A040]">{aluno.nome}</h2>
          <p className="text-sm text-[#AAAAAA] font-mono mt-1">
            Matrícula: {aluno.matricula} • <span className="text-[#E0E0E0]">{aluno.curso}</span>
          </p>
        </div>
        <button onClick={onClose} className="text-[#AAAAAA] hover:text-white transition">
          <X size={24} />
        </button>
      </div>

      {/* Conteúdo com Scroll */}
      <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
        
        {/* Dados do Orientador */}
        <div className="flex items-center gap-3 p-4 bg-[#121212] rounded border border-[#333333]">
          <div className="bg-[#C0A040]/20 p-2 rounded-full text-[#C0A040]">
            <User size={20} />
          </div>
          <div>
            <p className="text-xs text-[#AAAAAA] uppercase tracking-wider font-bold">Orientador</p>
            <p className="text-[#E0E0E0] font-medium">{aluno.professores?.nome || 'Não informado'}</p>
          </div>
        </div>

        {defesa ? (
          <>
            {/* Título e Resumo */}
            <div className="space-y-3">
              <div>
                <p className="text-xs text-[#AAAAAA] uppercase mb-1">Título do Trabalho</p>
                <h3 className="text-lg font-semibold text-[#E0E0E0] leading-tight">{defesa.titulo}</h3>
              </div>
              
              <div>
                <p className="text-xs text-[#AAAAAA] uppercase mb-1">Resumo</p>
                {defesa.resumo ? (
                  <div className="text-[#AAAAAA] text-sm leading-relaxed bg-[#121212] p-4 rounded border border-[#333333] text-justify">
                    {defesa.resumo}
                  </div>
                ) : (
                  <p className="text-[#666] italic text-sm">Nenhum resumo cadastrado.</p>
                )}
              </div>
            </div>

            {/* Grid de Detalhes Logísticos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-3 bg-[#121212] p-3 rounded border border-[#333333]">
                <Calendar className="text-[#C0A040]" size={18} />
                <div>
                  <p className="text-xs text-[#666]">Data</p>
                  <p className="text-[#E0E0E0] font-medium">
                    {defesa.data ? new Date(defesa.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : 'A definir'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#121212] p-3 rounded border border-[#333333]">
                <Clock className="text-[#C0A040]" size={18} />
                <div>
                  <p className="text-xs text-[#666]">Horário</p>
                  <p className="text-[#E0E0E0] font-medium">{defesa.horario?.slice(0, 5) || 'A definir'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#121212] p-3 rounded border border-[#333333] md:col-span-2">
                <MapPin className="text-[#C0A040]" size={18} />
                <div>
                  <p className="text-xs text-[#666]">Local</p>
                  <p className="text-[#E0E0E0] font-medium">{defesa.local}</p>
                </div>
              </div>
            </div>

            {/* Banca Examinadora */}
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3 border-b border-[#333333] pb-2">
                <Users className="text-[#C0A040]" size={18} />
                <h4 className="font-semibold text-[#E0E0E0]">Banca Examinadora</h4>
              </div>
              {defesa.banca && defesa.banca.length > 0 ? (
                <ul className="space-y-2">
                  {defesa.banca.map((membro, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-[#E0E0E0]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C0A040]" />
                      {membro}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#666] italic text-sm">Banca não definida.</p>
              )}
            </div>
            
            {/* Status da Defesa */}
            <div className="flex justify-end pt-4">
                 <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase border ${
                      defesa.status === 'Realizada' ? 'text-green-400 border-green-400/30 bg-green-400/10' :
                      defesa.status === 'Cancelada' ? 'text-red-400 border-red-400/30 bg-red-400/10' :
                      'text-[#C0A040] border-[#C0A040]/30 bg-[#C0A040]/10'
                    }`}>
                      Status: {defesa.status}
                 </span>
            </div>
          </>
        ) : (
          <div className="text-center py-12 opacity-50 flex flex-col items-center">
            <BookOpen size={48} className="mb-4 text-[#333]" />
            <p className="text-[#AAAAAA]">Este aluno ainda não possui defesa cadastrada.</p>
            <p className="text-xs text-[#666] mt-2">Edite o aluno para adicionar os dados da defesa.</p>
          </div>
        )}
      </div>
    </div>
  )
}