export interface ChatMessage {
  id: string
  query: string
  response: string
  timestamp: Date
}

export class ChatStorage {
  private static readonly STORAGE_KEY = "nylag-chat-history"
  private static readonly MAX_HISTORY_ITEMS = 100

  static saveMessage(query: string, response: string): void {
    try {
      const history = this.getHistory()
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        query,
        response,
        timestamp: new Date(),
      }

      const updatedHistory = [newMessage, ...history].slice(0, this.MAX_HISTORY_ITEMS)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory))

      // Dispatch event for sidebar to update
      window.dispatchEvent(
        new CustomEvent("newChatMessage", {
          detail: { query, response },
        }),
      )
    } catch (error) {
      console.error("Error saving chat message:", error)
    }
  }

  static getHistory(): ChatMessage[] {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY)
      if (!saved) return []

      const parsed = JSON.parse(saved)
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }))
    } catch (error) {
      console.error("Error loading chat history:", error)
      return []
    }
  }

  static deleteMessage(id: string): void {
    try {
      const history = this.getHistory()
      const updatedHistory = history.filter((item) => item.id !== id)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedHistory))
    } catch (error) {
      console.error("Error deleting chat message:", error)
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY)
    } catch (error) {
      console.error("Error clearing chat history:", error)
    }
  }

  static searchHistory(searchTerm: string): ChatMessage[] {
    const history = this.getHistory()
    if (!searchTerm.trim()) return history

    return history.filter(
      (item) =>
        item.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.response.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }
}
