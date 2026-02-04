import { createClient } from '@/lib/supabase/client'
import { ISolicitacao } from '@/app/type/index'

const supabase = createClient()

export const SolicitacaoService = {
  // 1. Listar todas as solicitações
  async getAll(): Promise<ISolicitacao[]> {

    const { data, error } = await supabase
      .from('solicitacoes')
      .select('*')
      .order('data_solicitacao', { ascending: false })
    
    if (error) {
        console.error('Erro ao buscar solicitações:', error.message)
        return []
    }

    return data as ISolicitacao[]
  },

  // 2. Buscar por ID
  async getById(id: number): Promise<ISolicitacao> {
    const { data, error } = await supabase
      .from('solicitacoes')
      .select('*') // Retornado ao select simples
      .eq('id', id)
      .single()
    
    if (error) throw error
    
    return data as ISolicitacao
  },

  // 3. Atualizar Status
  async updateStatus(id: number, status: string) {
    const { data, error } = await supabase
      .from('solicitacoes')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}