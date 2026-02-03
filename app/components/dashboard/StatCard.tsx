import Link from 'next/link'
import { ArrowUpRight, LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  label: string
  icon: LucideIcon
  href: string
  loading?: boolean
}

export function StatCard({ title, value, label, icon: Icon, href, loading }: StatCardProps) {
  return (
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
        <div className="p-3 rounded-xl bg-[#121212] border border-[#333] group-hover:border-[#C0A040] group-hover:text-[#E6C850] transition-all">
           <ArrowUpRight size={18} className="text-[#666] group-hover:text-[#E6C850]" />
        </div>
      </div>
      
      <Icon 
        className="absolute -right-6 -bottom-6 text-[#C0A040]/5 group-hover:text-[#C0A040]/10 transition-colors duration-500" 
        size={120} 
        strokeWidth={1}
      />
    </Link>
  )
}