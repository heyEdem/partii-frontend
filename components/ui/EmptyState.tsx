import { VelvetButton } from './VelvetButton'
import Link from 'next/link'

type EmptyVariant = 'no-events' | 'no-contributions' | 'no-reviews' | 'no-notifications' | 'no-results'

const CONFIGS: Record<EmptyVariant, { title: string; body: string; cta?: { label: string; href: string } }> = {
  'no-events': {
    title: 'No events yet',
    body: 'Create your first event or explore what\'s happening near you.',
    cta: { label: 'Create Event', href: '/events/new' },
  },
  'no-contributions': {
    title: 'No contributions',
    body: 'The organizer hasn\'t added any contribution items yet.',
  },
  'no-reviews': {
    title: 'No reviews yet',
    body: 'Reviews from attended events will appear here.',
  },
  'no-notifications': {
    title: 'All caught up',
    body: 'You\'re up to date. New notifications will appear here.',
  },
  'no-results': {
    title: 'No results found',
    body: 'Try adjusting your filters or search with different keywords.',
  },
}

interface EmptyStateProps {
  variant: EmptyVariant
  className?: string
}

export function EmptyState({ variant, className }: EmptyStateProps) {
  const config = CONFIGS[variant]

  return (
    <div className={`flex flex-col items-center justify-center text-center py-20 px-6 ${className ?? ''}`}>
      {/* SVG illustration — lavender/orange line art */}
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true" className="mb-6">
        <circle cx="60" cy="60" r="48" stroke="#9B8EC4" strokeWidth="1.5" strokeDasharray="4 4" />
        <circle cx="60" cy="60" r="32" stroke="#FF8C42" strokeWidth="1.5" opacity="0.5" />
        <path d="M44 60h32M60 44v32" stroke="#9B8EC4" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <h2 className="text-h1 text-text-primary mb-3">{config.title}</h2>
      <p className="text-body text-text-secondary max-w-[280px]">{config.body}</p>
      {config.cta && (
        <Link href={config.cta.href} className="mt-6">
          <VelvetButton>{config.cta.label}</VelvetButton>
        </Link>
      )}
    </div>
  )
}
