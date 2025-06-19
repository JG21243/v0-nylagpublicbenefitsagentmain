import { Agent, webSearchTool } from '@openai/agents'
import { SubAgentResult } from '../issueSchemas'

export const citationQualityAgent = new Agent({
  name: 'CitationQualityAgent',
  model: 'o4-mini',
  instructions: `Review every citation for proper Bluebook format and completeness. Verify case names, reporter details, and pincites. Suggest corrections for any citation errors. Use web search as needed to confirm authority details.`,
  tools: [webSearchTool()],
  outputType: SubAgentResult,
})
