import { ChatSessionsDB } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

// Helper – sanitise userId coming from query, header, or body
function normaliseUserId(raw: unknown): string | null {
  if (raw === null || raw === undefined || raw === "" || raw === "null" || raw === "undefined") {
    return null
  }
  return String(raw)
}

// GET /api/chat-sessions - Get user's chat sessions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const includeArchived = searchParams.get("includeArchived") === "true"
    const search = searchParams.get("search")

    const userId = normaliseUserId(searchParams.get("userId"))

    let result
    if (search) {
      result = await ChatSessionsDB.search(userId, search, page, limit)
    } else {
      result = await ChatSessionsDB.getByUser(userId, page, limit, includeArchived)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch chat sessions",
      },
      { status: 500 },
    )
  }
}

// POST /api/chat-sessions - Create new chat session
export async function POST(request: NextRequest) {
  try {
    // Read body ONCE
    const body = await request.json()
    const { title, userId: bodyUserId } = body

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Title is required",
        },
        { status: 400 },
      )
    }

    // Accept userId from header or body; normalise to null or valid UUID string
    const rawUserId = request.headers.get("x-user-id") ?? bodyUserId ?? null
    const userId = normaliseUserId(rawUserId)

    const result = await ChatSessionsDB.create(userId, title)

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    })
  } catch (error) {
    console.error("Error creating chat session:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create chat session",
      },
      { status: 500 },
    )
  }
}
