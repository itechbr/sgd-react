interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  // Mapa de cores
  const styles: Record<string, string> = {
    'Ativo': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Permanente': 'bg-[#C0A040]/10 text-[#C0A040] border-[#C0A040]/20',
    'Realizada': 'bg-green-500/10 text-green-400 border-green-500/20',
    'Agendada': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'default': 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  }

  const dotColors: Record<string, string> = {
    'Ativo': 'bg-blue-400',
    'Permanente': 'bg-[#C0A040]',
    'Realizada': 'bg-green-400',
    'Agendada': 'bg-purple-400',
    'default': 'bg-gray-400'
  }

  const currentStyle = styles[status] || styles['default']
  const dotColor = dotColors[status] || dotColors['default']
  const textSize = size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`flex items-center gap-1.5 rounded-full font-medium border ${currentStyle} ${textSize}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
      {status}
    </span>
  )
}