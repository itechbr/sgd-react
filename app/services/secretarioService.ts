import { createClient } from '@/lib/supabase/client'

// Cliente Supabase para uso no navegador
const supabase = createClient()

export interface ISecretario {
  id: number
  nome: string
  email: string
  siape: string
  campus: string
  role: 'Secretário' | 'Coordenador'
  ativo: boolean
}

export const SecretarioService = {
  // 1. Listar todos os secretários
  async getAll() {
    const { data, error } = await supabase
      .from('secretarios')
      .select('*')
      .order('nome', { ascending: true })

    if (error) {
      console.error('Erro ao buscar secretários:', error.message)
      return []
    }
    return data as ISecretario[]
  },

  // 2. Criar novo secretário
  async create(secretario: Omit<ISecretario, 'id'>) {
    const { data, error } = await supabase
      .from('secretarios')
      .insert([secretario])
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 3. Atualizar dados de um secretário
  async update(id: number, secretario: Partial<ISecretario>) {
    const { data, error } = await supabase
      .from('secretarios')
      .update(secretario)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // 4. Alternar status (Ativar/Inativar)
  async toggleStatus(id: number, statusAtual: boolean) {
    const { error } = await supabase
      .from('secretarios')
      .update({ ativo: !statusAtual })
      .eq('id', id)

    if (error) throw error
    return true
  },

  // 5. Excluir secretário (opcional, já que usamos o toggleStatus na interface)
  async delete(id: number) {
    const { error } = await supabase
      .from('secretarios')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}