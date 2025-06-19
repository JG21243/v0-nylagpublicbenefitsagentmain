import { Agent, webSearchTool } from "@openai/agents"
import { z } from "zod"

// --- Legal Analyst Agent ---
export const legalAnalystPrompt = `You are a legal analyst specializing in public benefits law, including SNAP, TANF, Medicaid, housing assistance, SSI/SSDI, and other safety net programs.
Given a collection of web search results about a legal issue, write a concise analysis of the current legal landscape.
Focus on relevant statutes, regulations, case law, agency guidance, and recent policy changes.
Pull out key legal citations, procedural requirements, and eligibility criteria. Keep it under 2 paragraphs.`

export const AnalysisSummary = z.object({
  summary: z.string().describe("Short text summary for this aspect of the legal analysis."),
})

export const legalAnalystAgent = new Agent({
  name: "LegalAnalystAgent",
  instructions: legalAnalystPrompt,
  outputType: AnalysisSummary,
})

// --- Public Benefits Research Planner Agent ---
export const plannerPrompt = `You are a legal research planner specializing in public benefits law for NYLAG attorneys.
Given a request for legal research, produce a set of web searches to gather the comprehensive legal context needed.
Focus on:
- Federal and New York State statutes and regulations
- Recent court decisions and administrative rulings
- Agency guidance documents and policy memos
- Advocacy resources and practice advisories
- Recent legislative or policy changes

Output between 6 and 12 search terms to query for, prioritizing authoritative legal sources.`

export const PublicBenefitsSearchItem = z.object({
  reason: z.string().describe("Your reasoning for why this search is relevant to public benefits law."),
  query: z.string().describe("The search term to feed into a web search, focusing on legal sources."),
})

export type PublicBenefitsSearchItem = z.infer<typeof PublicBenefitsSearchItem>

export const PublicBenefitsSearchPlan = z.object({
  searches: z.array(PublicBenefitsSearchItem).describe("A list of legal searches to perform."),
})

export type PublicBenefitsSearchPlan = z.infer<typeof PublicBenefitsSearchPlan>

export const plannerAgent = new Agent({
  name: "PublicBenefitsPlannerAgent",
  instructions: plannerPrompt,
  model: "o3-mini",
  outputType: PublicBenefitsSearchPlan,
})

// --- Policy Impact Analyst Agent ---
export const policyImpactPrompt = `You are a policy analyst focused on the practical impact of public benefits laws and policies on low-income clients.
Given legal research, analyze potential client impact, implementation challenges, advocacy opportunities, and practice considerations.
Consider how changes might affect vulnerable populations including immigrants, people with disabilities, families with children, and elderly individuals.
Keep it under 2 paragraphs.`

export const policyImpactAgent = new Agent({
  name: "PolicyImpactAnalystAgent",
  instructions: policyImpactPrompt,
  tools: [webSearchTool()],
  outputType: AnalysisSummary,
})

// --- Legal Search Agent ---
export const searchAgentPrompt = `You are a legal research assistant specializing in public benefits law.
Given a search term, use web search to retrieve up-to-date legal information and produce a short summary of at most 300 words.
Prioritize authoritative sources like:
- Federal and state agency websites (HUD, USDA/FNS, CMS, SSA, OTDA)
- Court decisions and administrative rulings
- Legal aid resources and practice advisories
- Recent policy changes and guidance documents
Focus on legal citations, eligibility requirements, procedural deadlines, and practical guidance.`

export const searchAgent = new Agent({
  name: "PublicBenefitsSearchAgent",
  instructions: searchAgentPrompt,
  tools: [webSearchTool()],
  modelSettings: { toolChoice: "required" },
})

// --- Verification Agent (Fixed Schema) ---
export const VerificationResult = z.object({
  verified: z.boolean().describe("Whether the legal research meets quality standards"),
  overallQuality: z.enum(["excellent", "good", "needs_revision", "poor"]).describe("Overall quality assessment"),
  qualityScore: z.number().min(0).max(10).describe("Numeric quality score from 0-10"),
  specificIssues: z
    .array(
      z.object({
        category: z.enum([
          "citation_error",
          "missing_info",
          "factual_error",
          "unclear_guidance",
          "incomplete_analysis",
        ]),
        description: z.string().describe("Detailed description of the issue"),
        severity: z.enum(["critical", "important", "minor"]),
        suggestedFix: z.string().describe("Specific suggestion for how to fix this issue"),
        location: z.string().nullable().describe("Where in the memo this issue appears, or null if not specific"),
      }),
    )
    .describe("List of specific issues found in the memo"),
  missingTopics: z.array(z.string()).describe("Important topics that should be covered but are missing"),
  strengthsToPreserve: z.array(z.string()).describe("Aspects of the memo that are well done and should be kept"),
  recommendRevision: z.boolean().describe("Whether this memo should be revised before delivery"),
})

export type VerificationResult = z.infer<typeof VerificationResult>

export const verifierAgent = new Agent({
  name: "LegalVerificationAgent",
  instructions: `You are a meticulous legal reviewer specializing in public benefits law.
You have been handed a legal research report for NYLAG attorneys.
Your job is to verify the report is legally accurate, properly cited, internally consistent, and provides actionable guidance.

Evaluate the memo on these criteria:
- Legal accuracy and current law (25%)
- Citation quality and completeness (20%)
- Practical guidance for client representation (20%)
- Clarity and organization (15%)
- Completeness of analysis (20%)

For each issue you identify:
1. Categorize it (citation_error, missing_info, factual_error, unclear_guidance, incomplete_analysis)
2. Assess severity (critical = must fix, important = should fix, minor = nice to fix)
3. Provide specific, actionable suggestions for improvement
4. Note the location in the memo where the issue appears (or set to null if it's a general issue)

Quality scoring:
- 9-10: Excellent - publication ready
- 7-8: Good - minor issues only
- 5-6: Needs revision - significant issues present
- 0-4: Poor - major problems throughout

Recommend revision if quality score is below 7 OR if any critical issues are present.

When specifying location, be specific (e.g., "Executive Summary section", "Legal Analysis paragraph 2", "Practice Guidance bullet point 3") or set to null for general issues.`,
  model: "gpt-4.1",
  outputType: VerificationResult,
})

// --- Legal Writer Agent ---
export const writerPrompt = `You are a senior public benefits attorney at NYLAG.
You will be provided with the original legal research query and a set of raw search summaries.
Your task is to synthesize these into a comprehensive legal research memo (at least several paragraphs) including:

1. **Executive Summary** - Brief overview of key findings
2. **Legal Analysis** - Current law including relevant statutes, regulations, and case law
3. **Practice Guidance** - Actionable advice for client representation
4. **Recent Developments** - Any recent changes or pending legislation
5. **Client Impact Considerations** - How this affects NYLAG's client base
6. **Follow-up Research** - Additional areas to investigate

Use proper legal citation format where possible and clearly distinguish between federal and New York State law.
If needed, you can call the available analysis tools (e.g. legal_analysis, policy_impact_analysis) to get specialist write-ups to incorporate.`

export const PublicBenefitsReportData = z.object({
  short_summary: z.string().describe("A short 2-3 sentence executive summary of key legal findings."),
  markdown_report: z.string().describe("The full legal research memo in markdown format."),
  follow_up_questions: z
    .array(z.string())
    .describe("Suggested follow-up legal research questions for further investigation."),
})

export type PublicBenefitsReportData = z.infer<typeof PublicBenefitsReportData>

export const writerAgent = new Agent({
  name: "PublicBenefitsWriterAgent",
  instructions: writerPrompt,
  model: "gpt-4.1",
  outputType: PublicBenefitsReportData,
})

// Add revision agent
export const revisionPrompt = `You are a senior public benefits attorney at NYLAG revising a legal research memo based on quality review feedback.

You will receive:
1. The original legal research query
2. The current draft memo
3. Detailed reviewer feedback with specific issues to address

Your task is to create an improved version that:
- Addresses each critical and important issue raised by the reviewer
- Preserves the strengths identified in the feedback
- Adds any missing information or topics
- Improves clarity, accuracy, and practical guidance
- Maintains professional legal memo structure and tone

Focus on critical issues first, then important ones. For minor issues, only address them if they're easy fixes that don't require major restructuring.

Use the same markdown format and structure as the original memo, but with improved content.`

export const revisionAgent = new Agent({
  name: "PublicBenefitsRevisionAgent",
  instructions: revisionPrompt,
  model: "gpt-4.1",
  outputType: PublicBenefitsReportData,
})
