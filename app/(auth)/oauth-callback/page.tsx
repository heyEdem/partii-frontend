'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { VelvetButton } from '@/components/ui/VelvetButton'

function OAuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState('')

  useEffect(() => {
    const accessToken = searchParams.get('access_token')
    const refreshToken = searchParams.get('refresh_token')

    if (!accessToken || !refreshToken) {
      setError('Authentication failed: tokens missing. Please try signing in again.')
      return
    }

    fetch('/api/auth/set-tokens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken, refreshToken }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to store tokens')
        router.push('/dashboard')
      })
      .catch((err: unknown) => {
        const e = err as { message?: string }
        setError(e?.message ?? 'Authentication failed. Please try again.')
      })
  }, [searchParams, router])

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-8">
        <div className="w-16 h-16 rounded-full bg-error/20 flex items-center justify-center">
          <span className="text-2xl text-error">!</span>
        </div>
        <div>
          <h1 className="text-h1 text-text-primary">Authentication Failed</h1>
          <p className="text-body text-error mt-2">{error}</p>
        </div>
        <Link href="/login">
          <VelvetButton variant="secondary">Back to sign in</VelvetButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center py-8">
      <span
        className="w-12 h-12 rounded-full border-2 border-accent-primary border-t-transparent animate-spin"
        aria-label="Loading"
      />
      <div>
        <h1 className="text-h1 text-text-primary">Signing you in&hellip;</h1>
        <p className="text-body text-text-secondary mt-1">Please wait a moment.</p>
      </div>
    </div>
  )
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  )
}
