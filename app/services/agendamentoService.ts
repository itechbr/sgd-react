// app/services/agendamentoService.ts
'use client'

import { IAgendamento } from '@/app/type'

const STORAGE_KEY = 'agendamentos'

const getInitialAgendamentos = (): IAgendamento[] => {
  // Verifique se está no ambiente do navegador antes de acessar o localStorage
  if (typeof window === 'undefined') {
    return []
  }

  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }

  // Se não houver nada no localStorage, crie alguns dados mockados
  const mockAgendamentos: IAgendamento[] = [
    {
      id: 1,
      aluno: 'João da Silva',
      titulo: 'Dissertação sobre Engenharia de Software',
      data: '2024-08-15',
      hora: '14:00',
    },
    {
      id: 2,
      aluno: 'Maria Oliveira',
      titulo: 'Tese sobre Inteligência Artificial',
      data: '2024-08-20',
      hora: '10:30',
    },
  ]

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAgendamentos))
  return mockAgendamentos
}

export const getAgendamentos = async (): Promise<IAgendamento[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(getInitialAgendamentos())
    }, 500) // Simula um delay de rede
  })
}

export const getAgendamentoById = async (
  id: number
): Promise<IAgendamento | undefined> => {
  const agendamentos = await getAgendamentos()
  return agendamentos.find(a => a.id === id)
}

export const createAgendamento = async (
  agendamento: Omit<IAgendamento, 'id'>
): Promise<IAgendamento> => {
  const agendamentos = await getAgendamentos()
  const newAgendamento: IAgendamento = {
    ...agendamento,
    id: Date.now(), // ID simples baseado no timestamp
  }
  const updatedAgendamentos = [...agendamentos, newAgendamento]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAgendamentos))
  return newAgendamento
}

export const updateAgendamento = async (
  id: number,
  updates: Partial<IAgendamento>
): Promise<IAgendamento | undefined> => {
  const agendamentos = await getAgendamentos()
  const index = agendamentos.findIndex(a => a.id === id)
  if (index === -1) return undefined

  const updatedAgendamento = { ...agendamentos[index], ...updates }
  agendamentos[index] = updatedAgendamento
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agendamentos))
  return updatedAgendamento
}

export const deleteAgendamento = async (id: number): Promise<boolean> => {
  const agendamentos = await getAgendamentos()
  const newAgendamentos = agendamentos.filter(a => a.id !== id)
  if (agendamentos.length === newAgendamentos.length) {
    return false // Nenhum item foi removido
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newAgendamentos))
  return true
}
