'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  ArrowLeft,
  ShareNetwork,
  Wallet,
} from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { StatusPill } from '@/components/ui/StatusPill'
import { Avatar } from '@/components/ui/Avatar'
import { eventsApi } from '@/lib/api/events'
import { useAuth } from '@/lib/hooks/useAuth'
import type { EventResponse } from '@/types'

function formatEventDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatEventTime(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function formatBudget(budget: string | null, currency: string | null) {
  if (!budget) return null
  const num = parseFloat(budget)
  const sym = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency ?? ''
  return `${sym}${num.toFixed(2)}`
}

function timeUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff < 0) return null
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days > 1) return `${days} days away`
  const hours = Math.floor(diff / (1000 * 60 * 60))
  if (hours > 1) return `${hours} hours away`
  return 'Starting soon'
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  const [event, setEvent] = useState<EventResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [joinMessage, setJoinMessage] = useState('')

  const eventId = Number(params.id)

  useEffect(() => {
    if (!eventId || isNaN(eventId)) {
      setError('Invalid event ID.')
      setIsLoading(false)
      return
    }

    eventsApi
      .getById(eventId)
      .then(setEvent)
      .catch((err: unknown) => {
        const e = err as { message?: string }
        setError(e?.message ?? 'Event not found.')
      })
      .finally(() => setIsLoading(false))
  }, [eventId])

  const handleJoin = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`)
      return
    }

    setIsJoining(true)
    setJoinMessage('')
    try {
      const attendee = await eventsApi.requestToJoin(eventId)
      setJoinMessage(
        attendee.status === 'APPROVED'
          ? "You're in! See you there."
          : 'Request sent! Waiting for organizer approval.',
      )
    } catch (err: unknown) {
      const e = err as { message?: string }
      setJoinMessage(e?.message ?? 'Failed to join event.')
    } finally {
      setIsJoining(false)
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: event?.title, url })
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="max-w-content mx-auto px-4 md:px-8 py-12 text-center">
        <h1 className="text-h1 text-text-primary mb-2">Event not found</h1>
        <p className="text-body text-text-secondary mb-6">{error}</p>
        <Link href="/">
          <VelvetButton variant="secondary">
            <ArrowLeft weight="thin" size={18} />
            Back to events
          </VelvetButton>
        </Link>
      </div>
    )
  }

  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
  const isFull = event.status === 'FULL' || (spotsLeft !== null && spotsLeft <= 0)
  const isPast = event.status === 'PAST' || event.status === 'CANCELLED'
  const countdown = timeUntil(event.eventDate)
  const budget = formatBudget(event.estimatedBudget, event.currency)

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-caption text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft weight="thin" size={16} />
        Back to events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Banner */}
          <div className="relative aspect-video rounded-card overflow-hidden">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-bg-surface flex items-center justify-center">
                <span className="text-text-secondary text-body">No image</span>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <StatusPill status={event.status} />
            </div>
          </div>

          {/* Title & organizer */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-display text-text-primary">{event.title}</h1>
              <button
                onClick={handleShare}
                className="flex-shrink-0 w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Share event"
              >
                <ShareNetwork weight="thin" size={20} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Avatar name={event.organizerDisplayName} size="xs" />
              <span className="text-caption text-text-secondary">
                Hosted by{' '}
                <span className="text-text-primary font-medium">{event.organizerDisplayName}</span>
              </span>
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h2 className="text-h3 text-text-primary mb-2">About</h2>
              <p className="text-body text-text-secondary whitespace-pre-line">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Info card */}
          <div className="bg-bg-elevated rounded-card p-6 flex flex-col gap-5">
            {/* Date & time */}
            <div className="flex items-start gap-3">
              <Calendar weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-body-medium text-text-primary">{formatEventDate(event.eventDate)}</p>
                <p className="text-caption text-text-secondary">{formatEventTime(event.eventDate)}</p>
                {countdown && (
                  <p className="text-caption text-accent-action mt-1">{countdown}</p>
                )}
              </div>
            </div>

            {/* Location */}
            {event.locationAddress && (
              <div className="flex items-start gap-3">
                <MapPin weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
                <p className="text-body text-text-secondary">{event.locationAddress}</p>
              </div>
            )}

            {/* Attendees */}
            <div className="flex items-start gap-3">
              <Users weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-body text-text-primary">
                  {event.currentAttendees}
                  {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attending
                </p>
                {spotsLeft !== null && spotsLeft > 0 && (
                  <p className="text-caption text-text-secondary">
                    {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
                  </p>
                )}
              </div>
            </div>

            {/* Budget */}
            {budget && (
              <div className="flex items-start gap-3">
                <Wallet weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-body text-text-primary">{budget}</p>
                  <p className="text-caption text-text-secondary">Estimated budget</p>
                </div>
              </div>
            )}

            {/* Join deadline */}
            {event.joinDeadline && (
              <div className="flex items-start gap-3">
                <Clock weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-caption text-text-secondary">Join by</p>
                  <p className="text-body text-text-primary">
                    {new Date(event.joinDeadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Join CTA */}
          {!isPast && (
            <div className="bg-bg-elevated rounded-card p-6">
              {joinMessage ? (
                <p className={`text-body text-center ${joinMessage.includes('Failed') ? 'text-error' : 'text-success'}`}>
                  {joinMessage}
                </p>
              ) : (
                <VelvetButton
                  variant="primary"
                  className="w-full"
                  disabled={isFull}
                  loading={isJoining}
                  onClick={handleJoin}
                >
                  {isFull ? 'Event Full' : isAuthenticated ? 'Join Event' : 'Sign in to Join'}
                </VelvetButton>
              )}
            </div>
          )}

          {/* Event type tag */}
          <div className="flex items-center gap-2">
            <span className="text-caption bg-bg-surface border border-border px-3 py-1 rounded-pill text-text-secondary">
              {event.eventType.replace(/_/g, ' ')}
            </span>
            {event.visibility === 'PRIVATE' && (
              <span className="text-caption bg-accent-primary/15 text-accent-primary px-3 py-1 rounded-pill">
                Private
              </span>
            )}
            {event.ageRestriction && (
              <span className="text-caption bg-bg-surface border border-border px-3 py-1 rounded-pill text-text-secondary">
                {event.ageRestriction}+
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
