'use client'

import Link from 'next/link'
import {
  PencilSimple,
  MapPin,
  Calendar,
  Star,
  CalendarCheck,
  Megaphone,
  ShieldCheck,
} from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/lib/hooks/useAuth'

export default function ProfilePage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      {/* Profile header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar
          name={user.displayName}
          src={user.profilePictureUrl ?? undefined}
          size="xl"
        />
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-display text-text-primary">{user.displayName}</h1>
            {user.isVerified && (
              <ShieldCheck weight="fill" size={22} className="text-accent-primary" />
            )}
          </div>
          {user.generalLocation && (
            <div className="flex items-center justify-center gap-1 mt-1 text-text-secondary">
              <MapPin weight="thin" size={16} />
              <span className="text-body">{user.generalLocation}</span>
            </div>
          )}
        </div>

        <Link href="/profile/edit" className="mt-4">
          <VelvetButton variant="secondary" size="sm">
            <PencilSimple weight="thin" size={16} />
            Edit Profile
          </VelvetButton>
        </Link>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-8">
          <h2 className="text-h3 text-text-primary mb-2">About</h2>
          <p className="text-body text-text-secondary whitespace-pre-line">{user.bio}</p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<CalendarCheck weight="thin" size={22} />}
          value={user.eventsAttended}
          label="Attended"
        />
        <StatCard
          icon={<Megaphone weight="thin" size={22} />}
          value={user.eventsOrganized}
          label="Organized"
        />
        <StatCard
          icon={<Star weight="thin" size={22} />}
          value={user.averageRating > 0 ? `${user.averageRating}/5` : '—'}
          label={`${user.totalRatings} reviews`}
        />
        <StatCard
          icon={<Calendar weight="thin" size={22} />}
          value={user.activeEventsCount}
          label="Active"
        />
      </div>

      {/* Info rows */}
      <div className="bg-bg-elevated rounded-card p-6 flex flex-col gap-4">
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Phone" value={user.phoneNumber ?? 'Not set'} />
        <InfoRow label="Age" value={`${user.age}`} />
        <InfoRow
          label="Member since"
          value={new Date(user.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })}
        />
        <InfoRow label="Account status" value={user.accountStatus} />
      </div>
    </div>
  )
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
}) {
  return (
    <div className="bg-bg-elevated rounded-card p-4 text-center">
      <div className="text-accent-primary flex justify-center mb-2">{icon}</div>
      <p className="text-h1 text-text-primary">{value}</p>
      <p className="text-caption text-text-secondary">{label}</p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-caption text-text-secondary">{label}</span>
      <span className="text-body text-text-primary">{value}</span>
    </div>
  )
}
