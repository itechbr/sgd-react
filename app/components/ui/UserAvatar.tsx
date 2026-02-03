interface UserAvatarProps {
  name: string
  className?: string
}

export function UserAvatar({ name, className = "w-10 h-10" }: UserAvatarProps) {
  // Codifica o nome para URL
  const encodedName = encodeURIComponent(name || 'User')
  const src = `https://ui-avatars.com/api/?name=${encodedName}&background=181818&color=C0A040&bold=true`

  return (
    <img 
      src={src} 
      alt={name}
      className={`rounded-full border border-[#333] object-cover ${className}`}
    />
  )
}