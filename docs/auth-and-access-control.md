# Auth and Access Control

## Auth Stack

- Identity provider: Clerk (`@clerk/nextjs`)
- Backend auth target: Convex JWT template `convex`
- Convex providers: web + admin issuer domains in `packages/backend/convex/auth.config.ts`

## App-Level Access Gating

## Admin App

Key gate is in `apps/admin/app/(dashboard)/layout.tsx`:

- requires `orgId` from Clerk auth
- fetches Clerk organization
- redirects to `/onboarding` when `publicMetadata.hasProfile` is not set

Onboarding page `apps/admin/app/onboarding/page.tsx`:

- requires `orgId`
- redirects to `/` when onboarding already completed

## Web App

Citizen auth is required for dashboard features via auth guard and Convex checks.
Verification status controls report submission eligibility.

## Convex Access Control Patterns

Most functions use:

- `const auth = await ctx.auth.getUserIdentity()`
- checks against `auth.subject`, `auth.orgId`, and `auth.orgRole`

Common enforcement patterns:

- Citizen ownership checks (`report.userId === auth.subject`)
- Organization scope checks (`organizationId === auth.orgId`)
- Role checks using string includes on org roles (for example denying `"member"` for admin-only operations)

## Organization-Specific Rules (Current)

- `functions.organizations.createOrganization`
  - requires authenticated user and `orgId`
- `functions.reports.getAllReports`, `takeReport`, `getReportsByOrganization`, `updateReportStatus`
  - require organization context
- `functions.tasks.createTask`
  - rejects users whose role includes `"member"`
- `functions.users.deleteUsers`, `deleteUsersFromDB`
  - require org context and non-member role
- `functions.payments.saveKeys`, `deleteKeys`, `retriveKeys`, `checkPaymentStatus`
  - org-scoped key/payment operations

## Citizen Verification Gate

`functions.reports.createReport` enforces that:

1. citizen record exists for current `auth.subject`
2. related `userIdentity` exists
3. `userIdentity.isAuthorized` is true

This is the effective gate preventing unverified citizens from submitting reports.

## Secrets and Payment Access Controls

Admin BYOS Stripe key routes:

- `apps/admin/app/api/secrets/create/route.ts`
- `apps/admin/app/api/secrets/delete/route.ts`

Both require authenticated user + `orgId`, then use Infisical machine credentials to create/delete tenant-scoped secrets named with org suffixes.

## Important Caveats for Future Hardening

- Some role checks are string-contains based, not enum-safe.
- `functions.tasks.deleteTask` checks `"memeber"` (typo) rather than `"member"`.
- Several Convex functions are intentionally callable by trusted service paths and do not enforce direct end-user auth in-function; keep this boundary explicit when adding new callers.
