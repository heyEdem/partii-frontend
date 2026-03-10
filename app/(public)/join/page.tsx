'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LinkSimple, ArrowLeft } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { InputField } from '@/components/ui/InputField'
import { eventsApi } from '@/lib/api/events'

export default function JoinByCodePage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = code.trim()
    if (!trimmed) {
      setError('Please enter an invite code.')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      const event = await eventsApi.getByCode(trimmed)
      router.push(`/events/${event.id}`)
    } catch (err: unknown) {
      const typed = err as { message?: string }
      setError(typed?.message ?? 'Event not found. Check the code and try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-caption text-text-secondary hover:text-text-primary transition-colors mb-8"
      >
        <ArrowLeft weight="thin" size={16} />
        Back to events
      </Link>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-accent-primary/20 flex items-center justify-center mx-auto mb-4">
          <LinkSimple weight="thin" size={32} className="text-accent-primary" />
        </div>
        <h1 className="text-h1 text-text-primary">Join with Code</h1>
        <p className="text-body text-text-secondary mt-2">
          Enter the private invite code to find your event.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Invite Code"
          type="text"
          placeholder="e.g. abc123xyz"
          value={code}
          onChange={(e) => {
            setCode(e.target.value)
            setError('')
          }}
          error={error}
          autoFocus
        />

        <VelvetButton type="submit" variant="primary" loading={isLoading} className="w-full mt-2">
          Find Event
        </VelvetButton>
      </form>
    </div>
  )
}
