import { createClient } from '@/lib/supabase/client'
import { IAgendamento } from '@/app/type'

const supabase = createClient()

export const AgendamentoService = {
  async getAll(): Promise<IAgendamento[]> {
    const { data, error } = await supabase
      .from('defesas')
      .select(`
        id,
        titulo,
        data,
        horario,
        local,
        alunos (
          id,
          nome
        )
      `)
      .eq('status', 'Agendada')
      .order('data', { ascending: true })

    if (error) {
      console.error('Erro ao buscar agendamentos:', error)
      return []
    }

    return data.map((item: any) => ({
      id: item.id,
      aluno: item.alunos?.nome || 'Aluno Desconhecido',
      aluno_id: item.alunos?.id,
      titulo: item.titulo,
      data: item.data,
      hora: item.horario,
      local: item.local,
    }))
  },

  async getAlunosQualificadosSemDefesa() {
    const { data: alunos, error } = await supabase
      .from('alunos')
      .select('id, nome, status')
      .in('status', ['Ativo', 'Qualificado'])
      .order('nome')

    if (error) {
      console.error('Erro ao buscar alunos:', error)
      return []
    }

    const { data: defesas } = await supabase
      .from('defesas')
      .select('aluno_id')
    
    const alunosComDefesa = new Set(defesas?.map(d => d.aluno_id))

    return alunos.filter(a => !alunosComDefesa.has(a.id))
  },

  async create(agendamento: { titulo: string, data: string, horario: string, aluno_id: number, local: string }) {
    const { data, error } = await supabase
      .from('defesas')
      .insert([{
        titulo: agendamento.titulo,
        data: agendamento.data,
        horario: agendamento.horario,
        aluno_id: agendamento.aluno_id,
        local: agendamento.local,
        status: 'Agendada',
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: number, updates: Partial<IAgendamento & { local?: string }>) {
    const dbUpdates: any = {}
    if (updates.titulo) dbUpdates.titulo = updates.titulo
    if (updates.data) dbUpdates.data = updates.data
    if (updates.hora) dbUpdates.horario = updates.hora
    if (updates.local) dbUpdates.local = updates.local
    
    const { data, error } = await supabase
      .from('defesas')
      .update(dbUpdates)
      .eq('id', id)
      .select()

    if (error) throw error
    return data
  },

  async delete(id: number) {
    const { error } = await supabase
      .from('defesas')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}
