# Database Schema (Convex)

The canonical data model is `packages/backend/convex/schema.ts`.

Urban Watch uses Convex schema definitions (`defineSchema`, `defineTable`, validators via `v.*`) rather than SQL migrations.

## Tables

## `citizens`

- Fields: `email`, `fullName`, `dateOfBirth`, `phoneNumber`, `permanentAddress`, `points`, `clerkUserId`, `userId`
- Indexes:
  - `by_userId` (`userId`)
  - `by_points` (`points`)
- Used by: user profile, leaderboard, report ownership, verification linkage

## `userIdentity`

- Fields: `isAuthorized`, `verificationStatus?`, `documentType?`, `notes?`, `citizenId`
- Indexes:
  - `by_citizenId` (`citizenId`)
- Used by: verification review status and report-submit authorization gate

## `chatbot`

- Fields: `role`, `content`, `userId`
- Indexes:
  - `by_userId` (`userId`)
- Used by: citizen chatbot conversation history

## `organization`

- Fields: `name`, `purpose`, `goal`, `organizationId`, `payments_enabled`, `userId`
- Indexes: none declared
- Used by: org onboarding/profile and donation discoverability

## `tasks`

- Fields: `organizationId`, `title`, `description`, `assignedByUserId`, `assignedToUserId`, `assigneeName`, `status`, `dueDate`
- Status enum: `pending | in_progress | completed | cancelled`
- Used by: admin task assignment and personal task execution

## `apiKeys`

- Fields: `organizationId`, `provider`, `keyName`, `publicKeyPrefix`, `secretKeyPrefix`, `webhookSecretPrefix`, `userId`
- Used by: BYOS Stripe key metadata (prefixes only, full secrets in Infisical)

## `donations`

- Fields: `amount`, `donatedTo`, `status`, `stripePaymentIntentId`, `donatedBy`
- Status enum: `pending | paid | failed`
- Used by: donation checkout tracking and webhook settlement

## `reports`

- Fields: `imageUrl`, `location`, `notes`, `title?`, `description?`, `instructions?`, `whatNotToDo?`, `priority?`, `status?`, `process`, `isSpam`, `inferredGoal?`, `inferredPurpose?`, `userId`
- Priority enum: `low | medium | high`
- Status enum: `pending | resolved`
- Used by: citizen report lifecycle + AI analysis outputs

## `reportAssignments`

- Fields: `reportId`, `organizationId`, `similarityScore`, `status`
- Status enum: `pending | accepted | rejected`
- Used by: organization report ownership/assignment tracking

## Logical Relationships

- `userIdentity.citizenId` -> `citizens._id`
- `reportAssignments.reportId` -> `reports._id`
- `reports.userId` -> `citizens.userId` (string-level relation)
- `tasks.organizationId` / `apiKeys.organizationId` / `reportAssignments.organizationId` / `donations.donatedTo` -> `organization.organizationId` (string-level relation)

## Schema Change Workflow

Convex schema evolution in this repo:

1. Edit `packages/backend/convex/schema.ts`.
2. Update all affected functions in `packages/backend/convex/functions`.
3. Update app code expecting old fields/enums.
4. Run typechecks for backend and apps.
5. Validate critical runtime paths in dev.
6. Deploy Convex.

## Practical Guidance for Modifications

- Adding a field:
  - start as optional when backward compatibility is needed
  - patch existing write paths to populate it
- Adding enum values:
  - update all validators, UI filters, and status badges
- Adding relationships:
  - prefer indexed foreign keys where query volume is high
- Removing/renaming fields:
  - do in two steps (introduce new field, migrate write/read paths, then remove old field later)
