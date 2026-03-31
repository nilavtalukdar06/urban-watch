# Extension Playbooks

This file gives implementation recipes for common feature additions.

## Add a New Convex API

1. Create or update module in `packages/backend/convex/functions`.
2. Define `args` with `v.*` validators and implement handler auth rules.
3. Consume API from app via `@workspace/backend/convex/_generated/api`.
4. Add UI/server action callsite in target app module.
5. Typecheck backend + apps and validate runtime path.

Checklist:

- auth boundary is explicit
- organization/citizen scoping is enforced where required
- return shape matches UI expectation

## Add a New Schema Field/Table

1. Edit `packages/backend/convex/schema.ts`.
2. Update read/write functions impacted by the new shape.
3. Update UI forms, table columns, and status filters where needed.
4. Deploy Convex after typecheck and smoke validation.

Guidance:

- prefer optional field first for compatibility
- avoid breaking removals in a single step

## Add a New Inngest Workflow

1. Create new function file in `packages/jobs/inngest/functions`.
2. Register it in the correct app Inngest route:
   - web: `apps/web/app/api/inngest/route.ts`
   - admin: `apps/admin/app/api/inngest/route.ts`
3. Emit event from server action or route in app module.
4. Implement `step.run` phases with idempotent side effects.
5. Add monitoring logs and error handling.

Checklist:

- clear event name namespace (`domain/action`)
- payload includes IDs required for retries
- Convex writes are safe for replay

## Add a New AI-Assisted Flow

1. Create agent in `packages/jobs/inngest/vercel/agents`.
2. Add/adjust prompt in `packages/jobs/inngest/vercel/prompts`.
3. Add or update Inngest function to invoke agent.
4. Persist structured outputs to Convex when needed.
5. Add user/org notification path (Resend) if product requires feedback.

Checklist:

- model choice documented
- output schema validated (Zod)
- fallback behavior on model failure

## Add a New Admin Org-Scoped Feature

1. Add route in `apps/admin/app/(dashboard)`.
2. Add module under `apps/admin/modules/<feature>`.
3. Back with Convex functions that require `auth.orgId`.
4. Enforce role behavior if admin-only.
5. Update sidebar/navigation.

## Add a New Citizen Feature

1. Add route in `apps/web/app/(dashboard)`.
2. Add module under `apps/web/modules/<feature>`.
3. Reuse shared UI from `@workspace/ui` where possible.
4. Back with Convex calls and any workflow triggers.
5. Respect verification/auth prerequisites.

## Add a New Internal Package

1. Create `packages/<name>` and `@workspace/<name>`.
2. Add exports aligned to real source files.
3. Add `workspace:*` dependency in apps.
4. Add TS path mappings and `transpilePackages` updates if required.
5. Validate app build in dev and production mode.
