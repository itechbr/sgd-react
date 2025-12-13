'use client'

import { useEffect, useState } from 'react'
import { AlunoService, IAlunoCompleto } from '@/app/services/alunoService'
import { AlunoForm } from '@/app/components/alunos/AlunoForm'
import { DefesaDetails } from '@/app/components/alunos/DefesaDetails'
import { Pagination } from '@/app/components/ui/Pagination' // Importação Atualizada
import { Plus, Search, Edit, Trash2, GraduationCap } from 'lucide-react'

export default function AlunosPage() {
  const [alunos, setAlunos] = useState<IAlunoCompleto[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  // Configuração da Paginação
  const ITEMS_PER_PAGE = 8 // Mesmo valor do arquivo alunos.js original
  const [currentPage, setCurrentPage] = useState(1)

  // Estados dos Modais
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAluno, setEditingAluno] = useState<IAlunoCompleto | null>(null)
  const [viewAluno, setViewAluno] = useState<IAlunoCompleto | null>(null)

  useEffect(() => {
    carregarAlunos()
  }, [])

  // Reseta para página 1 ao filtrar
  useEffect(() => {
    setCurrentPage(1)
  }, [busca])

  async function carregarAlunos() {
    try {
      const dados = await AlunoService.getAll()
      setAlunos(dados)
    } catch (error) {
      console.error(error)
      alert('Erro ao carregar alunos.')
    } finally {
      setLoading(false)
    }
  }

  function handleNew() {
    setEditingAluno(null)
    setIsFormOpen(true)
  }

  function handleEdit(aluno: IAlunoCompleto) {
    setEditingAluno(aluno)
    setIsFormOpen(true)
  }

  function handleFormSuccess() {
    setIsFormOpen(false)
    carregarAlunos()
  }

  async function handleDelete(id: number) {
    if (confirm('Tem certeza que deseja remover este aluno?')) {
      try {
        await AlunoService.delete(id)
        setAlunos(prev => prev.filter(a => a.id !== id))
        
        // Ajusta página se deletar o último item
        const totalItemsAfter = alunos.length - 1
        const maxPages = Math.ceil(totalItemsAfter / ITEMS_PER_PAGE)
        if (currentPage > maxPages && maxPages > 0) setCurrentPage(maxPages)
          
      } catch (error) {
        alert('Erro ao excluir aluno.')
      }
    }
  }

  // Filtragem
  const dadosFiltrados = alunos.filter(aluno => 
    aluno.nome.toLowerCase().includes(busca.toLowerCase()) ||
    aluno.matricula.includes(busca) ||
    aluno.professores?.nome.toLowerCase().includes(busca.toLowerCase())
  )

  // Lógica de Paginação (Client-Side)
  const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedData = dadosFiltrados.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Ativo': return 'text-blue-400 border-blue-400/30 bg-blue-400/10'
      case 'Qualificado': return 'text-[#C0A040] border-[#C0A040]/30 bg-[#C0A040]/10'
      case 'Defendido': return 'text-green-400 border-green-400/30 bg-green-400/10'
      default: return 'text-red-400 border-red-400/30 bg-red-400/10'
    }
  }

  return (
    <div className="space-y-6 relative">
      
      {/* Modais */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-4xl my-auto">
            <AlunoForm 
              alunoToEdit={editingAluno}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {viewAluno && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-auto">
            <DefesaDetails 
              aluno={viewAluno} 
              onClose={() => setViewAluno(null)} 
            />
          </div>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-[#C0A040]">Gerenciar Alunos</h2>
        <button onClick={handleNew} className="bg-[#C0A040] text-black px-4 py-2 rounded font-bold hover:bg-[#E6C850] transition flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Novo Aluno
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-[#1F1F1F] p-4 rounded-lg border border-[#333333]">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Buscar por Nome, Matrícula ou Orientador..." 
            className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] pl-10 px-3 py-2 rounded focus:outline-none focus:border-[#C0A040] transition-colors"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-[#AAAAAA]" />
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-[#333333]">
            <thead className="bg-black">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#C0A040]">Aluno / Matrícula</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#C0A040]">Curso / Ingresso</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#C0A040]">Orientador</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-[#C0A040]">Status</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-[#C0A040]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333] bg-[#1F1F1F]">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[#AAAAAA]">Carregando...</td></tr>
              ) : dadosFiltrados.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-[#AAAAAA]">Nenhum aluno encontrado.</td></tr>
              ) : (
                paginatedData.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-[#1A1A1A] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{aluno.nome}</div>
                      <div className="text-[#AAAAAA] text-xs font-mono">{aluno.matricula}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#E0E0E0]">{aluno.curso}</div>
                      <div className="text-[#AAAAAA] text-xs">Ingresso: {aluno.ingresso}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#E0E0E0]">
                      {aluno.professores?.nome || <span className="text-[#666] italic">Sem orientador</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(aluno.status)}`}>
                        {aluno.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button onClick={() => setViewAluno(aluno)} className="text-[#AAAAAA] hover:text-blue-400 transition" title="Ver Detalhes">
                          <GraduationCap className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleEdit(aluno)} className="text-[#AAAAAA] hover:text-[#C0A040] transition" title="Editar">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(aluno.id)} className="text-[#AAAAAA] hover:text-red-500 transition" title="Excluir">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Rodapé com Paginação */}
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