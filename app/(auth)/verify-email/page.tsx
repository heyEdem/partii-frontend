'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { OtpInput } from '@/components/ui/OtpInput'
import { authApi } from '@/lib/api/auth'

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''

  const [otp, setOtp] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [countdown, setCountdown] = useState(60)
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  const handleVerify = useCallback(async () => {
    if (otp.length < 6) {
      setApiError('Please enter the full 6-digit code.')
      return
    }
    setApiError('')
    setIsSubmitting(true)
    try {
      await authApi.verifyEmail({ email, otp })
      router.push('/dashboard')
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Verification failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }, [email, otp, router])

  const handleResend = async () => {
    setIsResending(true)
    setApiError('')
    try {
      await authApi.resendOtp(email)
      setCountdown(60)
      setOtp('')
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Failed to resend code.')
    } finally {
      setIsResending(false)
    }
  }

  const formatCountdown = (s: number) => `0:${s.toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">✉️</span>
        </div>
        <h1 className="text-h1 text-text-primary">Check your email</h1>
        {email && (
          <p className="text-body text-text-secondary mt-2">
            We sent a 6-digit code to{' '}
            <span className="text-text-primary font-medium">{email}</span>
          </p>
        )}
      </div>

      {/* OTP input */}
      <OtpInput value={otp} onChange={setOtp} />

      {apiError && (
        <p className="text-caption text-error text-center">{apiError}</p>
      )}

      {/* Verify button */}
      <VelvetButton
        variant="primary"
        loading={isSubmitting}
        disabled={otp.length < 6}
        className="w-full"
        onClick={handleVerify}
      >
        Verify Email
      </VelvetButton>

      {/* Resend */}
      <div className="text-center">
        {countdown > 0 ? (
          <p className="text-caption text-text-secondary">
            Resend in{' '}
            <span className="text-text-primary font-medium">{formatCountdown(countdown)}</span>
          </p>
        ) : (
          <VelvetButton
            variant="ghost"
            loading={isResending}
            onClick={handleResend}
            className="text-caption"
          >
            Resend code
          </VelvetButton>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
