'use client'
import { useEffect, useCallback, ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useIsDesktop } from '@/lib/hooks/useMediaQuery'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, children, className }: DialogProps) {
  const isDesktop = useIsDesktop()

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, handleKey])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'fixed z-50 bg-bg-elevated overflow-y-auto',
          isDesktop
            ? // Desktop: centered modal
              'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[480px] max-h-[80vh] rounded-modal p-8'
            : // Mobile: bottom sheet
              'bottom-0 left-0 right-0 max-h-[90vh] rounded-t-modal p-6 animate-slide-in-up',
          className,
        )}
      >
        {/* Drag handle (mobile only) */}
        {!isDesktop && (
          <div className="w-8 h-1 bg-border rounded-full mx-auto mb-6" aria-hidden="true" />
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {title && <h2 className="text-h1 text-text-primary">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto text-text-secondary hover:text-text-primary transition-colors p-1"
            aria-label="Close"
          >
            <X size={20} weight="thin" />
          </button>
        </div>

        {children}
      </div>
    </>
  )
}
