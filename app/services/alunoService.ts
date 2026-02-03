import { createClient } from '@/lib/supabase/client'
import { IAluno, IDefesa } from '@/app/type/index'

const supabase = createClient()

// Tipo estendido para garantir a tipagem no Frontend
export interface IAlunoCompleto extends IAluno {
  professores?: { nome: string } | null
  defesas?: IDefesa | null
}

export const AlunoService = {
  // 1. Listar alunos com tratamento seguro de dados (Map)
  async getAll(): Promise<IAlunoCompleto[]> {
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

    // AQUI ESTÁ A CORREÇÃO: Mapeamos manualmente para garantir que a estrutura bata com a Interface
    return data.map((item: any) => ({
      ...item,
      // Tratamento de segurança: Supabase pode retornar array ou objeto no join
      professores: Array.isArray(item.professores) 
        ? item.professores[0] || null 
        : item.professores || null,
      // Garante que defesas seja um objeto ou null (caso venha array vazio)
      defesas: Array.isArray(item.defesas)
        ? item.defesas[0] || null
        : item.defesas || null
    }))
  },

  // 2. Buscar um aluno específico
  async getById(id: number): Promise<IAlunoCompleto> {
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
    
    // Aplicamos a mesma normalização para o item único
    const aluno = data as any
    return {
      ...aluno,
      professores: Array.isArray(aluno.professores) 
        ? aluno.professores[0] || null 
        : aluno.professores || null,
      defesas: Array.isArray(aluno.defesas) 
        ? aluno.defesas[0] || null 
        : aluno.defesas || null
    }
  },

  // 3. Criar Aluno (Tipagem ajustada para Omit 'id')
  async create(aluno: Omit<IAluno, 'id' | 'ativo'>, defesa?: Partial<IDefesa>) {
    // 1. Cria o Aluno
    const { data: novoAluno, error: erroAluno } = await supabase
      .from('alunos')
      .insert([{ ...aluno, ativo: true }]) // Garante que nasce ativo
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

  // 4. Atualizar Aluno
  async update(id: number, aluno: Partial<IAluno>, defesa?: Partial<IDefesa>) {
    // 1. Atualiza dados do Aluno
    const { error: erroAluno } = await supabase
      .from('alunos')
      .update(aluno)
      .eq('id', id)

    if (erroAluno) throw erroAluno

    // 2. Atualiza ou Cria Defesa
    if (defesa) {
      const { data: defesaExistente } = await supabase
        .from('defesas')
        .select('id')
        .eq('aluno_id', id)
        .maybeSingle() // Use maybeSingle para evitar erro 406 se não existir

      if (defesaExistente) {
        const { error: erroUpdDefesa } = await supabase
          .from('defesas')
          .update(defesa)
          .eq('aluno_id', id)
        if (erroUpdDefesa) throw erroUpdDefesa
      } else {
        const { error: erroInsDefesa } = await supabase
          .from('defesas')
          .insert([{ ...defesa, aluno_id: id }])
        if (erroInsDefesa) throw erroInsDefesa
      }
    }

    return true
  },

  async delete(id: number) {
    // Primeiro remove a defesa
    await supabase.from('defesas').delete().eq('aluno_id', id)
    
    // Depois remove o aluno
    const { error } = await supabase.from('alunos').delete().eq('id', id)
    if (error) throw error
    return true
  }
}