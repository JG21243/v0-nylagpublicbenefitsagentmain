import { Agent } from '@openai/agents'
import { SubAgentResult } from '../issueSchemas'

export const clarityOrgAgent = new Agent({
  name: 'ClarityOrganizationAgent',
  model: 'o4-mini',
  instructions: `Assess the memo for readability and logical organization. Flag confusing wording or structural problems and provide suggestions to clarify and reorganize as needed.`,
  outputType: SubAgentResult,
})
