'use client'

import { useEffect, useState } from 'react'
import { SolicitacaoService } from '@/app/services/solicitacaoService'
import { ISolicitacao } from '@/app/type/index'
import { SolicitacaoDetails } from '@/app/components/solicitacoes/SolicitacaoDetails'
import { Pagination } from '@/app/components/ui/Pagination'
import { DataTable, Column } from '@/app/components/ui/DataTable'
import { Search, Eye } from 'lucide-react'

export default function SolicitacoesPage() {
  const [solicitacoes, setSolicitacoes] = useState<ISolicitacao[]>([])
  const [loading, setLoading] = useState(true)

  // Filtros
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroData, setFiltroData] = useState('')

  // Paginação
  const ITEMS_PER_PAGE = 8
  const [currentPage, setCurrentPage] = useState(1)

  // Modais
  const [viewSolicitacao, setViewSolicitacao] = useState<ISolicitacao | null>(null)

  useEffect(() => {
    carregarSolicitacoes()
  }, [])

  // Reseta para página 1 ao mexer nos filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [busca, filtroStatus, filtroData])

  async function carregarSolicitacoes() {
    try {
      const dados = await SolicitacaoService.getAll()
      setSolicitacoes(dados)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar lista de solicitações')
    } finally {
      setLoading(false)
    }
  }

  // --- Auxiliares de Estilo ---
  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Aprovada': return 'bg-green-900/30 text-green-400 border-green-800'
      case 'Rejeitada': return 'bg-red-900/30 text-red-400 border-red-800'
      case 'Aguardando': return 'bg-yellow-900/30 text-yellow-400 border-yellow-800'
      default: return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  // --- Definição das Colunas da Tabela ---
  const columns: Column<ISolicitacao>[] = [
    {
      header: 'Aluno / Matrícula',
      accessor: (item) => (
        <div>
          <div className="font-medium text-white hover:text-[#C0A040] transition cursor-pointer" onClick={() => setViewSolicitacao(item)}>
            {item.aluno_nome}
          </div>
          <div className="text-[#AAAAAA] text-xs mt-1">
            {item.matricula}
          </div>
        </div>
      )
    },
    { 
        header: 'Tipo', 
        accessor: 'tipo' 
    },
    { 
      header: 'Data Solicitação', 
      accessor: (item) => new Date(item.data_solicitacao).toLocaleDateString('pt-BR', {timeZone: 'UTC'}) 
    },
    {
      header: 'Status',
      className: 'text-center',
      accessor: (item) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(item.status)}`}>
            {item.status}
        </span>
      )
    },
    {
      header: 'Ações',
      className: 'text-center',
      accessor: (item) => (
        <div className="flex justify-center gap-2">
            <button 
                onClick={() => setViewSolicitacao(item)}
                className="text-[#AAAAAA] hover:text-[#C0A040] transition flex items-center gap-1 text-sm font-medium border border-transparent hover:border-[#333333] px-2 py-1 rounded"
            >
                <Eye size={16} /> Detalhes
            </button>
        </div>
      )
    }
  ]

  // --- Lógica de Filtros ---
  const dadosFiltrados = solicitacoes.filter(s => {
    const matchBusca = 
      s.aluno_nome.toLowerCase().includes(busca.toLowerCase()) ||
      s.matricula.includes(busca)
    
    const matchStatus = filtroStatus === '' || s.status.toLowerCase() === filtroStatus.toLowerCase()
    
    const matchData = filtroData === '' || s.data_solicitacao.startsWith(filtroData)

    return matchBusca && matchStatus && matchData
  })

  // --- Cálculos de Paginação ---
  const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = dadosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-6 relative">
      
      {/* Modal Detalhes Conectado */}
      {viewSolicitacao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-auto">
            <SolicitacaoDetails 
              solicitacao={viewSolicitacao}
              onClose={() => setViewSolicitacao(null)}
              onUpdate={carregarSolicitacoes} // <--- AQUI ESTÁ A MÁGICA
            />
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col justify-center text-center sm:text-left mb-6">
        <h2 className="text-2xl font-bold text-[#C0A040]">Solicitações Pendentes</h2>
        <p className="text-[#AAAAAA] text-sm mt-1">Gerencie as solicitações de defesa e qualificação.</p>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#1F1F1F] p-5 rounded-xl border border-[#333333] shadow-lg">
        <h3 className="text-[#C0A040] font-semibold mb-4 text-sm uppercase tracking-wide">Filtrar Solicitações</h3>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Input Texto */}
            <div className="md:col-span-5 w-full">
            <label className="block text-sm text-[#AAAAAA] mb-1">Buscar por Aluno ou Matrícula</label>
            <div className="relative">
                <input 
                type="text" 
                placeholder="Nome ou matrícula..." 
                className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] pl-10 px-3 py-2 rounded-lg focus:outline-none focus:border-[#C0A040] transition-colors"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                />
                <Search className="h-5 w-5 absolute left-3 top-2.5 text-[#AAAAAA]" />
            </div>
            </div>
            
            {/* Select Status */}
            <div className="md:col-span-3 w-full">
                <label className="block text-sm text-[#AAAAAA] mb-1">Status</label>
                <select 
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] px-3 py-2 rounded-lg focus:outline-none focus:border-[#C0A040] transition-colors"
                >
                    <option value="">Todos</option>
                    <option value="Aguardando">Aguardando</option>
                    <option value="Aprovada">Aprovada</option>
                    <option value="Rejeitada">Rejeitada</option>
                </select>
            </div>

            {/* Input Data */}
            <div className="md:col-span-4 w-full">
                <label className="block text-sm text-[#AAAAAA] mb-1">Data da Solicitação</label>
                <input 
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] px-3 py-2 rounded-lg focus:outline-none focus:border-[#C0A040] transition-colors scheme-dark"
                />
            </div>
        </div>
      </div>

      {/* Tabela Componentizada */}
      <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] flex flex-col shadow-lg overflow-hidden">
        <DataTable 
            columns={columns}
            data={paginatedData}
            isLoading={loading}
        />

        {/* Paginação */}
        {!loading && dadosFiltrados.length > 0 && (
            <div className="p-4 border-t border-[#333333]">
                <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    totalItems={dadosFiltrados.length}
                    onPageChange={setCurrentPage} 
                />
            </div>
        )}
      </div>
    </div>
  )
}