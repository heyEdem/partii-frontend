'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { InputField, TextareaField } from '@/components/ui/InputField'
import { useToast } from '@/lib/hooks/useToast'
import { eventsApi } from '@/lib/api/events'
import type { EventResponse, EventType, EventVisibility } from '@/types'

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  eventType: z.string().min(1, 'Select an event type'),
  eventDate: z.string().min(1, 'Event date is required'),
  locationAddress: z.string().optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  maxAttendees: z.string().optional(),
  ageRestriction: z.string().optional(),
  joinDeadline: z.string().optional(),
  estimatedBudget: z.string().optional(),
  currency: z.string().optional(),
  paymentDeadline: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

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

function toDatetimeLocal(iso: string) {
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toISOString().slice(0, 16)
}

export default function EditEventPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const eventId = Number(params.id)

  const [event, setEvent] = useState<EventResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const values = watch()

  useEffect(() => {
    eventsApi
      .getById(eventId)
      .then((ev) => {
        setEvent(ev)
        reset({
          title: ev.title,
          description: ev.description ?? '',
          eventType: ev.eventType,
          eventDate: toDatetimeLocal(ev.eventDate),
          locationAddress: ev.locationAddress ?? '',
          visibility: ev.visibility,
          maxAttendees: ev.maxAttendees?.toString() ?? '',
          ageRestriction: ev.ageRestriction?.toString() ?? '',
          joinDeadline: ev.joinDeadline ? toDatetimeLocal(ev.joinDeadline) : '',
          estimatedBudget: ev.estimatedBudget ?? '',
          currency: ev.currency ?? 'GHS',
          paymentDeadline: ev.paymentDeadline ? toDatetimeLocal(ev.paymentDeadline) : '',
        })
      })
      .catch((err: unknown) => {
        const e = err as { message?: string }
        setApiError(e?.message ?? 'Failed to load event.')
      })
      .finally(() => setIsLoading(false))
  }, [eventId, reset])

  const onSubmit = async (data: FormValues) => {
    setApiError('')
    try {
      await eventsApi.update(eventId, {
        title: data.title,
        description: data.description || undefined,
        eventType: data.eventType as EventType,
        eventDate: data.eventDate,
        locationAddress: data.locationAddress || undefined,
        visibility: data.visibility as EventVisibility,
        maxAttendees: data.maxAttendees ? parseInt(data.maxAttendees) : undefined,
        ageRestriction: data.ageRestriction ? parseInt(data.ageRestriction) : undefined,
        joinDeadline: data.joinDeadline || undefined,
        estimatedBudget: data.estimatedBudget || undefined,
        currency: data.currency || undefined,
        paymentDeadline: data.paymentDeadline || undefined,
      })
      toast('Event updated!', 'success')
      router.push(`/events/${eventId}`)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Failed to update event.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-body text-error">{apiError || 'Event not found.'}</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button
        onClick={() => router.back()}
        className="text-caption text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 mb-6"
      >
        <ArrowLeft weight="thin" size={16} />
        Back
      </button>

      <h1 className="text-display text-text-primary mb-8">Edit Event</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        <InputField label="Title" error={errors.title?.message} {...register('title')} />

        <TextareaField label="Description" {...register('description')} />

        {/* Event type */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-text-secondary">Event Type</label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {EVENT_TYPES.map((type) => (
              <label
                key={type.value}
                className={`flex items-center justify-center h-10 px-3 rounded-button text-caption cursor-pointer transition-colors ${
                  values.eventType === type.value
                    ? 'bg-accent-primary text-white'
                    : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                <input type="radio" value={type.value} className="sr-only" {...register('eventType')} />
                {type.label}
              </label>
            ))}
          </div>
        </div>

        <InputField
          label="Date & Time"
          type="datetime-local"
          error={errors.eventDate?.message}
          {...register('eventDate')}
        />

        <InputField label="Location" placeholder="Address or venue" {...register('locationAddress')} />

        {/* Visibility */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-text-secondary">Visibility</label>
          <div className="flex gap-3">
            {(['PUBLIC', 'PRIVATE'] as const).map((v) => (
              <label
                key={v}
                className={`flex-1 flex items-center justify-center h-12 rounded-button text-body-medium cursor-pointer transition-colors ${
                  values.visibility === v
                    ? 'bg-accent-primary text-white'
                    : 'bg-bg-surface border border-border text-text-secondary'
                }`}
              >
                <input type="radio" value={v} className="sr-only" {...register('visibility')} />
                {v === 'PUBLIC' ? 'Public' : 'Private'}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField label="Max Attendees" type="number" {...register('maxAttendees')} />
          <InputField label="Age Restriction" type="number" {...register('ageRestriction')} />
        </div>

        <InputField label="Join Deadline" type="datetime-local" {...register('joinDeadline')} />

        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-2">
            <InputField label="Budget" type="number" {...register('estimatedBudget')} />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-caption font-medium text-text-secondary">Currency</label>
            <select
              className="h-12 px-4 bg-bg-surface border border-border rounded-input text-body text-text-primary outline-none focus:border-accent-primary focus:shadow-lavender-ring"
              {...register('currency')}
            >
              <option value="GHS">GHS (₵)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
        </div>

        <InputField label="Payment Deadline" type="datetime-local" {...register('paymentDeadline')} />

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
