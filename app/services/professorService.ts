import { createClient } from '@/lib/supabase/client'
import { IProfessor } from '@/app/type/index' // Ajuste se sua pasta for 'types'

// Como estamos usando Client Component para o CRUD inicialmente, usamos o client do browser
const supabase = createClient()

export const ProfessorService = {
  // Listar todos os professores
  async getAll() {
    const { data, error } = await supabase
      .from('professores')
      .select('*')
      .order('nome', { ascending: true })
    
    if (error) throw error
    return data as IProfessor[]
  },

  // Buscar por ID
  async getById(id: number) {
    const { data, error } = await supabase
      .from('professores')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as IProfessor
  },

  // Criar novo professor
  async create(professor: Omit<IProfessor, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('professores')
      .insert([professor])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Atualizar professor
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

  // Remover professor (Soft delete ou Hard delete)
  // Aqui faremos Hard Delete para simplificar, mas no legado havia lógica de inativar
  async delete(id: number) {
    const { error } = await supabase
      .from('professores')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}