import { ChatSessionsDB } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/chat-sessions/[sessionId] - Get specific chat session with messages
export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const result = await ChatSessionsDB.getWithMessages(params.sessionId)

    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    })
  } catch (error) {
    console.error("Error fetching chat session:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch chat session",
      },
      { status: 500 },
    )
  }
}

// PATCH /api/chat-sessions/[sessionId] - Update chat session
export async function PATCH(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const body = await request.json()

    if (body.title) {
      const result = await ChatSessionsDB.updateTitle(params.sessionId, body.title)
      return NextResponse.json(result, {
        status: result.success ? 200 : 404,
      })
    }

    if (typeof body.archived === "boolean") {
      const result = await ChatSessionsDB.setArchived(params.sessionId, body.archived)
      return NextResponse.json(result, {
        status: result.success ? 200 : 404,
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: "No valid updates provided",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Error updating chat session:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update chat session",
      },
      { status: 500 },
    )
  }
}

// DELETE /api/chat-sessions/[sessionId] - Delete chat session
export async function DELETE(request: NextRequest, { params }: { params: { sessionId: string } }) {
  try {
    const result = await ChatSessionsDB.delete(params.sessionId)

    return NextResponse.json(result, {
      status: result.success ? 200 : 404,
    })
  } catch (error) {
    console.error("Error deleting chat session:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete chat session",
      },
      { status: 500 },
    )
  }
}
