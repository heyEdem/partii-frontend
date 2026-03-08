import Link from 'next/link'
import { MapPin, Users } from '@phosphor-icons/react'
import { StatusPill } from './StatusPill'
import { AvatarStack } from './Avatar'
import { cn } from '@/lib/utils'
import type { EventResponse } from '@/types'

interface EventCardProps {
  event: EventResponse
  className?: string
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate().toString(),
  }
}

function formatPrice(budget: string | null, currency: string | null) {
  if (!budget) return null
  const num = parseFloat(budget)
  const sym = currency === 'GHS' ? '₵' : currency === 'USD' ? '$' : currency ?? ''
  return `${sym}${num.toFixed(0)}`
}

export function EventCard({ event, className }: EventCardProps) {
  const { month, day } = formatDate(event.eventDate)
  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.currentAttendees : null
  const price = formatPrice(event.estimatedBudget, event.currency)

  return (
    <Link
      href={`/events/${event.id}`}
      className={cn(
        'group block bg-bg-elevated rounded-card overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:border hover:border-border',
        className,
      )}
      aria-label={event.title}
    >
      {/* Banner image */}
      <div className="relative aspect-video overflow-hidden">
        {event.imageUrl ? (
          <img
            src={event.imageUrl}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
          />
        ) : (
          <div className="w-full h-full bg-bg-surface flex items-center justify-center">
            <span className="text-text-secondary text-caption">No image</span>
          </div>
        )}

        {/* Date badge */}
        <div className="absolute top-3 left-3 bg-bg-primary/90 rounded-[10px] px-2 py-1 min-w-[44px] text-center" aria-hidden="true">
          <p className="text-[10px] font-semibold text-accent-action uppercase leading-none">{month}</p>
          <p className="text-[20px] font-bold text-text-primary leading-tight">{day}</p>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <StatusPill status={event.status} />
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-h2 text-text-primary line-clamp-2 mb-2">{event.title}</h3>

        <div className="flex items-center gap-1 text-caption text-text-secondary mb-4">
          <MapPin size={13} weight="thin" aria-hidden="true" />
          <span className="truncate">{event.locationAddress ?? 'Location TBD'}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-caption text-text-secondary">
            <Users size={14} weight="thin" aria-hidden="true" />
            <span>
              {event.currentAttendees}
              {event.maxAttendees ? ` / ${event.maxAttendees}` : ''} going
            </span>
          </div>

          {price && (
            <span className="text-caption font-semibold text-accent-action bg-accent-action/15 px-3 h-7 rounded-pill flex items-center">
              {price}
            </span>
          )}
          {!price && spotsLeft !== null && spotsLeft > 0 && (
            <span className="text-caption text-text-secondary">
              {spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
