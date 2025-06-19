import { z } from 'zod'
export const SubAgentIssue = z.object({
  category: z.enum(['citation_error','missing_info','factual_error','unclear_guidance','incomplete_analysis']),
  description: z.string(),
  severity: z.enum(['critical','important','minor']),
  suggestedFix: z.string(),
  location: z.string().nullable(),
})
export const SubAgentResult = z.object({
  specificIssues: z.array(SubAgentIssue),
  missingTopics: z.array(z.string()),
  strengthsToPreserve: z.array(z.string()),
})
