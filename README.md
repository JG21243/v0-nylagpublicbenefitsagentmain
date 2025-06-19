## Agent Architecture

The system employs 7 specialized AI agents working in coordination:

### 1. **Planner Agent** (`o3-mini`)
- Analyzes legal research queries and creates strategic search plans
- Generates 6-12 targeted searches focusing on authoritative legal sources
- Prioritizes federal and New York State law, recent court decisions, and agency guidance

### 2. **Search Agent** (default model with web search)
- Executes planned searches using web search tools
- Summarizes findings from authoritative legal sources (max 300 words)
- Prioritizes federal agencies (HUD, USDA/FNS, CMS, SSA) and NY agencies (OTDA)

### 3. **Legal Analyst Agent** (default model)
- Provides specialized legal analysis of statutes, regulations, and case law
- Extracts key legal citations using **Bluebook (21st Edition)** format
- Identifies procedural requirements and eligibility criteria

### 4. **Policy Impact Agent** (default model)
- Analyzes practical impact on low-income clients and vulnerable populations
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

## Legal Citation Standards

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
