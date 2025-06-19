/* eslint-disable max-lines */
/**
 * NYLAG Public Benefits Agent definitions
 * --------------------------------------
 * 7 co-operating agents:
 *  • Planner          – o3-mini
 *  • Search           – gpt-4.1  + web search
 *  • Legal Analyst    – gpt-4.1  + web search
 *  • Policy Impact    – gpt-4.1  + web search
 *  • Writer           – gpt-4.1
 *  • Verifier         – gpt-4.1
 *  • Revision         – o3       + web search  (high reasoning effort)
 *
 * All Bluebook (21st ed.) citation rules are baked into the prompts.
 */
import { Agent, webSearchTool } from "@openai/agents"
import { z } from "zod"

/* ----------  Utility Schemas  ---------- */

export const AnalysisSummary = z.object({
  summary: z.string().describe("Short text summary of this aspect of the analysis."),
})
export type AnalysisSummary = z.infer<typeof AnalysisSummary>

/* ----------  1. Planner Agent  ---------- */

const plannerPrompt = `You are a legal research planner specializing in public-benefits law for NYLAG attorneys.
Given a research request, output 4-6 targeted web searches focusing on authoritative legal sources
(statutes, regulations, recent cases, agency guidance, advocacy memos, policy changes).`

export const PublicBenefitsSearchItem = z.object({
  reason: z.string().describe("Why this search is relevant."),
  query: z.string().describe("Exact search term to use."),
})
export type PublicBenefitsSearchItem = z.infer<typeof PublicBenefitsSearchItem>

export const PublicBenefitsSearchPlan = z.object({
  searches: z.array(PublicBenefitsSearchItem).describe("List of searches to perform."),
})
export type PublicBenefitsSearchPlan = z.infer<typeof PublicBenefitsSearchPlan>

export const plannerAgent = new Agent({
  name: "PublicBenefitsPlannerAgent",
  instructions: plannerPrompt,
  model: "o3-mini",
  outputType: PublicBenefitsSearchPlan,
})

/* ----------  2. Search Agent  ---------- */

const searchPrompt = `You are a legal research assistant.
Use web search to retrieve up-to-date information on public-benefits law and return a summary ≤300 words.
Prioritize federal / NY state agencies, courts, and reputable legal-aid sources.
Focus on citations, eligibility rules, deadlines, and practical guidance.`

export const searchAgent = new Agent({
  name: "PublicBenefitsSearchAgent",
  instructions: searchPrompt,
  model: "gpt-4.1",
  tools: [webSearchTool()],
  modelSettings: { toolChoice: "required" },
})

/* ----------  3. Legal Analyst Agent  ---------- */

const legalAnalystPrompt = `You are a legal analyst specializing in public-benefits law
(SNAP, TANF, Medicaid, housing, SSI/SSDI, etc.).
Given web-search results, write a concise analysis (≤2 paragraphs) covering statutes, regulations,
case law, and agency guidance.  Use Bluebook (21st ed.) citations.`

export const legalAnalystAgent = new Agent({
  name: "LegalAnalystAgent",
  instructions: legalAnalystPrompt,
  model: "gpt-4.1",
  tools: [webSearchTool()],
  outputType: AnalysisSummary,
})

/* ----------  4. Policy Impact Agent  ---------- */

const policyImpactPrompt = `You are a policy analyst focusing on the practical impact of public-benefits laws.
Analyse how changes affect low-income clients (immigrants, disabled people, families, seniors, etc.).
Use web search to gather real-world implementation data.  Keep it ≤2 paragraphs.`

export const policyImpactAgent = new Agent({
  name: "PolicyImpactAnalystAgent",
  instructions: policyImpactPrompt,
  model: "gpt-4.1",
  tools: [webSearchTool()],
  outputType: AnalysisSummary,
})

/* ----------  5. Writer Agent  ---------- */

const writerPrompt = `You are a senior NYLAG public-benefits attorney.
Using the query and search summaries, draft a memo with:
1. Executive Summary 2. Legal Analysis 3. Practice Guidance 4. Recent Developments
5. Client Impact 6. Follow-up Research.
All citations must follow Bluebook (21st ed.) format (see prompt for patterns & examples).`

export const PublicBenefitsReportData = z.object({
  short_summary: z.string(),
  markdown_report: z.string(),
  follow_up_questions: z.array(z.string()),
})
export type PublicBenefitsReportData = z.infer<typeof PublicBenefitsReportData>

export const writerAgent = new Agent({
  name: "PublicBenefitsWriterAgent",
  instructions: writerPrompt,
  model: "gpt-4.1",
  outputType: PublicBenefitsReportData,
})

/* ----------  6. Verifier Agent  ---------- */

const VerificationResult = z.object({
  verified: z.boolean(),
  overallQuality: z.enum(["excellent", "good", "needs_revision", "poor"]),
  qualityScore: z.number().min(0).max(10),
  specificIssues: z.array(
    z.object({
      category: z.enum(["citation_error", "missing_info", "factual_error", "unclear_guidance", "incomplete_analysis"]),
      description: z.string(),
      severity: z.enum(["critical", "important", "minor"]),
      suggestedFix: z.string(),
      location: z.string().nullable(),
    }),
  ),
  missingTopics: z.array(z.string()),
  strengthsToPreserve: z.array(z.string()),
  recommendRevision: z.boolean(),
})
export type VerificationResult = z.infer<typeof VerificationResult>

const verifierPrompt = `You are a meticulous legal reviewer.
Score the memo on accuracy, citation quality, guidance, clarity, and completeness (weights 25/20/20/15/20).
Flag issues with category, severity, suggested fix, location.
Recommend revision if score <7 or any critical issues.`

export const verifierAgent = new Agent({
  name: "LegalVerificationAgent",
  instructions: verifierPrompt,
  model: "gpt-4.1",
  outputType: VerificationResult,
})

/* ----------  7. Revision Agent  ---------- */

const revisionPrompt = `You are a senior NYLAG attorney revising a memo based on verifier feedback.
Address every critical / important issue, preserve strengths, add missing info, improve clarity,
and ensure Bluebook compliance.  You may perform web searches to fact-check and update citations.`

export const revisionAgent = new Agent({
  name: "PublicBenefitsRevisionAgent",
  instructions: revisionPrompt,
  model: "o3",
  modelSettings: { reasoningEffort: "high" },
  tools: [webSearchTool()],
  outputType: PublicBenefitsReportData,
})

/* ----------  Re-exports for manager.ts and other modules  ---------- */
