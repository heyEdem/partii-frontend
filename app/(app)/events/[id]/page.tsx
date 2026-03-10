'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Users,
  Wallet,
  Clock,
  ArrowLeft,
  PencilSimple,
  Trash,
  Megaphone,
  XCircle,
  ShareNetwork,
} from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { StatusPill } from '@/components/ui/StatusPill'
import { Avatar } from '@/components/ui/Avatar'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/lib/hooks/useToast'
import { eventsApi } from '@/lib/api/events'
import type { EventResponse, AttendeeResponse } from '@/types'

function formatEventDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatEventTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function formatBudget(budget: string | null, currency: string | null) {
  if (!budget) return null
  const num = parseFloat(budget)
  const sym = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency ?? ''
  return `${sym}${num.toFixed(2)}`
}

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const eventId = Number(params.id)

  const [event, setEvent] = useState<EventResponse | null>(null)
  const [attendees, setAttendees] = useState<AttendeeResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState('')

  const isOrganizer = user && event && user.id === event.organizerId
  const isPast = event?.status === 'PAST' || event?.status === 'CANCELLED'
  const isDraft = event?.status === 'DRAFT'

  useEffect(() => {
    if (!eventId || isNaN(eventId)) {
      setError('Invalid event.')
      setIsLoading(false)
      return
    }

    Promise.all([
      eventsApi.getById(eventId),
      eventsApi.getAttendees(eventId).catch(() => [] as AttendeeResponse[]),
    ])
      .then(([ev, att]) => {
        setEvent(ev)
        setAttendees(att)
      })
      .catch((err: unknown) => {
        const e = err as { message?: string }
        setError(e?.message ?? 'Event not found.')
      })
      .finally(() => setIsLoading(false))
  }, [eventId])

  const handleAction = async (
    action: string,
    fn: () => Promise<unknown>,
    successMsg: string,
  ) => {
    setActionLoading(action)
    try {
      await fn()
      toast(successMsg, 'success')
      // Refresh event data
      const [ev, att] = await Promise.all([
        eventsApi.getById(eventId),
        eventsApi.getAttendees(eventId).catch(() => [] as AttendeeResponse[]),
      ])
      setEvent(ev)
      setAttendees(att)
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast(e?.message ?? 'Action failed.', 'error')
    } finally {
      setActionLoading('')
    }
  }

  const handleDelete = async () => {
    setActionLoading('delete')
    try {
      await eventsApi.delete(eventId)
      toast('Event deleted.', 'success')
      router.push('/dashboard')
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast(e?.message ?? 'Failed to delete.', 'error')
    } finally {
      setActionLoading('')
    }
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: event?.title, url })
    } else {
      await navigator.clipboard.writeText(url)
      toast('Link copied!', 'success')
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
        <Link href="/dashboard">
          <VelvetButton variant="secondary">
            <ArrowLeft weight="thin" size={18} />
            Back to Dashboard
          </VelvetButton>
        </Link>
      </div>
    )
  }

  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
  const capacityPercent = event.maxAttendees
    ? Math.round((event.currentAttendees / event.maxAttendees) * 100)
    : 0
  const budget = formatBudget(event.estimatedBudget, event.currency)
  const approvedAttendees = attendees.filter((a) => a.status === 'APPROVED')
  const pendingAttendees = attendees.filter((a) => a.status === 'PENDING')

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-6">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-caption text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft weight="thin" size={16} />
        Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Banner */}
          <div className="relative aspect-video rounded-card overflow-hidden">
            {event.imageUrl ? (
              <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-bg-surface flex items-center justify-center">
                <span className="text-text-secondary text-body">No image</span>
              </div>
            )}
            <div className="absolute top-4 right-4">
              <StatusPill status={event.status} />
            </div>
          </div>

          {/* Title + actions */}
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-display text-text-primary">{event.title}</h1>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Share"
              >
                <ShareNetwork weight="thin" size={20} />
              </button>
              {isOrganizer && (
                <Link href={`/events/${event.id}/edit`}>
                  <button
                    className="w-10 h-10 rounded-full bg-bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                    aria-label="Edit event"
                  >
                    <PencilSimple weight="thin" size={20} />
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div>
              <h2 className="text-h3 text-text-primary mb-2">About</h2>
              <p className="text-body text-text-secondary whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {/* Attendees preview */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-h3 text-text-primary">
                Attendees ({approvedAttendees.length})
              </h2>
              {isOrganizer && (
                <Link
                  href={`/events/${event.id}/attendees`}
                  className="text-caption text-accent-primary hover:underline"
                >
                  Manage
                </Link>
              )}
            </div>
            {approvedAttendees.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {approvedAttendees.slice(0, 12).map((a) => (
                  <div key={a.id} className="flex items-center gap-2 bg-bg-surface rounded-pill px-3 py-1.5">
                    <Avatar name={a.displayName} src={a.profilePictureUrl ?? undefined} size="xs" />
                    <span className="text-caption text-text-primary">{a.displayName}</span>
                  </div>
                ))}
                {approvedAttendees.length > 12 && (
                  <span className="text-caption text-text-secondary self-center">
                    +{approvedAttendees.length - 12} more
                  </span>
                )}
              </div>
            ) : (
              <p className="text-body text-text-secondary">No attendees yet.</p>
            )}
          </div>

          {/* Pending requests (organizer only) */}
          {isOrganizer && pendingAttendees.length > 0 && (
            <div className="bg-bg-elevated rounded-card p-5">
              <h3 className="text-h3 text-text-primary mb-3">
                Pending Requests ({pendingAttendees.length})
              </h3>
              <div className="flex flex-col gap-3">
                {pendingAttendees.map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar name={a.displayName} src={a.profilePictureUrl ?? undefined} size="sm" />
                      <span className="text-body text-text-primary">{a.displayName}</span>
                    </div>
                    <div className="flex gap-2">
                      <VelvetButton
                        size="sm"
                        variant="primary"
                        loading={actionLoading === `approve-${a.userId}`}
                        onClick={() =>
                          handleAction(
                            `approve-${a.userId}`,
                            () => eventsApi.approveAttendee(eventId, a.userId),
                            `${a.displayName} approved!`,
                          )
                        }
                      >
                        Approve
                      </VelvetButton>
                      <VelvetButton
                        size="sm"
                        variant="ghost"
                        loading={actionLoading === `decline-${a.userId}`}
                        onClick={() =>
                          handleAction(
                            `decline-${a.userId}`,
                            () => eventsApi.declineAttendee(eventId, a.userId),
                            `${a.displayName} declined.`,
                          )
                        }
                      >
                        Decline
                      </VelvetButton>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          {/* Info card */}
          <div className="bg-bg-elevated rounded-card p-6 flex flex-col gap-5">
            <div className="flex items-start gap-3">
              <Calendar weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-body-medium text-text-primary">{formatEventDate(event.eventDate)}</p>
                <p className="text-caption text-text-secondary">{formatEventTime(event.eventDate)}</p>
              </div>
            </div>

            {event.locationAddress && (
              <div className="flex items-start gap-3">
                <MapPin weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
                <p className="text-body text-text-secondary">{event.locationAddress}</p>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Users weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-body text-text-primary">
                  {event.currentAttendees}
                  {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} attending
                </p>
                {event.maxAttendees && (
                  <div className="mt-2">
                    <ProgressBar value={capacityPercent} size="default" />
                  </div>
                )}
              </div>
            </div>

            {budget && (
              <div className="flex items-start gap-3">
                <Wallet weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-body text-text-primary">{budget}</p>
                  <p className="text-caption text-text-secondary">Estimated budget</p>
                </div>
              </div>
            )}

            {event.joinDeadline && (
              <div className="flex items-start gap-3">
                <Clock weight="thin" size={22} className="text-accent-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-caption text-text-secondary">Join by</p>
                  <p className="text-body text-text-primary">
                    {new Date(event.joinDeadline).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}

            {event.privateLinkCode && isOrganizer && (
              <div className="bg-bg-surface rounded-input p-3">
                <p className="text-caption text-text-secondary mb-1">Invite Code</p>
                <p className="text-body-medium text-accent-primary font-mono">{event.privateLinkCode}</p>
              </div>
            )}
          </div>

          {/* Organizer actions */}
          {isOrganizer && (
            <div className="bg-bg-elevated rounded-card p-4 flex flex-col gap-3">
              <h3 className="text-h3 text-text-primary">Organizer Actions</h3>

              {isDraft && (
                <VelvetButton
                  variant="primary"
                  className="w-full"
                  loading={actionLoading === 'publish'}
                  onClick={() =>
                    handleAction('publish', () => eventsApi.publish(eventId), 'Event published!')
                  }
                >
                  <Megaphone weight="thin" size={18} />
                  Publish Event
                </VelvetButton>
              )}

              {!isPast && !isDraft && (
                <VelvetButton
                  variant="ghost"
                  className="w-full"
                  loading={actionLoading === 'cancel'}
                  onClick={() =>
                    handleAction('cancel', () => eventsApi.cancel(eventId), 'Event cancelled.')
                  }
                >
                  <XCircle weight="thin" size={18} />
                  Cancel Event
                </VelvetButton>
              )}

              {(isDraft || event.status === 'CANCELLED') && (
                <VelvetButton
                  variant="destructive"
                  className="w-full"
                  loading={actionLoading === 'delete'}
                  onClick={handleDelete}
                >
                  <Trash weight="thin" size={18} />
                  Delete Event
                </VelvetButton>
              )}
            </div>
          )}

          {/* Event type & visibility tags */}
          <div className="flex items-center gap-2 flex-wrap">
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
