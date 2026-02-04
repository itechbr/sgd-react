'use client'

import { useEffect, useState } from 'react'
import { ProfessorService } from '@/app/services/professorService'
import { IProfessor } from '@/app/type/index'
import { ProfessorForm } from '@/app/components/professores/ProfessorForm'
import { ProfessorDetails } from '@/app/components/professores/ProfessorDetails'
import { Pagination } from '@/app/components/ui/Pagination'
import { DataTable, Column } from '@/app/components/ui/DataTable'
import { Plus, Search, ExternalLink } from 'lucide-react'

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<IProfessor[]>([])
  const [loading, setLoading] = useState(true)
  
  // Filtros
  const [busca, setBusca] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')

  // Paginação
  const ITEMS_PER_PAGE = 8
  const [currentPage, setCurrentPage] = useState(1)

  // Modais
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProfessor, setEditingProfessor] = useState<IProfessor | null>(null)
  const [viewProfessor, setViewProfessor] = useState<IProfessor | null>(null)

  useEffect(() => {
    carregarProfessores()
  }, [])

  // Reseta para página 1 ao filtrar
  useEffect(() => {
    setCurrentPage(1)
  }, [busca, filtroTipo])

  async function carregarProfessores() {
    try {
      const dados = await ProfessorService.getAll()
      setProfessores(dados)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar lista de professores')
    } finally {
      setLoading(false)
    }
  }

  // --- Handlers ---
  function handleNew() {
    setEditingProfessor(null)
    setIsFormOpen(true)
  }

  function handleEdit(professor: IProfessor) {
    setEditingProfessor(professor)
    setIsFormOpen(true)
  }

  function handleSuccess() {
    setIsFormOpen(false)
    carregarProfessores()
  }

  async function handleDelete(professor: IProfessor) {
    if (confirm('Tem certeza que deseja excluir este professor?')) {
      try {
        if (professor.id) {
            await ProfessorService.delete(professor.id)
            setProfessores(prev => prev.filter(p => p.id !== professor.id))
            const totalItems = professores.length - 1
            const maxPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
            if (currentPage > maxPages && maxPages > 0) setCurrentPage(maxPages)
        }
      } catch (error) {
        alert('Erro ao excluir professor.')
      }
    }
  }

  // --- Auxiliares de Estilo ---
  const getCategoriaStyle = (tipo: string) => {
    switch(tipo) {
      case 'Permanente': return 'bg-[#C0A040]/20 text-[#C0A040] border-[#C0A040]/50'
      case 'Colaborador': return 'bg-blue-900/30 text-blue-400 border-blue-800'
      case 'Visitante': return 'bg-purple-900/30 text-purple-400 border-purple-800'
      default: return 'bg-gray-800 text-gray-400 border-gray-700'
    }
  }

  // --- Definição das Colunas ---
  const columns: Column<IProfessor>[] = [
    {
      header: 'Professor / Áreas',
      accessor: (prof) => (
        <div>
          <button onClick={() => setViewProfessor(prof)} className="font-medium text-white hover:text-[#C0A040] hover:underline text-left">
            {prof.nome}
          </button>
          <div className="text-[#AAAAAA] text-xs mt-1 truncate max-w-[200px]" title={prof.areas}>
            {prof.areas || '—'}
          </div>
        </div>
      )
    },
    { header: 'Instituição', accessor: 'instituicao' },
    { header: 'Titulação', accessor: 'titulacao' },
    {
      header: 'Lattes',
      className: 'text-center',
      accessor: (prof) => prof.lattes ? (
        <a 
            href={prof.lattes} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex justify-center text-[#AAAAAA] hover:text-[#C0A040] transition"
            title="Ver Currículo Lattes"
        >
            <ExternalLink size={18} />
        </a>
      ) : (
        <span className="text-[#333333] cursor-not-allowed flex justify-center">
            <ExternalLink size={18} />
        </span>
      )
    },
    {
      header: 'Categoria',
      className: 'text-center',
      accessor: (prof) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getCategoriaStyle(prof.tipo)}`}>
            {prof.tipo}
        </span>
      )
    },
    {
      header: 'Status',
      className: 'text-center',
      accessor: (prof) => prof.ativo ? (
        <div className="flex justify-center" title="Ativo">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
        </div>
      ) : (
        <div className="flex justify-center" title="Inativo">
            <span className="h-3 w-3 rounded-full bg-red-900 border border-red-700 inline-block"></span>
        </div>
      )
    }
  ]

  // --- Filtros e Paginação ---
  const dadosFiltrados = professores.filter(p => {
    const matchBusca = 
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.email.toLowerCase().includes(busca.toLowerCase()) ||
      (p.areas && p.areas.toLowerCase().includes(busca.toLowerCase()))
    
    const matchTipo = filtroTipo === '' || p.tipo === filtroTipo

    return matchBusca && matchTipo
  })

  const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = dadosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  return (
    <div className="space-y-6 relative">
      
      {/* Modal Formulário */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-auto">
            <ProfessorForm 
              professorToEdit={editingProfessor}
              onSuccess={handleSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Modal Detalhes */}
      {viewProfessor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg my-auto">
            <ProfessorDetails 
              professor={viewProfessor}
              onClose={() => setViewProfessor(null)}
            />
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-[#C0A040]">Gerenciar Professores</h2>
        <button 
          onClick={handleNew}
          className="bg-[#C0A040] text-black px-4 py-2 rounded font-bold hover:bg-[#E6C850] transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Professor
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#1F1F1F] p-4 rounded-lg border border-[#333333] flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm text-[#AAAAAA] mb-1">Buscar por Nome, E-mail ou Área</label>
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
            <label className="block text-sm text-[#AAAAAA] mb-1">Categoria</label>
            <select 
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] px-3 py-2 rounded focus:outline-none focus:border-[#C0A040] transition-colors"
            >
                <option value="">Todas</option>
                <option value="Permanente">Permanente</option>
                <option value="Colaborador">Colaborador</option>
                <option value="Visitante">Visitante</option>
            </select>
        </div>
      </div>

      {/* Tabela Componentizada */}
      <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] flex flex-col">
        <DataTable 
            columns={columns}
            data={paginatedData}
            isLoading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
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