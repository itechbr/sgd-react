// app/components/agendamentos/AgendamentoDetails.tsx
'use client'

import { IAgendamento } from '@/app/type/index'
import { X, Calendar, Clock, User, BookOpen } from 'lucide-react'

interface AgendamentoDetailsProps {
  agendamento: IAgendamento
  onClose: () => void
}

const AgendamentoDetails: React.FC<AgendamentoDetailsProps> = ({
  agendamento,
  onClose,
}) => {
  // Função para formatar a data para o padrão brasileiro
  const formatarData = (data: string) => {
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  return (
    <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] w-full max-w-lg mx-auto shadow-2xl relative flex flex-col max-h-[90vh]">
      {/* --- Cabeçalho --- */}
      <div className="flex justify-between items-center p-6 border-b border-[#333333] bg-[#1A1A1A] rounded-t-lg">
        <h3 className="text-xl font-semibold text-[#C0A040] flex items-center gap-2">
          <Calendar className="opacity-70" />
          Detalhes do Agendamento
        </h3>
        <button
          onClick={onClose}
          className="text-[#AAAAAA] hover:text-white transition p-1 bg-[#333333] rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* --- Conteúdo --- */}
      <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar flex-1">
        {/* Aluno */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center border border-[#C0A040] shrink-0">
            <User size={20} className="text-[#C0A040]" />
          </div>
          <div>
            <span className="text-[#AAAAAA] block text-xs uppercase tracking-wider mb-1">
              Aluno(a)
            </span>
            <p className="text-lg font-bold text-white">
              {agendamento.aluno}
            </p>
          </div>
        </div>

        {/* Título */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center border border-[#555] shrink-0">
            <BookOpen size={20} className="text-[#AAAAAA]" />
          </div>
          <div>
            <span className="text-[#AAAAAA] block text-xs uppercase tracking-wider mb-1">
              Título da Defesa
            </span>
            <p className="text-base text-[#E0E0E0]">{agendamento.titulo}</p>
          </div>
        </div>

        {/* Data e Hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-[#333333]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-[#AAAAAA]" />
            </div>
            <div>
              <span className="text-[#AAAAAA] block text-xs uppercase tracking-wider mb-1">
                Data
              </span>
              <p className="text-base font-semibold text-white">
                {formatarData(agendamento.data)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-[#333333] rounded-full flex items-center justify-center shrink-0">
              <Clock size={20} className="text-[#AAAAAA]" />
            </div>
            <div>
              <span className="text-[#AAAAAA] block text-xs uppercase tracking-wider mb-1">
                Horário
              </span>
              <p className="text-base font-semibold text-white">
                {agendamento.hora}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Rodapé --- */}
      <div className="p-4 border-t border-[#333333] bg-[#1A1A1A] flex justify-end rounded-b-lg">
        <button
          onClick={onClose}
          className="bg-[#C0A040] text-black px-6 py-2 rounded font-bold hover:bg-[#E6C850] transition"
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

export default AgendamentoDetails
