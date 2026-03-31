# Monorepo and Turborepo

## Workspace Layout

The workspace is defined in `pnpm-workspace.yaml`:

- `apps/*`
- `packages/*`

Current apps and packages:

- Apps: `apps/web`, `apps/admin`
- Packages: `packages/backend`, `packages/jobs`, `packages/ui`, `packages/emails`, `packages/eslint-config`, `packages/typescript-config`

## Root Scripts and Toolchain

Root `package.json` scripts:

- `pnpm dev` -> `turbo dev`
- `pnpm build` -> `turbo build`
- `pnpm lint` -> `turbo lint`
- `pnpm format` -> prettier write

Defaults:

- package manager: `pnpm@10.4.1`
- Node engine: `>=20`

## Turborepo Task Graph

`turbo.json` defines:

- `build`
  - depends on `^build`
  - inputs include `.env*`
  - outputs include `.next/**` and `dist/**`
  - whitelists runtime env keys for build
- `lint`
  - depends on `^lint`
- `check-types`
  - depends on `^check-types`
- `dev`
  - `cache: false`, `persistent: true`

Important note:

- Apps expose `typecheck`, not `check-types`. If running `turbo check-types`, align script names first.

## Package Consumption Model

Apps depend on internal packages using `workspace:*` in app `package.json` files.

Both app `tsconfig.json` files define path mappings for internal imports:

- `@workspace/ui/*` -> `../../packages/ui/src/*`
- `@workspace/backend/*` -> `../../packages/backend/*`
- `@workspace/jobs/*` -> `../../packages/jobs/*`
- `@workspace/emails/*` -> `../../packages/emails/*`

Both app `next.config.mjs` files transpile workspace packages:

- `@workspace/ui`
- `@workspace/emails`
- `@workspace/jobs`

## Package-by-Package Roles

- `@workspace/backend` (`packages/backend`)
  - Convex schema, auth config, functions, generated API types
  - scripts: `dev`, `setup`, `typecheck`
- `@workspace/jobs` (`packages/jobs`)
  - Inngest clients and functions, AI agents, Pinecone integration
  - script: `dev` (Inngest CLI)
- `@workspace/ui` (`packages/ui`)
  - shared UI components/hooks/styles
  - script: `lint`
- `@workspace/emails` (`packages/emails`)
  - email sender/template modules over Resend
- `@workspace/eslint-config`, `@workspace/typescript-config`
  - shared lint and TS baselines

## Packaging Caveat

`packages/jobs/package.json` and `packages/emails/package.json` `exports` fields do not fully reflect actual in-repo import paths used by apps. In practice, imports currently work because of workspace linking + app `paths` mapping + Next transpilation.

If package publishing or strict Node ESM resolution becomes required, normalize `exports` to real entrypoints.
