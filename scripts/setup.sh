#!/usr/bin/env bash
# Simple setup script to install development dependencies
# Run this from the repository root: bash scripts/setup.sh

set -euo pipefail

# Install required packages
npm install next @openai/agents zod

# Install all remaining dependencies declared in package.json
npm install

echo "All dependencies installed."
echo "Run 'npm run lint' to lint and 'npx tsc --noEmit' to type-check."
