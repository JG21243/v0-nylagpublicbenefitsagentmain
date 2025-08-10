# NYLAG Public Benefits Agent

NYLAG Public Benefits Agent is a Next.js 15.2.4 web application with AI-powered chat functionality for legal research on public benefits programs (SNAP, Medicaid, housing assistance, SSI/SSDI). The application includes both a web interface and a CLI interface for legal research queries.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Bootstrap and Dependencies
- Install dependencies: `npm install` -- takes ~55 seconds. Set timeout to 120+ seconds.
- Install required ESLint dependencies: `npm install --save-dev eslint eslint-config-next` -- takes ~46 seconds. Set timeout to 120+ seconds.
- Install tsx globally for CLI interface: `npm install -g tsx` -- takes ~5 seconds.

### Build and Test
- Lint the code: `npm run lint` -- takes ~3 seconds. WORKS after ESLint dependencies are installed.
- Build for production: `npm run build` -- takes ~22 seconds. NEVER CANCEL. Set timeout to 180+ seconds.
- Development server: `npm run dev` -- starts in ~2 seconds, runs on http://localhost:3000
- Production server: `npm run start` -- requires fresh build first, runs on http://localhost:3000

### Environment Configuration
- **CRITICAL**: Both CLI and web interfaces require `OPENAI_API_KEY` environment variable
- Without API key: CLI fails with clear error message, web chat returns 500 error
- Create `.env.local` file with: `OPENAI_API_KEY=your_key_here` for local development

### CLI Interface
- Run CLI: `echo "Your query here" | npx tsx main.ts`
- Example: `echo "What are the work requirements for SNAP?" | npx tsx main.ts`
- **REQUIRES**: OPENAI_API_KEY environment variable or will fail with clear error
- CLI processes queries through PublicBenefitsResearchManager for legal research

## Validation

### Manual Testing Requirements
**ALWAYS run through these validation scenarios after making changes:**

#### Web Interface Validation
1. Start development server: `npm run dev`
2. Navigate to http://localhost:3000 in browser
3. Verify the main page loads with "NYLAG Public Benefits Research Agent" header
4. Test chat interface:
   - Enter a sample query: "What are SNAP eligibility requirements?"
   - With API key: Should process query and return research results
   - Without API key: Should return clear error message about missing configuration
5. Verify responsive design works on different screen sizes
6. Check that copy conversation button works (copies to clipboard)

#### CLI Interface Validation
1. Test CLI with query: `echo "Research SNAP work requirements" | npx tsx main.ts`
2. Verify error handling without API key provides clear instructions
3. With API key: Should process query through research workflow

#### Build and Deployment Validation
1. Build production version: `npm run build` -- NEVER CANCEL, takes ~22 seconds
2. Verify build output shows route information and bundle sizes
3. Start production server: `npm run start` (after fresh build)
4. Test production site functionality matches development

### Pre-commit Validation
- **ALWAYS** run `npm run lint` before committing changes
- Lint issues will cause build failures in deployment
- Fix any TypeScript/ESLint warnings before submission

## Common Tasks

### Repository Structure
```
.
├── README.md
├── package.json              # Next.js project with AI SDK dependencies
├── next.config.mjs          # Next.js configuration with security headers
├── eslint.config.mjs        # ESLint configuration for Next.js
├── tailwind.config.ts       # Tailwind CSS styling configuration
├── tsconfig.json            # TypeScript configuration
├── vercel.json              # Vercel deployment configuration
├── main.ts                  # CLI entry point for legal research
├── app/                     # Next.js app router structure
│   ├── page.tsx            # Main landing page with chat interface
│   ├── layout.tsx          # Root layout with styling
│   ├── api/chat/route.ts   # API endpoint for chat functionality
│   └── test-ui/            # Test UI page
├── components/              # React components
│   ├── chat.tsx            # Main chat interface component
│   ├── ui/                 # Reusable UI components (Radix UI based)
│   └── ...
├── lib/                     # Core logic and utilities
│   ├── manager.ts          # PublicBenefitsResearchManager
│   ├── agents.ts           # AI agent definitions
│   └── utils.ts            # Utility functions
└── styles/                  # Global CSS styles
```

### Key Dependencies
- **Next.js 15.2.4** with React 19 - Modern web framework
- **@ai-sdk/react** - AI chat functionality
- **@openai/agents** - OpenAI agents integration for CLI
- **Radix UI** components - Accessible UI component library
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety and better developer experience

### Package Manager
- Uses **npm** as primary package manager (package-lock.json)
- Also has pnpm-lock.yaml but npm is used in scripts
- Always use `npm install` for dependencies
- Always use `npm run [script]` for running scripts

### Deployment
- Deployed on **Vercel** (vercel.json configuration)
- Auto-synced with v0.dev deployments
- Build command: `npm run build`
- Install command: `npm install`

## Known Issues and Workarounds

### ESLint Dependencies
- **Issue**: Fresh clone fails on `npm run lint` with missing ESLint packages
- **Fix**: Run `npm install --save-dev eslint eslint-config-next` after `npm install`
- **Validation**: Lint should show only minor warnings about unused variables

### API Key Requirements
- **Issue**: Both CLI and web interface require OPENAI_API_KEY
- **CLI Behavior**: Clear error message, exits gracefully
- **Web Behavior**: Returns 500 error with clear admin contact message
- **Fix**: Set environment variable or create .env.local file

### Port Conflicts
- **Issue**: Cannot run dev and production servers simultaneously on port 3000
- **Fix**: Stop dev server before starting production server
- **Detection**: "EADDRINUSE" error indicates port conflict

### TypeScript Build Errors
- **Config**: TypeScript build errors are ignored in next.config.mjs (`ignoreBuildErrors: true`)
- **ESLint**: ESLint errors are ignored during builds (`ignoreDuringBuilds: true`)
- **Reason**: Allows builds to complete despite minor type issues

## Timing Expectations

### Command Timing (NEVER CANCEL these operations)
- `npm install` -- 55 seconds, timeout: 120+ seconds
- `npm install --save-dev eslint eslint-config-next` -- 46 seconds, timeout: 120+ seconds
- `npm run build` -- 22 seconds, timeout: 180+ seconds
- `npm run lint` -- 3 seconds, timeout: 30+ seconds
- `npm run dev` startup -- 2 seconds, timeout: 30+ seconds
- `npm install -g tsx` -- 5 seconds, timeout: 30+ seconds

### Development Workflow Timing
- Code changes during `npm run dev` -- hot reload in 1-2 seconds
- Build verification -- 22 seconds total
- Lint check -- 3 seconds
- Total pre-commit validation -- ~30 seconds

### Performance Notes
- **Fast build times** compared to many Next.js projects
- **Quick hot reload** in development
- **No test suite** exists - no time needed for test execution
- **Small bundle sizes** - good optimization for production

## Important Files to Monitor

### After Changes to API Integration
- Always check `app/api/chat/route.ts` after modifying chat functionality
- Always check `lib/manager.ts` after modifying research workflow
- Always check `main.ts` after modifying CLI interface

### After Changes to UI Components
- Always check `components/chat.tsx` after modifying chat interface
- Always check `app/page.tsx` after modifying main page layout
- Always verify responsive design works across screen sizes

### After Changes to Configuration
- Always check `next.config.mjs` after modifying build settings
- Always check `eslint.config.mjs` after modifying linting rules
- Always run full build after configuration changes

## Development Environment Notes

### Node.js Version
- Current: Node.js v20.19.4 with npm 10.8.2
- Works with Node.js 18+ (Next.js 15 requirement)
- No specific Node.js version pinning in package.json

### Editor Integration
- TypeScript configuration in `tsconfig.json` supports modern IDE features
- ESLint configuration provides code quality feedback
- Tailwind CSS IntelliSense supported via configuration files

### Browser Compatibility
- Modern browsers supported (Next.js 15 defaults)
- Progressive Web App features not implemented
- Mobile-responsive design implemented with Tailwind CSS