# Agent Architecture Documentation

## System Overview

The NYLAG Public Benefits Research Agent employs a **7-agent architecture** with enhanced web search capabilities across **4 specialized agents**. This distributed approach ensures comprehensive legal research with specialized analysis, independent fact-checking, and quality assurance.

## Agent Workflow

```mermaid
graph TD
    A[User Query] --> B[Planner Agent]
    B --> C[Search Agent + Web Search]
    B --> D[Legal Analyst Agent + Web Search]
    B --> E[Policy Impact Agent + Web Search]
    C --> F[Writer Agent]
    D --> F
    E --> F
    F --> G[Verifier Agent]
    G --> H{Quality Check}
    H -->|Pass| I[Final Output]
    H -->|Fail| J[Revision Agent + Web Search + Fact-Check]
    J --> G
