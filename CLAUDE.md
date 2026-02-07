# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Rules

- **Always ask for permission before running any git commands** (commit, push, checkout, merge, etc.)
- **Do NOT generate Playwright/E2E test files in this repo** - No `.spec.ts` files, no `playwright.config.ts`, no test screenshots. Playwright artifacts are gitignored and must never be committed. If the QA testing agent needs to run E2E tests, it should do so locally only and clean up after itself
- **Always stop the dev server after any local test run** - Use `pkill -f "next dev"` after completing tests. If Turbopack cache gets corrupted, run `npm run dev:clean` to clear it
- **Check for duplicate/conflict files at session start** - Scan for macOS duplicate files (patterns like `file 2.tsx`, `file 3.tsx`, `file copy.tsx`) and other file conflicts. Analyze them, compare with originals if present, and ask the user before cleaning up

## Commands

```bash
npm run dev          # Start development server at localhost:3000
npm run dev:clean    # Clear .next cache and start dev server (use if Turbopack corrupts)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
npm run format       # Format code with Prettier
npm run format:check # Check if code is formatted
```

## Environment Setup

Copy `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_SUPABASE_URL=      # From Supabase dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY= # Public anon key
SUPABASE_SERVICE_ROLE_KEY=     # Service role key (server-side only)
TENSOREVALS_BACKEND_URL=       # TensorEvals API endpoint
TENSOREVALS_BACKEND_API_KEY=   # Backend API key
```

## Code Quality

- **Prettier**: Code formatting (config in `.prettierrc`)
- **ESLint**: Linting with Next.js recommended rules
- **Husky + lint-staged**: Pre-commit hooks run lint and format on staged files
- **EditorConfig**: Consistent editor settings (`.editorconfig`)
- **CI**: GitHub Actions runs build on PRs to `main`/`development`

## Architecture

TensorEval is a Next.js 15 application for an AI agent CI/CD platform. It uses the App Router with React 19 and TypeScript.

### Tech Stack

- **Framework**: Next.js 15.5.10 (App Router)
- **Styling**: Tailwind CSS 4 with CSS custom properties in `globals.css`
- **Animations**: Framer Motion for scroll-triggered and interactive animations
- **Components**: shadcn/ui pattern with Radix UI primitives
- **Icons**: Lucide React

### Structure

**Routes** (`src/app/`):

- `/` - Landing page composed of section components
- `/login` - Authentication page with OAuth and email options (includes signup toggle)
- `(authenticated)/` - Route group for authenticated pages (shared layout with sidebar + header)
  - `/dashboard` - Main dashboard with recent evaluation runs overview
  - `/dashboard/settings` - User settings (profile, appearance)
  - `/datasets` - Dataset management
  - `/datasets/new` - Create new dataset (upload or AI-generated)
  - `/datasets/[id]` - View dataset details
  - `/evaluations` - Evaluation runs listing page
  - `/evaluations/new` - New evaluation wizard (configure agent, select dataset, review)
  - `/evaluations/[id]` - View evaluation results with live streaming logs
- `/not-found.tsx` - Custom 404 page

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
- URL params for passing state between wizard steps (e.g., `/evaluations/new?step=dataset`)
- Mock data and TypeScript types are defined inline in page components
- Error boundaries used for defensive error handling in complex pages
