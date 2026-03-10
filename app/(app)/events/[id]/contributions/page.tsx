'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Hand,
  CheckCircle,
  Trash,
  Package,
  Wrench,
} from '@phosphor-icons/react'
import { VelvetButton } from '@/components/ui/VelvetButton'
import { StatusPill } from '@/components/ui/StatusPill'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Avatar } from '@/components/ui/Avatar'
import { Dialog } from '@/components/ui/Dialog'
import { InputField } from '@/components/ui/InputField'
import { EmptyState } from '@/components/ui/EmptyState'
import { useAuth } from '@/lib/hooks/useAuth'
import { useToast } from '@/lib/hooks/useToast'
import { eventsApi } from '@/lib/api/events'
import type {
  ContributionItemResponse,
  ContributionSummaryResponse,
  ContributionType,
  Priority,
} from '@/types'

type FilterTab = 'all' | 'AVAILABLE' | 'CLAIMED' | 'CONFIRMED'

export default function ContributionsPage() {
  const params = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const eventId = Number(params.id)

  const [items, setItems] = useState<ContributionItemResponse[]>([])
  const [summary, setSummary] = useState<ContributionSummaryResponse | null>(null)
  const [filter, setFilter] = useState<FilterTab>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState('')
  const [showAddDialog, setShowAddDialog] = useState(false)

  const loadData = useCallback(async () => {
    try {
      const [itemsData, summaryData] = await Promise.all([
        eventsApi.getContributions(eventId),
        eventsApi.getContributionSummary(eventId),
      ])
      setItems(itemsData)
      setSummary(summaryData)
    } catch {
      // silently handle
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAction = async (
    key: string,
    fn: () => Promise<unknown>,
    successMsg: string,
  ) => {
    setActionLoading(key)
    try {
      await fn()
      toast(successMsg, 'success')
      await loadData()
    } catch (err: unknown) {
      const e = err as { message?: string }
      toast(e?.message ?? 'Action failed.', 'error')
    } finally {
      setActionLoading('')
    }
  }

  const filtered = filter === 'all' ? items : items.filter((i) => i.status === filter)
  const progressPercent = summary
    ? summary.totalItems > 0
      ? Math.round(((summary.claimedItems + summary.confirmedItems) / summary.totalItems) * 100)
      : 0
    : 0

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="w-10 h-10 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <Link
        href={`/events/${eventId}`}
        className="inline-flex items-center gap-1 text-caption text-text-secondary hover:text-text-primary transition-colors mb-6"
      >
        <ArrowLeft weight="thin" size={16} />
        Back to event
      </Link>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-display text-text-primary">Contributions</h1>
        <VelvetButton onClick={() => setShowAddDialog(true)}>
          <Plus weight="bold" size={16} />
          Add Item
        </VelvetButton>
      </div>

      {/* Summary card */}
      {summary && summary.totalItems > 0 && (
        <div className="bg-bg-elevated rounded-card p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-body-medium text-text-primary">
              {summary.claimedItems + summary.confirmedItems} / {summary.totalItems} items covered
            </span>
            <span className="text-caption text-text-secondary">{progressPercent}%</span>
          </div>
          <ProgressBar value={progressPercent} size="default" />
          <div className="flex gap-6 mt-4 text-caption text-text-secondary">
            <span>
              <span className="text-success font-medium">{summary.confirmedItems}</span> confirmed
            </span>
            <span>
              <span className="text-accent-action font-medium">{summary.claimedItems}</span> claimed
            </span>
            <span>
              <span className="text-text-primary font-medium">{summary.availableItems}</span> available
            </span>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(
          [
            { key: 'all' as FilterTab, label: 'All' },
            { key: 'AVAILABLE' as FilterTab, label: 'Available' },
            { key: 'CLAIMED' as FilterTab, label: 'Claimed' },
            { key: 'CONFIRMED' as FilterTab, label: 'Confirmed' },
          ] as const
        ).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-pill text-caption whitespace-nowrap transition-colors ${
              filter === key
                ? 'bg-accent-primary text-white'
                : 'bg-bg-surface border border-border text-text-secondary hover:text-text-primary'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Items list */}
      {filtered.length === 0 ? (
        <EmptyState variant="no-contributions" />
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((item) => (
            <ContributionCard
              key={item.id}
              item={item}
              eventId={eventId}
              currentUserId={user?.id}
              actionLoading={actionLoading}
              onAction={handleAction}
            />
          ))}
        </div>
      )}

      {/* Add item dialog */}
      <AddContributionDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        eventId={eventId}
        onCreated={loadData}
      />
    </div>
  )
}

// ---------- Contribution Card ----------

function ContributionCard({
  item,
  eventId,
  currentUserId,
  actionLoading,
  onAction,
}: {
  item: ContributionItemResponse
  eventId: number
  currentUserId?: number
  actionLoading: string
  onAction: (key: string, fn: () => Promise<unknown>, msg: string) => void
}) {
  const isMine = item.assignedToUserId === currentUserId
  const TypeIcon = item.type === 'MATERIAL' ? Package : Wrench

  return (
    <div className="bg-bg-elevated rounded-card p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between">
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
              {item.quantity && <span>Qty: {item.quantity}</span>}
              {item.estimatedCost && (
                <span className="text-accent-action font-medium">
                  ~{item.estimatedCost}
                </span>
              )}
              <span
                className={
                  item.priority === 'MUST_HAVE'
                    ? 'text-error font-medium'
                    : 'text-text-secondary'
                }
              >
                {item.priority === 'MUST_HAVE' ? 'Must have' : 'Nice to have'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Assigned user */}
      {item.assignedToDisplayName && (
        <div className="flex items-center gap-2 ml-[52px]">
          <Avatar
            name={item.assignedToDisplayName}
            src={item.assignedToProfilePictureUrl ?? undefined}
            size="xs"
          />
          <span className="text-caption text-text-secondary">
            {isMine ? 'You' : item.assignedToDisplayName}
          </span>
        </div>
      )}

      {item.notes && (
        <p className="text-caption text-text-secondary ml-[52px]">{item.notes}</p>
      )}

      {/* Actions */}
      <div className="flex gap-2 ml-[52px]">
        {item.status === 'AVAILABLE' && (
          <VelvetButton
            size="sm"
            variant="primary"
            loading={actionLoading === `claim-${item.id}`}
            onClick={() =>
              onAction(
                `claim-${item.id}`,
                () => eventsApi.claimContribution(eventId, item.id),
                `Claimed "${item.name}"!`,
              )
            }
          >
            <Hand weight="thin" size={14} />
            Claim
          </VelvetButton>
        )}

        {item.status === 'CLAIMED' && isMine && (
          <VelvetButton
            size="sm"
            variant="ghost"
            loading={actionLoading === `release-${item.id}`}
            onClick={() =>
              onAction(
                `release-${item.id}`,
                () => eventsApi.releaseContribution(eventId, item.id),
                'Released item.',
              )
            }
          >
            Release
          </VelvetButton>
        )}

        {item.status === 'CLAIMED' && !isMine && (
          <VelvetButton
            size="sm"
            variant="primary"
            loading={actionLoading === `confirm-${item.id}`}
            onClick={() =>
              onAction(
                `confirm-${item.id}`,
                () => eventsApi.confirmContribution(eventId, item.id),
                `Confirmed "${item.name}"!`,
              )
            }
          >
            <CheckCircle weight="thin" size={14} />
            Confirm
          </VelvetButton>
        )}

        {item.status === 'CONFIRMED' && !item.completed && (
          <VelvetButton
            size="sm"
            variant="primary"
            loading={actionLoading === `complete-${item.id}`}
            onClick={() =>
              onAction(
                `complete-${item.id}`,
                () => eventsApi.completeContribution(eventId, item.id),
                `"${item.name}" marked complete!`,
              )
            }
          >
            <CheckCircle weight="thin" size={14} />
            Complete
          </VelvetButton>
        )}

        {item.status === 'AVAILABLE' && (
          <VelvetButton
            size="sm"
            variant="ghost"
            loading={actionLoading === `delete-${item.id}`}
            onClick={() =>
              onAction(
                `delete-${item.id}`,
                () => eventsApi.deleteContributionItem(eventId, item.id),
                'Item removed.',
              )
            }
          >
            <Trash weight="thin" size={14} />
          </VelvetButton>
        )}
      </div>
    </div>
  )
}

// ---------- Add Contribution Dialog ----------

function AddContributionDialog({
  open,
  onClose,
  eventId,
  onCreated,
}: {
  open: boolean
  onClose: () => void
  eventId: number
  onCreated: () => void
}) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [type, setType] = useState<ContributionType>('MATERIAL')
  const [quantity, setQuantity] = useState('')
  const [estimatedCost, setEstimatedCost] = useState('')
  const [priority, setPriority] = useState<Priority>('NICE_TO_HAVE')
  const [notes, setNotes] = useState('')

  const resetForm = () => {
    setName('')
    setCategory('')
    setType('MATERIAL')
    setQuantity('')
    setEstimatedCost('')
    setPriority('NICE_TO_HAVE')
    setNotes('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    setIsSubmitting(true)
    try {
      await eventsApi.addContributionItem(eventId, {
        name: name.trim(),
        category: category.trim() || undefined,
        type,
        quantity: quantity ? parseInt(quantity) : undefined,
        estimatedCost: estimatedCost || undefined,
        priority,
        notes: notes.trim() || undefined,
      })
      toast('Item added!', 'success')
      resetForm()
      onClose()
      onCreated()
    } catch (err: unknown) {
      const typed = err as { message?: string }
      toast(typed?.message ?? 'Failed to add item.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="Add Contribution Item">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="Item Name"
          placeholder="e.g. Cooler box, DJ setup"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />

        <InputField
          label="Category (optional)"
          placeholder="e.g. Drinks, Equipment"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        {/* Type toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-text-secondary">Type</label>
          <div className="flex gap-3">
            {(['MATERIAL', 'SERVICE'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 h-10 rounded-button text-caption flex items-center justify-center gap-2 transition-colors ${
                  type === t
                    ? 'bg-accent-primary text-white'
                    : 'bg-bg-surface border border-border text-text-secondary'
                }`}
              >
                {t === 'MATERIAL' ? (
                  <Package weight="thin" size={16} />
                ) : (
                  <Wrench weight="thin" size={16} />
                )}
                {t === 'MATERIAL' ? 'Material' : 'Service'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputField
            label="Quantity"
            type="number"
            placeholder="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <InputField
            label="Est. Cost"
            type="number"
            placeholder="0.00"
            value={estimatedCost}
            onChange={(e) => setEstimatedCost(e.target.value)}
          />
        </div>

        {/* Priority toggle */}
        <div className="flex flex-col gap-2">
          <label className="text-caption font-medium text-text-secondary">Priority</label>
          <div className="flex gap-3">
            {(['MUST_HAVE', 'NICE_TO_HAVE'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 h-10 rounded-button text-caption transition-colors ${
                  priority === p
                    ? p === 'MUST_HAVE'
                      ? 'bg-error text-white'
                      : 'bg-accent-primary text-white'
                    : 'bg-bg-surface border border-border text-text-secondary'
                }`}
              >
                {p === 'MUST_HAVE' ? 'Must Have' : 'Nice to Have'}
              </button>
            ))}
          </div>
        </div>

        <InputField
          label="Notes (optional)"
          placeholder="Any details or instructions..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <VelvetButton type="submit" variant="primary" loading={isSubmitting} className="w-full mt-2">
          Add Item
        </VelvetButton>
      </form>
    </Dialog>
  )
}
