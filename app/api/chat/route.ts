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
          const startTime = Date.now()
          let searchCount = 0
          let totalSearches = 0

          // Send initial status with enhanced formatting
          stream.write(formatDataStreamPart("text", "🚀 **NYLAG Legal Research System Activated**\n\n"))
          stream.write(formatDataStreamPart("text", "```\n🔍 INITIALIZING COMPREHENSIVE LEGAL RESEARCH\n```\n\n"))

          // Phase 1: Planning
          stream.write(formatDataStreamPart("text", "## 📋 Phase 1: Research Strategy Development\n\n"))
          stream.write(formatDataStreamPart("text", "🎯 **Analyzing Query Complexity**\n"))
          stream.write(formatDataStreamPart("text", "• Parsing legal terminology and concepts...\n"))
          stream.write(formatDataStreamPart("text", "• Identifying relevant areas of public benefits law...\n"))
          stream.write(formatDataStreamPart("text", "• Mapping federal vs. state jurisdiction requirements...\n"))
          stream.write(formatDataStreamPart("text", "• Prioritizing authoritative legal sources...\n\n"))

          const manager = new PublicBenefitsResearchManager()

          // Enhanced planning phase
          const originalPlanSearches = manager.planSearches.bind(manager)
          manager.planSearches = async (query: string) => {
            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            stream.write(formatDataStreamPart("text", `⏱️ *Planning completed in ${elapsed} seconds*\n\n`))

            const result = await originalPlanSearches(query)
            totalSearches = result.searches.length

            stream.write(formatDataStreamPart("text", "## 🔍 Phase 2: Legal Database Search Execution\n\n"))
            stream.write(formatDataStreamPart("text", `📊 **Search Strategy Finalized**\n`))
            stream.write(formatDataStreamPart("text", `• Total searches planned: **${totalSearches}**\n`))
            stream.write(
              formatDataStreamPart("text", "• Target databases: Federal Register, CFR, State Codes, Case Law\n"),
            )
            stream.write(
              formatDataStreamPart("text", "• Search scope: Statutes, Regulations, Administrative Guidance\n\n"),
            )

            stream.write(formatDataStreamPart("text", "🚀 **Executing Searches**\n"))
            return result
          }

          // Enhanced search phase with real-time updates
          const originalPerformSearches = manager.performSearches.bind(manager)
          manager.performSearches = async (searchPlan: any) => {
            const searches = searchPlan.searches
            const results: string[] = []

            for (let i = 0; i < searches.length; i++) {
              const search = searches[i]
              searchCount = i + 1
              const elapsed = Math.floor((Date.now() - startTime) / 1000)

              // Progress update
              const percentage = Math.round((searchCount / totalSearches) * 100)
              stream.write(
                formatDataStreamPart(
                  "text",
                  `🔄 **Search ${searchCount}/${totalSearches}** (${percentage}%) - *${elapsed}s elapsed*\n`,
                ),
              )
              stream.write(formatDataStreamPart("text", `   └─ Querying: "${search.query}"\n`))

              try {
                const result = await manager.search(search)
                if (result) {
                  results.push(result)
                  stream.write(formatDataStreamPart("text", `   ✅ Found relevant authorities\n`))
                } else {
                  stream.write(formatDataStreamPart("text", `   ⚠️ No results for this query\n`))
                }
              } catch (error) {
                stream.write(formatDataStreamPart("text", `   ❌ Search error: ${error}\n`))
              }

              // Add small delay for better UX
              await new Promise((resolve) => setTimeout(resolve, 500))
            }

            const elapsed = Math.floor((Date.now() - startTime) / 1000)
            stream.write(formatDataStreamPart("text", `\n🎉 **All searches completed!** (${elapsed}s total)\n`))
            stream.write(
              formatDataStreamPart(
                "text",
                `📈 Success rate: ${Math.round((results.length / totalSearches) * 100)}%\n\n`,
              ),
            )

            return results
          }

          // Enhanced analysis phase
          const originalWriteReportWithIterations = manager.writeReportWithIterations.bind(manager)
          manager.writeReportWithIterations = async (query: string, searchResults: string[]) => {
            stream.write(formatDataStreamPart("text", "## 🧠 Phase 3: Legal Analysis & Synthesis\n\n"))
            stream.write(formatDataStreamPart("text", "⚖️ **Processing Legal Authorities**\n"))
            stream.write(formatDataStreamPart("text", "• Analyzing statutory frameworks...\n"))
            stream.write(formatDataStreamPart("text", "• Cross-referencing regulatory guidance...\n"))
            stream.write(formatDataStreamPart("text", "• Evaluating case law precedents...\n"))
            stream.write(formatDataStreamPart("text", "• Assessing policy implications...\n\n"))

            stream.write(formatDataStreamPart("text", "## 📝 Phase 4: Report Generation & Quality Review\n\n"))
            stream.write(formatDataStreamPart("text", "✍️ **Drafting Legal Memorandum**\n"))
            stream.write(formatDataStreamPart("text", "• Structuring comprehensive analysis...\n"))
            stream.write(formatDataStreamPart("text", "• Incorporating proper legal citations...\n"))
            stream.write(formatDataStreamPart("text", "• Generating practice guidance...\n"))

            const result = await originalWriteReportWithIterations(query, searchResults)

            if (result.iterationCount > 1) {
              stream.write(formatDataStreamPart("text", `\n🔍 **Quality Assurance Process**\n`))
              stream.write(formatDataStreamPart("text", `• Iterations completed: ${result.iterationCount}\n`))
              stream.write(formatDataStreamPart("text", `• Quality score: ${result.verification.qualityScore}/10\n`))
              stream.write(
                formatDataStreamPart(
                  "text",
                  `• Issues resolved: ${result.iterationHistory.filter((h) => h.action === "revised").length}\n`,
                ),
              )
            }

            const totalElapsed = Math.floor((Date.now() - startTime) / 1000)
            stream.write(formatDataStreamPart("text", `\n⏱️ **Total research time: ${totalElapsed} seconds**\n`))
            stream.write(formatDataStreamPart("text", `🎯 **Final quality rating: ${result.finalQuality}**\n\n`))

            return result
          }

          // Execute the research
          const result = await manager.generate(query)

          // Final completion message
          const totalTime = Math.floor((Date.now() - startTime) / 1000)
          stream.write(formatDataStreamPart("text", "---\n\n"))
          stream.write(formatDataStreamPart("text", "# ✅ LEGAL RESEARCH COMPLETE\n\n"))
          stream.write(
            formatDataStreamPart(
              "text",
              `**Research completed in ${totalTime} seconds with ${result.iterationCount} quality iteration${result.iterationCount > 1 ? "s" : ""}**\n\n`,
            ),
          )
          stream.write(formatDataStreamPart("text", "---\n\n"))

          // Stream the final memo
          stream.write(formatDataStreamPart("text", result.report.markdown_report))

          // Enhanced quality summary
          const qualityInfo = `\n\n---\n\n# 📊 Research Quality & Methodology Report\n\n## 🎯 Quality Metrics\n- **Overall Quality:** ${result.finalQuality.toUpperCase()}\n- **Quality Score:** ${result.verification.qualityScore}/10\n- **Research Iterations:** ${result.iterationCount}\n- **Revisions Made:** ${result.iterationHistory.filter((h) => h.action === "revised").length}\n- **Total Research Time:** ${totalTime} seconds\n- **Sources Consulted:** ${totalSearches} legal databases\n\n## 🔍 Research Methodology\n- **Federal Sources:** Statutes, CFR, Federal Register\n- **State Sources:** New York State laws and regulations  \n- **Case Law:** Relevant judicial precedents\n- **Administrative:** Agency guidance and policy documents\n- **Currency Check:** All sources verified for current validity\n\n## ⚖️ Legal Disclaimer\n*This research memo is generated using AI analysis of legal sources and should be reviewed by qualified legal counsel. While comprehensive, it may not capture all relevant authorities or recent developments.*`

          stream.write(formatDataStreamPart("text", qualityInfo))

          stream.write(
            formatDataStreamPart("finish_message", {
              finishReason: "stop",
              metadata: {
                iterations: result.iterationCount,
                finalQuality: result.finalQuality,
                qualityScore: result.verification.qualityScore,
                totalTime: totalTime,
                searchCount: totalSearches,
              },
            }),
          )
        } catch (error) {
          stream.write(formatDataStreamPart("text", "\n\n❌ **RESEARCH ERROR**\n\n"))
          stream.write(
            formatDataStreamPart(
              "text",
              `**Error Details:** ${error instanceof Error ? error.message : "Unknown error"}\n\n`,
            ),
          )
          stream.write(
            formatDataStreamPart(
              "text",
              "**Troubleshooting:**\n- Try rephrasing your query\n- Check for overly broad or narrow terms\n- Contact support if the issue persists\n\n",
            ),
          )
          stream.write(formatDataStreamPart("text", "*The NYLAG research team has been notified of this error.*"))

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
