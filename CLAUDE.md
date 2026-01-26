# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint (eslint command)
```

## Architecture

TensorEval is a Next.js 16 marketing website for an AI agent CI/CD platform. It uses the App Router with React 19 and TypeScript.

### Tech Stack
- **Framework**: Next.js 16.1.4 (App Router)
- **Styling**: Tailwind CSS 4 with CSS custom properties in `globals.css`
- **Animations**: Framer Motion for scroll-triggered and interactive animations
- **Components**: shadcn/ui pattern with Radix UI primitives

### Structure

**Routes** (`src/app/`):
- `/` - Landing page composed of section components
- `/login` - Authentication page with OAuth and email options

**Components** (`src/components/`):
- Section components (Hero, Workflow, Features, UseCases, Pricing, etc.) are client components using Framer Motion
- UI primitives in `ui/` folder follow shadcn/ui conventions with CVA (class-variance-authority) for variants

**Design System** (`src/app/globals.css`):
- CSS custom properties define the color palette, spacing, and theming
- Custom animations: `pulse-dot`, `spin-slow`, gradient text effects

### Patterns
- Server components by default; `"use client"` directive for components with state/effects/animations
- `cn()` utility from `src/lib/utils.ts` merges Tailwind classes (clsx + tailwind-merge)
- Mobile-first responsive design using Tailwind breakpoints
