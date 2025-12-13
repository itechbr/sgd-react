import { createClient } from '@/lib/supabase/client'
import { IProfessor } from '@/app/type/index' 

// Cliente Supabase para uso no navegador
const supabase = createClient()

export const ProfessorService = {
  // 1. Listar todos os professores (Substitui o acesso direto ao array)
  async getAll() {
    const { data, error } = await supabase
      .from('professores')
      .select('*')
      .order('nome', { ascending: true })
    
    if (error) {
        console.error('Erro ao buscar professores:', error.message)
        return []
    }
    return data as IProfessor[]
  },

  // 2. Buscar professor por ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('professores')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as IProfessor
  },

  // 3. Criar novo professor
  async create(professor: Omit<IProfessor, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('professores')
      .insert([professor])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 4. Atualizar professor
  async update(id: number, professor: Partial<IProfessor>) {
    const { data, error } = await supabase
      .from('professores')
      .update(professor)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // 5. Deletar professor
  async delete(id: number) {
    const { error } = await supabase
      .from('professores')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}