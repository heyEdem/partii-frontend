import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0–100
  size?: 'default' | 'hero'
  showLabel?: boolean
  className?: string
}

function getBarColor(value: number) {
  if (value > 75) return 'bg-success'
  if (value >= 25) return 'bg-warning'
  return 'bg-error'
}

export function ProgressBar({ value, size = 'default', showLabel = false, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value))
  const color = getBarColor(clamped)

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <p className="text-[12px] text-text-secondary text-right mb-1">{clamped}%</p>
      )}
      <div
        className={cn('w-full bg-bg-surface rounded-pill overflow-hidden', size === 'hero' ? 'h-3' : 'h-2')}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn('h-full rounded-pill transition-[width] duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]', color)}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
