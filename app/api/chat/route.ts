import { createDataStreamResponse } from "ai"
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

    return createDataStreamResponse({
      execute: async (stream) => {
        try {
          // Send initial status
          stream.write(formatDataStreamPart("text", "🔍 **Starting Legal Research Process**\n\n"))

          // Planning phase
          stream.write(formatDataStreamPart("text", "**Phase 1: Research Planning**\n"))
          stream.write(formatDataStreamPart("text", "• Analyzing your query for key legal concepts...\n"))
          stream.write(formatDataStreamPart("text", "• Identifying relevant areas of public benefits law...\n"))
          stream.write(formatDataStreamPart("text", "• Planning comprehensive search strategy...\n\n"))

          // Execute research with progress updates
          const manager = new PublicBenefitsResearchManager()

          // Override the manager's methods to provide streaming updates
          const originalPlanSearches = manager.planSearches.bind(manager)
          manager.planSearches = async (query: string) => {
            stream.write(formatDataStreamPart("text", "**Phase 2: Search Planning Complete**\n"))
            const result = await originalPlanSearches(query)
            stream.write(
              formatDataStreamPart("text", `• Will perform ${result.searches.length} targeted legal searches\n`),
            )
            stream.write(
              formatDataStreamPart("text", "• Focusing on statutes, regulations, case law, and agency guidance\n\n"),
            )
            return result
          }

          const originalPerformSearches = manager.performSearches.bind(manager)
          manager.performSearches = async (searchPlan: any) => {
            stream.write(formatDataStreamPart("text", "**Phase 3: Conducting Legal Research**\n"))
            stream.write(formatDataStreamPart("text", "• Searching federal and state legal databases...\n"))

            const results = await originalPerformSearches(searchPlan)

            stream.write(formatDataStreamPart("text", `• Completed ${searchPlan.searches.length} legal searches\n`))
            stream.write(formatDataStreamPart("text", "• Gathered relevant legal authorities and precedents\n\n"))
            return results
          }

          const originalWriteReportWithIterations = manager.writeReportWithIterations.bind(manager)
          manager.writeReportWithIterations = async (query: string, searchResults: string[]) => {
            stream.write(formatDataStreamPart("text", "**Phase 4: Analysis & Report Generation**\n"))
            stream.write(formatDataStreamPart("text", "• Analyzing legal authorities and requirements...\n"))
            stream.write(formatDataStreamPart("text", "• Synthesizing research findings...\n"))
            stream.write(formatDataStreamPart("text", "• Generating comprehensive legal memo...\n"))

            const result = await originalWriteReportWithIterations(query, searchResults)

            if (result.iterationCount > 1) {
              stream.write(
                formatDataStreamPart("text", `• Quality review completed (${result.iterationCount} iterations)\n`),
              )
            }
            stream.write(formatDataStreamPart("text", `• Final quality assessment: ${result.finalQuality}\n\n`))

            return result
          }

          // Execute the research
          const result = await manager.generate(query)

          // Stream completion status
          stream.write(formatDataStreamPart("text", "**✅ Research Complete!**\n\n"))
          stream.write(formatDataStreamPart("text", "---\n\n"))

          // Stream the final memo
          stream.write(formatDataStreamPart("text", result.report.markdown_report))

          // Add quality information at the end
          const qualityInfo = `\n\n---\n\n**📊 Research Quality Summary:**\n- **Iterations:** ${result.iterationCount}\n- **Final Quality:** ${result.finalQuality}\n- **Quality Score:** ${result.verification.qualityScore}/10\n- **Revisions Made:** ${result.iterationHistory.filter((h) => h.action === "revised").length}\n\n*This research was conducted using authoritative legal sources including federal and state statutes, regulations, case law, and agency guidance documents.*`
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
        } catch (error) {
          stream.write(formatDataStreamPart("text", "\n\n❌ **Research Error**\n\n"))
          stream.write(
            formatDataStreamPart(
              "text",
              `An error occurred during the research process: ${error instanceof Error ? error.message : "Unknown error"}\n\n`,
            ),
          )
          stream.write(
            formatDataStreamPart("text", "Please try rephrasing your query or contact support if the issue persists."),
          )

          stream.write(
            formatDataStreamPart("finish_message", {
              finishReason: "error",
              metadata: { error: error instanceof Error ? error.message : "Unknown error" },
            }),
          )
        }
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
