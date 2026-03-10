'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Client } from '@stomp/stompjs'
import type { ChatMessageResponse } from '@/types'
import { chatApi } from '@/lib/api/chat'

const WS_URL = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/partii/api/v1')
  .replace('/partii/api/v1', '')
  .replace('http', 'ws') + '/ws/chat'

interface UseEventChatOptions {
  eventId: number
  enabled?: boolean
}

export function useEventChat({ eventId, enabled = true }: UseEventChatOptions) {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const clientRef = useRef<Client | null>(null)

  // Load chat history via REST
  useEffect(() => {
    if (!enabled) return
    setIsLoadingHistory(true)
    chatApi
      .getMessages(eventId)
      .then((msgs) => setMessages(msgs.reverse()))
      .catch(() => {})
      .finally(() => setIsLoadingHistory(false))
  }, [eventId, enabled])

  // STOMP connection for real-time messages
  useEffect(() => {
    if (!enabled) return

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        setIsConnected(true)
        client.subscribe(`/topic/event/${eventId}/messages`, (frame) => {
          try {
            const msg: ChatMessageResponse = JSON.parse(frame.body)
            setMessages((prev) => [...prev, msg])
          } catch {
            // Ignore malformed messages
          }
        })
      },
      onDisconnect: () => setIsConnected(false),
      onStompError: () => setIsConnected(false),
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      clientRef.current = null
      setIsConnected(false)
    }
  }, [eventId, enabled])

  const sendMessage = useCallback(
    (content: string) => {
      if (!clientRef.current?.connected || !content.trim()) return
      clientRef.current.publish({
        destination: `/app/chat/${eventId}/send`,
        body: JSON.stringify({ content: content.trim() }),
      })
    },
    [eventId],
  )

  return {
    messages,
    isConnected,
    isLoadingHistory,
    sendMessage,
  }
}
