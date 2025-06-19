# Model Configuration Guide

## Current Model Assignments

### Reasoning Models (o3, o3-mini)
Used for tasks requiring deep analysis and careful consideration:

| Agent | Model | Reasoning Effort | Tools | Rationale |
|-------|-------|------------------|-------|-----------|
| Planner | `o3-mini` | Default | None | Optimized for strategic planning and search strategy |
| **Revision** | **`o3`** | **`high`** | **Web Search** | **Maximum reasoning + fact-checking for systematic improvement** |

### Standard Models
| Agent | Model | Tools | Purpose |
|-------|-------|-------|---------|
| Search | `gpt-4.1` | Web Search | Primary search execution and summarization |
| Legal Analyst | `gpt-4.1` | Web Search | Legal analysis with Bluebook citations |
| Policy Impact | `gpt-4.1` | Web Search | Client impact analysis |
| Writer | `gpt-4.1` | Legal/Policy agents | Memo composition and synthesis |
| Verifier | `gpt-4.1` | None | Quality assurance and citation verification |

## Reasoning Effort Configuration

### Available Levels
- **`"low"`**: Minimal reasoning effort - faster responses, less thorough analysis
- **`"medium"`**: Moderate reasoning effort - balanced approach (default for o4-mini)
- **`"high"`**: High reasoning effort - maximum thoroughness, slower responses

### Current Configuration Rationale

#### Writer Agent (`medium`)
- **Purpose**: Initial memo composition
- **Rationale**: Balances comprehensive analysis with reasonable response time
- **Tasks**: Synthesizing research, structuring memos, applying Bluebook citations

#### Verifier Agent (`high`)
- **Purpose**: Quality assurance and citation verification
- **Rationale**: Accuracy is critical for legal review and Bluebook compliance
- **Tasks**: Legal accuracy verification, citation format checking, quality scoring

#### Revision Agent (`high`)
- **Purpose**: Systematic memo improvement
- **Rationale**: Careful consideration needed for addressing reviewer feedback
- **Tasks**: Citation correction, content improvement, issue resolution

## Bluebook Citation Integration

### Model Training Focus
All citation-capable agents are trained on:
- **Bluebook 21st Edition** format requirements
- Federal vs. state citation distinctions
- Administrative material citation standards
- Proper use of citation signals and formatting

### Citation Quality Metrics
- Format compliance with Bluebook standards
- Accuracy of legal authority references
- Proper use of pinpoint citations
- Correct italicization and abbreviations
- Appropriate signal usage (see, cf., but see, etc.)

## Performance Optimization

### Cost-Quality Balance
- **Medium reasoning effort** for initial writing provides good quality at reasonable cost
- **High reasoning effort** for verification and revision ensures accuracy where it matters most
- **Strategic model selection** balances capabilities with cost considerations

### Response Time Considerations
- Parallel search execution reduces total workflow time
- Medium reasoning effort prevents excessive delays in memo generation
- High reasoning effort used only where accuracy is critical

## Enhanced Search Capabilities

### Multi-Agent Web Search Coordination
**4 out of 7 agents** now have independent web search capabilities:

| Agent | Search Focus | Coordination Strategy |
|-------|--------------|----------------------|
| **Search** | Primary research execution | Follows Planner's strategic search plan |
| **Legal Analyst** | Current legal authorities | Targeted searches for specific legal analysis |
| **Policy Impact** | Implementation data & real-world impacts | Policy-focused searches for client impact |
| **Revision** | **Fact-checking & verification** | **Independent verification of memo content** |

### Search Specialization
- **Search Agent**: Broad legal research per planned strategy
- **Legal Analyst**: Deep-dive legal authority searches
- **Policy Impact**: Current policy implementation data
- **Revision Agent**: **Real-time fact-checking and citation verification**

## Revision Agent Enhanced Capabilities

### Advanced Reasoning + Fact-Checking
The Revision agent combines the most powerful model (`o3`) with high reasoning effort and independent web search:

#### Core Capabilities:
- **Systematic memo improvement** based on reviewer feedback
- **Real-time fact-checking** of legal authorities and citations
- **Independent verification** of controversial or complex legal points
- **Current law confirmation** for accuracy and currency

#### Fact-Checking Features:
- **Citation verification**: Confirms Bluebook format and accuracy
- **Legal authority validation**: Verifies case holdings and statutory text
- **Currency checks**: Ensures regulations and guidance are current
- **Cross-referencing**: Validates information against multiple sources

#### Quality Assurance Integration:
- **Error correction**: Fixes factual inaccuracies with verified sources
- **Gap filling**: Adds missing information identified during review
- **Authority strengthening**: Enhances weak sections with additional sources
- **Consistency checking**: Ensures internal consistency across memo sections
