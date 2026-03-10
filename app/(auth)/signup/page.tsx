'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeSlash, GoogleLogo, GithubLogo } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { InputField } from '@/components/ui/InputField'
import { authApi } from '@/lib/api/auth'

const schema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),
  dob: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const date = new Date(val)
      if (isNaN(date.getTime())) return false
      const today = new Date()
      const age = today.getFullYear() - date.getFullYear()
      const hasBirthdayPassed =
        today.getMonth() > date.getMonth() ||
        (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate())
      return age > 18 || (age === 18 && hasBirthdayPassed)
    }, 'You must be at least 18 years old to use Partii'),
})

type FormValues = z.infer<typeof schema>

export default function SignupPage() {
  const router = useRouter()
  const [apiError, setApiError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setApiError('')
    try {
      const res = await authApi.signup(data)
      await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }),
      })
      router.push(`/verify-email?email=${encodeURIComponent(data.email)}`)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Sign up failed. Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h1 text-text-primary">Create your account</h1>
        <p className="text-body text-text-secondary mt-1">Join Partii today</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <InputField
          label="Display Name"
          type="text"
          placeholder="How you'll appear to others"
          autoComplete="nickname"
          error={errors.displayName?.message}
          {...register('displayName')}
        />
        <InputField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password with show/hide */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-text-secondary">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min 8 characters"
              autoComplete="new-password"
              className={`w-full h-12 px-4 pr-12 bg-bg-surface border rounded-input text-body text-text-primary placeholder:text-text-secondary transition-all outline-none focus:shadow-lavender-ring ${
                errors.password
                  ? 'border-error focus:border-error focus:shadow-none'
                  : 'border-border focus:border-accent-primary'
              }`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <EyeSlash weight="thin" size={20} />
              ) : (
                <Eye weight="thin" size={20} />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-[12px] text-error">{errors.password.message}</p>
          )}
        </div>

        <InputField
          label="Date of Birth"
          type="date"
          error={errors.dob?.message}
          {...register('dob')}
        />

        {apiError && (
          <p className="text-caption text-error text-center">{apiError}</p>
        )}

        <VelvetButton type="submit" variant="primary" loading={isSubmitting} className="w-full mt-1">
          Create Account
        </VelvetButton>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-border" />
        <span className="text-caption text-text-secondary">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* OAuth */}
      <div className="flex flex-col gap-3">
        <a href={`${process.env.NEXT_PUBLIC_API_URL ?? ''}/oauth2/authorization/google`}>
          <VelvetButton variant="ghost" className="w-full border border-border text-text-primary">
            <GoogleLogo weight="thin" size={20} />
            Continue with Google
          </VelvetButton>
        </a>
        <a href={`${process.env.NEXT_PUBLIC_API_URL ?? ''}/oauth2/authorization/github`}>
          <VelvetButton variant="ghost" className="w-full border border-border text-text-primary">
            <GithubLogo weight="thin" size={20} />
            Continue with GitHub
          </VelvetButton>
        </a>
      </div>

      {/* Footer link */}
      <p className="text-caption text-text-secondary text-center">
        Already have an account?{' '}
        <Link href="/login" className="text-accent-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}
