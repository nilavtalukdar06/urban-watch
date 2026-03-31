# Integrations and Environment

This file lists major third-party integrations and the environment keys used by runtime code.

Do not store secret values in docs; keep names only.

## Core Integrations

- Convex: backend database and API runtime
- Clerk: authentication and organization context
- Inngest: asynchronous workflow orchestration
- OpenAI: analysis/verification/resolution generation (Inngest agents)
- xAI: citizen chatbot model (`grok-3-mini`)
- Pinecone: vector indexing and semantic report matching
- Stripe: donation checkout + webhook events
- Infisical: tenant-scoped secret storage for Stripe keys
- Resend: email delivery
- Stream: citizen real-time chat experience

## Environment Keys by Concern

## Clerk and Auth

- `CLERK_SECRET_KEY`
- `CLERK_JWT_ISSUER_DOMAIN_WEB`
- `CLERK_JWT_ISSUER_DOMAIN_ADMIN`

## Convex

- `NEXT_PUBLIC_CONVEX_URL` (apps)
- `CONVEX_URL` / `CONVEX_DEPLOYMENT` (backend workflows and Convex env usage)

## Inngest and AI

- `OPENAI_API_KEY`
- `XAI_API_KEY`

## Email

- `RESEND_API_KEY`

## Stream Chat

- `STREAM_API_KEY`
- `STREAM_API_SECRET`

## Stripe + Infisical Secret Management

- `MACHINE_ID`
- `MACHINE_SECRET`
- `PROJECT_ID`
- `ENV`

Infisical stores tenant keys under names:

- `tenant_public_<orgId>`
- `tenant_secret_<orgId>`
- `tenant_webhook_<orgId>`

## Pinecone

- `PINECONE_API_KEY`

## Where Env Surfaces Are Referenced

- Turborepo build task pass-through: `turbo.json`
- Web donation/create checkout: `apps/web/app/api/payments/create/route.ts`
- Web stripe webhook verification: `apps/web/app/api/stripe/webhook/route.ts`
- Admin secrets create/delete routes: `apps/admin/app/api/secrets/create/route.ts`, `apps/admin/app/api/secrets/delete/route.ts`
- Convex auth provider setup: `packages/backend/convex/auth.config.ts`

## Operational Notes

- Stripe secrets are not stored raw in Convex; only key prefixes are persisted in `apiKeys`.
- Webhooks are verified using tenant-specific webhook secret fetched from Infisical.
- Inngest and AI keys should be present in environments where workflow functions execute.
