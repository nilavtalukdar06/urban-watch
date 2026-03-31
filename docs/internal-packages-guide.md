# Internal Packages Guide

This project uses `packages/*` for shared code consumed by `apps/web` and `apps/admin`.

## Create a New Package

1. Create folder: `packages/<your-package>`
2. Add `package.json` with:
   - `"name": "@workspace/<your-package>"`
   - `"type": "module"`
   - scripts you need (`lint`, `typecheck`, etc.)
3. Add `tsconfig.json` extending shared config (usually `@workspace/typescript-config/react-library.json` or `base.json`)
4. Add source folder (`src/`) and exports

Example starter `package.json`:

```json
{
  "name": "@workspace/example",
  "type": "module",
  "private": true,
  "exports": {
    "./*": "./src/*"
  }
}
```

## Wire It Into Apps

1. Add dependency to consuming app:
   - `apps/web/package.json` and/or `apps/admin/package.json`
   - version: `"@workspace/<your-package>": "workspace:*"`
2. Add TypeScript path mapping in app `tsconfig.json` if deep import aliases are needed.
3. Add to `transpilePackages` in both app `next.config.mjs` when package ships TS/JS that Next must transpile.

## Existing Import Conventions

Current app conventions map:

- `@workspace/ui/*` -> `packages/ui/src/*`
- `@workspace/backend/*` -> `packages/backend/*`
- `@workspace/jobs/*` -> `packages/jobs/*`
- `@workspace/emails/*` -> `packages/emails/*`

When adding a new package, follow the same explicit and predictable alias style.

## Export Design Recommendations

- Keep exports aligned with actual file layout.
- Prefer stable subpath exports over arbitrary deep relative imports.
- If package might be reused outside this monorepo, ensure Node-compatible `exports` are complete.

## Validation Checklist for New Package

- Package is discoverable under workspace (`pnpm-workspace.yaml` already includes `packages/*`)
- App imports resolve in editor and at runtime
- Package builds/lints/typechecks in isolation
- App build succeeds with package dependency
- No secret values embedded in package source

## Pitfalls in Current Repo to Avoid Repeating

- `packages/jobs` and `packages/emails` have `exports` mappings that do not completely match real usage paths.
- Use this as a reminder to keep `exports`, TS paths, and actual folder layout consistent for new packages.
