import { run } from '@openai/agents'
import { z } from 'zod'
import { VerificationResult } from '@/lib/agents'
import { SubAgentResult } from './issueSchemas'
import { legalAccuracyAgent } from './subAgents/legalAccuracyAgent'
import { citationQualityAgent } from './subAgents/citationQualityAgent'
import { practicalGuidanceAgent } from './subAgents/practicalGuidanceAgent'
import { clarityOrgAgent } from './subAgents/clarityOrgAgent'
import { completenessAgent } from './subAgents/completenessAgent'

export async function parallelVerifierAgent(memo: string): Promise<VerificationResult> {
  const agents = [
    legalAccuracyAgent,
    citationQualityAgent,
    practicalGuidanceAgent,
    clarityOrgAgent,
    completenessAgent,
  ]

  const results: Array<z.infer<typeof SubAgentResult>> = await Promise.all(
    agents.map(async (agent) => {
      const res = await run(agent, memo)
      return res.finalOutput as z.infer<typeof SubAgentResult>
    }),
  )

  const specificIssues = results.flatMap((r) => r.specificIssues)
  const missingTopics = Array.from(new Set(results.flatMap((r) => r.missingTopics)))
  const strengthsToPreserve = Array.from(new Set(results.flatMap((r) => r.strengthsToPreserve)))

  const numCritical = specificIssues.filter((i) => i.severity === 'critical').length
  const numImportant = specificIssues.filter((i) => i.severity === 'important').length

  let qualityScore = 10 - numCritical * 2 - numImportant
  if (qualityScore < 0) qualityScore = 0

  let overallQuality: VerificationResult['overallQuality'] = 'poor'
  if (qualityScore >= 9 && numCritical === 0) overallQuality = 'excellent'
  else if (qualityScore >= 7 && numCritical === 0) overallQuality = 'good'
  else if (qualityScore >= 5 && numCritical <= 2) overallQuality = 'needs_revision'

  const recommendRevision = qualityScore < 7 || numCritical > 0

  return {
    verified: qualityScore >= 7 && numCritical === 0,
    overallQuality,
    qualityScore,
    specificIssues,
    missingTopics,
    strengthsToPreserve,
    recommendRevision,
  }
}
