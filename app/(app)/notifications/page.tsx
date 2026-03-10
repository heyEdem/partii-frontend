'use client'

import { EmptyState } from '@/components/ui/EmptyState'

export default function NotificationsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-display text-text-primary mb-8">Notifications</h1>
      <EmptyState variant="no-notifications" />
    </div>
  )
}
