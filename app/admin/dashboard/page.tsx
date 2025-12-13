import Link from 'next/link'
import { FileText, Calendar, Users, ClipboardList } from 'lucide-react'

export default function DashboardPage() {
  // Dados simulados para validar o visual (migrados do dashboard.js)
  const stats = [
    { label: 'Solicitações Pendentes', value: 5, icon: ClipboardList, color: 'text-sgd-gold', desc: 'Novos pedidos de defesa.' },
    { label: 'Defesas Agendadas', value: 2, icon: Calendar, color: 'text-blue-400', desc: 'Total de defesas agendadas.' },
    { label: 'Documentos Gerados', value: 42, icon: FileText, color: 'text-green-400', desc: 'Total de atas e declarações.' },
    { label: 'Professores', value: 12, icon: Users, color: 'text-purple-400', desc: 'Total de cadastrados.' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E0E0E0] mb-6">Visão Geral</h2>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#1F1F1F] rounded-lg p-6 border-l-4 border-[#C0A040] shadow-md hover:-translate-y-1 transition-transform">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#E6C850] text-lg font-semibold mb-2">{stat.label}</h3>
                <p className="text-[#AAAAAA] text-sm mb-4">{stat.desc}</p>
              </div>
              <stat.icon className={`w-6 h-6 ${stat.color} opacity-80`} />
            </div>
            <div className="text-4xl font-extrabold text-[#E0E0E0]">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Área dos Gráficos (Placeholder por enquanto) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Gráfico Principal */}
        <div className="lg:col-span-2 bg-[#1F1F1F] p-6 rounded-lg shadow-lg border border-[#333333]">
          <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">Volume de Defesas (2025)</h2>
          <div className="h-64 flex items-center justify-center bg-black/20 rounded border border-dashed border-[#444]">
            <span className="text-[#666]">Gráfico será implementado na Fase IV</span>
          </div>
        </div>

        {/* Lista Lateral */}
        <div className="lg:col-span-1 bg-[#1F1F1F] p-6 rounded-lg shadow-lg border border-[#333333]">
          <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">Solicitações Recentes</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-[#121212] rounded-lg border border-[#333] hover:border-[#C0A040] transition-colors">
                <div>
                  <p className="text-sm font-medium text-[#E0E0E0]">Aluno Exemplo {i}</p>
                  <p className="text-xs text-[#AAAAAA]">Engenharia de Software</p>
                </div>
                <span className="text-xs text-[#AAAAAA]">{i}d atrás</span>
              </div>
            ))}
          </div>
          <Link 
            href="/solicitacoes" 
            className="block mt-4 w-full text-center py-2 text-[#E6C850] border border-[#E6C850] rounded-lg hover:bg-[#E6C850] hover:text-[#1F1F1F] transition-colors text-sm font-medium"
          >
            Ver Todos
          </Link>
        </div>
      </div>
    </div>
  )
}