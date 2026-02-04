'use client'

import { useEffect, useState } from 'react'
import { DashboardService, DashboardStats, SolicitacaoRecente } from '@/app/services/dashboardService'
import { DefesasChart, StatusChart } from '@/app/components/dashboard/DashboardCharts'
import { StatCard } from '@/app/components/dashboard/StatCard' 
import { StatusBadge } from '@/app/components/ui/StatusBadge' 
import { UserAvatar } from '@/app/components/ui/UserAvatar' 
import { ChartCard } from '@/app/components/ui/ChartCard' 
import Link from 'next/link'
import { Users, CalendarClock, FileText, GraduationCap } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    solicitacoes: 0, defesas: 0, documentos: 0, professores: 0
  })
  const [recentes, setRecentes] = useState<SolicitacaoRecente[]>([])
  const [loading, setLoading] = useState(true)
  const [chartDataDefesas, setChartDataDefesas] = useState<number[]>([])
  const [chartDataStatus, setChartDataStatus] = useState<number[]>([])

  const chartLabelsDefesas = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const chartLabelsStatus = ['Ativo', 'Qualificado', 'Defendido', 'Outros']
  const chartColorsStatus = ['#3B82F6', '#E6C850', '#22C55E', '#EF4444']

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, recentData, defesasMes, statusAlunos] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getRecentRequests(),
          DashboardService.getDefesasPorMes(),
          DashboardService.getStatusAlunos()
        ])
        setStats(statsData); setRecentes(recentData);
        setChartDataDefesas(defesasMes); setChartDataStatus(statusAlunos);
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalAlunos = chartDataStatus.reduce((acc, val) => acc + val, 0) || 1

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#E0E0E0]">Visão Geral</h1>
          <p className="text-[#AAAAAA] text-sm mt-1">Bem-vindo ao painel de controle do SGD.</p>
        </div>
      </div>

      {/* CARDS METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Alunos Ativos" value={stats.solicitacoes} label="Em orientação" icon={Users} href="/alunos" loading={loading} />
        <StatCard title="Defesas Agendadas" value={stats.defesas} label="Próximos 30 dias" icon={CalendarClock} href="/agenda" loading={loading} />
        <StatCard title="Documentos" value={stats.documentos} label="Gerados em 2025" icon={FileText} href="/documentos" loading={loading} />
        <StatCard title="Professores" value={stats.professores} label="Corpo docente" icon={GraduationCap} href="/professores" loading={loading} />
      </div>

      {/* GRÁFICOS E LISTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
             {/* Gráfico Barras */}
             <ChartCard title="Defesas Realizadas">
                <div className="h-72 w-full">
                    {!loading && <DefesasChart data={chartDataDefesas} labels={chartLabelsDefesas} />}
                </div>
            </ChartCard>

            {/* Gráfico Pizza */}
            <ChartCard title="Status dos Alunos">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-71 aspect-square relative mx-auto">
                       {!loading && <StatusChart data={chartDataStatus} labels={chartLabelsStatus} colors={chartColorsStatus} />}
                       <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-bold text-[#E0E0E0]">{totalAlunos}</span>
                          <span className="text-xs text-[#666] uppercase tracking-wider">Total</span>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                        {chartLabelsStatus.map((label, i) => (
                            <div key={i} className="flex items-center justify-between p-1 rounded-lg hover:bg-[#2A2A2A] transition-colors group cursor-default">
                                <div className="flex items-center gap-3">
                                    <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: chartColorsStatus[i], boxShadow: `0 0 8px ${chartColorsStatus[i]}` }}></span>
                                    <span className="text-sm text-[#CCCCCC] group-hover:text-white transition-colors">{label}</span>
                                </div>
                                <div className="text-right">
                                    <span className="block text-sm text-[15px] font-bold text-[#E0E0E0]">{chartDataStatus[i]}</span>
                                    <span className="text-[15px] text-[#666]">{((chartDataStatus[i] || 0) / totalAlunos * 100).toFixed(0)}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ChartCard>
        </div>

        {/* Lista Recentes */}
        <ChartCard 
            title="Novos Alunos" 
            className="lg:col-span-1 h-full"
            action={<Link href="/alunos" className="text-xs text-[#C0A040] hover:underline">Ver todos</Link>}
        >
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                {loading ? (
                   <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-16 bg-[#2A2A2A] rounded-xl animate-pulse"/>)}</div>
                ) : recentes.length === 0 ? (
                    <p className="text-center text-[#666] py-10">Nenhuma atividade recente.</p>
                ) : (
                    recentes.map((sol) => (
                        <div key={sol.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#2A2A2A] border border-transparent hover:border-[#333] transition-all group">
                            <UserAvatar name={sol.nome} className="group-hover:border-[#C0A040] transition-colors" />
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#E0E0E0] truncate group-hover:text-[#E6C850] transition-colors">{sol.nome}</p>
                                <p className="text-xs text-[#888] truncate">{sol.curso}</p>
                            </div>
                            
                            <div className="text-right flex flex-col items-end gap-1">
                                <span className="text-[10px] text-[#666] whitespace-nowrap">{sol.data}</span>
                                <StatusBadge status={sol.status} />
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {/* LINK PARA GERENCIAR ALUNOS */}
            <Link 
                href="/alunos" 
                className="w-full mt-4 py-3 rounded-xl border border-dashed border-[#333] text-[#666] text-sm hover:border-[#C0A040] hover:text-[#C0A040] hover:bg-[#C0A040]/5 transition-all flex items-center justify-center gap-2"
            >
                <Users size={16} /> 
                Gerenciar Solicitações
            </Link>
        </ChartCard>

      </div>
    </div>
  )
}