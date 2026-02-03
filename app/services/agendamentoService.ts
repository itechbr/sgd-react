'use client'

import { createClient } from '@/lib/supabase/client'
import { IAgendamento, IAluno, IDefesa } from '@/app/type'

const supabase = createClient()

const mapearDefesaParaAgendamento = (defesa: any): IAgendamento => {
  return {
    id: defesa.id,
    aluno: defesa.alunos?.nome || 'Aluno não encontrado',
    titulo: defesa.titulo,
    data: defesa.data,
    hora: defesa.horario,
    aluno_id: defesa.aluno_id,
  }
}

export const getAgendamentos = async (): Promise<IAgendamento[]> => {
  const { data, error } = await supabase
    .from('defesas')
    .select(`
      id,
      aluno_id,
      titulo,
      data,
      horario,
      alunos (
        nome,
        status
      )
    `)
  
  if (error) {
    console.error('Erro ao buscar defesas:', error.message)
    throw new Error('Não foi possível buscar os agendamentos.')
  }

  const agendamentosFiltrados = data
    .filter(defesa => defesa.alunos?.status === 'Qualificado')
    .map(mapearDefesaParaAgendamento)

  return agendamentosFiltrados
}

export const getAlunosQualificadosSemDefesa = async (): Promise<IAluno[]> => {
  const { data: defesas, error: erroDefesas } = await supabase
    .from('defesas')
    .select('aluno_id')

  if (erroDefesas) {
    console.error('Erro ao buscar IDs de alunos em defesas:', erroDefesas.message)
    return []
  }
  const alunosComDefesaIds = defesas.map(d => d.aluno_id)

  const { data: alunos, error: erroAlunos } = await supabase
    .from('alunos')
    .select('*')
    .eq('status', 'Qualificado')
    .not('id', 'in', `(${alunosComDefesaIds.join(',')})`)

  if (erroAlunos) {
    console.error('Erro ao buscar alunos qualificados:', erroAlunos.message)
    return []
  }

  return alunos
}

export const createAgendamento = async (
  defesa: Omit<IDefesa, 'id' | 'status' | 'local' | 'resumo' | 'banca'>
): Promise<IDefesa> => {
  const { data, error } = await supabase
    .from('defesas')
    .insert([{ ...defesa, status: 'Agendada' }])
    .select()
    .single()

  if (error) {
    console.error('Erro ao criar defesa:', error.message)
    throw new Error('Não foi possível criar o agendamento.')
  }

  return data
}

export const updateAgendamento = async (
  id: number,
  updates: Partial<IDefesa>
): Promise<IDefesa> => {
  const { data, error } = await supabase
    .from('defesas')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error(`Erro ao atualizar defesa com ID ${id}:`, error.message)
    throw new Error('Não foi possível atualizar o agendamento.')
  }

  return data
}

export const deleteAgendamento = async (id: number): Promise<boolean> => {
  const { error } = await supabase.from('defesas').delete().eq('id', id)

  if (error) {
    console.error(`Erro ao excluir defesa com ID ${id}:`, error.message)
    return false
  }

  return true
}
