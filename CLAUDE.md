# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

- **Always ask for permission before running any git commands** (commit, push, checkout, merge, etc.)

## Commands

```bash
npm run dev          # Start development server at localhost:3000
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
```

## Code Quality

- **Prettier**: Code formatting (config in `.prettierrc`)
- **ESLint**: Linting with Next.js recommended rules
- **Husky + lint-staged**: Pre-commit hooks run lint and format on staged files
- **EditorConfig**: Consistent editor settings (`.editorconfig`)
- **CI**: GitHub Actions runs build on PRs to `main`/`development`

## Architecture

TensorEval is a Next.js 16 application for an AI agent CI/CD platform. It uses the App Router with React 19 and TypeScript.

### Tech Stack

- **Framework**: Next.js 16.1.4 (App Router)
- **Styling**: Tailwind CSS 4 with CSS custom properties in `globals.css`
- **Animations**: Framer Motion for scroll-triggered and interactive animations
- **Components**: shadcn/ui pattern with Radix UI primitives
- **Icons**: Google Material Symbols

### Structure

**Routes** (`src/app/`):

- `/` - Landing page composed of section components
- `/login` - Authentication page with OAuth and email options
- `/signup` - User registration page
- `/dashboard` - Main dashboard with agents overview and recent runs
- `/agents` - Agent management (separate top-level route with own layout)
  - `/agents/new` - Step 1: Agent type selection
  - `/agents/configure` - Step 2: Configuration settings
  - `/agents/review` - Step 3: Review and create agent

**Landing Page Components** (`src/components/`):

- `Hero.tsx` - Landing page hero section
- `Features.tsx` - Product features showcase
- `Workflow.tsx` - How it works / workflow visualization
- `UseCases.tsx` - Use case examples
- `Pricing.tsx` - Pricing plans
- `Demo.tsx` - Product demo section
- `CTA.tsx` - Call-to-action section
- `Navigation.tsx` - Main site navigation
- `Footer.tsx` - Site footer

All section components are client components using Framer Motion for animations.

**Dashboard Components** (`src/components/dashboard/`):

- `app-navigation.tsx` - App-style navigation (differs from marketing nav)
- `dashboard-footer.tsx` - Simplified footer for app pages

**Evaluation Components** (`src/components/evaluation/`):

- `EvaluationHeader.tsx` - Breadcrumb, title, status badge, action buttons
- `MetricCards.tsx` - Overall score, test pass rate, avg latency cards
- `PerformanceComparison.tsx` - Radar chart with baseline comparison
- `TestCasesTable.tsx` - Searchable, filterable, paginated test results table

**UI Primitives** (`src/components/ui/`):

Follows shadcn/ui conventions with CVA (class-variance-authority) for variants:

- `button.tsx` - Button component with variants
- `card.tsx` - Card container component
- `input.tsx` - Text input field
- `textarea.tsx` - Multi-line text input
- `select.tsx` - Dropdown select (Radix UI)
- `badge.tsx` - Status/label badges
- `table.tsx` - Data table components
- `progress.tsx` - Linear progress bar (Radix UI)
- `circular-progress.tsx` - SVG circular progress indicator
- `radar-chart.tsx` - Reusable radar/spider chart
- `breadcrumb.tsx` - Navigation breadcrumb
- `skeleton.tsx` - Loading skeleton component

**Mock Data** (`src/lib/mock-data/`):

- `evaluation.ts` - Static mock data for evaluation results

**Types** (`src/types/`):

- `evaluation.ts` - TypeScript interfaces for evaluation data structures

**Design Reference** (`stitch/`):

- HTML exports from Google Stitch for UI implementation reference
- Excluded from Prettier formatting checks

**Design System** (`src/app/globals.css`):

- CSS custom properties define the color palette, spacing, and theming
- Custom animations: `pulse-dot`, `spin-slow`, gradient text effects

### Design Tokens

**Dashboard color palette:**

- Primary: `#135bec` (blue)
- Background: `#f6f6f8`
- Font: Space Grotesk

**Landing page color palette:**

- Primary: `#4f46e5` to `#6366f1` (purple gradient)
- Uses CSS custom properties from globals.css

### Patterns

- Server components by default; `"use client"` directive for components with state/effects/animations
- `cn()` utility from `src/lib/utils.ts` merges Tailwind classes (clsx + tailwind-merge)
- Mobile-first responsive design using Tailwind breakpoints
- URL params for passing state between wizard steps (e.g., `/agents/configure?name=...&type=...`)
