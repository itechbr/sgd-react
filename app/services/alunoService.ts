import { createClient } from '@/lib/supabase/client'
import { IAluno, IDefesa } from '@/app/type/index'

const supabase = createClient()

// Tipo estendido para incluir dados relacionais na listagem
export interface IAlunoCompleto extends IAluno {
  professores?: { nome: string } | null
  defesas?: IDefesa | null
}

export const AlunoService = {
  // Listar alunos com dados do Orientador e Defesa
  async getAll() {
    const { data, error } = await supabase
      .from('alunos')
      .select(`
        *,
        professores (nome),
        defesas (*)
      `)
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar alunos:', error.message)
      return []
    }
    return data as IAlunoCompleto[]
  },

  // Buscar um aluno específico
  async getById(id: number) {
    const { data, error } = await supabase
      .from('alunos')
      .select(`
        *,
        professores (nome),
        defesas (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data as IAlunoCompleto
  },

  // Criar Aluno (e opcionalmente a Defesa)
  async create(aluno: Partial<IAluno>, defesa?: Partial<IDefesa>) {
    // 1. Cria o Aluno
    const { data: novoAluno, error: erroAluno } = await supabase
      .from('alunos')
      .insert([aluno])
      .select()
      .single()

    if (erroAluno) throw erroAluno

    // 2. Se houver defesa, cria a Defesa vinculada
    if (defesa && novoAluno) {
      const { error: erroDefesa } = await supabase
        .from('defesas')
        .insert([{ ...defesa, aluno_id: novoAluno.id }])

      if (erroDefesa) throw erroDefesa
    }

    return novoAluno
  },

  // Atualizar Aluno
  async update(id: number, aluno: Partial<IAluno>, defesa?: Partial<IDefesa>) {
    // 1. Atualiza dados do Aluno
    const { error: erroAluno } = await supabase
      .from('alunos')
      .update(aluno)
      .eq('id', id)

    if (erroAluno) throw erroAluno

    // 2. Atualiza ou Cria Defesa
    if (defesa) {
      // Verifica se já existe defesa para este aluno
      const { data: defesaExistente } = await supabase
        .from('defesas')
        .select('id')
        .eq('aluno_id', id)
        .single()

      if (defesaExistente) {
        // Atualiza
        const { error: erroUpdDefesa } = await supabase
          .from('defesas')
          .update(defesa)
          .eq('aluno_id', id)
        if (erroUpdDefesa) throw erroUpdDefesa
      } else {
        // Cria nova
        const { error: erroInsDefesa } = await supabase
          .from('defesas')
          .insert([{ ...defesa, aluno_id: id }])
        if (erroInsDefesa) throw erroInsDefesa
      }
    }

    return true
  },

  async delete(id: number) {
    // Primeiro remove a defesa (por causa da chave estrangeira)
    await supabase.from('defesas').delete().eq('aluno_id', id)
    
    // Depois remove o aluno
    const { error } = await supabase.from('alunos').delete().eq('id', id)
    if (error) throw error
    return true
  }
}