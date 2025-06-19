# NYLAG Public Benefits Research Agent

An AI-powered legal research system designed specifically for public benefits law, built for the New York Legal Assistance Group (NYLAG). This system uses multiple specialized AI agents to conduct comprehensive legal research, analyze policy impacts, and generate professional legal memoranda with proper Bluebook citations.

## 🎯 Purpose

This tool assists NYLAG attorneys with research on:
- **SNAP** (Supplemental Nutrition Assistance Program)
- **Medicaid** and healthcare benefits
- **SSI/SSDI** (Social Security benefits)
- **Housing assistance** programs
- **TANF** and cash assistance
- **Other public benefits** programs

## 🏗️ Architecture Overview

The system employs **7 specialized AI agents** working in coordination to deliver comprehensive legal research:

\`\`\`
User Query → Planner → Search Execution → Analysis → Writing → Verification → Revision (if needed)
\`\`\`

## 🤖 Agent Architecture

The system employs 7 specialized AI agents working in coordination:

### 1. **Planner Agent** (`o3-mini`)
- Analyzes legal research queries and creates strategic search plans
- Generates 4-6 targeted searches focusing on authoritative legal sources
- Prioritizes federal and New York State law, recent court decisions, and agency guidance

### 2. **Search Agent** (`o4-mini` + web search)
- Executes planned searches using web search tools
- Summarizes findings from authoritative legal sources (max 300 words)
- Prioritizes federal agencies (HUD, USDA/FNS, CMS, SSA) and NY agencies (OTDA)

### 3. **Legal Analyst Agent** (`gpt-4.1` + web search)
- Provides specialized legal analysis of statutes, regulations, and case law
- **Can perform independent web searches** for current legal authorities
- Extracts key legal citations using **Bluebook (21st Edition)** format
- Identifies procedural requirements and eligibility criteria

### 4. **Policy Impact Agent** (`gpt-4.1` + web search)
- Analyzes practical impact on low-income clients and vulnerable populations
- **Can search for current policy implementation data** and real-world impacts
- Identifies implementation challenges and advocacy opportunities
- Considers effects on immigrants, people with disabilities, families, and elderly

### 5. **Writer Agent** (`o4-mini`, medium reasoning effort)
- Synthesizes research into comprehensive legal memos
- Uses proper **Bluebook (21st Edition)** citation format throughout
- Integrates specialist analysis from Legal Analyst and Policy Impact agents

### 6. **Verifier Agent** (`o4-mini`, high reasoning effort)
- Performs quality assurance with focus on legal accuracy and citation quality
- Evaluates memos on 5 criteria with emphasis on Bluebook compliance
- Provides detailed feedback for revision when quality score < 7

### 7. **Revision Agent** (`o4-mini`, high reasoning effort)
- Revises memos based on verifier feedback
- Ensures proper Bluebook citation format and legal accuracy
- Addresses critical and important issues systematically

## 🔍 Enhanced Search Capabilities

### Multi-Agent Web Search
- **3 agents** now have independent web search capabilities:
  - **Search Agent**: Primary search execution
  - **Legal Analyst**: Targeted legal authority searches
  - **Policy Impact**: Current policy and implementation data searches

### Search Coordination
- Planner creates strategic search plan to avoid duplication
- Each agent focuses on their specialized domain
- Comprehensive coverage of legal, policy, and practical aspects

## 📚 Legal Citation Standards

All legal authorities are cited using **Bluebook (21st Edition)** format:

**Federal Authorities:**
- Statutes: `7 U.S.C. § 2014(a) (2018)`
- Regulations: `7 C.F.R. § 273.9(b)(1) (2023)`
- Cases: `Goldberg v. Kelly, 397 U.S. 254, 264 (1970)`

**New York State Authorities:**
- Statutes: `N.Y. Soc. Serv. Law § 131-a (McKinney 2023)`
- Regulations: `18 N.Y.C.R.R. § 352.3 (2023)`
- Cases: `Aliessa v. Novello, 96 N.Y.2d 418, 424 (2001)`

**Administrative Materials:**
- Agency Guidance: `USDA, SNAP Quality Control Annual Report (2023)`
- Policy Manuals: `N.Y. State OTDA, Administrative Directive 03 ADM-07 (2003)`

## 🔧 Model Configuration

| Agent | Model | Tools | Reasoning Effort | Purpose |
|-------|-------|-------|------------------|---------|
| Planner | `o3-mini` | None | Default | Strategic research planning |
| **Legal Analyst** | `gpt-4.1` | **Web Search** | Default | Legal analysis + current law search |
| **Policy Impact** | `gpt-4.1` | **Web Search** | Default | Policy analysis + implementation data |
| **Search** | **`o4-mini`** | Web Search | Default | Primary search execution |
| Writer | `o4-mini` | Legal/Policy agents | Medium | Memo composition |
| Verifier | `o4-mini` | None | High | Quality assurance |
| Revision | `o4-mini` | None | High | Systematic improvement |

### Reasoning Effort Levels
- **Medium**: Balanced performance and quality for memo writing
- **High**: Maximum thoroughness for verification and revision
- **Default**: Standard performance for analysis and search tasks

## 🎯 Output Format

Each research session produces:

1. **Executive Summary** - Key findings overview
2. **Legal Analysis** - Current law with proper citations
3. **Practice Guidance** - Actionable advice for client representation
4. **Recent Developments** - Policy changes and new legislation
5. **Client Impact Considerations** - Effects on NYLAG's client base
6. **Follow-up Research** - Additional investigation areas

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- OpenAI API key
- Environment variables configured

### Installation
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd nylag-public-benefits-agent

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API keys
\`\`\`

### Environment Variables
\`\`\`bash
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=your_database_url_here  # Optional: for data persistence
\`\`\`

### Running the Application

**Development Mode:**
\`\`\`bash
npm run dev
\`\`\`

**Production Mode:**
\`\`\`bash
npm run build
npm start
\`\`\`

**Command Line Interface:**
\`\`\`bash
npx tsx main.ts
\`\`\`

## 💡 Usage Examples

### Example Queries
- "What are the current SNAP work requirements for able-bodied adults without dependents?"
- "How do recent Medicaid policy changes affect immigrant eligibility in New York?"
- "What are the due process requirements for SSI benefit terminations?"
- "Analyze the impact of housing voucher waitlist policies on families with children"

### Sample Output Structure
\`\`\`markdown
# Legal Research Memo: SNAP Work Requirements

## Executive Summary
Current federal law requires able-bodied adults without dependents (ABAWDs)...

## Legal Analysis
### Federal Requirements
7 U.S.C. § 2015(d)(1) (2018) establishes work requirements...

### New York State Implementation
N.Y. Soc. Serv. Law § 95 (McKinney 2023) provides...

## Practice Guidance
- File exemption requests within 30 days of notice
- Document good cause circumstances thoroughly...
\`\`\`

## 🔄 Quality Assurance Process

### Iterative Improvement
1. **Initial Draft**: Writer agent creates comprehensive memo
2. **Quality Review**: Verifier agent evaluates on 5 criteria
3. **Revision**: If quality score < 7, Revision agent improves memo
4. **Final Output**: Up to 3 iterations ensure high quality

### Quality Metrics
- **Legal Accuracy**: Current law and proper interpretation (25%)
- **Citation Quality**: Bluebook compliance and completeness (20%)
- **Practical Guidance**: Actionable advice for attorneys (20%)
- **Clarity**: Organization and readability (15%)
- **Completeness**: Comprehensive analysis (20%)

## 🛠️ Development

### Project Structure
\`\`\`
├── app/                    # Next.js application
├── components/            # React components
├── lib/                   # Core agent logic
│   ├── agents.ts         # Agent definitions
│   └── manager.ts        # Workflow orchestration
├── docs/                 # Documentation
└── main.ts              # CLI entry point
\`\`\`

### Key Files
- `lib/agents.ts`: All 7 agent definitions with prompts and configurations
- `lib/manager.ts`: Workflow orchestration and quality control
- `app/api/chat/route.ts`: Web API endpoint
- `components/chat.tsx`: User interface component

### Adding New Agents
1. Define agent in `lib/agents.ts`
2. Add to workflow in `lib/manager.ts`
3. Update documentation
4. Test thoroughly

## 🔍 Monitoring and Debugging

### Logging
- Agent execution times and performance
- Quality scores and iteration patterns
- Error tracking and resolution
- User query patterns

### Performance Metrics
- Average response time per query type
- Quality score distribution
- Iteration frequency analysis
- Cost per research session

## 🚨 Troubleshooting

### Common Issues

**API Key Errors:**
- Verify `OPENAI_API_KEY` is set correctly
- Check API key has sufficient credits
- Ensure key has access to required models

**Model Availability:**
- `o3-mini`, `o4-mini`, and `gpt-4.1` must be available
- Check OpenAI service status
- Verify model access permissions

**Search Tool Issues:**
- Web search requires internet connectivity
- Some searches may be rate-limited
- Verify search tool permissions

**Quality Issues:**
- Low-quality outputs trigger automatic revision
- Check if specific legal domains need specialized prompts
- Monitor citation accuracy for Bluebook compliance

### Getting Help
- Check the troubleshooting guide in `/docs/`
- Review agent logs for specific error messages
- Contact NYLAG technical support for system issues

## 📄 License

This project is proprietary software developed for the New York Legal Assistance Group (NYLAG). Unauthorized use, distribution, or modification is prohibited.

## 🤝 Contributing

This is an internal NYLAG project. For contributions or modifications:
1. Follow established coding standards
2. Update documentation for any changes
3. Test thoroughly with legal research scenarios
4. Ensure Bluebook citation compliance

---

**Developed for NYLAG** - Advancing justice through technology-assisted legal research.
