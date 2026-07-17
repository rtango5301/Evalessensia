# Evalessensia

[![CI](https://github.com/RTE404/Evalessensia-SDK/actions/workflows/ci.yml/badge.svg)](https://github.com/RTE404/Evalessensia-SDK/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Evalessensia is a CI/CD platform for AI agents — helping teams systematically evaluate, test, and monitor AI agent performance before deployment.

## Features

- **Agent Management** — Create, configure, and manage AI agents with a guided wizard
- **Evaluation Dashboard** — View detailed test results, metrics, and performance comparisons
- **Automated Testing** — Run comprehensive test suites against your AI agents
- **Performance Metrics** — Track latency, accuracy, and reliability over time

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS 4, Framer Motion
- **Components**: shadcn/ui with Radix UI primitives
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/RTE404/Evalessensia-SDK.git
cd Evalessensia-SDK

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

| Command                | Description                  |
| ---------------------- | ---------------------------- |
| `npm run dev`          | Start development server     |
| `npm run build`        | Create production build      |
| `npm run start`        | Start production server      |
| `npm run lint`         | Run ESLint                   |
| `npm run format`       | Format code with Prettier    |
| `npm run format:check` | Check code formatting        |
| `npm run typecheck`    | Run TypeScript type checking |

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Landing page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   ├── dashboard/          # Main dashboard
│   │   ├── layout.tsx      # Dashboard shell (sidebar + header)
│   │   └── page.tsx        # Dashboard home
│   └── agents/             # Agent management
│       ├── layout.tsx      # Agents layout
│       ├── page.tsx        # Agents list
│       ├── new/            # Step 1: Agent type selection
│       ├── configure/      # Step 2: Configuration
│       └── review/         # Step 3: Review & create
├── components/
│   ├── ui/                 # Reusable UI primitives (shadcn/ui)
│   ├── dashboard/          # Dashboard-specific components
│   └── evaluation/         # Evaluation page components
├── lib/                    # Utilities and helpers
└── types/                  # TypeScript type definitions
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](.github/CONTRIBUTING.md) for details on:

- Branch naming conventions
- Commit message format
- Pull request process

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
