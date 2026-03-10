'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GoogleLogo, GithubLogo } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { InputField } from '@/components/ui/InputField'
import { authApi } from '@/lib/api/auth'

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormValues) => {
    setApiError('')
    try {
      const res = await authApi.login(data)
      await fetch('/api/auth/set-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }),
      })
      router.push('/dashboard')
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Sign in failed. Please try again.')
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-h1 text-text-primary">Sign in to Partii</h1>
        <p className="text-body text-text-secondary mt-1">Welcome back</p>
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
        <InputField
          label="Password"
          type="password"
          placeholder="Your password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Forgot password */}
        <div className="flex justify-end -mt-1">
          <Link href="/forgot-password" className="text-caption text-accent-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {apiError && (
          <p className="text-caption text-error text-center">{apiError}</p>
        )}

        <VelvetButton type="submit" variant="primary" loading={isSubmitting} className="w-full mt-1">
          Sign in
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
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-accent-primary hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}
