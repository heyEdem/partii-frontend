import { cn } from '@/lib/utils'
import type { AttendeeStatus, PaymentStatus, ContributionStatus, Priority, EventStatus } from '@/types'

type PillStatus =
  | EventStatus
  | AttendeeStatus
  | PaymentStatus
  | ContributionStatus
  | Priority
  | 'ACTIVE'
  | 'WAITLIST'

interface StatusConfig {
  bg: string
  text: string
  extra?: string
  label: string
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // Event status
  ACTIVE:      { bg: 'bg-accent-primary/15', text: 'text-accent-primary', label: 'Active' },
  DRAFT:       { bg: 'bg-bg-surface', text: 'text-text-secondary', extra: 'border border-dashed border-border', label: 'Draft' },
  FULL:        { bg: 'bg-accent-action/15', text: 'text-accent-action', label: 'Full' },
  PAST:        { bg: 'bg-bg-surface', text: 'text-text-secondary', label: 'Past' },
  CANCELLED:   { bg: 'bg-bg-surface', text: 'text-error line-through', label: 'Cancelled' },
  ARCHIVED:    { bg: 'bg-bg-surface', text: 'text-text-secondary', label: 'Archived' },

  // Payment status
  PAID:        { bg: 'bg-success/15', text: 'text-success', label: 'Paid' },
  PARTIAL:     { bg: 'bg-warning/15', text: 'text-warning', label: 'Partial' },
  UNPAID:      { bg: 'bg-bg-surface', text: 'text-text-secondary', label: 'Unpaid' },
  OVERDUE:     { bg: 'bg-error/15', text: 'text-error', label: 'Overdue' },

  // Attendee status
  PENDING:     { bg: 'bg-bg-surface', text: 'text-text-secondary', label: 'Pending' },
  APPROVED:    { bg: 'bg-success/15', text: 'text-success', label: 'Approved' },
  WAITLIST:    { bg: 'bg-accent-primary/15', text: 'text-accent-primary italic', label: 'Waitlist' },
  DECLINED:    { bg: 'bg-error/15', text: 'text-error', label: 'Declined' },
  REMOVED:     { bg: 'bg-bg-surface', text: 'text-error', label: 'Removed' },

  // Contribution status
  AVAILABLE:   { bg: 'bg-bg-surface', text: 'text-text-primary', label: 'Available' },
  CLAIMED:     { bg: 'bg-accent-action/15', text: 'text-accent-action', label: 'Claimed' },
  ASSIGNED:    { bg: 'bg-accent-primary/15', text: 'text-accent-primary', label: 'Assigned' },
  CONFIRMED:   { bg: 'bg-success/15', text: 'text-success', label: 'Confirmed' },

  // Priority
  MUST_HAVE:   { bg: 'bg-accent-action/15', text: 'text-accent-action', label: 'Must-Have' },
  NICE_TO_HAVE: { bg: 'bg-accent-primary/15', text: 'text-accent-primary', label: 'Nice-to-Have' },
}

interface StatusPillProps {
  status: string
  className?: string
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = STATUS_MAP[status] ?? { bg: 'bg-bg-surface', text: 'text-text-secondary', label: status }

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 h-7 rounded-pill text-label font-semibold uppercase tracking-wider whitespace-nowrap',
        config.bg,
        config.text,
        config.extra,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
