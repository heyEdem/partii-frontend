'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Star,
  CalendarCheck,
  Megaphone,
  ShieldCheck,
  ArrowLeft,
  WarningCircle,
} from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { Avatar } from '@/components/ui/Avatar'
import { Dialog } from '@/components/ui/Dialog'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/lib/hooks/useToast'
import { usersApi } from '@/lib/api/users'
import type { UserProfileResponse } from '@/types'

export default function PublicProfilePage() {
  const params = useParams()
  const userId = Number(params.id)
  const { user: currentUser } = useAuth()
  const { toast } = useToast()

  const [profile, setProfile] = useState<UserProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showReportDialog, setShowReportDialog] = useState(false)
  const [reportReason, setReportReason] = useState('')
  const [isReporting, setIsReporting] = useState(false)

  const isOwnProfile = currentUser && currentUser.id === userId

  useEffect(() => {
    usersApi
      .getById(userId)
      .then(setProfile)
      .catch((err: unknown) => {
        const e = err as { message?: string }
        setError(e?.message ?? 'User not found.')
      })
      .finally(() => setIsLoading(false))
  }, [userId])

  const handleReport = async () => {
    if (!reportReason.trim()) return
    setIsReporting(true)
    try {
      await usersApi.reportUser(userId, reportReason.trim())
      toast('Report submitted. Thank you.', 'success')
      setShowReportDialog(false)
      setReportReason('')
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast(e?.message ?? 'Failed to submit report.', 'error')
    } finally {
      setIsReporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="max-w-2xl mx-auto px-4 md:px-8 py-12 text-center">
        <h1 className="text-h1 text-text-primary mb-2">User not found</h1>
        <p className="text-body text-text-secondary mb-6">{error}</p>
        <Link href="/dashboard">
          <VelvetButton variant="secondary">
            <ArrowLeft weight="thin" size={18} />
            Back
          </VelvetButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-caption text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft weight="thin" size={16} />
        Back
      </Link>

      {/* Profile header */}
      <div className="flex flex-col items-center text-center mb-8">
        <Avatar
          name={profile.displayName}
          src={profile.profilePictureUrl ?? undefined}
          size="xl"
        />
        <div className="mt-4">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-display text-text-primary">{profile.displayName}</h1>
            {profile.isVerified && (
              <ShieldCheck weight="fill" size={22} className="text-accent-primary" />
            )}
          </div>
          {profile.generalLocation && (
            <div className="flex items-center justify-center gap-1 mt-1 text-text-secondary">
              <MapPin weight="thin" size={16} />
              <span className="text-body">{profile.generalLocation}</span>
            </div>
          )}
        </div>

        {isOwnProfile && (
          <Link href="/profile/edit" className="mt-4">
            <VelvetButton variant="secondary" size="sm">Edit Profile</VelvetButton>
          </Link>
        )}
      </div>

      {/* Bio */}
      {profile.bio && (
        <div className="mb-8">
          <h2 className="text-h3 text-text-primary mb-2">About</h2>
          <p className="text-body text-text-secondary whitespace-pre-line">{profile.bio}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-bg-elevated rounded-card p-4 text-center">
          <div className="text-accent-primary flex justify-center mb-2">
            <CalendarCheck weight="thin" size={22} />
          </div>
          <p className="text-h1 text-text-primary">{profile.eventsAttended}</p>
          <p className="text-caption text-text-secondary">Attended</p>
        </div>
        <div className="bg-bg-elevated rounded-card p-4 text-center">
          <div className="text-accent-primary flex justify-center mb-2">
            <Megaphone weight="thin" size={22} />
          </div>
          <p className="text-h1 text-text-primary">{profile.eventsOrganized}</p>
          <p className="text-caption text-text-secondary">Organized</p>
        </div>
        <div className="bg-bg-elevated rounded-card p-4 text-center">
          <div className="text-accent-primary flex justify-center mb-2">
            <Star weight="thin" size={22} />
          </div>
          <p className="text-h1 text-text-primary">
            {profile.averageRating > 0 ? `${profile.averageRating}/5` : '—'}
          </p>
          <p className="text-caption text-text-secondary">{profile.totalRatings} reviews</p>
        </div>
        <div className="bg-bg-elevated rounded-card p-4 text-center">
          <div className="text-accent-primary flex justify-center mb-2">
            <Calendar weight="thin" size={22} />
          </div>
          <p className="text-h1 text-text-primary">{profile.activeEventsCount}</p>
          <p className="text-caption text-text-secondary">Active</p>
        </div>
      </div>

      {/* Member info */}
      <div className="bg-bg-elevated rounded-card p-6 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-caption text-text-secondary">Member since</span>
          <span className="text-body text-text-primary">
            {new Date(profile.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>

      {/* Report button (not own profile) */}
      {!isOwnProfile && (
        <button
          onClick={() => setShowReportDialog(true)}
          className="text-caption text-text-secondary hover:text-error transition-colors flex items-center gap-1"
        >
          <WarningCircle weight="thin" size={16} />
          Report user
        </button>
      )}

      {/* Report dialog */}
      <Dialog
        open={showReportDialog}
        onClose={() => setShowReportDialog(false)}
        title="Report User"
      >
        <div className="flex flex-col gap-4">
          <p className="text-body text-text-secondary">
            Tell us why you&apos;re reporting {profile.displayName}.
          </p>
          <textarea
            value={reportReason}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Describe the issue..."
            className="min-h-[100px] px-4 py-3.5 bg-bg-surface border border-border rounded-input text-body text-text-primary placeholder:text-text-secondary outline-none focus:border-accent-primary focus:shadow-lavender-ring resize-y"
          />
          <div className="flex justify-end gap-3">
            <VelvetButton variant="ghost" onClick={() => setShowReportDialog(false)}>
              Cancel
            </VelvetButton>
            <VelvetButton
              variant="destructive"
              loading={isReporting}
              disabled={!reportReason.trim()}
              onClick={handleReport}
            >
              Submit Report
            </VelvetButton>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
