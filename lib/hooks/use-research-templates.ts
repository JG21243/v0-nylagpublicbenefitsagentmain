"use client"

import { useState, useEffect, useCallback } from "react"
import type { ResearchTemplate, PaginatedResponse } from "@/lib/database/types"

interface UseResearchTemplatesOptions {
  category?: string
  page?: number
  limit?: number
}

export function useResearchTemplates(options: UseResearchTemplatesOptions = {}) {
  const { category, page = 1, limit = 50 } = options

  const [templates, setTemplates] = useState<ResearchTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    totalPages: 0,
  })

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (category) {
        params.append("category", category)
      }

      const response = await fetch(`/api/templates?${params}`)
      const result: PaginatedResponse<ResearchTemplate> = await response.json()

      if (result.success) {
        setTemplates(result.data || [])
        setPagination(result.pagination)
      } else {
        setError(result.error || "Failed to fetch research templates")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [category, page, limit])

  useEffect(() => {
    fetchTemplates()
  }, [fetchTemplates])

  const createTemplate = useCallback(
    async (template: {
      title: string
      category: string
      query_template: string
      description?: string
      is_public?: boolean
    }) => {
      try {
        const response = await fetch("/api/templates", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(template),
        })

        const result = await response.json()

        if (result.success) {
          await fetchTemplates() // Refresh the list
          return result.data
        } else {
          throw new Error(result.error || "Failed to create research template")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create template")
        throw err
      }
    },
    [fetchTemplates],
  )

  return {
    templates,
    loading,
    error,
    pagination,
    createTemplate,
    refetch: fetchTemplates,
  }
}

export function useTemplateCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/templates/categories")
      const result = await response.json()

      if (result.success) {
        setCategories(result.data || [])
      } else {
        setError(result.error || "Failed to fetch template categories")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  }
}
