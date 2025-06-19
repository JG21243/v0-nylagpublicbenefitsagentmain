## Individual Agent Specifications

### 1. Planner Agent
**Model**: `o3-mini`  
**Purpose**: Strategic research planning  
**Reasoning Effort**: Default (optimized for planning)

### 2. Search Agent
**Model**: Default (gpt-4o)  
**Purpose**: Execute web searches and summarize findings  
**Tools**: Web search tool (required)

### 3. Legal Analyst Agent
**Model**: Default (gpt-4o)  
**Purpose**: Specialized legal analysis with Bluebook citations  
**Reasoning Effort**: Default

**Responsibilities**:
- Analyze legal authorities and requirements
- Extract key legal citations in **Bluebook (21st Edition)** format
- Identify procedural requirements and eligibility criteria
- Provide concise legal landscape analysis

**Citation Requirements**:
- Federal Statutes: `[Title] U.S.C. § [Section] ([Year])`
- Federal Regulations: `[Title] C.F.R. § [Section] ([Year])`
- State Statutes: `N.Y. [Code] § [Section] (McKinney [Year])`
- Cases: `[Case Name], [Volume] [Reporter] [Page] ([Court] [Year])`
- Agency Guidance: `[Agency], [Title] ([Date])`

### 4. Policy Impact Agent
**Model**: Default (gpt-4o)  
**Purpose**: Client impact analysis  
**Reasoning Effort**: Default

### 5. Writer Agent
**Model**: `o4-mini`  
**Purpose**: Legal memo composition with Bluebook citations  
**Reasoning Effort**: `medium`

**Responsibilities**:
- Synthesize research into comprehensive legal memos
- Apply **Bluebook (21st Edition)** citation format throughout
- Structure output with proper legal memo format
- Integrate specialist analysis from other agents

**Bluebook Citation Standards**:
- All legal authorities must follow Bluebook 21st Edition format
- Proper use of signals (see, cf., but see, contra)
- Pinpoint citations for specific holdings
- Parallel citations for state cases when available
- Proper italicization and formatting

### 6. Verifier Agent
**Model**: `o4-mini`  
**Purpose**: Quality assurance with citation verification  
**Reasoning Effort**: `high`

**Evaluation Criteria** (Updated):
- Legal accuracy and current law (25%)
- **Bluebook citation quality and completeness (20%)**
- Practical guidance for client representation (20%)
- Clarity and organization (15%)
- Completeness of analysis (20%)

**Citation Review Focus**:
- Bluebook 21st Edition compliance
- Proper case name italicization
- Accurate statutory and regulatory citations
- Correct court abbreviations and jurisdictions
- Appropriate use of citation signals

### 7. Revision Agent
**Model**: `o4-mini`  
**Purpose**: Memo revision with citation correction  
**Reasoning Effort**: `high`

**Citation Review Checklist**:
- Verify all case names are properly italicized
- Check statutory citations include proper year parentheticals
- Ensure regulatory citations are current and properly formatted
- Confirm court abbreviations follow Bluebook standards
- Review pinpoint citations for accuracy
- Check parallel citations for state cases
- Verify proper use of signals
