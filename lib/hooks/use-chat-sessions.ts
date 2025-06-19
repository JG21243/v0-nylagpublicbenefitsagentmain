"use client"

import { useState, useEffect, useCallback } from "react"
import type { ChatSession, ChatMessage, PaginatedResponse } from "@/lib/database/types"

interface UseChatSessionsOptions {
  page?: number
  limit?: number
  includeArchived?: boolean
  search?: string
}

export function useChatSessions(options: UseChatSessionsOptions = {}) {
  const { page = 1, limit = 20, includeArchived = false, search } = options

  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  })

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        includeArchived: includeArchived.toString(),
      })

      if (search) {
        params.append("search", search)
      }

      const response = await fetch(`/api/chat-sessions?${params}`)
      const result: PaginatedResponse<ChatSession> = await response.json()

      if (result.success) {
        setSessions(result.data || [])
        setPagination(result.pagination)
      } else {
        setError(result.error || "Failed to fetch chat sessions")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [page, limit, includeArchived, search])

  useEffect(() => {
    fetchSessions()
  }, [fetchSessions])

  const createSession = useCallback(
    async (title: string) => {
      try {
        const response = await fetch("/api/chat-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title }),
        })

        const result = await response.json()

        if (result.success) {
          await fetchSessions() // Refresh the list
          return result.data
        } else {
          throw new Error(result.error || "Failed to create chat session")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create session")
        throw err
      }
    },
    [fetchSessions],
  )

  const updateSession = useCallback(
    async (sessionId: string, updates: { title?: string; archived?: boolean }) => {
      try {
        const response = await fetch(`/api/chat-sessions/${sessionId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })

        const result = await response.json()

        if (result.success) {
          await fetchSessions() // Refresh the list
          return result.data
        } else {
          throw new Error(result.error || "Failed to update chat session")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update session")
        throw err
      }
    },
    [fetchSessions],
  )

  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        const response = await fetch(`/api/chat-sessions/${sessionId}`, {
          method: "DELETE",
        })

        const result = await response.json()

        if (result.success) {
          await fetchSessions() // Refresh the list
        } else {
          throw new Error(result.error || "Failed to delete chat session")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete session")
        throw err
      }
    },
    [fetchSessions],
  )

  return {
    sessions,
    loading,
    error,
    pagination,
    createSession,
    updateSession,
    deleteSession,
    refetch: fetchSessions,
  }
}

export function useChatSession(sessionId: string | null) {
  const [session, setSession] = useState<(ChatSession & { messages: ChatMessage[] }) | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = useCallback(async () => {
    if (!sessionId) {
      setSession(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/chat-sessions/${sessionId}`)
      const result = await response.json()

      if (result.success) {
        setSession(result.data)
      } else {
        setError(result.error || "Failed to fetch chat session")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [sessionId])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  return {
    session,
    loading,
    error,
    refetch: fetchSession,
  }
}
