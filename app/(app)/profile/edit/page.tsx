'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { InputField, TextareaField } from '@/components/ui/InputField'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/lib/hooks/useToast'
import { usersApi } from '@/lib/api/users'

const schema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  bio: z.string().max(500, 'Bio must be 500 characters or less').optional(),
  generalLocation: z.string().optional(),
  phoneNumber: z.string().optional(),
  profilePictureUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type FormValues = z.infer<typeof schema>

export default function EditProfilePage() {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const { toast } = useToast()
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: user?.displayName ?? '',
      bio: user?.bio ?? '',
      generalLocation: user?.generalLocation ?? '',
      phoneNumber: user?.phoneNumber ?? '',
      profilePictureUrl: user?.profilePictureUrl ?? '',
    },
  })

  const onSubmit = async (data: FormValues) => {
    setApiError('')
    try {
      const updated = await usersApi.updateMe({
        displayName: data.displayName,
        bio: data.bio || undefined,
        generalLocation: data.generalLocation || undefined,
        phoneNumber: data.phoneNumber || undefined,
        profilePictureUrl: data.profilePictureUrl || undefined,
      })
      setUser(updated)
      toast('Profile updated!', 'success')
      router.push('/profile')
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Failed to update profile.')
    }
  }

  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="text-caption text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 mb-6"
      >
        <ArrowLeft weight="thin" size={16} />
        Back
      </button>

      <h1 className="text-display text-text-primary mb-8">Edit Profile</h1>

      {/* Avatar preview */}
      <div className="flex justify-center mb-8">
        <Avatar
          name={user.displayName}
          src={user.profilePictureUrl ?? undefined}
          size="xl"
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <InputField
          label="Display Name"
          error={errors.displayName?.message}
          {...register('displayName')}
        />

        <TextareaField
          label="Bio"
          placeholder="Tell others about yourself..."
          error={errors.bio?.message}
          hint="Max 500 characters"
          {...register('bio')}
        />

        <InputField
          label="Location"
          placeholder="City, Country"
          {...register('generalLocation')}
        />

        <InputField
          label="Phone Number"
          type="tel"
          placeholder="+1 234 567 890"
          {...register('phoneNumber')}
        />

        <InputField
          label="Profile Picture URL"
          type="url"
          placeholder="https://..."
          error={errors.profilePictureUrl?.message}
          hint="Direct link to an image"
          {...register('profilePictureUrl')}
        />

        {apiError && <p className="text-caption text-error text-center">{apiError}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <VelvetButton type="button" variant="ghost" onClick={() => router.back()}>
            Cancel
          </VelvetButton>
          <VelvetButton type="submit" variant="primary" loading={isSubmitting} disabled={!isDirty}>
            Save Changes
          </VelvetButton>
        </div>
      </form>
    </div>
  )
}
