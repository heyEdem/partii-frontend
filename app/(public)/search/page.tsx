'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { MagnifyingGlass, Funnel, X } from '@phosphor-icons/react'
import { EventCard } from '@/components/ui/EventCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { eventsApi } from '@/lib/api/events'
import type { EventResponse, EventType } from '@/types'

const EVENT_TYPES: { value: EventType; label: string }[] = [
  { value: 'PARTY', label: 'Party' },
  { value: 'DINNER', label: 'Dinner' },
  { value: 'TRIP', label: 'Trip' },
  { value: 'SPORTS', label: 'Sports' },
  { value: 'GAME_NIGHT', label: 'Game Night' },
  { value: 'CONCERT', label: 'Concert' },
  { value: 'FESTIVAL', label: 'Festival' },
  { value: 'BIRTHDAY', label: 'Birthday' },
  { value: 'NETWORKING', label: 'Networking' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'OTHER', label: 'Other' },
]

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [query, setQuery] = useState(initialQuery)
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [events, setEvents] = useState<EventResponse[]>([])
  const [nextCursor, setNextCursor] = useState<string | null>(null)
  const [hasNext, setHasNext] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const loaderRef = useRef<HTMLDivElement>(null)

  const fetchEvents = useCallback(
    async (cursor?: string) => {
      setIsLoading(true)
      try {
        // NOTE: Backend doesn't have a search endpoint yet — using public listing
        // and filtering client-side as a fallback. When /events/search is added,
        // replace this with eventsApi.search().
        const page = await eventsApi.getPublicEvents(cursor)
        let results = page.content

        // Client-side keyword filter (temporary until backend search endpoint exists)
        if (query.trim()) {
          const q = query.toLowerCase()
          results = results.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              e.description?.toLowerCase().includes(q) ||
              e.locationAddress?.toLowerCase().includes(q),
          )
        }

        // Client-side type filter
        if (selectedTypes.length > 0) {
          results = results.filter((e) => selectedTypes.includes(e.eventType))
        }

        setEvents((prev) => (cursor ? [...prev, ...results] : results))
        setNextCursor(page.nextCursor)
        setHasNext(page.hasNext)
        setHasSearched(true)
      } catch {
        // Silently handle — empty results shown
        setHasSearched(true)
      } finally {
        setIsLoading(false)
      }
    },
    [query, selectedTypes],
  )

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setEvents([])
    setNextCursor(null)
    setHasNext(true)
    // Update URL without navigation
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    router.replace(`/search${params.toString() ? `?${params}` : ''}`, { scroll: false })
    fetchEvents()
  }

  const toggleType = (type: EventType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    )
  }

  const clearFilters = () => {
    setSelectedTypes([])
    setQuery('')
    setEvents([])
    setHasSearched(false)
    router.replace('/search', { scroll: false })
  }

  // Search on initial load if query param exists
  useEffect(() => {
    if (initialQuery) fetchEvents()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasNext || !hasSearched) return

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
  }, [hasNext, nextCursor, isLoading, hasSearched, fetchEvents])

  const hasActiveFilters = selectedTypes.length > 0 || query.trim().length > 0

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <h1 className="text-display text-text-primary mb-6">Explore</h1>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <MagnifyingGlass
            weight="thin"
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events by name, location..."
            className="w-full h-12 pl-12 pr-4 bg-bg-surface border border-border rounded-input text-body text-text-primary placeholder:text-text-secondary outline-none focus:border-accent-primary focus:shadow-lavender-ring transition-all"
          />
        </div>
        <VelvetButton type="submit" variant="primary">
          Search
        </VelvetButton>
        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className={`h-12 w-12 flex items-center justify-center rounded-input border transition-colors ${
            showFilters || selectedTypes.length > 0
              ? 'bg-accent-primary/15 border-accent-primary text-accent-primary'
              : 'bg-bg-surface border-border text-text-secondary hover:text-text-primary'
          }`}
          aria-label="Toggle filters"
        >
          <Funnel weight="thin" size={20} />
        </button>
      </form>

      {/* Filter chips */}
      {showFilters && (
        <div className="mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-caption text-text-secondary">Event Type</span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-caption text-accent-primary hover:underline flex items-center gap-1"
              >
                <X weight="thin" size={14} />
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((type) => {
              const isActive = selectedTypes.includes(type.value)
              return (
                <button
                  key={type.value}
                  onClick={() => toggleType(type.value)}
                  className={`h-8 px-4 rounded-pill text-caption transition-colors ${
                    isActive
                      ? 'bg-accent-primary text-white'
                      : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary'
                  }`}
                >
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Results */}
      {events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}

      {/* Empty / No results */}
      {hasSearched && !isLoading && events.length === 0 && (
        <EmptyState variant="no-results" />
      )}

      {/* Pre-search prompt */}
      {!hasSearched && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MagnifyingGlass weight="thin" size={64} className="text-text-secondary/40 mb-4" />
          <p className="text-body text-text-secondary">
            Search for events or browse by category.
          </p>
        </div>
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
