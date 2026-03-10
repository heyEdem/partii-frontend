'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { CheckCircle } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { InputField } from '@/components/ui/InputField'
import { authApi } from '@/lib/api/auth'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
})

type FormValues = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [sentEmail, setSentEmail] = useState('')
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setApiError('')
    try {
      await authApi.forgotPassword(data)
      setSentEmail(data.email)
      setSubmitted(true)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Failed to send reset link. Please try again.')
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-6 text-center py-8">
        <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center">
          <CheckCircle weight="thin" size={36} className="text-accent-primary" />
        </div>
        <div>
          <h1 className="text-h1 text-text-primary">Check your email</h1>
          <p className="text-body text-text-secondary mt-2">
            We sent a password reset link to{' '}
            <span className="text-text-primary font-medium">{sentEmail}</span>
          </p>
        </div>
        <Link href="/login">
          <VelvetButton variant="ghost">
            Back to sign in
          </VelvetButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h1 text-text-primary">Forgot password?</h1>
        <p className="text-body text-text-secondary mt-1">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        {apiError && (
          <p className="text-caption text-error text-center">{apiError}</p>
        )}

        <VelvetButton type="submit" variant="primary" loading={isSubmitting} className="w-full mt-1">
          Send reset link
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
