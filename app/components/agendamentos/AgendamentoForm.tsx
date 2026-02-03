'use client'

import { IAgendamento, IAluno } from '@/app/type'
import React, { useState, useEffect } from 'react'
import * => AgendamentoService from '@/app/services/agendamentoService'

interface IAgendamentoComId extends IAgendamento {
  aluno_id?: number
}

interface AgendamentoFormData {
  titulo: string
  data: string
  horario: string
  aluno_id?: number
}

interface AgendamentoFormProps {
  agendamento?: IAgendamentoComId | null
  onSuccess: (data: AgendamentoFormData) => void
  onCancel: () => void
}

const AgendamentoForm: React.FC<AgendamentoFormProps> = ({
  agendamento,
  onSuccess,
  onCancel,
}) => {
  const [alunoId, setAlunoId] = useState<number | undefined>(undefined)
  const [titulo, setTitulo] = useState('')
  const [data, setData] = useState('')
  const [horario, setHorario] = useState('')
  const [alunosDisponiveis, setAlunosDisponiveis] = useState<IAluno[]>([])
  const [loadingAlunos, setLoadingAlunos] = useState(false)

  useEffect(() => {
    if (agendamento) {
      setTitulo(agendamento.titulo)
      setData(agendamento.data)
      setHorario(agendamento.hora)
      setAlunosDisponiveis([])
    } else {
      const fetchAlunos = async () => {
        setLoadingAlunos(true)
        try {
          const alunos = await AgendamentoService.getAlunosQualificadosSemDefesa()
          setAlunosDisponiveis(alunos)
        } catch (error) {
          console.error("Erro ao buscar alunos qualificados:", error)
        } finally {
          setLoadingAlunos(false)
        }
      }
      fetchAlunos()
      
      const today = new Date().toISOString().split('T')[0]
      setData(today)
      setHorario('09:00')
      setTitulo('')
    }
  }, [agendamento])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agendamento && !alunoId) {
      alert("Por favor, selecione um aluno.")
      return
    }

    onSuccess({
      titulo,
      data,
      horario,
      aluno_id: agendamento ? undefined : alunoId,
    })
  }

  return (
    <div className="bg-[#1F1F1F] rounded-lg border border-[#333333] shadow-lg text-white">
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#333333]">
          <h3 className="text-xl font-semibold text-[#C0A040]">
            {agendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-[#AAAAAA] hover:text-white"
          >
            &times;
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="aluno"
              className="block mb-2 text-sm font-medium text-[#AAAAAA]"
            >
              Aluno(a)
            </label>
            {agendamento ? (
              <input
                type="text"
                id="aluno"
                value={agendamento.aluno}
                className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] rounded-lg p-2.5"
                disabled
              />
            ) : (
              <select
                id="aluno"
                value={alunoId || ''}
                onChange={e => setAlunoId(Number(e.target.value))}
                className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] rounded-lg p-2.5 focus:outline-none focus:border-[#C0A040]"
                required
                disabled={loadingAlunos}
              >
                <option value="" disabled>
                  {loadingAlunos ? 'Carregando alunos...' : 'Selecione um aluno'}
                </option>
                {alunosDisponiveis.map(al => (
                  <option key={al.id} value={al.id}>
                    {al.nome}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label
              htmlFor="titulo"
              className="block mb-2 text-sm font-medium text-[#AAAAAA]"
            >
              Título da Defesa
            </label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={e => setTitulo(e.target.value)}
              className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] rounded-lg p-2.5 focus:outline-none focus:border-[#C0A040]"
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="data"
                className="block mb-2 text-sm font-medium text-[#AAAAAA]"
              >
                Data
              </label>
              <input
                type="date"
                id="data"
                value={data}
                onChange={e => setData(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] rounded-lg p-2.5 focus:outline-none focus:border-[#C0A040]"
                required
              />
            </div>
            <div>
              <label
                htmlFor="hora"
                className="block mb-2 text-sm font-medium text-[#AAAAAA]"
              >
                Horário
              </label>
              <input
                type="time"
                id="hora"
                value={horario}
                onChange={e => setHorario(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] text-[#E0E0E0] rounded-lg p-2.5 focus:outline-none focus:border-[#C0A040]"
                required
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end mt-8 pt-4 border-t border-[#333333]">
          <div className="flex-1 flex justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-[#C0A040] text-black px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#E6C850] transition-colors"
            >
              Salvar Agendamento
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AgendamentoForm
