'use client'

import { useEffect, useState } from 'react'
import { ProfessorService } from '@/app/services/professorService'
import { IProfessor } from '@/app/type/index'
import { Plus, Search, Edit, Trash2 } from 'lucide-react'

export default function ProfessoresPage() {
  const [professores, setProfessores] = useState<IProfessor[]>([])
  const [loading, setLoading] = useState(true)
  const [busca, setBusca] = useState('')

  // Buscar dados ao carregar
  useEffect(() => {
    carregarProfessores()
  }, [])

  async function carregarProfessores() {
    try {
      const dados = await ProfessorService.getAll()
      setProfessores(dados)
    } catch (error) {
      console.error('Erro ao carregar professores:', error)
      alert('Erro ao carregar lista de professores')
    } finally {
      setLoading(false)
    }
  }

  // Filtragem local (igual ao legado, mas reativa)
  const dadosFiltrados = professores.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.email.toLowerCase().includes(busca.toLowerCase()) ||
    (p.areas && p.areas.toLowerCase().includes(busca.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Cabeçalho da Página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-[#C0A040]">Gerenciar Professores</h2>
        <button 
          onClick={() => alert('Modal de Criação será implementado a seguir')}
          className="bg-[#C0A040] text-black px-4 py-2 rounded font-bold hover:bg-[#E6C850] transition flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Professor
        </button>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-[#1F1F1F] p-4 rounded-lg border border-[#333333] flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="block text-sm text-[#AAAAAA] mb-1">Buscar</label>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Nome, E-mail ou Área..." 
              className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] pl-10 px-3 py-2 rounded focus:outline-none focus:border-[#C0A040] transition-colors"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <Search className="h-5 w-5 absolute left-3 top-2.5 text-[#AAAAAA]" />
          </div>
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] overflow-hidden">
        <table className="w-full divide-y divide-[#333333]">
          <thead className="bg-black">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#C0A040]">Professor</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#C0A040]">Instituição</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#C0A040]">Titulação</th>
              <th className="px-6 py-3 text-right text-sm font-semibold text-[#C0A040]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333333] bg-[#1F1F1F]">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-[#AAAAAA]">Carregando...</td></tr>
            ) : dadosFiltrados.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-[#AAAAAA]">Nenhum professor encontrado.</td></tr>
            ) : (
              dadosFiltrados.map((prof) => (
                <tr key={prof.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{prof.nome}</div>
                    <div className="text-[#AAAAAA] text-xs">{prof.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#E0E0E0]">{prof.instituicao}</td>
                  <td className="px-6 py-4 text-sm text-[#E0E0E0]">{prof.titulacao}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button className="text-[#AAAAAA] hover:text-[#C0A040] transition">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-[#AAAAAA] hover:text-red-500 transition">
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
    </div>
  )
}