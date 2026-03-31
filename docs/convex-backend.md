# Convex Backend

## Location and Structure

- Package: `packages/backend`
- Convex root: `packages/backend/convex`
- Auth providers: `packages/backend/convex/auth.config.ts`
- Schema: `packages/backend/convex/schema.ts`
- Functions: `packages/backend/convex/functions/*.ts`
- Generated API/types: `packages/backend/convex/_generated`

## Auth Integration

`auth.config.ts` configures two Clerk JWT issuers, one for web and one for admin, both with `applicationID: "convex"`.

Apps acquire Convex template tokens and pass them to server-side `fetchQuery`/`fetchMutation` when needed.

## Function Domains

Function modules under `packages/backend/convex/functions`:

- `users.ts`
  - create/read users, verification status reads, delete flows, points update
- `organizations.ts`
  - create org profile, get current org, list payment-enabled orgs
- `reports.ts`
  - submit, analyze patch, query lists/details, assignment operations, status changes
- `tasks.ts`
  - create/delete/list tasks, assignee task list, status mutation
- `payments.ts`
  - key status/save/retrieve/delete, donation checkout record, donation status updates
- `verification.ts`
  - verification status transition and verification result recording
- `chatbot.ts`
  - create user messages, persist AI messages, read/delete history

## API Usage from Apps

Apps import generated API paths from:

- `@workspace/backend/convex/_generated/api`
- type helpers from `@workspace/backend/convex/_generated/dataModel`

Typical usage patterns:

- Client components: `useQuery`, `useMutation`, `useAction` (from `convex/react`)
- Server components/actions/routes: `preloadQuery`, `fetchQuery`, `fetchMutation` (from `convex/nextjs`)

Representative app integration points:

- report submit: `apps/web/modules/reports/functions/submit-report.ts`
- account verification submit: `apps/web/modules/profile/functions/verify-account.ts`
- donation create/webhook: `apps/web/app/api/payments/create/route.ts`, `apps/web/app/api/stripe/webhook/route.ts`
- payments key management: `apps/admin/app/api/secrets/create/route.ts`, `apps/admin/app/api/secrets/delete/route.ts`

## Current Security-Sensitive Endpoints

Some Convex functions are intentionally usable by backend jobs or trusted server entrypoints and do not enforce direct end-user auth checks internally. These include:

- `functions.reports.getReportById`
- `functions.users.getUserById`
- `functions.users.updateUserPoints`
- `functions.verification.verificationRecord`
- `functions.chatbot.createAImessage`
- `functions.payments.updateDonationStatus`

When extending these, preserve the trusted caller assumptions or add explicit service-auth patterns.

## Changing Convex APIs Safely

1. Add or modify function in `packages/backend/convex/functions/*.ts`.
2. Keep `args` validators (`v.*`) and return shape explicit.
3. Ensure auth/role rules are correct for new function purpose.
4. Update all app call sites importing `api.functions.*`.
5. Run backend typecheck (`pnpm --filter @workspace/backend typecheck`) and app typechecks.
6. Deploy Convex when ready (`packages/backend`: `npx convex deploy`).
