'use client'
import { useToast } from '@/lib/hooks/useToast'
import { CheckCircle, WarningCircle, XCircle, Info, X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

const TYPE_CONFIG = {
  success: { bar: 'bg-success', icon: CheckCircle, iconColor: 'text-success' },
  error: { bar: 'bg-error', icon: XCircle, iconColor: 'text-error' },
  warning: { bar: 'bg-warning', icon: WarningCircle, iconColor: 'text-warning' },
  info: { bar: 'bg-accent-primary', icon: Info, iconColor: 'text-accent-primary' },
}

export function ToastContainer() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div
      className="fixed bottom-6 right-4 md:right-6 z-50 flex flex-col gap-2 items-end md:items-end"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((t) => {
        const { bar, icon: Icon, iconColor } = TYPE_CONFIG[t.type]
        return (
          <div
            key={t.id}
            className="flex items-start bg-bg-elevated min-w-[280px] max-w-[360px] rounded-button shadow-lg overflow-hidden animate-slide-in-right"
            role="alert"
          >
            <div className={cn('w-1 self-stretch flex-shrink-0', bar)} aria-hidden="true" />
            <div className="flex items-start gap-3 px-4 py-3 flex-1">
              <Icon size={18} className={cn('mt-0.5 flex-shrink-0', iconColor)} weight="fill" aria-hidden="true" />
              <p className="text-[14px] text-text-primary flex-1">{t.message}</p>
              <button
                onClick={() => dismiss(t.id)}
                className="text-text-secondary hover:text-text-primary transition-colors ml-2 flex-shrink-0"
                aria-label="Dismiss"
              >
                <X size={16} weight="thin" />
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
