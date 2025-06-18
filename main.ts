import { withTrace } from '@openai/agents';
import { PublicBenefitsResearchManager } from './lib/manager';

// Entrypoint for the NYLAG public benefits research agent.
// Run this as `npx tsx examples/nylag-public-benefits-agent/main.ts` and enter a legal research query, for example:
// "Research the latest changes to SNAP work requirements for able-bodied adults without dependents"

async function main() {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter a public benefits legal research query: ', async (query: string) => {
    rl.close();
    await withTrace('NYLAG public benefits research workflow', async () => {
      const manager = new PublicBenefitsResearchManager();
      await manager.run(query);
    });
  });
}

// ES module entry point
main();
