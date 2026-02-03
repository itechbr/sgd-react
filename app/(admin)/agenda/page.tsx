'use client'

import { useEffect, useState } from 'react'
import { AgendamentoService } from '@/app/services/agendamentoService' 
import { IAgendamento } from '@/app/type'
import AgendamentoForm from '@/app/components/agendamentos/AgendamentoForm'
import AgendamentoDetails from '@/app/components/agendamentos/AgendamentoDetails'
import { Pagination } from '@/app/components/ui/Pagination'
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Calendar,
  MoreHorizontal,
} from 'lucide-react'

interface IAgendamentoComId extends IAgendamento {
  aluno_id?: number
  local?: string
}

interface AgendamentoFormData {
  titulo: string
  data: string
  horario: string
  aluno_id?: number
  local: string
}

export default function AgendaPage() {
  const [agendamentos, setAgendamentos] = useState<IAgendamentoComId[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAgendamento, setEditingAgendamento] = useState<IAgendamentoComId | null>(null)
  const [viewAgendamento, setViewAgendamento] = useState<IAgendamentoComId | null>(null)

  useEffect(() => {
    carregarAgendamentos()
  }, [])

  useEffect(() => {
    setCurrentPage(1)
  }, [busca])

  const carregarAgendamentos = async () => {
    setLoading(true)
    try {
      const dados = await AgendamentoService.getAll()
      setAgendamentos(dados)
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error)
      alert('Não foi possível carregar os agendamentos.')
    } finally {
      setLoading(false)
    }
  }

  const handleNew = () => {
    setEditingAgendamento(null)
    setIsFormOpen(true)
  }

  const handleEdit = (agendamento: IAgendamentoComId) => {
    setEditingAgendamento(agendamento)
    setIsFormOpen(true)
  }

  const handleFormSuccess = async (formData: AgendamentoFormData) => {
    try {
      if (editingAgendamento) {
        await AgendamentoService.update(editingAgendamento.id, {
          titulo: formData.titulo,
          data: formData.data,
          hora: formData.horario,
          local: formData.local,
        })
      } else {
        if (!formData.aluno_id) {
            throw new Error("ID do aluno é necessário para criar um agendamento.")
        }
        await AgendamentoService.create({
          titulo: formData.titulo,
          data: formData.data,
          horario: formData.horario,
          aluno_id: formData.aluno_id,
          local: formData.local,
        })
      }
      setIsFormOpen(false)
      await carregarAgendamentos()
    } catch (error) {
      console.error('Erro ao salvar agendamento:', error)
      alert(`Não foi possível salvar o agendamento. ${error instanceof Error ? error.message : ''}`)
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      try {
        await AgendamentoService.delete(id)
        await carregarAgendamentos()
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error)
        alert('Não foi possível excluir o agendamento.')
      }
    }
  }

  const dadosFiltrados = agendamentos.filter(
    ag =>
      ag.aluno.toLowerCase().includes(busca.toLowerCase()) ||
      ag.titulo.toLowerCase().includes(busca.toLowerCase())
  )

  const totalPages = Math.ceil(dadosFiltrados.length / ITEMS_PER_PAGE)
  const paginatedData = dadosFiltrados.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const formatarData = (data: string) => {
    if (!data) return 'Data inválida';
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  return (
    <div className="space-y-6">
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg">
            <AgendamentoForm
              agendamento={editingAgendamento}
              onSuccess={handleFormSuccess}
              onCancel={() => setIsFormOpen(false)}
            />
          </div>
        </div>
      )}

      {viewAgendamento && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <AgendamentoDetails
            agendamento={viewAgendamento}
            onClose={() => setViewAgendamento(null)}
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-[#C0A040]">
          Agenda de Defesas
        </h2>
        <button
          onClick={handleNew}
          className="bg-[#C0A040] text-black px-4 py-2 rounded font-bold hover:bg-[#E6C850] transition flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Agendamento
        </button>
      </div>

      <div className="bg-[#1F1F1F] p-4 rounded-lg border border-[#333333]">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por aluno ou título..."
            className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] pl-10 px-3 py-2 rounded focus:outline-none focus:border-[#C0A040]"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
          <Search className="h-5 w-5 absolute left-3 top-2.5 text-[#AAAAAA]" />
        </div>
      </div>

      <div className="bg-[#1F1F1F] rounded-lg border border-[#333333]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead className="bg-black/20">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#C0A040]">Aluno</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#C0A040]">Título</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-[#C0A040]">Data & Hora</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-[#C0A040]">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#333333]">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#AAAAAA]">Carregando...</td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-[#AAAAAA]">
                    Nenhum agendamento encontrado para alunos qualificados.
                  </td>
                </tr>
              ) : (
                paginatedData.map(ag => (
                  <tr key={ag.id} className="hover:bg-[#1A1A1A]">
                    <td className="px-6 py-4 text-white font-medium">{ag.aluno}</td>
                    <td className="px-6 py-4 text-[#E0E0E0]">{ag.titulo}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar size={14} className="text-[#AAAAAA]" />
                        <span className="text-white">{formatarData(ag.data)}</span>
                        <span className="text-[#555]">às</span>
                        <span className="font-semibold text-[#C0A040]">{ag.hora}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-3">
                        <button onClick={() => setViewAgendamento(ag)} className="text-[#AAAAAA] hover:text-blue-400" title="Ver Detalhes">
                          <MoreHorizontal size={20} />
                        </button>
                        <button onClick={() => handleEdit(ag)} className="text-[#AAAAAA] hover:text-[#C0A040]" title="Editar">
                          <Edit size={18} />
                        </button>
                        <button onClick={() => handleDelete(ag.id)} className="text-[#AAAAAA] hover:text-red-500" title="Excluir">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-[#333333]">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={dadosFiltrados.length}
            />
          </div>
        )}
      </div>
    </div>
  )
}