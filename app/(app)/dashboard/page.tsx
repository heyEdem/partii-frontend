'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Plus } from '@phosphor-icons/react'
import Link from 'next/link'
import { EventCard } from '@/components/ui/EventCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { useAuth } from '@/lib/hooks/useAuth'
import { eventsApi } from '@/lib/api/events'
import type { EventResponse } from '@/types'

type Tab = 'organized' | 'attending' | 'pending' | 'past'

const TABS: { key: Tab; label: string }[] = [
  { key: 'organized', label: 'Organizing' },
  { key: 'attending', label: 'Attending' },
  { key: 'pending', label: 'Pending' },
  { key: 'past', label: 'Past' },
]

const fetchers: Record<Tab, (cursor?: string) => Promise<{ content: EventResponse[]; nextCursor: string | null; hasNext: boolean }>> = {
  organized: (c) => eventsApi.getMyEventsOrganized(c),
  attending: (c) => eventsApi.getMyEventsAttending(c),
  pending: (c) => eventsApi.getMyEventsPending(c),
  past: (c) => eventsApi.getMyEventsPast(c),
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<Tab>('organized')
  const [events, setEvents] = useState<EventResponse[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const loaderRef = useRef<HTMLDivElement>(null)

  const fetchEvents = useCallback(
    async (cursor?: string) => {
      setIsLoading(true)
      try {
        const page = await fetchers[activeTab](cursor)
        setEvents((prev) => (cursor ? [...prev, ...page.content] : page.content))
        setNextCursor(page.nextCursor)
        setHasNext(page.hasNext)
      } catch {
        // Silently handle — empty state shown
      } finally {
        setIsLoading(false)
      }
    },
    [activeTab],
  )

  // Refetch on tab change
  useEffect(() => {
    setEvents([])
    setNextCursor(null)
    setHasNext(true)
    fetchEvents()
  }, [fetchEvents])

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasNext) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && nextCursor && !isLoading) {
          fetchEvents(nextCursor)
        }
      },
      { threshold: 0.1 },
    )
    observer.observe(loaderRef.current)
    return () => observer.disconnect()
  }, [hasNext, nextCursor, isLoading, fetchEvents])

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-display text-text-primary">
            {user ? `Hey, ${user.displayName.split(' ')[0]}` : 'Dashboard'}
          </h1>
          <p className="text-body text-text-secondary mt-1">Manage your events</p>
        </div>
        <Link href="/events/new" className="hidden md:block">
          <VelvetButton>
            <Plus weight="bold" size={16} />
            New Event
          </VelvetButton>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-3 text-body-medium whitespace-nowrap transition-colors relative ${
              activeTab === key
                ? 'text-accent-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
            {activeTab === key && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Event grid */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty */}
      {!isLoading && events.length === 0 && <EmptyState variant="no-events" />}

      {/* Loader */}
      <div ref={loaderRef} className="flex justify-center py-8">
        {isLoading && (
          <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  )
}
