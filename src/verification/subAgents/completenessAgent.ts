import { Agent } from '@openai/agents'
import { SubAgentResult } from '../issueSchemas'

export const completenessAgent = new Agent({
  name: 'CompletenessAgent',
  model: 'o4-mini',
  instructions: `Check whether the memo addresses all significant legal issues raised by the research request. Note any gaps in analysis and recommend additional topics to cover.`,
  outputType: SubAgentResult,
})
