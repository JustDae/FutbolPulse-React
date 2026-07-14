import { Avatar, AvatarImage, AvatarFallback } from '@/presentation/components/ui/avatar'
import { cn } from '@/presentation/utils/cn'

interface AvatarUser {
  nombre_completo?: string
  username?: string
  avatar_url?: string
  avatarUrl?: string
  foto_perfil?: string
  firstName?: string
  lastName?: string
}

interface UserAvatarProps {
  user: AvatarUser | null
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<UserAvatarProps['size']>, string> = {
  sm: 'h-9 w-9 text-sm',
  md: 'h-10 w-10 text-sm',
  lg: 'h-20 w-20 text-2xl',
}

function getInitials(user: AvatarUser): string {
  if (user.nombre_completo) {
    const parts = user.nombre_completo.split(' ').filter(Boolean)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return user.nombre_completo.slice(0, 2).toUpperCase()
  }

  const first = user.firstName?.trim()
  const last = user.lastName?.trim()

  if (first && last) return `${first[0]}${last[0]}`.toUpperCase()
  if (first) return first[0].toUpperCase()
  if (user.username) return user.username.slice(0, 2).toUpperCase()
  return 'US'
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const avatarUrl = user?.foto_perfil || user?.avatar_url || user?.avatarUrl

  return (
    <Avatar className={cn(sizeClasses[size])}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={`Avatar`} />}
      <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
        {user ? getInitials(user) : '?'}
      </AvatarFallback>
    </Avatar>
  )
}
