// app/components/agendamentos/AgendamentoForm.tsx
'use client'

import { IAgendamento } from '@/app/type'
import React, { useState, useEffect } from 'react'

interface AgendamentoFormProps {
  agendamento?: IAgendamento | null
  onSuccess: () => void
  onCancel: () => void
}

const AgendamentoForm: React.FC<AgendamentoFormProps> = ({
  agendamento,
  onSuccess,
  onCancel,
}) => {
  const [aluno, setAluno] = useState('')
  const [titulo, setTitulo] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')

  useEffect(() => {
    if (agendamento) {
      setAluno(agendamento.aluno)
      setTitulo(agendamento.titulo)
      setData(agendamento.data)
      setHora(agendamento.hora)
    } else {
      // Define valores padrão para um novo formulário
      const today = new Date().toISOString().split('T')[0]
      setData(today)
      setHora('09:00')
    }
  }, [agendamento])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Lógica de submissão (será conectada ao service na página principal)
    // Por enquanto, apenas chama o callback de sucesso
    onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-yellow-400">
          {agendamento ? 'Editar Agendamento' : 'Novo Agendamento'}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-white"
        >
          &times;
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="aluno"
            className="block mb-2 text-sm font-medium text-gray-400"
          >
            Aluno(a)
          </label>
          <input
            type="text"
            id="aluno"
            value={aluno}
            onChange={e => setAluno(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            required
          />
        </div>
        <div>
          <label
            htmlFor="titulo"
            className="block mb-2 text-sm font-medium text-gray-400"
          >
            Título da Defesa
          </label>
          <input
            type="text"
            id="titulo"
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="data"
              className="block mb-2 text-sm font-medium text-gray-400"
            >
              Data
            </label>
            <input
              type="date"
              id="data"
              value={data}
              onChange={e => setData(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              required
            />
          </div>
          <div>
            <label
              htmlFor="hora"
              className="block mb-2 text-sm font-medium text-gray-400"
            >
              Horário
            </label>
            <input
              type="time"
              id="hora"
              value={hora}
              onChange={e => setHora(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2.5"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end mt-8 pt-4 border-t border-gray-700">
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
            className="bg-yellow-500 text-black px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-yellow-400 transition-colors"
          >
            Salvar
          </button>
        </div>
      </div>
    </form>
  )
}

export default AgendamentoForm
