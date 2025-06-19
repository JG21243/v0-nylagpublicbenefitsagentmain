import { ResearchTemplatesDB } from "@/lib/database"
import { NextResponse } from "next/server"

// GET /api/templates/categories - Get all template categories
export async function GET() {
  try {
    const result = await ResearchTemplatesDB.getCategories()

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching template categories:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch template categories",
      },
      { status: 500 },
    )
  }
}
