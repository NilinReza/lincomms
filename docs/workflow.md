# Development Workflow

LinComms follows **Git best practices** with a feature-branch workflow.

## Branching
- `main`: stable production-ready branch
- `dev`: active integration branch
- `feature/*`: used for all new features and docs updates

## Commit Conventions
- Conventional Commits format (`feat:`, `fix:`, `docs:`, etc.)
- Signed commits required (`-S` flag enabled).

## Pull Requests
- Base branch: `dev`
- PRs must have:
  - Clear title (`feat:`, `fix:`, `docs:` prefix)
  - Description including summary, details, checklist
  - Labels + milestone assignment

## CI/CD
- Every PR triggers:
  - Prisma schema validation
  - Jest unit tests
  - Cypress e2e tests
- Merges to `main` are version-tagged (e.g., `v0.2.0`).

## Release Workflow
1. Merge into `dev`.
2. QA & testing in staging environment.
3. Merge into `main` with release tag.
