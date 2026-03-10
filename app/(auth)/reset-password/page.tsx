'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import Link from 'next/link'
import { CheckCircle, Eye, EyeSlash } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { authApi } from '@/lib/api/auth'

const schema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FormValues = z.infer<typeof schema>

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token') ?? ''

  const [success, setSuccess] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => router.push('/login'), 2000)
      return () => clearTimeout(timer)
    }
  }, [success, router])

  const onSubmit = async (data: FormValues) => {
    if (!token) {
      setApiError('Reset token is missing. Please use the link from your email.')
      return
    }
    setApiError('')
    try {
      await authApi.resetPassword({ token, newPassword: data.newPassword })
      setSuccess(true)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Failed to reset password. Please try again.')
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-8">
        <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
          <CheckCircle weight="thin" size={36} className="text-accent-primary" />
        </div>
        <div>
          <h1 className="text-h1 text-text-primary">Password updated!</h1>
          <p className="text-body text-text-secondary mt-2">
            Redirecting you to sign in&hellip;
          </p>
        </div>
        <Link href="/login">
          <VelvetButton variant="ghost">Go to sign in</VelvetButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h1 text-text-primary">Reset your password</h1>
        <p className="text-body text-text-secondary mt-1">
          Choose a strong new password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* New password */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-text-secondary">New Password</label>
          <div className="relative">
            <input
              type={showNew ? 'text' : 'password'}
              placeholder="Min 8 characters"
              autoComplete="new-password"
              className={`w-full h-12 px-4 pr-12 bg-bg-surface border rounded-input text-body text-text-primary placeholder:text-text-secondary transition-all outline-none focus:shadow-lavender-ring ${
                errors.newPassword
                  ? 'border-error focus:border-error focus:shadow-none'
                  : 'border-border focus:border-accent-primary'
              }`}
              {...register('newPassword')}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={showNew ? 'Hide password' : 'Show password'}
            >
              {showNew ? <EyeSlash weight="thin" size={20} /> : <Eye weight="thin" size={20} />}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-[12px] text-error">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-text-secondary">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className={`w-full h-12 px-4 pr-12 bg-bg-surface border rounded-input text-body text-text-primary placeholder:text-text-secondary transition-all outline-none focus:shadow-lavender-ring ${
                errors.confirmPassword
                  ? 'border-error focus:border-error focus:shadow-none'
                  : 'border-border focus:border-accent-primary'
              }`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? <EyeSlash weight="thin" size={20} /> : <Eye weight="thin" size={20} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-[12px] text-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        {apiError && (
          <p className="text-caption text-error text-center">{apiError}</p>
        )}

        <VelvetButton type="submit" variant="primary" loading={isSubmitting} className="w-full mt-1">
          Reset Password
        </VelvetButton>
      </form>

      <div className="text-center">
        <Link href="/login" className="text-caption text-text-secondary hover:text-text-primary transition-colors">
          ← Back to sign in
        </Link>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12">
          <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
