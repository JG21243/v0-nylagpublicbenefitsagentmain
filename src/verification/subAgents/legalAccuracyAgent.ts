import { Agent, webSearchTool } from '@openai/agents'
import { SubAgentResult } from '../issueSchemas'

export const legalAccuracyAgent = new Agent({
  name: 'LegalAccuracyAgent',
  model: 'gpt-4.1',
  instructions: `You check the memo for legal accuracy and current law. Verify all statutes, regulations, and cases cited. Flag outdated or incorrect statements and suggest precise fixes. Use web search to confirm authorities.`,
  tools: [webSearchTool()],
  outputType: SubAgentResult,
})
