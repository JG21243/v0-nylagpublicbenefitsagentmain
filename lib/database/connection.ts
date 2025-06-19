import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

// Create the SQL client
export const sql = neon(process.env.DATABASE_URL)

// Test database connection
export async function testConnection() {
  try {
    const result = await sql`SELECT NOW() as current_time`
    console.log("Database connected successfully:", result[0].current_time)
    return true
  } catch (error) {
    console.error("Database connection failed:", error)
    return false
  }
}

// Health check function
export async function healthCheck() {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total_sessions,
        (SELECT COUNT(*) FROM chat_messages) as total_messages,
        (SELECT COUNT(*) FROM research_templates) as total_templates
      FROM chat_sessions
    `
    return {
      status: "healthy",
      stats: result[0],
    }
  } catch (error) {
    return {
      status: "error",
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
