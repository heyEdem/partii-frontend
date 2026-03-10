'use client'

import { VelvetButton } from '@/components/ui/VelvetButton'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-error">!</span>
        </div>
        <h1 className="text-h1 text-text-primary mb-2">Something went wrong</h1>
        <p className="text-body text-text-secondary mb-8">
          {error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <VelvetButton variant="primary" onClick={reset}>
          Try Again
        </VelvetButton>
      </div>
    </div>
  )
}
