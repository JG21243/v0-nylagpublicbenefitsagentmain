import { ResearchTemplatesDB } from "@/lib/database"
import { type NextRequest, NextResponse } from "next/server"

// GET /api/templates - Get research templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || undefined
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // For now, we'll use null as userId since we don't have auth yet
    const userId = null

    const result = await ResearchTemplatesDB.getByCategory(category, userId, page, limit)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching research templates:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch research templates",
      },
      { status: 500 },
    )
  }
}

// POST /api/templates - Create new research template
export async function POST(request: NextRequest) {
  try {
    const { title, category, query_template, description, is_public } = await request.json()

    if (!title || !category || !query_template) {
      return NextResponse.json(
        {
          success: false,
          error: "Title, category, and query_template are required",
        },
        { status: 400 },
      )
    }

    // For now, we'll use null as createdBy since we don't have auth yet
    const createdBy = null

    const result = await ResearchTemplatesDB.create(
      title,
      category,
      query_template,
      description || null,
      is_public !== false, // Default to true
      createdBy,
    )

    return NextResponse.json(result, {
      status: result.success ? 201 : 400,
    })
  } catch (error) {
    console.error("Error creating research template:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create research template",
      },
      { status: 500 },
    )
  }
}
