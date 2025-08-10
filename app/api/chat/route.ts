// Using Request type to avoid dependency on next/server typings
import { withTrace } from "@openai/agents"
import { streamText } from "ai"
import { formatDataStreamPart } from "@ai-sdk/ui-utils"
import { PublicBenefitsResearchManager } from "@/lib/manager"

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    const last = messages[messages.length - 1]
    const query = last?.content || ""

    if (!query.trim()) {
      return new Response(JSON.stringify({ error: "Query cannot be empty" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Check for required environment variables
    if (!process.env.OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY environment variable")
      return new Response(
        JSON.stringify({
          error: "OpenAI API key not configured. Please contact the administrator.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    const manager = new PublicBenefitsResearchManager()
    const result = await withTrace("NYLAG public benefits research workflow", async () => {
      return manager.generate(query)
    })

    return createDataStreamResponse({
      execute: (stream) => {
        // Stream iteration information first
        const iterationSummary = `*Research completed with ${result.iterationCount} iteration${result.iterationCount > 1 ? "s" : ""} - Final quality: ${result.finalQuality}*\n\n`
        stream.write(formatDataStreamPart("text", iterationSummary))

        // Stream the final memo
        stream.write(formatDataStreamPart("text", result.report.markdown_report))

        // Add quality information at the end
        const qualityInfo = `\n\n---\n\n**Research Quality Summary:**\n- Iterations: ${result.iterationCount}\n- Final Quality: ${result.finalQuality}\n- Quality Score: ${result.verification.qualityScore}/10\n- Issues Resolved: ${result.iterationHistory.filter((h) => h.action === "revised").length} revision${result.iterationHistory.filter((h) => h.action === "revised").length !== 1 ? "s" : ""} made`
        stream.write(formatDataStreamPart("text", qualityInfo))

        stream.write(
          formatDataStreamPart("finish_message", {
            finishReason: "stop",
            metadata: {
              iterations: result.iterationCount,
              finalQuality: result.finalQuality,
              qualityScore: result.verification.qualityScore,
            },
          }),
        )
      },
    })
  } catch (error) {
    console.error("API Error:", error)

    // Provide more specific error messages
    let errorMessage = "An error occurred while processing your request"
    let suggestion = "Please try again or contact support if the issue persists."

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        errorMessage = "OpenAI API authentication failed"
        suggestion = "Please check that the OpenAI API key is valid and has sufficient credits."
      } else if (error.message.includes("rate limit")) {
        errorMessage = "API rate limit exceeded"
        suggestion = "Please wait a moment and try again."
      } else if (error.message.includes("network") || error.message.includes("fetch")) {
        errorMessage = "Network connection error"
        suggestion = "Please check your internet connection and try again."
      }
    }

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: error instanceof Error ? error.message : "Unknown error",
        suggestion: suggestion,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
