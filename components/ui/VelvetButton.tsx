import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type ButtonSize = 'default' | 'sm'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-accent-action text-black font-semibold hover:shadow-orange-glow hover:-translate-y-px',
  secondary:
    'bg-transparent text-accent-primary border border-accent-primary hover:bg-accent-primary/15',
  ghost:
    'bg-transparent text-accent-primary hover:bg-accent-primary/10',
  destructive:
    'bg-error text-white hover:opacity-90',
}

export const VelvetButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', loading, disabled, className, children, ...props }, ref) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2 font-medium rounded-button transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary/50',
          // Size
          size === 'default' ? 'h-12 px-6 text-body-medium md:h-11' : 'h-8 px-3.5 text-caption rounded-sm',
          // Variant
          variantStyles[variant],
          // Disabled
          isDisabled && 'opacity-40 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
        )}
        {children}
      </button>
    )
  },
)

VelvetButton.displayName = 'VelvetButton'
