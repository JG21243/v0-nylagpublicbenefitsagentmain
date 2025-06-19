import { sql } from "./connection"
import type { ChatMessage, ApiResponse } from "./types"

export class ChatMessagesDB {
  // Add a message to a chat session
  static async create(
    sessionId: string,
    role: "user" | "assistant",
    content: string,
    metadata: Record<string, any> = {},
  ): Promise<ApiResponse<ChatMessage>> {
    try {
      const result = await sql`
        INSERT INTO chat_messages (session_id, role, content, metadata)
        VALUES (${sessionId}, ${role}, ${content}, ${JSON.stringify(metadata)})
        RETURNING *
      `

      // Update session's updated_at timestamp
      await sql`
        UPDATE chat_sessions 
        SET updated_at = NOW() 
        WHERE id = ${sessionId}
      `

      return {
        success: true,
        data: result[0] as ChatMessage,
      }
    } catch (error) {
      console.error("Error creating chat message:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create chat message",
      }
    }
  }

  // Get messages for a session
  static async getBySession(sessionId: string): Promise<ApiResponse<ChatMessage[]>> {
    try {
      const messages = await sql`
        SELECT * FROM chat_messages 
        WHERE session_id = ${sessionId}
        ORDER BY created_at ASC
      `

      return {
        success: true,
        data: messages as ChatMessage[],
      }
    } catch (error) {
      console.error("Error fetching chat messages:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch chat messages",
        data: [],
      }
    }
  }

  // Delete a specific message
  static async delete(messageId: string): Promise<ApiResponse<void>> {
    try {
      await sql`DELETE FROM chat_messages WHERE id = ${messageId}`

      return {
        success: true,
        message: "Chat message deleted successfully",
      }
    } catch (error) {
      console.error("Error deleting chat message:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete chat message",
      }
    }
  }

  // Update message metadata (for things like ratings, bookmarks, etc.)
  static async updateMetadata(messageId: string, metadata: Record<string, any>): Promise<ApiResponse<ChatMessage>> {
    try {
      const result = await sql`
        UPDATE chat_messages 
        SET metadata = ${JSON.stringify(metadata)}
        WHERE id = ${messageId}
        RETURNING *
      `

      if (result.length === 0) {
        return {
          success: false,
          error: "Chat message not found",
        }
      }

      return {
        success: true,
        data: result[0] as ChatMessage,
      }
    } catch (error) {
      console.error("Error updating chat message metadata:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update chat message",
      }
    }
  }
}
