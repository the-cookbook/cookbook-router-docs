# Cookbook Router Docs

<div align="center">
  <img src="/src/assets/harpy-docs.png" alt="Cookbook Router Docs" style="width:420px;" />
</div>

Fumadocs documentation site for the Cookbook Router monorepo.

The documentation is split into two root areas:

- **Cookbook Router** — core router, React integration, CLI, framework concepts, API reference, errors, troubleshooting, and recipes.
- **Bundler Plugins** — Vite, Webpack, Rspack, Rollup/Rolldown, esbuild, and Bun.

## Requirements

- Node.js 22
- pnpm through Corepack

## Development

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm dev
```

## Validation

Run the complete documentation gate:

```bash
pnpm docs:check
```

That command validates content structure, API coverage, package imports, generated Fumadocs content, TypeScript, Biome, and the production build.

The dependency-free checks can run without installing the app:

```bash
node scripts/validate-content-structure.mjs
node scripts/validate-api-coverage.mjs
node scripts/validate-code-imports.mjs
```

To compare the committed public API manifest with a current Cookbook Router checkout:

```bash
pnpm audit:api-source ../cookbook-router
```

The audit fails when a package root entrypoint adds or removes a public value, type, or default export. Update the API reference and `scripts/public-api-manifest.json` together.

## Search

The app uses the Fumadocs search UI and falls back to static search when Algolia public credentials are missing.

```bash
NEXT_PUBLIC_ALGOLIA_APP_ID=
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=
ALGOLIA_ADMIN_API_KEY=
```

After a successful production build, push `.next/server/app/static.json.body` to Algolia with:

```bash
pnpm search:sync
```
