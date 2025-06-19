import { healthCheck } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const health = await healthCheck()

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: health,
    })
  } catch (error) {
    console.error("Health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
