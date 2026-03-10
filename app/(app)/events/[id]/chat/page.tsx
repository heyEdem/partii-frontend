'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, PaperPlaneRight, Circle } from '@phosphor-icons/react'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/lib/hooks/useAuth'
import { useEventChat } from '@/lib/chat/useEventChat'
import type { ChatMessageResponse } from '@/types'

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDateDivider(dateStr: string) {
  const d = new Date(dateStr)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function shouldShowDateDivider(
  msg: ChatMessageResponse,
  prevMsg: ChatMessageResponse | undefined,
) {
  if (!prevMsg) return true
  return new Date(msg.sentAt).toDateString() !== new Date(prevMsg.sentAt).toDateString()
}

export default function EventChatPage() {
  const params = useParams()
  const eventId = Number(params.id)
  const { user } = useAuth()
  const { messages, isConnected, isLoadingHistory, sendMessage } = useEventChat({
    eventId,
    enabled: !!eventId,
  })

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 md:px-8 py-4 border-b border-border bg-bg-elevated flex-shrink-0">
        <Link
          href={`/events/${eventId}`}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft weight="thin" size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-h3 text-text-primary">Event Chat</h1>
          <div className="flex items-center gap-1.5">
            <Circle
              weight="fill"
              size={8}
              className={isConnected ? 'text-success' : 'text-text-secondary'}
            />
            <span className="text-caption text-text-secondary">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-4">
        {isLoadingHistory ? (
          <div className="flex items-center justify-center py-12">
            <span className="w-8 h-8 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-body text-text-secondary">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {messages.map((msg, i) => {
              const isMe = user && msg.senderId === user.id
              const prevMsg = messages[i - 1]
              const showDivider = shouldShowDateDivider(msg, prevMsg)
              const showAvatar =
                !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId || showDivider)

              return (
                <div key={msg.id}>
                  {/* Date divider */}
                  {showDivider && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-caption text-text-secondary">
                        {formatDateDivider(msg.sentAt)}
                      </span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                  )}

                  {/* Message bubble */}
                  <div
                    className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'} ${
                      showAvatar ? 'mt-3' : 'mt-0.5'
                    }`}
                  >
                    {!isMe && (
                      <div className="w-8 flex-shrink-0">
                        {showAvatar && (
                          <Avatar
                            name={msg.senderDisplayName}
                            src={msg.senderProfilePictureUrl ?? undefined}
                            size="xs"
                          />
                        )}
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] px-3.5 py-2 rounded-[16px] ${
                        msg.deleted
                          ? 'bg-bg-surface text-text-secondary italic'
                          : isMe
                            ? 'bg-accent-action text-black rounded-br-[4px]'
                            : 'bg-bg-surface text-text-primary rounded-bl-[4px]'
                      }`}
                    >
                      {showAvatar && !isMe && (
                        <p className="text-[11px] font-semibold text-accent-primary mb-0.5">
                          {msg.senderDisplayName}
                        </p>
                      )}
                      <p className="text-body break-words">
                        {msg.deleted ? 'This message was deleted' : msg.content}
                      </p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          isMe ? 'text-black/60' : 'text-text-secondary'
                        }`}
                      >
                        {formatTime(msg.sentAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 px-4 md:px-8 py-3 border-t border-border bg-bg-elevated flex-shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          maxLength={2000}
          className="flex-1 h-11 px-4 bg-bg-surface border border-border rounded-pill text-body text-text-primary placeholder:text-text-secondary outline-none focus:border-accent-primary focus:shadow-lavender-ring transition-all"
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!input.trim() || !isConnected}
          className="w-11 h-11 rounded-full bg-accent-action flex items-center justify-center text-black transition-all hover:shadow-orange-glow hover:-translate-y-px active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
          aria-label="Send message"
        >
          <PaperPlaneRight weight="fill" size={20} />
        </button>
      </form>
    </div>
  )
}
