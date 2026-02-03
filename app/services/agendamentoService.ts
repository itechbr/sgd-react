import { createClient } from '@/lib/supabase/client'
import { IAgendamento } from '@/app/type'

const supabase = createClient()

export const AgendamentoService = {
  // Busca todos os agendamentos (Defesas com status 'Agendada')
  async getAll(): Promise<IAgendamento[]> {
    const { data, error } = await supabase
      .from('defesas')
      .select(`
        id,
        titulo,
        data,
        horario,
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

    // Mapeia o retorno do Supabase para o tipo IAgendamento da interface
    return data.map((item: any) => ({
      id: item.id,
      aluno: item.alunos?.nome || 'Aluno Desconhecido',
      aluno_id: item.alunos?.id,
      titulo: item.titulo,
      data: item.data, // formato YYYY-MM-DD
      hora: item.horario // formato HH:MM:SS ou HH:MM
    }))
  },

  // Busca alunos que podem agendar defesa (Ativos e sem defesa marcada)
  async getAlunosQualificadosSemDefesa() {
    // 1. Busca todos os alunos ativos
    const { data: alunos, error } = await supabase
      .from('alunos')
      .select('id, nome, status')
      .in('status', ['Ativo', 'Qualificado']) // Aceita Ativo ou Qualificado
      .order('nome')

    if (error) {
      console.error('Erro ao buscar alunos:', error)
      return []
    }

    // 2. Busca IDs de alunos que JÁ têm defesa agendada ou realizada
    const { data: defesas } = await supabase
      .from('defesas')
      .select('aluno_id')
    
    const alunosComDefesa = new Set(defesas?.map(d => d.aluno_id))

    // 3. Filtra: Retorna apenas quem NÃO está na lista de defesas
    return alunos.filter(a => !alunosComDefesa.has(a.id))
  },

  async create(agendamento: { titulo: string, data: string, horario: string, aluno_id: number }) {
    const { data, error } = await supabase
      .from('defesas')
      .insert([{
        titulo: agendamento.titulo,
        data: agendamento.data,
        horario: agendamento.horario,
        aluno_id: agendamento.aluno_id,
        status: 'Agendada' // Padrão ao criar
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: number, updates: Partial<IAgendamento>) {
    // Precisamos traduzir os campos da interface para o banco
    const dbUpdates: any = {}
    if (updates.titulo) dbUpdates.titulo = updates.titulo
    if (updates.data) dbUpdates.data = updates.data
    if (updates.hora) dbUpdates.horario = updates.hora
    
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