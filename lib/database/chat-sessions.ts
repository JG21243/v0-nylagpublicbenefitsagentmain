import { sql } from "./connection"
import type { ChatSession, ChatMessage, ApiResponse, PaginatedResponse } from "./types"

export class ChatSessionsDB {
  // --- create a chat session ---
  static async create(userId: string | null, title: string): Promise<ApiResponse<ChatSession>> {
    try {
      const id = crypto.randomUUID()
      const rows =
        userId && userId.trim() !== "" && userId !== "null" && userId !== "undefined"
          ? await sql`
              INSERT INTO chat_sessions (id, user_id, title)
              VALUES (${id}::uuid, ${userId}::uuid, ${title})
              RETURNING *
            `
          : await sql`
              INSERT INTO chat_sessions (id, title)
              VALUES (${id}::uuid, ${title})
              RETURNING *
            `

      return { success: true, data: rows[0] as ChatSession }
    } catch (error) {
      console.error("Error creating chat session:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create chat session",
      }
    }
  }

  // Get chat sessions for a user with pagination
  static async getByUser(
    userId: string | null,
    page = 1,
    limit = 20,
    includeArchived = false,
  ): Promise<PaginatedResponse<ChatSession>> {
    try {
      const offset = (page - 1) * limit

      // Get total count
      const countResult = await sql`
        SELECT COUNT(*) as total 
        FROM chat_sessions 
        WHERE (user_id = ${userId} OR ${userId} IS NULL)
        ${includeArchived ? sql`` : sql`AND is_archived = FALSE`}
      `

      const total = Number.parseInt(countResult[0].total)

      // Get paginated results
      const sessions = await sql`
        SELECT * FROM chat_sessions 
        WHERE (user_id = ${userId} OR ${userId} IS NULL)
        ${includeArchived ? sql`` : sql`AND is_archived = FALSE`}
        ORDER BY updated_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      return {
        success: true,
        data: sessions as ChatSession[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      console.error("Error fetching chat sessions:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch chat sessions",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      }
    }
  }

  // Get a specific chat session with messages
  static async getWithMessages(sessionId: string): Promise<ApiResponse<ChatSession & { messages: ChatMessage[] }>> {
    try {
      const sessionResult = await sql`
        SELECT * FROM chat_sessions WHERE id = ${sessionId}
      `

      if (sessionResult.length === 0) {
        return {
          success: false,
          error: "Chat session not found",
        }
      }

      const messagesResult = await sql`
        SELECT * FROM chat_messages 
        WHERE session_id = ${sessionId}
        ORDER BY created_at ASC
      `

      return {
        success: true,
        data: {
          ...(sessionResult[0] as ChatSession),
          messages: messagesResult as ChatMessage[],
        },
      }
    } catch (error) {
      console.error("Error fetching chat session with messages:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch chat session",
      }
    }
  }

  // Update chat session title
  static async updateTitle(sessionId: string, title: string): Promise<ApiResponse<ChatSession>> {
    try {
      const result = await sql`
        UPDATE chat_sessions 
        SET title = ${title}, updated_at = NOW()
        WHERE id = ${sessionId}
        RETURNING *
      `

      if (result.length === 0) {
        return {
          success: false,
          error: "Chat session not found",
        }
      }

      return {
        success: true,
        data: result[0] as ChatSession,
      }
    } catch (error) {
      console.error("Error updating chat session:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update chat session",
      }
    }
  }

  // Archive/unarchive chat session
  static async setArchived(sessionId: string, archived: boolean): Promise<ApiResponse<ChatSession>> {
    try {
      const result = await sql`
        UPDATE chat_sessions 
        SET is_archived = ${archived}, updated_at = NOW()
        WHERE id = ${sessionId}
        RETURNING *
      `

      if (result.length === 0) {
        return {
          success: false,
          error: "Chat session not found",
        }
      }

      return {
        success: true,
        data: result[0] as ChatSession,
      }
    } catch (error) {
      console.error("Error archiving chat session:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to archive chat session",
      }
    }
  }

  // Delete chat session and all messages
  static async delete(sessionId: string): Promise<ApiResponse<void>> {
    try {
      await sql`DELETE FROM chat_sessions WHERE id = ${sessionId}`

      return {
        success: true,
        message: "Chat session deleted successfully",
      }
    } catch (error) {
      console.error("Error deleting chat session:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete chat session",
      }
    }
  }

  // Search chat sessions
  static async search(
    userId: string | null,
    searchTerm: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<ChatSession>> {
    try {
      const offset = (page - 1) * limit

      // Search in session titles and message content
      const searchQuery = `%${searchTerm}%`

      const countResult = await sql`
        SELECT COUNT(DISTINCT s.id) as total
        FROM chat_sessions s
        LEFT JOIN chat_messages m ON s.id = m.session_id
        WHERE (s.user_id = ${userId} OR ${userId} IS NULL)
        AND s.is_archived = FALSE
        AND (
          s.title ILIKE ${searchQuery}
          OR m.content ILIKE ${searchQuery}
        )
      `

      const total = Number.parseInt(countResult[0].total)

      const sessions = await sql`
        SELECT DISTINCT s.*
        FROM chat_sessions s
        LEFT JOIN chat_messages m ON s.id = m.session_id
        WHERE (s.user_id = ${userId} OR ${userId} IS NULL)
        AND s.is_archived = FALSE
        AND (
          s.title ILIKE ${searchQuery}
          OR m.content ILIKE ${searchQuery}
        )
        ORDER BY s.updated_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      return {
        success: true,
        data: sessions as ChatSession[],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      }
    } catch (error) {
      console.error("Error searching chat sessions:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to search chat sessions",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      }
    }
  }
}
