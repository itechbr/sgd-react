'use client'

import { useEffect, useState } from 'react'
import { DashboardService, DashboardStats, SolicitacaoRecente } from '@/app/services/dashboardService'
import { DefesasChart, StatusChart } from '@/app/components/dashboard/DashboardCharts'
import Link from 'next/link'
import { 
  Users, 
  CalendarClock, 
  FileText, 
  GraduationCap, 
  ArrowUpRight, 
  MoreHorizontal 
} from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    solicitacoes: 0,
    defesas: 0,
    documentos: 0,
    professores: 0
  })
  
  const [recentes, setRecentes] = useState<SolicitacaoRecente[]>([])
  const [loading, setLoading] = useState(true)

  // Estados dos gráficos
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

        setStats(statsData)
        setRecentes(recentData)
        setChartDataDefesas(defesasMes)
        setChartDataStatus(statusAlunos)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const totalAlunos = chartDataStatus.reduce((acc, val) => acc + val, 0) || 1

  // Componente de Card Reutilizável com Efeito Premium
  const StatCard = ({ title, value, label, icon: Icon, href, color }: any) => (
    <Link href={href} className="group relative overflow-hidden rounded-2xl bg-[#1F1F1F] p-6 border border-[#333] transition-all duration-300 hover:border-[#C0A040]/50 hover:shadow-[0_0_20px_rgba(192,160,64,0.15)] hover:-translate-y-1">
      <div className="relative z-10 flex justify-between items-start">
        <div>
          <p className="text-[#AAAAAA] text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-[#E0E0E0] mt-2 group-hover:text-[#E6C850] transition-colors">
            {loading ? <span className="animate-pulse">...</span> : value}
          </h3>
          <p className="text-xs text-[#666] mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C0A040]"></span>
            {label}
          </p>
        </div>
        <div className={`p-3 rounded-xl bg-[#121212] border border-[#333] group-hover:border-[#C0A040] group-hover:text-[#E6C850] transition-all`}>
           <ArrowUpRight size={18} className="text-[#666] group-hover:text-[#E6C850]" />
        </div>
      </div>
      
      {/* Ícone de Fundo Decorativo */}
      <Icon 
        className="absolute -right-6 -bottom-6 text-[#C0A040]/5 group-hover:text-[#C0A040]/10 transition-colors duration-500" 
        size={120} 
        strokeWidth={1}
      />
    </Link>
  )

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* --- HEADER DA PÁGINA --- */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-[#E0E0E0]">Visão Geral</h1>
          <p className="text-[#AAAAAA] text-sm mt-1">Bem-vindo ao painel de controle do SGD.</p>
        </div>
        <div className="text-right hidden sm:block">
           <span className="text-xs text-[#666] border border-[#333] px-3 py-1 rounded-full bg-[#1F1F1F]">
             Ano Letivo: 2025
           </span>
        </div>
      </div>

      {/* --- CARDS METRICS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Alunos Ativos" 
          value={stats.solicitacoes} 
          label="Em orientação"
          icon={Users} 
          href="/alunos"
        />
        <StatCard 
          title="Defesas Agendadas" 
          value={stats.defesas} 
          label="Próximos 30 dias"
          icon={CalendarClock} 
          href="/agenda"
        />
        <StatCard 
          title="Documentos" 
          value={stats.documentos} 
          label="Gerados em 2025"
          icon={FileText} 
          href="/documentos"
        />
        <StatCard 
          title="Professores" 
          value={stats.professores} 
          label="Corpo docente"
          icon={GraduationCap} 
          href="/professores"
        />
      </div>

      {/* --- GRÁFICOS E LISTA --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA: Gráficos */}
        <div className="lg:col-span-2 space-y-6">
             
             {/* Gráfico de Barras */}
             <div className="bg-[#1F1F1F] p-6 rounded-2xl border border-[#333] shadow-lg relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-[#E0E0E0]">Defesas Realizadas</h2>
                    <button className="text-[#666] hover:text-[#C0A040]"><MoreHorizontal size={20}/></button>
                </div>
                <div className="h-72 w-full">
                    {!loading && <DefesasChart data={chartDataDefesas} labels={chartLabelsDefesas} />}
                </div>
            </div>

            {/* Gráfico de Pizza + Legenda Estilizada */}
            <div className="bg-[#1F1F1F] p-6 rounded-2xl border border-[#333] shadow-lg">
                <h2 className="text-lg font-semibold text-[#E0E0E0] mb-6">Status dos Alunos</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="h-56 aspect-square relative mx-auto">
                       {!loading && <StatusChart data={chartDataStatus} labels={chartLabelsStatus} colors={chartColorsStatus} />}
                       {/* Total no Centro do Donut */}
                       <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-3xl font-bold text-[#E0E0E0]">{totalAlunos}</span>
                          <span className="text-xs text-[#666] uppercase tracking-wider">Total</span>
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                        {chartLabelsStatus.map((label, i) => {
                            const percent = ((chartDataStatus[i] || 0) / totalAlunos * 100).toFixed(0)
                            return (
                                <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-[#2A2A2A] transition-colors group cursor-default">
                                    <div className="flex items-center gap-3">
                                        <span className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px]" style={{ backgroundColor: chartColorsStatus[i], boxShadow: `0 0 8px ${chartColorsStatus[i]}` }}></span>
                                        <span className="text-sm text-[#CCCCCC] group-hover:text-white transition-colors">{label}</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-sm font-bold text-[#E0E0E0]">{chartDataStatus[i]}</span>
                                        <span className="text-[10px] text-[#666]">{percent}%</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>

        {/* COLUNA DIREITA: Lista Recentes */}
        <div className="lg:col-span-1 bg-[#1F1F1F] p-6 rounded-2xl border border-[#333] shadow-lg flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-[#E0E0E0]">Novos Alunos</h2>
                <Link href="/alunos" className="text-xs text-[#C0A040] hover:underline">Ver todos</Link>
            </div>
            
            <div className="space-y-4 flex-1 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
                {loading ? (
                   <div className="space-y-4">
                      {[1,2,3].map(i => <div key={i} className="h-16 bg-[#2A2A2A] rounded-xl animate-pulse"/>)}
                   </div>
                ) : recentes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[#666]">
                        <Users size={32} className="mb-2 opacity-50"/>
                        <p className="text-sm">Nenhuma atividade recente.</p>
                    </div>
                ) : (
                    recentes.map((sol) => (
                        <div key={sol.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#2A2A2A] border border-transparent hover:border-[#333] transition-all group">
                            {/* Avatar Gerado Automaticamente */}
                            <img 
                                src={`https://ui-avatars.com/api/?name=${sol.nome.replace(' ', '+')}&background=181818&color=C0A040&bold=true`} 
                                alt={sol.nome}
                                className="w-10 h-10 rounded-full border border-[#333] group-hover:border-[#C0A040] transition-colors"
                            />
                            
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#E0E0E0] truncate group-hover:text-[#E6C850] transition-colors">
                                    {sol.nome}
                                </p>
                                <p className="text-xs text-[#888] truncate">{sol.curso}</p>
                            </div>
                            
                            <div className="text-right flex flex-col items-end gap-1">
                                <span className="text-[10px] text-[#666] whitespace-nowrap">{sol.data}</span>
                                <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                                    sol.status === 'Ativo' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 
                                    'bg-gray-500/10 text-gray-400 border-gray-500/20'
                                }`}>
                                  <span className={`w-1 h-1 rounded-full ${sol.status === 'Ativo' ? 'bg-blue-400' : 'bg-gray-400'}`}></span>
                                  {sol.status}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            <button className="w-full mt-4 py-3 rounded-xl border border-dashed border-[#333] text-[#666] text-sm hover:border-[#C0A040] hover:text-[#C0A040] transition-all flex items-center justify-center gap-2">
                <Users size={16} />
                Gerenciar Solicitações
            </button>
        </div>

      </div>
    </div>
  )
}