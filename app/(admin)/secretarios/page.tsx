'use client'

import { useEffect, useState } from 'react'
import { SecretarioService, ISecretario } from '@/app/services/secretarioService'
import { SecretarioForm } from '@/app/components/secretarios/SecretarioForm'
import { SecretarioDetails } from '@/app/components/secretarios/SecretarioDetails'
import { Pagination } from '@/app/components/ui/Pagination'
import { DataTable, Column } from '@/app/components/ui/DataTable'
import { Plus, Search, Edit, Trash2, KeyRound } from 'lucide-react'

export default function SecretariosPage() {
  const [secretarios, setSecretarios] = useState<ISecretario[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [busca, setBusca] = useState('')
  const [filtroRole, setFiltroRole] = useState('')

  // Paginação
  const ITEMS_PER_PAGE = 8
  const [currentPage, setCurrentPage] = useState(1)

  // Modais
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSecretario, setEditingSecretario] = useState<ISecretario | null>(null)
  const [viewSecretario, setViewSecretario] = useState<ISecretario | null>(null)

  useEffect(() => {
    carregarSecretarios()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [busca, filtroRole])

  async function carregarSecretarios() {
    try {
      const dados = await SecretarioService.getAll()
      setSecretarios(dados)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar equipe.')
    } finally {
      setLoading(false)
    }
  }

  // --- Handlers ---
  function handleNew() {
    setEditingSecretario(null)
    setIsFormOpen(true)
  }

  function handleEdit(sec: ISecretario) {
    setEditingSecretario(sec)
    setIsFormOpen(true)
  }

  function handleSuccess() {
    setIsFormOpen(false)
    carregarSecretarios()
  }

  async function handleToggleStatus(id: number, statusAtual: boolean, nome: string) {
    const acao = statusAtual ? "revogar" : "reativar"
    if (confirm(`Deseja ${acao} o acesso de "${nome}"?`)) {
      try {
        await SecretarioService.toggleStatus(id, statusAtual)
        setSecretarios(prev => prev.map(s => s.id === id ? { ...s, ativo: !statusAtual } : s))
      } catch (error) {
        alert('Erro ao alterar status.')
      }
    }
  }

  function handleResetPassword(nome: string) {
    alert(`Link de redefinição de senha enviado para o e-mail de ${nome}.`)
  }

  // --- Definição das Colunas ---
  const columns: Column<ISecretario>[] = [
    {
      header: 'Nome',
      accessor: (sec) => (
        <div>
          <button onClick={() => setViewSecretario(sec)} className="font-medium text-white hover:text-[#C0A040] hover:underline text-left">
            {sec.nome}
          </button>
          <div className="text-[#AAAAAA] text-xs truncate max-w-[200px]" title={sec.email}>
            {sec.email}
          </div>
        </div>
      )
    },
    { header: 'SIAPE', accessor: 'siape' },
    { header: 'Campus', accessor: 'campus' },
    {
      header: 'Nível',
      accessor: (sec) => (
        <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
            sec.role === 'Coordenador' 
            ? 'bg-[#C0A040]/20 text-[#C0A040] border-[#C0A040]/50' 
            : 'bg-blue-900/30 text-blue-400 border-blue-800'
        }`}>
            {sec.role}
        </span>
      )
    },
    {
      header: 'Status',
      accessor: (sec) => sec.ativo ? (
        <div className="flex items-center gap-2" title="Ativo">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs text-green-400">Ativo</span>
        </div>
      ) : (
        <div className="flex items-center gap-2" title="Inativo">
            <span className="h-3 w-3 rounded-full bg-red-900 border border-red-700 inline-block"></span>
            <span className="text-xs text-red-500">Inativo</span>
        </div>
      )
    },
    {
      header: 'Ações',
      className: 'text-right',
      accessor: (sec) => (
        <div className="flex items-center justify-end space-x-2">
          <button 
              onClick={() => handleResetPassword(sec.nome)} 
              className="text-[#AAAAAA] hover:text-blue-400 p-1" 
              title="Resetar Senha"
          >
            <KeyRound className="w-5 h-5" />
          </button>
          <button 
              onClick={() => handleEdit(sec)} 
              className="text-[#AAAAAA] hover:text-[#C0A040] p-1" 
              title="Editar"
          >
            <Edit className="w-5 h-5" />
          </button>
          <button 
              onClick={() => handleToggleStatus(sec.id, sec.ativo, sec.nome)} 
              className={`p-1 transition ${sec.ativo ? 'text-[#AAAAAA] hover:text-red-500' : 'text-red-500 hover:text-green-400'}`} 
              title={sec.ativo ? "Revogar Acesso" : "Reativar Acesso"}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ]

  // --- Filtros e Paginação ---
  const dadosFiltrados = secretarios.filter(s => {
    const matchBusca = 
      s.nome.toLowerCase().includes(busca.toLowerCase()) ||
      s.siape.includes(busca) ||
      s.email.toLowerCase().includes(busca.toLowerCase())
    
    const matchRole = filtroRole === '' || s.role === filtroRole

    return matchBusca && matchRole
  })

  const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = dadosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-6 relative">
      
      {/* Modais */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <SecretarioForm 
              secretarioToEdit={editingSecretario}
              onSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {viewSecretario && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <SecretarioDetails 
              secretario={viewSecretario}
              onClose={() => setViewSecretario(null)}
            />
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-xl font-semibold text-[#C0A040]">Equipe Administrativa</h2>
            <p className="text-sm text-[#AAAAAA]">Gerencie secretários e coordenadores do sistema.</p>
        </div>
        <button onClick={handleNew} className="bg-[#C0A040] text-black px-4 py-2 rounded font-bold hover:bg-[#E6C850] transition flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Novo Usuário
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#1F1F1F] p-4 rounded-lg border border-[#333333] flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm text-[#AAAAAA] mb-1">Buscar por Nome ou SIAPE</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Digite para buscar..." 
              className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] pl-10 px-3 py-2 rounded focus:outline-none focus:border-[#C0A040] transition-colors"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Search className="h-5 w-5 absolute left-3 top-2.5 text-[#AAAAAA]" />
          </div>
        </div>
        <div className="w-full md:w-48">
            <label className="block text-sm text-[#AAAAAA] mb-1">Nível de Acesso</label>
            <select 
                value={filtroRole}
                onChange={(e) => setFiltroRole(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] px-3 py-2 rounded focus:outline-none focus:border-[#C0A040] transition-colors"
            >
                <option value="">Todos</option>
                <option value="Secretário">Secretário</option>
                <option value="Coordenador">Coordenador</option>
            </select>
        </div>
      </div>

      {/* Tabela Componentizada */}
      <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] flex flex-col">
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