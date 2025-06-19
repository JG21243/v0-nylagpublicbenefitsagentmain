export interface User {
  id: string
  email: string
  name: string
  role: "attorney" | "admin" | "paralegal"
  created_at: Date
  updated_at: Date
}

export interface ChatSession {
  id: string
  user_id: string | null
  title: string
  created_at: Date
  updated_at: Date
  is_archived: boolean
}

export interface ChatMessage {
  id: string
  session_id: string
  role: "user" | "assistant"
  content: string
  metadata: Record<string, any>
  created_at: Date
}

export interface ResearchTemplate {
  id: string
  title: string
  category: string
  query_template: string
  description: string | null
  is_public: boolean
  created_by: string | null
  created_at: Date
  updated_at: Date
}

export interface SavedSearch {
  id: string
  user_id: string
  query: string
  title: string | null
  tags: string[]
  created_at: Date
}

export interface ResearchDocument {
  id: string
  session_id: string
  filename: string
  blob_url: string
  file_type: string | null
  file_size: number | null
  created_at: Date
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
