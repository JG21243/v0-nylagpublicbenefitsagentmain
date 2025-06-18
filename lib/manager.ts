import { type Agent, run, type RunResult } from "@openai/agents"
import { legalAnalystAgent } from "./agents"
import { plannerAgent, type PublicBenefitsSearchItem, type PublicBenefitsSearchPlan } from "./agents"
import { policyImpactAgent } from "./agents"
import { searchAgent } from "./agents"
import { verifierAgent, type VerificationResult } from "./agents"
import { writerAgent, type PublicBenefitsReportData } from "./agents"
import { revisionAgent } from "./agents"

// Custom output extractor for sub-agents that return an AnalysisSummary
async function summaryExtractor(runResult: RunResult<unknown, Agent<unknown, any>>): Promise<string> {
  return String(runResult.finalOutput.summary)
}

// Quality thresholds for determining when to iterate
const QUALITY_THRESHOLDS = {
  excellent: { minScore: 9, maxCriticalIssues: 0 },
  good: { minScore: 7, maxCriticalIssues: 0 },
  needs_revision: { minScore: 5, maxCriticalIssues: 2 },
  poor: { minScore: 0, maxCriticalIssues: 999 },
}

export interface ResearchResult {
  report: PublicBenefitsReportData
  verification: VerificationResult
  iterationCount: number
  finalQuality: string
  iterationHistory: Array<{
    iteration: number
    quality: string
    issuesFound: number
    action: "revised" | "finalized"
  }>
}

export class PublicBenefitsResearchManager {
  private originalQuery = ""
  private maxIterations = 3

  async run(query: string): Promise<void> {
    console.log(`[start] Starting public benefits legal research...`)
    const result = await this.generate(query)

    const finalReport = `Legal Research Summary\n\n${result.report.short_summary}`
    console.log(finalReport)
    console.log("\n\n=====LEGAL RESEARCH MEMO=====\n\n")
    console.log(`${result.report.markdown_report}`)
    console.log("\n\n=====FOLLOW-UP RESEARCH QUESTIONS=====\n\n")
    console.log(result.report.follow_up_questions.join("\n"))
    console.log("\n\n=====FINAL QUALITY ASSESSMENT=====\n\n")
    console.log(`Quality: ${result.finalQuality} (${result.iterationCount} iterations)`)
    console.log(result.verification)
  }

  async generate(query: string): Promise<ResearchResult> {
    try {
      this.originalQuery = query
      console.log(`[generate] Processing query: ${query.substring(0, 100)}...`)

      const searchPlan = await this.planSearches(query)
      const searchResults = await this.performSearches(searchPlan)
      const result = await this.writeReportWithIterations(query, searchResults)

      console.log(
        `[generate] Successfully generated report with ${result.iterationCount} iterations, final quality: ${result.finalQuality}`,
      )
      return result
    } catch (error) {
      console.error("[generate] Error in research workflow:", error)
      throw error
    }
  }

  async planSearches(query: string): Promise<PublicBenefitsSearchPlan> {
    console.log(`[planning] Planning legal research searches...`)
    try {
      const result = await run(plannerAgent, `Legal Research Query: ${query}`)
      console.log(`[planning] Will perform ${result.finalOutput?.searches.length} legal searches`)
      return result.finalOutput!
    } catch (error) {
      console.error("[planning] Error planning searches:", error)
      throw new Error(`Failed to plan research searches: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async performSearches(searchPlan: PublicBenefitsSearchPlan): Promise<string[]> {
    console.log(`[searching] Conducting legal research...`)
    let numCompleted = 0
    const results: (string | null)[] = new Array(searchPlan.searches.length)

    try {
      await Promise.all(
        searchPlan.searches.map(async (item, i) => {
          const result = await this.search(item)
          results[i] = result
          numCompleted++
          console.log(`[searching] Legal research... ${numCompleted}/${searchPlan.searches.length} completed`)
        }),
      )
      console.log(`[searching] Done with legal research searches.`)
      return results.filter((r): r is string => r !== null)
    } catch (error) {
      console.error("[searching] Error performing searches:", error)
      throw new Error(
        `Failed to perform research searches: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  async search(item: PublicBenefitsSearchItem): Promise<string | null> {
    const inputData = `Legal search term: ${item.query}\nReason: ${item.reason}`
    try {
      const result = await run(searchAgent, inputData)
      return String(result.finalOutput)
    } catch (error) {
      console.error(`[search] Error searching for "${item.query}":`, error)
      return null
    }
  }

  async writeReportWithIterations(query: string, searchResults: string[]): Promise<ResearchResult> {
    let currentIteration = 0
    let currentReport = await this.generateInitialReport(query, searchResults)
    const iterationHistory: ResearchResult["iterationHistory"] = []

    while (currentIteration < this.maxIterations) {
      console.log(`[iteration ${currentIteration + 1}] Reviewing draft memo...`)

      const verification = await this.verifyReport(currentReport)
      const criticalIssues = verification.specificIssues.filter((i) => i.severity === "critical")
      const totalIssues = verification.specificIssues.length

      // Record this iteration
      const shouldRevise = this.shouldRevise(verification, currentIteration)
      iterationHistory.push({
        iteration: currentIteration + 1,
        quality: verification.overallQuality,
        issuesFound: totalIssues,
        action: shouldRevise ? "revised" : "finalized",
      })

      // If quality is acceptable or we're out of iterations, finalize
      if (!shouldRevise) {
        console.log(
          `[iteration ${currentIteration + 1}] Quality acceptable (${verification.overallQuality}, ${criticalIssues.length} critical issues), finalizing memo`,
        )
        return {
          report: currentReport,
          verification,
          iterationCount: currentIteration + 1,
          finalQuality: verification.overallQuality,
          iterationHistory,
        }
      }

      // Revise the report
      console.log(
        `[iteration ${currentIteration + 1}] Found ${criticalIssues.length} critical issues and ${totalIssues} total issues, revising...`,
      )
      currentReport = await this.reviseReport(currentReport, verification)
      currentIteration++
    }

    // Final verification after max iterations
    const finalVerification = await this.verifyReport(currentReport)
    console.log(
      `[iteration ${currentIteration + 1}] Max iterations reached, finalizing memo with quality: ${finalVerification.overallQuality}`,
    )

    return {
      report: currentReport,
      verification: finalVerification,
      iterationCount: currentIteration + 1,
      finalQuality: finalVerification.overallQuality,
      iterationHistory,
    }
  }

  private shouldRevise(verification: VerificationResult, currentIteration: number): boolean {
    // Don't revise if we're at max iterations
    if (currentIteration >= this.maxIterations - 1) {
      return false
    }

    // Always revise if there are critical issues
    const criticalIssues = verification.specificIssues.filter((i) => i.severity === "critical")
    if (criticalIssues.length > 0) {
      return true
    }

    // Revise if overall quality suggests revision and score is low
    if (verification.recommendRevision && verification.qualityScore < 7) {
      return true
    }

    return false
  }

  async generateInitialReport(query: string, searchResults: string[]): Promise<PublicBenefitsReportData> {
    // Expose the specialist analysts as tools
    const legalAnalysisTool = legalAnalystAgent.asTool({
      toolName: "legal_analysis",
      toolDescription: "Use to get a short write-up of relevant legal authorities and requirements",
      customOutputExtractor: summaryExtractor,
    })
    const policyImpactTool = policyImpactAgent.asTool({
      toolName: "policy_impact_analysis",
      toolDescription: "Use to get a short write-up of potential client impact and policy considerations",
      customOutputExtractor: summaryExtractor,
    })
    const writerWithTools = writerAgent.clone({
      tools: [legalAnalysisTool, policyImpactTool],
    })

    console.log(`[writing] Drafting initial legal research memo...`)
    try {
      const inputData = `Original legal research query: ${query}\nSummarized legal research results: ${searchResults}`
      const result = await run(writerWithTools, inputData)
      console.log(`[writing] Done drafting initial legal research memo.`)
      return result.finalOutput!
    } catch (error) {
      console.error("[writing] Error writing initial report:", error)
      throw new Error(
        `Failed to write initial research report: ${error instanceof Error ? error.message : "Unknown error"}`,
      )
    }
  }

  async reviseReport(
    originalReport: PublicBenefitsReportData,
    feedback: VerificationResult,
  ): Promise<PublicBenefitsReportData> {
    console.log(`[revision] Revising memo based on ${feedback.specificIssues.length} issues...`)

    const revisionInput = `ORIGINAL QUERY: ${this.originalQuery}
    
CURRENT MEMO:
${originalReport.markdown_report}

REVIEWER FEEDBACK:
Overall Quality: ${feedback.overallQuality} (Score: ${feedback.qualityScore}/10)
Recommendation: ${feedback.recommendRevision ? "REVISE" : "ACCEPTABLE"}

CRITICAL ISSUES TO FIX:
${feedback.specificIssues
  .filter((issue) => issue.severity === "critical")
  .map(
    (issue) => `- ${issue.category.toUpperCase()}: ${issue.description}
  Location: ${issue.location || "General issue"}
  Fix: ${issue.suggestedFix}`,
  )
  .join("\n")}

IMPORTANT ISSUES TO ADDRESS:
${feedback.specificIssues
  .filter((issue) => issue.severity === "important")
  .map(
    (issue) => `- ${issue.category.toUpperCase()}: ${issue.description}
  Location: ${issue.location || "General issue"}
  Fix: ${issue.suggestedFix}`,
  )
  .join("\n")}

MISSING TOPICS TO ADD:
${feedback.missingTopics.map((topic) => `- ${topic}`).join("\n")}

STRENGTHS TO PRESERVE:
${feedback.strengthsToPreserve.map((strength) => `- ${strength}`).join("\n")}

Please create an improved version that addresses these issues while maintaining the memo's structure and preserving its strengths.`

    try {
      const result = await run(revisionAgent, revisionInput)
      console.log(`[revision] Completed memo revision.`)
      return result.finalOutput!
    } catch (error) {
      console.error("[revision] Error revising report:", error)
      throw new Error(`Failed to revise research report: ${error instanceof Error ? error.message : "Unknown error"}`)
    }
  }

  async verifyReport(report: PublicBenefitsReportData): Promise<VerificationResult> {
    console.log(`[verifying] Verifying legal accuracy and quality...`)
    try {
      const result = await run(verifierAgent, report.markdown_report)
      console.log(
        `[verifying] Quality assessment complete: ${result.finalOutput!.overallQuality} (${result.finalOutput!.qualityScore}/10)`,
      )
      return result.finalOutput!
    } catch (error) {
      console.error("[verifying] Error verifying report:", error)
      // Return a default verification result if verification fails
      return {
        verified: false,
        overallQuality: "poor",
        qualityScore: 3,
        specificIssues: [
          {
            category: "factual_error",
            description: `Verification failed: ${error instanceof Error ? error.message : "Unknown error"}`,
            severity: "critical",
            suggestedFix: "Manual review required due to verification system error",
            location: null,
          },
        ],
        missingTopics: [],
        strengthsToPreserve: [],
        recommendRevision: false,
      }
    }
  }
}
