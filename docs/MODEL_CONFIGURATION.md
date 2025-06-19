# Model Configuration Guide

## Current Model Assignments

### Reasoning Models (o3-mini, o4-mini)
Used for tasks requiring deep analysis and careful consideration:

| Agent | Model | Reasoning Effort | Rationale |
|-------|-------|------------------|-----------|
| Planner | `o3-mini` | Default | Optimized for strategic planning and search strategy |
| Writer | `o4-mini` | `medium` | Balances quality with reasonable response time for memo composition |
| Verifier | `o4-mini` | `high` | Maximum accuracy needed for quality assessment and citation review |
| Revision | `o4-mini` | `high` | Careful consideration required for systematic improvement |

### Standard Models
| Agent | Model | Purpose |
|-------|-------|---------|
| Search | Default (gpt-4o) | Web search execution and summarization |
| Legal Analyst | Default (gpt-4o) | Legal analysis with Bluebook citations |
| Policy Impact | Default (gpt-4o) | Client impact analysis |

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
