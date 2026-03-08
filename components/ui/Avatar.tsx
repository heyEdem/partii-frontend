import { cn } from '@/lib/utils'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

const SIZE_MAP: Record<AvatarSize, { outer: string; font: string }> = {
  xs: { outer: 'w-6 h-6', font: 'text-[10px]' },
  sm: { outer: 'w-8 h-8', font: 'text-xs' },
  md: { outer: 'w-10 h-10', font: 'text-sm' },
  lg: { outer: 'w-14 h-14', font: 'text-lg' },
  xl: { outer: 'w-20 h-20', font: 'text-2xl' },
}

interface AvatarProps {
  src?: string | null
  name: string
  size?: AvatarSize
  className?: string
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const { outer, font } = SIZE_MAP[size]

  return (
    <div
      className={cn('rounded-avatar overflow-hidden flex-shrink-0 ring-2 ring-bg-elevated', outer, className)}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full bg-avatar-gradient flex items-center justify-center">
          <span className={cn('font-semibold text-black leading-none', font)}>
            {getInitials(name)}
          </span>
        </div>
      )}
    </div>
  )
}

interface AvatarStackProps {
  users: Array<{ name: string; src?: string | null }>
  max?: number
  size?: AvatarSize
  className?: string
}

export function AvatarStack({ users, max = 4, size = 'sm', className }: AvatarStackProps) {
  const shown = users.slice(0, max)
  const overflow = users.length - max

  return (
    <div className={cn('flex items-center', className)}>
      {shown.map((user, i) => (
        <div key={i} style={{ marginLeft: i === 0 ? 0 : '-8px' }}>
          <Avatar src={user.src} name={user.name} size={size} />
        </div>
      ))}
      {overflow > 0 && (
        <div
          style={{ marginLeft: '-8px' }}
          className={cn(
            'rounded-avatar bg-bg-surface flex items-center justify-center ring-2 ring-bg-elevated flex-shrink-0',
            SIZE_MAP[size].outer,
          )}
        >
          <span className={cn('text-text-secondary font-medium', SIZE_MAP[size].font)}>
            +{overflow}
          </span>
        </div>
      )}
    </div>
  )
}
