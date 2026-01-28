# Contributing Guide

## Branch Strategy

```
main (production)
  └── development (integration)
        └── feature/* (your work)
```

## Development Workflow

### 1. Start a New Feature

```bash
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

### 2. Naming Conventions

| Prefix      | Use Case          |
| ----------- | ----------------- |
| `feature/`  | New features      |
| `fix/`      | Bug fixes         |
| `refactor/` | Code improvements |
| `chore/`    | Maintenance tasks |
| `docs/`     | Documentation     |

### 3. Making Commits

Use conventional commits:

```bash
git commit -m "feat: add user authentication"
git commit -m "fix: resolve hero image alignment"
git commit -m "refactor: simplify pricing logic"
```

### 4. Keep Your Branch Updated

```bash
git fetch origin
git rebase origin/development
```

### 5. Before Opening a PR

```bash
npm run lint      # Check for linting errors
npm run build     # Ensure build passes
```

### 6. Opening a PR

- Target: `development` branch
- Use the PR template
- Keep changes small and focused
- Request review when ready

## Code Standards

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- No `console.log` in production code
- Run `npm run lint` before committing

## PR Merge Strategy

- Feature → Development: **Squash merge**
- Development → Main: **Merge commit**
