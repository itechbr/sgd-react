import { ReactNode } from 'react'
import { MoreHorizontal } from 'lucide-react'

interface ChartCardProps {
  title: string
  children: ReactNode
  action?: ReactNode // Botão opcional no topo direito
  className?: string
}

export function ChartCard({ title, children, action, className = "" }: ChartCardProps) {
  return (
    <div className={`bg-[#1F1F1F] p-6 rounded-2xl border border-[#333] shadow-lg flex flex-col ${className}`}>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#E0E0E0]">{title}</h2>
            {action ? action : (
                <button className="text-[#666] hover:text-[#C0A040] transition-colors">
                    <MoreHorizontal size={20}/>
                </button>
            )}
        </div>
        {children}
    </div>
  )
}