# Urban Watch Documentation

This folder is the implementation-focused documentation set for engineering and agentic coding tools.

Use this as the primary context before adding or changing features.

## Reading Order

1. [Architecture Overview](./architecture-overview.md)
2. [Monorepo and Turborepo](./monorepo-and-turborepo.md)
3. [Apps and Features](./apps-and-features.md)
4. [Convex Backend](./convex-backend.md)
5. [Database Schema](./database-schema.md)
6. [Auth and Access Control](./auth-and-access-control.md)
7. [Inngest and AI Orchestration](./inngest-and-ai-orchestration.md)
8. [Internal Packages Guide](./internal-packages-guide.md)
9. [Integrations and Env](./integrations-and-env.md)
10. [Extension Playbooks](./extension-playbooks.md)

## Source of Truth Rules

- Runtime behavior is defined by code, not by assumptions.
- Prefer package-level definitions under `packages/backend/convex`, `packages/jobs`, and app API routes under `apps/*/app/api`.
- When this docs set and the root `README.md` disagree, prefer code and update docs.

## Fast Context Jump

- Monorepo task graph: `turbo.json`
- Workspace boundaries: `pnpm-workspace.yaml`
- Web app: `apps/web`
- Admin app: `apps/admin`
- Convex backend: `packages/backend/convex`
- Inngest workflows: `packages/jobs/inngest`

## Known Caveats Worth Remembering

- `turbo.json` defines `check-types`, while apps expose a `typecheck` script.
- Convex schema changes are done by editing `packages/backend/convex/schema.ts` and deploying, not SQL migrations.
- Some package `exports` fields (`packages/jobs`, `packages/emails`) do not fully mirror real import usage; apps rely on workspace + TypeScript paths.
