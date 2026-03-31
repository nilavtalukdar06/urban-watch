# Inngest and AI Orchestration

## Inngest Clients

Defined in `packages/jobs/inngest/client.ts`:

- `inngestWeb` (`id: "urban-watch-web"`)
- `inngestAdmin` (`id: "urban-watch-admin"`)

## Inngest HTTP Entrypoints

- Web app: `apps/web/app/api/inngest/route.ts`
  - registers: `healthCheck`, `verifyAccountFunction`, `analyzeReportFunction`
- Admin app: `apps/admin/app/api/inngest/route.ts`
  - registers: `sendEmailFunction`, `reportResolutionFunction`

## Event Producers

- `apps/web/modules/reports/functions/submit-report.ts`
  - sends `report/analyze`
- `apps/web/modules/profile/functions/verify-account.ts`
  - sends `test/verify-account`
- `apps/admin/modules/reports/functions/send-resolution-email.ts`
  - sends `report/resolved`
- `apps/admin/modules/users/functions/trigger-email.ts`
  - sends `user/send-email`

## Workflow Functions

## `health.ts`

- Event: `test/health-check`
- Purpose: simple smoke/log check

## `verify-account.ts`

- Event: `test/verify-account`
- Steps:
  1. run AI verification agent on uploaded ID image + user profile fields
  2. write verification record to Convex (`functions.verification.verificationRecord`)
  3. send verification email via `@workspace/emails`

## `analyze-report.ts`

- Event: `report/analyze`
- Steps:
  1. fetch report and user from Convex
  2. run AI report analysis agent (`analyzeReport`)
  3. patch report fields in Convex (`updateReportWithAnalysis`)
  4. if not spam, upsert vector record to Pinecone
  5. update user points in Convex (+10 for non-spam, -5 for spam)
  6. send analysis email via `@workspace/emails`

## `report-resolution.ts`

- Event: `report/resolved`
- Steps:
  1. fetch report and user from Convex
  2. generate resolution email content with AI
  3. send final email via `@workspace/emails`

## `send-email.ts`

- Event: `user/send-email`
- Purpose: generic org-initiated email send path

## AI Agents and Models

Agent code lives in `packages/jobs/inngest/vercel/agents`:

- `analyze-report.ts`
  - model: OpenAI (`gpt-4o-mini`)
  - output: structured Zod object with report fields + email content
- `verify-account.ts`
  - model: OpenAI (`gpt-5-nano`)
  - output: authorization decision, extracted document context, email content
- `generate-resolution-email.ts`
  - model: OpenAI (`gpt-4o-mini`)
  - output: resolution email body/subject

Prompt files are in `packages/jobs/inngest/vercel/prompts`.

## Vector Store Path (Pinecone)

- Client/index config: `packages/jobs/inngest/vectors/pinecone.ts`
- Upsert path: `packages/jobs/inngest/functions/analyze-report.ts`
- Search path: `apps/admin/modules/reports/functions/search-relevant-reports.ts`
  - builds query text from organization `goal` and `purpose`
  - requests top results with rerank model `bge-reranker-v2-m3`

## Separate AI Path: Citizen Chatbot

The chatbot flow is not handled by Inngest.

- API route: `apps/web/app/api/chat/route.ts`
- model: `xai("grok-3-mini")`
- history persistence: Convex mutation `functions.chatbot.createAImessage`

## Extension Notes

- Prefer adding a new event name + dedicated function file rather than overloading existing events.
- Keep event payloads stable and explicit (include entity IDs and minimal denormalized context).
- For side effects, keep ordering clear in `step.run` blocks for retry safety and observability.
