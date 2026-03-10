'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Package, Wrench, ArrowRight } from '@phosphor-icons/react'
import { StatusPill } from '@/components/ui/StatusPill'
import { EmptyState } from '@/components/ui/EmptyState'
import { usersApi } from '@/lib/api/users'
import type { ContributionItemResponse } from '@/types'

export default function MyContributionsPage() {
  const [items, setItems] = useState<ContributionItemResponse[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    usersApi
      .getMyContributions()
      .then(setItems)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-display text-text-primary mb-2">My Contributions</h1>
      <p className="text-body text-text-secondary mb-8">
        Items you&apos;ve claimed or been assigned across all events.
      </p>

      {items.length === 0 ? (
        <EmptyState variant="no-contributions" />
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const TypeIcon = item.type === 'MATERIAL' ? Package : Wrench

            return (
              <Link
                key={item.id}
                href={`/events/${item.eventId}/contributions`}
                className="bg-bg-elevated rounded-card p-4 flex items-center justify-between hover:scale-[1.01] transition-transform"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-button bg-bg-surface flex items-center justify-center flex-shrink-0">
                    <TypeIcon weight="thin" size={20} className="text-accent-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-body-medium text-text-primary">{item.name}</span>
                      <StatusPill status={item.status} />
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-caption text-text-secondary">
                      {item.category && <span>{item.category}</span>}
                      {item.estimatedCost && (
                        <span className="text-accent-action">~{item.estimatedCost}</span>
                      )}
                      <span
                        className={
                          item.priority === 'MUST_HAVE' ? 'text-error' : ''
                        }
                      >
                        {item.priority === 'MUST_HAVE' ? 'Must have' : 'Nice to have'}
                      </span>
                    </div>
                  </div>
                </div>
                <ArrowRight weight="thin" size={18} className="text-text-secondary flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
