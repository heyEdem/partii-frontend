'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ArrowRight, Check } from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { InputField, TextareaField } from '@/components/ui/InputField'
import { eventsApi } from '@/lib/api/events'
import type { EventType, EventVisibility } from '@/types'

// ---------- Schema ----------

const schema = z.object({
  // Step 1: Basics
  title: z.string().min(3, 'Title must be at least 3 characters'),
  eventType: z.string().min(1, 'Select an event type'),
  description: z.string().optional(),

  // Step 2: Date & Location
  eventDate: z.string().min(1, 'Event date is required'),
  locationAddress: z.string().optional(),

  // Step 3: Settings
  visibility: z.enum(['PUBLIC', 'PRIVATE']),
  maxAttendees: z.string().optional(),
  ageRestriction: z.string().optional(),
  joinDeadline: z.string().optional(),

  // Step 4: Budget
  estimatedBudget: z.string().optional(),
  currency: z.string().optional(),
  paymentDeadline: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

// ---------- Constants ----------

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

const STEPS = ['Basics', 'When & Where', 'Settings', 'Budget', 'Review']

// ---------- Component ----------

export default function CreateEventPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [apiError, setApiError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      visibility: 'PUBLIC',
      currency: 'GHS',
    },
  })

  const values = watch()

  const stepsFields: (keyof FormValues)[][] = [
    ['title', 'eventType', 'description'],
    ['eventDate', 'locationAddress'],
    ['visibility', 'maxAttendees', 'ageRestriction', 'joinDeadline'],
    ['estimatedBudget', 'currency', 'paymentDeadline'],
    [],
  ]

  const goNext = async () => {
    const valid = await trigger(stepsFields[step])
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const goBack = () => setStep((s) => Math.max(s - 1, 0))

  const onSubmit = async (data: FormValues) => {
    setApiError('')
    try {
      const event = await eventsApi.create({
        title: data.title,
        eventType: data.eventType as EventType,
        description: data.description || undefined,
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
      router.push(`/events/${event.id}`)
    } catch (err: unknown) {
      const e = err as { message?: string }
      setApiError(e?.message ?? 'Failed to create event.')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-caption text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 mb-4"
        >
          <ArrowLeft weight="thin" size={16} />
          Cancel
        </button>
        <h1 className="text-display text-text-primary">Create Event</h1>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              disabled={i > step}
              className={`w-8 h-8 rounded-full text-caption font-semibold flex items-center justify-center transition-colors ${
                i < step
                  ? 'bg-accent-primary text-white'
                  : i === step
                    ? 'bg-accent-action text-black'
                    : 'bg-bg-surface text-text-secondary'
              }`}
            >
              {i < step ? <Check weight="bold" size={14} /> : i + 1}
            </button>
            <span className={`text-caption hidden sm:block ${i === step ? 'text-text-primary' : 'text-text-secondary'}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className="w-4 h-px bg-border hidden sm:block" />}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Step 1: Basics */}
        {step === 0 && (
          <>
            <InputField
              label="Event Title"
              placeholder="Give your event a catchy name"
              error={errors.title?.message}
              {...register('title')}
            />

            <div className="flex flex-col gap-2">
              <label className="text-caption font-medium text-text-secondary">Event Type</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {EVENT_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-center justify-center h-10 px-3 rounded-button text-caption cursor-pointer transition-colors ${
                      values.eventType === type.value
                        ? 'bg-accent-primary text-white'
                        : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary hover:border-text-secondary'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type.value}
                      className="sr-only"
                      {...register('eventType')}
                    />
                    {type.label}
                  </label>
                ))}
              </div>
              {errors.eventType && (
                <p className="text-[12px] text-error">{errors.eventType.message}</p>
              )}
            </div>

            <TextareaField
              label="Description (optional)"
              placeholder="Tell people what to expect..."
              {...register('description')}
            />
          </>
        )}

        {/* Step 2: Date & Location */}
        {step === 1 && (
          <>
            <InputField
              label="Event Date & Time"
              type="datetime-local"
              error={errors.eventDate?.message}
              {...register('eventDate')}
            />
            <InputField
              label="Location (optional)"
              placeholder="Address or venue name"
              {...register('locationAddress')}
            />
          </>
        )}

        {/* Step 3: Settings */}
        {step === 2 && (
          <>
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
                    <input
                      type="radio"
                      value={v}
                      className="sr-only"
                      {...register('visibility')}
                    />
                    {v === 'PUBLIC' ? 'Public' : 'Private (invite only)'}
                  </label>
                ))}
              </div>
            </div>

            <InputField
              label="Max Attendees (optional)"
              type="number"
              placeholder="Leave blank for unlimited"
              {...register('maxAttendees')}
            />
            <InputField
              label="Age Restriction (optional)"
              type="number"
              placeholder="Minimum age, e.g. 18"
              {...register('ageRestriction')}
            />
            <InputField
              label="Join Deadline (optional)"
              type="datetime-local"
              {...register('joinDeadline')}
            />
          </>
        )}

        {/* Step 4: Budget */}
        {step === 3 && (
          <>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <InputField
                  label="Estimated Budget (optional)"
                  type="number"
                  placeholder="0.00"
                  {...register('estimatedBudget')}
                />
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
            <InputField
              label="Payment Deadline (optional)"
              type="datetime-local"
              {...register('paymentDeadline')}
            />
          </>
        )}

        {/* Step 5: Review */}
        {step === 4 && (
          <div className="bg-bg-elevated rounded-card p-6 flex flex-col gap-4">
            <h2 className="text-h2 text-text-primary">Review your event</h2>

            <div className="grid grid-cols-2 gap-4 text-body">
              <div>
                <span className="text-text-secondary block text-caption">Title</span>
                <span className="text-text-primary">{values.title}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-caption">Type</span>
                <span className="text-text-primary">{values.eventType?.replace(/_/g, ' ')}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-caption">Date</span>
                <span className="text-text-primary">
                  {values.eventDate ? new Date(values.eventDate).toLocaleString() : '—'}
                </span>
              </div>
              <div>
                <span className="text-text-secondary block text-caption">Location</span>
                <span className="text-text-primary">{values.locationAddress || 'TBD'}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-caption">Visibility</span>
                <span className="text-text-primary">{values.visibility}</span>
              </div>
              <div>
                <span className="text-text-secondary block text-caption">Max Attendees</span>
                <span className="text-text-primary">{values.maxAttendees || 'Unlimited'}</span>
              </div>
              {values.estimatedBudget && (
                <div>
                  <span className="text-text-secondary block text-caption">Budget</span>
                  <span className="text-text-primary">
                    {values.currency === 'GHS' ? '₵' : values.currency === 'USD' ? '$' : values.currency}{' '}
                    {values.estimatedBudget}
                  </span>
                </div>
              )}
            </div>

            {values.description && (
              <div>
                <span className="text-text-secondary block text-caption mb-1">Description</span>
                <p className="text-body text-text-primary whitespace-pre-line">{values.description}</p>
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {apiError && (
          <p className="text-caption text-error text-center">{apiError}</p>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4">
          {step > 0 ? (
            <VelvetButton type="button" variant="ghost" onClick={goBack}>
              <ArrowLeft weight="thin" size={16} />
              Back
            </VelvetButton>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <VelvetButton type="button" variant="primary" onClick={goNext}>
              Next
              <ArrowRight weight="thin" size={16} />
            </VelvetButton>
          ) : (
            <VelvetButton type="submit" variant="primary" loading={isSubmitting}>
              Create Event
            </VelvetButton>
          )}
        </div>
      </form>
    </div>
  )
}
