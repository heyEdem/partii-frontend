'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserMinus } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { Avatar } from '@/components/ui/Avatar'
import { StatusPill } from '@/components/ui/StatusPill'
import { useToast } from '@/lib/hooks/useToast'
import { eventsApi } from '@/lib/api/events'
import type { AttendeeResponse } from '@/types'

type FilterTab = 'all' | 'APPROVED' | 'PENDING' | 'WAITLIST'

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'PENDING', label: 'Pending' },
  { key: 'WAITLIST', label: 'Waitlist' },
]

export default function AttendeesPage() {
  const params = useParams()
  const { toast } = useToast()
  const eventId = Number(params.id)

  const [attendees, setAttendees] = useState<AttendeeResponse[]>([])
  const [filter, setFilter] = useState<FilterTab>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')

  const loadAttendees = async () => {
    try {
      const data = await eventsApi.getAttendees(eventId)
      setAttendees(data)
    } catch {
      // handled silently
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadAttendees()
  }, [eventId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAction = async (
    key: string,
    fn: () => Promise<unknown>,
    successMsg: string,
  ) => {
    setActionLoading(key)
    try {
      await fn()
      toast(successMsg, 'success')
      await loadAttendees()
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast(e?.message ?? 'Action failed.', 'error')
    } finally {
      setActionLoading('')
    }
  }

  const filtered =
    filter === 'all' ? attendees : attendees.filter((a) => a.status === filter)

  const counts = {
    all: attendees.length,
    APPROVED: attendees.filter((a) => a.status === 'APPROVED').length,
    PENDING: attendees.filter((a) => a.status === 'PENDING').length,
    WAITLIST: attendees.filter((a) => a.status === 'WAITLIST').length,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <Link
        href={`/events/${eventId}`}
        className="inline-flex items-center gap-1 text-caption text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft weight="thin" size={16} />
        Back to event
      </Link>

      <h1 className="text-display text-text-primary mb-6">Attendees</h1>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {FILTER_TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-pill text-caption whitespace-nowrap transition-colors ${
              filter === key
                ? 'bg-accent-primary text-white'
                : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      {/* Attendee list */}
      {filtered.length === 0 ? (
        <p className="text-body text-text-secondary text-center py-12">No attendees in this category.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-bg-elevated rounded-card p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar name={a.displayName} src={a.profilePictureUrl ?? undefined} size="md" />
                <div>
                  <p className="text-body-medium text-text-primary">{a.displayName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <StatusPill status={a.status} />
                    {a.paymentStatus && a.paymentStatus !== 'UNPAID' && (
                      <StatusPill status={a.paymentStatus} />
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {a.status === 'PENDING' && (
                  <>
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
                  </>
                )}
                {a.status === 'APPROVED' && (
                  <VelvetButton
                    size="sm"
                    variant="ghost"
                    loading={actionLoading === `remove-${a.userId}`}
                    onClick={() =>
                      handleAction(
                        `remove-${a.userId}`,
                        () => eventsApi.removeAttendee(eventId, a.userId),
                        `${a.displayName} removed.`,
                      )
                    }
                  >
                    <UserMinus weight="thin" size={16} />
                    Remove
                  </VelvetButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
