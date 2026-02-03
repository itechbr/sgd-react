import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export interface DashboardStats {
  solicitacoes: number
  defesas: number
  documentos: number
  professores: number
}

export interface SolicitacaoRecente {
  id: number
  nome: string
  curso: string
  data: string
  status: string
}

export interface ChartData {
  labels: string[]
  data: number[]
}

export const DashboardService = {
  // 1. Busca os Cards (Contadores)
  async getStats(): Promise<DashboardStats> {
    try {
      // Professores
      const { count: profCount } = await supabase
        .from('professores')
        .select('*', { count: 'exact', head: true })

      // Defesas Agendadas
      const { count: defesasCount } = await supabase
        .from('defesas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Agendada')

      // Solicitações (Alunos com status 'Ativo' = Pendente de TCC)
      const { count: solCount } = await supabase
        .from('alunos')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Ativo') 

      // Documentos (Consideramos Defesas 'Realizada' como documentos gerados)
      const { count: docCount } = await supabase
        .from('defesas')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'Realizada')

      return {
        professores: profCount || 0,
        defesas: defesasCount || 0,
        solicitacoes: solCount || 0,
        documentos: docCount || 0
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      return { solicitacoes: 0, defesas: 0, documentos: 0, professores: 0 }
    }
  },

  // 2. Busca lista de Recentes
  async getRecentRequests(): Promise<SolicitacaoRecente[]> {
    const { data, error } = await supabase
      .from('alunos')
      .select('id, nome, curso, created_at, status')
      .eq('status', 'Ativo')
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) return []

    return data.map((aluno: any) => ({
      id: aluno.id,
      nome: aluno.nome,
      curso: aluno.curso,
      status: aluno.status,
      data: new Date(aluno.created_at).toLocaleDateString('pt-BR')
    }))
  },

  // 3. GRÁFICO: Defesas por Mês (Ano Atual)
  async getDefesasPorMes(): Promise<number[]> {
    const anoAtual = new Date().getFullYear()
    const inicioAno = `${anoAtual}-01-01`
    const fimAno = `${anoAtual}-12-31`

    // Busca data de todas as defesas do ano
    const { data, error } = await supabase
      .from('defesas')
      .select('data')
      .gte('data', inicioAno)
      .lte('data', fimAno)

    if (error || !data) return new Array(12).fill(0)

    // Inicializa array com 12 zeros (Jan a Dez)
    const meses = new Array(12).fill(0)

    data.forEach((defesa: any) => {
      const dataDefesa = new Date(defesa.data)
      const mes = dataDefesa.getMonth() // 0 = Jan, 11 = Dez
      meses[mes]++
    })

    return meses
  },

  // 4. GRÁFICO: Status dos Alunos
  async getStatusAlunos(): Promise<number[]> {
    // Definindo a ordem fixa dos status para o gráfico bater com as labels
    // Ordem: ['Ativo', 'Qualificado', 'Defendido', 'Trancado'] (exemplo)
    
    const { data, error } = await supabase
      .from('alunos')
      .select('status')

    if (error || !data) return [0, 0, 0, 0]

    // Contadores
    let ativos = 0
    let qualificados = 0
    let defendidos = 0 // ou 'Realizada' dependendo da sua regra
    let outros = 0

    data.forEach((aluno: any) => {
        const s = aluno.status
        if (s === 'Ativo') ativos++
        else if (s === 'Qualificado') qualificados++
        else if (s === 'Defendido' || s === 'Concluído') defendidos++
        else outros++
    })

    // Retorna na ordem que o gráfico espera: [Ativo, Qualificado, Defendido, Outros]
    return [ativos, qualificados, defendidos, outros]
  }
}