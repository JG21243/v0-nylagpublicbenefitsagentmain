import { Agent } from '@openai/agents'
import { SubAgentResult } from '../issueSchemas'

export const practicalGuidanceAgent = new Agent({
  name: 'PracticalGuidanceAgent',
  model: 'o4-mini',
  instructions: `Evaluate whether the memo gives clear, actionable guidance for NYLAG attorneys. Identify any advice that is impractical or unclear and suggest improvements.`,
  outputType: SubAgentResult,
})
