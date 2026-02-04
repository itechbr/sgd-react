import { ISolicitacao } from '@/app/type/index'
import { X, Calendar, Clock, MapPin, FileText, User } from 'lucide-react'

interface Props {
  solicitacao: ISolicitacao
  onClose: () => void
}

export function SolicitacaoDetails({ solicitacao, onClose }: Props) {
  
  // Função para renderizar badge colorido igual ao JS original
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Aprovada': return 'bg-green-900/30 text-green-400 border-green-800'
      case 'Rejeitada': return 'bg-red-900/30 text-red-400 border-red-800'
      case 'Aguardando': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
      default: return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  return (
    <div className="bg-[#1F1F1F] border border-[#333333] rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center p-5 border-b border-[#333333] bg-[#1A1A1A] rounded-t-2xl">
        <h3 className="text-xl font-semibold text-[#C0A040] flex items-center gap-2">
          <User className="w-5 h-5 opacity-70" />
          Ficha do Aluno
        </h3>
        <button 
          onClick={onClose} 
          className="text-[#AAAAAA] hover:text-white transition bg-[#333333] p-1 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      {/* Conteúdo com Scroll */}
      <div className="p-6 overflow-y-auto custom-scrollbar space-y-8">
        
        {/* Dados Acadêmicos */}
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[#AAAAAA] font-semibold mb-4 border-b border-[#333333] pb-2">
            Dados Acadêmicos
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs text-[#AAAAAA] block">Nome Completo</label>
              <p className="text-lg font-medium text-white">{solicitacao.aluno_nome}</p>
            </div>
            <div>
              <label className="text-xs text-[#AAAAAA] block">Matrícula</label>
              <p className="text-[#E0E0E0]">{solicitacao.matricula}</p>
            </div>
            <div>
              <label className="text-xs text-[#AAAAAA] block">E-mail</label>
              <p className="text-[#E0E0E0]">{solicitacao.email || '—'}</p>
            </div>
            <div>
              <label className="text-xs text-[#AAAAAA] block">Curso</label>
              <p className="text-[#E0E0E0]">{solicitacao.curso}</p>
            </div>
            <div>
              <label className="text-xs text-[#AAAAAA] block">Orientador</label>
              <p className="text-[#C0A040]">{solicitacao.orientador || 'Não definido'}</p>
            </div>
            <div>
              <label className="text-xs text-[#AAAAAA] block">Status Atual</label>
              <span className={`inline-block px-2 py-1 text-xs rounded-full border mt-1 ${getStatusBadge(solicitacao.status)}`}>
                {solicitacao.status}
              </span>
            </div>
          </div>
        </div>

        {/* Informações da Defesa/Qualificação */}
        <div>
            <h4 className="text-xs uppercase tracking-wider text-[#AAAAAA] font-semibold mb-4 border-b border-[#333333] pb-2 flex items-center justify-between">
                Informações da {solicitacao.tipo}
                <FileText className="w-4 h-4 opacity-50" />
            </h4>

            {solicitacao.detalhes_titulo ? (
                <div className="bg-[#1A1A1A] p-5 rounded-lg border border-[#333333]">
                    <div className="mb-4">
                        <h4 className="text-[#C0A040] text-sm font-semibold mb-1">Título do Trabalho</h4>
                        <p className="text-white font-medium">{solicitacao.detalhes_titulo}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#AAAAAA]" />
                            <div>
                                <h4 className="text-[#AAAAAA] text-xs">Data</h4>
                                <p className="text-sm text-white">{solicitacao.detalhes_data}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-[#AAAAAA]" />
                            <div>
                                <h4 className="text-[#AAAAAA] text-xs">Horário</h4>
                                <p className="text-sm text-white">{solicitacao.detalhes_horario}</p>
                            </div>
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-[#AAAAAA]" />
                            <div>
                                <h4 className="text-[#AAAAAA] text-xs">Local</h4>
                                <p className="text-sm text-white">{solicitacao.detalhes_local}</p>
                            </div>
                        </div>
                    </div>
                    
                    {solicitacao.detalhes_banca && solicitacao.detalhes_banca.length > 0 && (
                        <div>
                            <h4 className="text-[#C0A040] text-sm font-semibold mb-2">Banca Examinadora</h4>
                            <ul className="list-disc list-inside text-[#AAAAAA] text-sm">
                                {solicitacao.detalhes_banca.map((membro, index) => (
                                    <li key={index}>{membro}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-6 text-[#AAAAAA] bg-black/20 rounded-lg border border-dashed border-[#333333]">
                    <p>Nenhuma informação detalhada registrada.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}