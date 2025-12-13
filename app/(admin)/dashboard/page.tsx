'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DefesasChart, StatusChart } from '@/app/components/dashboard/DashboardCharts'
import Link from 'next/link'

// Tipos para os dados do dashboard
interface DashboardStats {
  solicitacoes: number
  defesas: number
  documentos: number
  professores: number
}

interface SolicitacaoRecente {
  id: number
  nome: string
  curso: string
  data: string
}

export default function DashboardPage() {
  const supabase = createClient()
  
  const [stats, setStats] = useState<DashboardStats>({
    solicitacoes: 0,
    defesas: 0,
    documentos: 42, // Mockado conforme original
    professores: 0
  })
  
  const [recentes, setRecentes] = useState<SolicitacaoRecente[]>([])
  const [loading, setLoading] = useState(true)

  // Dados estáticos para os gráficos (Fiéis ao original)
  const chartDataDefesas = [2, 3, 5, 4, 7, 8, 5, 6, 9, 10, 4, 0]
  const chartLabelsDefesas = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  
  const chartDataStatus = [15, 60, 10, 15] // Dados fictícios do original
  const chartLabelsStatus = ['Aguardando', 'Em Orientação', 'Pendente', 'Concluído']
  const chartColorsStatus = ['#EF4444', '#3B82F6', '#E6C850', '#22C55E'] // Vermelho, Azul, Dourado, Verde

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // 1. Contar Professores
        const { count: profCount } = await supabase.from('professores').select('*', { count: 'exact', head: true })
        
        // 2. Contar Defesas Agendadas
        const { count: defesasCount } = await supabase.from('defesas').select('*', { count: 'exact', head: true }).eq('status', 'Agendada')

        // 3. Contar Solicitações (Alunos ativos sem defesa marcada ou recém criados)
        // Lógica simplificada: Alunos com status 'Ativo'
        const { count: solCount } = await supabase.from('alunos').select('*', { count: 'exact', head: true }).eq('status', 'Ativo')

        // 4. Buscar Solicitações Recentes (Últimos 5 alunos)
        const { data: ultimosAlunos } = await supabase
          .from('alunos')
          .select('id, nome, curso, created_at')
          .order('created_at', { ascending: false })
          .limit(5)

        setStats(prev => ({
          ...prev,
          professores: profCount || 0,
          defesas: defesasCount || 0,
          solicitacoes: solCount || 0
        }))

        if (ultimosAlunos) {
          setRecentes(ultimosAlunos.map(a => ({
            id: a.id,
            nome: a.nome,
            curso: a.curso,
            data: new Date(a.created_at).toLocaleDateString('pt-BR')
          })))
        }

      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  return (
    <div className="space-y-8">
      
      {/* --- CARDS SUPERIORES --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Solicitações */}
        <div className="bg-[#1F1F1F] rounded-lg p-6 border-l-4 border-[#C0A040] shadow-md transform transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-[#E6C850] text-lg font-semibold mb-2">Solicitações Pendentes</h3>
            <p className="text-[#AAAAAA] text-sm mb-4">Novos pedidos de defesa.</p>
            <div className="text-4xl font-extrabold text-[#E0E0E0] mb-4">
                {loading ? '-' : stats.solicitacoes}
            </div>
            <Link href="/alunos" className="inline-block bg-[#C0A040] text-black px-3 py-2 rounded font-semibold text-sm hover:bg-[#E6C850] transition-colors">
                Verificar Agora
            </Link>
        </div>

        {/* Card 2: Defesas */}
        <div className="bg-[#1F1F1F] rounded-lg p-6 border-l-4 border-[#C0A040] shadow-md transform transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-[#E6C850] text-lg font-semibold mb-2">Defesas Agendadas</h3>
            <p className="text-[#AAAAAA] text-sm mb-4">Total de defesas agendadas.</p>
            <div className="text-4xl font-extrabold text-[#E0E0E0] mb-4">
                {loading ? '-' : stats.defesas}
            </div>
            <Link href="/agenda" className="inline-block bg-[#C0A040] text-black px-3 py-2 rounded font-semibold text-sm hover:bg-[#E6C850] transition-colors">
                Verificar Agora
            </Link>
        </div>

        {/* Card 3: Documentos */}
        <div className="bg-[#1F1F1F] rounded-lg p-6 border-l-4 border-[#C0A040] shadow-md transform transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-[#E6C850] text-lg font-semibold mb-2">Documentos Gerados</h3>
            <p className="text-[#AAAAAA] text-sm mb-4">Total de atas e declarações.</p>
            <div className="text-4xl font-extrabold text-[#E0E0E0] mb-4">
                {stats.documentos}
            </div>
            <Link href="/documentos" className="inline-block bg-[#C0A040] text-black px-3 py-2 rounded font-semibold text-sm hover:bg-[#E6C850] transition-colors">
                Verificar Agora
            </Link>
        </div>

        {/* Card 4: Professores */}
        <div className="bg-[#1F1F1F] rounded-lg p-6 border-l-4 border-[#C0A040] shadow-md transform transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-[#E6C850] text-lg font-semibold mb-2">Gerenciar Professores</h3>
            <p className="text-[#AAAAAA] text-sm mb-4">Total de professores cadastrados.</p>
            <div className="text-4xl font-extrabold text-[#E0E0E0] mb-4">
                {loading ? '-' : stats.professores}
            </div>
            <Link href="/professores" className="inline-block bg-[#C0A040] text-black px-3 py-2 rounded font-semibold text-sm hover:bg-[#E6C850] transition-colors">
                Verificar Agora
            </Link>
        </div>
      </div>

      {/* --- GRÁFICO DE BARRAS --- */}
      <div className="bg-[#1F1F1F] p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">Volume de Defesas Realizadas por Mês (2025)</h2>
        <div className="h-80 w-full">
            <DefesasChart data={chartDataDefesas} labels={chartLabelsDefesas} />
        </div>
      </div>

      {/* --- ROW INFERIOR (GRÁFICO PIZZA + LISTA) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Gráfico de Pizza */}
        <div className="lg:col-span-2 bg-[#1F1F1F] p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">Status Geral dos Alunos no TCC</h2>
            <div className="flex flex-col md:flex-row items-center md:space-x-6 h-full">
                <div className="h-64 w-64 md:h-80 md:w-80 flex-shrink-0">
                    <StatusChart data={chartDataStatus} labels={chartLabelsStatus} colors={chartColorsStatus} />
                </div>
                {/* Legenda Manual */}
                <div className="mt-4 md:mt-0 space-y-2 text-sm text-[#AAAAAA] flex-1">
                    {chartLabelsStatus.map((label, i) => (
                        <div key={i} className="flex items-center">
                            <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: chartColorsStatus[i] }}></span>
                            {label} ({chartDataStatus[i]}%)
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Lista de Recentes */}
        <div className="lg:col-span-1 bg-[#1F1F1F] p-6 rounded-lg shadow-lg flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">Solicitações Pendentes</h2>
            
            <div className="space-y-3 flex-1 overflow-y-auto max-h-96 custom-scrollbar pr-2">
                {recentes.length === 0 ? (
                    <p className="text-center text-[#666] py-10">Nenhuma solicitação recente.</p>
                ) : (
                    recentes.map((sol) => (
                        <div key={sol.id} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#333] hover:border-[#C0A040] transition-colors">
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[#E0E0E0] truncate">{sol.nome}</p>
                                <p className="text-xs text-[#AAAAAA]">{sol.curso}</p>
                            </div>
                            <span className="text-xs text-[#AAAAAA] whitespace-nowrap ml-2">{sol.data}</span>
                        </div>
                    ))
                )}
            </div>

            <Link href="/alunos" className="mt-4 w-full block text-center py-2 text-[#E6C850] border border-[#E6C850] rounded-lg hover:bg-[#E6C850] hover:text-[#1F1F1F] transition-colors text-sm font-medium">
                Ver Todos
            </Link>
        </div>

      </div>
    </div>
  )
}