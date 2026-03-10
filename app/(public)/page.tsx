'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { EventCard } from '@/components/ui/EventCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { eventsApi } from '@/lib/api/events'
import type { EventResponse } from '@/types'

export default function HomePage() {
  const [events, setEvents] = useState<EventResponse[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const loaderRef = useRef<HTMLDivElement>(null)

  const fetchEvents = useCallback(async (cursor?: string) => {
    try {
      const page = await eventsApi.getPublicEvents(cursor)
      setEvents((prev) => cursor ? [...prev, ...page.content] : page.content)
      setNextCursor(page.nextCursor)
      setHasNext(page.hasNext)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setError(e?.message ?? 'Failed to load events.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  // Infinite scroll via IntersectionObserver
  useEffect(() => {
    if (!loaderRef.current || !hasNext) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && nextCursor && !isLoading) {
          setIsLoading(true)
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
      {/* Hero */}
      <section className="mb-10">
        <h1
          className="text-display md:text-[40px] font-bold mb-2"
          style={{
            background: 'linear-gradient(135deg, #9B8EC4, #FF8C42)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Discover Events
        </h1>
        <p className="text-body text-text-secondary max-w-lg">
          Find your next adventure. Browse public events happening near you.
        </p>
      </section>

      {/* Error */}
      {error && (
        <div className="text-center py-12">
          <p className="text-body text-error">{error}</p>
        </div>
      )}

      {/* Event grid */}
      {!error && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!error && !isLoading && events.length === 0 && (
        <EmptyState variant="no-events" />
      )}

      {/* Infinite scroll sentinel */}
      <div ref={loaderRef} className="flex justify-center py-8">
        {isLoading && (
          <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        )}
      </div>
    </div>
  )
}
