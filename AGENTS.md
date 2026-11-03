<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# rentora_studio_client

Next.js 16 (App Router) client for Rentora Studio, a creative-studio rental marketplace. Early stage: only `src/app/page.tsx` and `layout.tsx` exist as app code.

## Commands

- Dev: `npm run dev` (Turbopack)
- Lint: `npm run lint` (ESLint flat config, passes clean — run before finishing)
- Typecheck: `npx tsc --noEmit` (no `typecheck` script exists; passes clean)
- Build: `npm run build`
- **No test runner, no CI, no pre-commit hooks** — don't look for `npm test`, it fails by design of `create-next-app`.

## Stack quirks (verify against docs before assuming)

- **Next 16.4.4 with Cache Components on**: `next.config.ts` sets `cacheComponents: true` + `partialPrefetching: true`. Data fetching is dynamic by default; caching requires the `"use cache"` directive. No `runtime` route segment config is allowed (Node runtime only). Also `reactCompiler: true` (React Compiler via `babel-plugin-react-compiler`).
- **Tailwind CSS v4, no `tailwind.config`**: all theming is CSS-first in `src/app/globals.css` (`@import "tailwindcss"`, `@theme inline`). Loaded through the `@tailwindcss/turbopack` rule in `next.config.ts` — don't add a PostCSS config.
- **shadcn/ui style `base-nova`**: components in `src/components/ui/` are built on **`@base-ui/react` (Base UI), not Radix** — don't import `@radix-ui/*`, it isn't installed. Adding components: `npx shadcn@latest add <name>` (config: `components.json`).
- **`cn` comes from the `cn` npm package**: components do `import { cn } from "cn"`. `src/lib/utils.ts` only re-exports it. Both work; match the existing `from "cn"` style in `src/components/ui/`.
- Path alias: `@/*` → `./src/*`.

## Environment / backend

- `.env` is gitignored and holds `MONGODB_URI` (Atlas) and `NEXT_PUBLIC_API_URL=http://localhost:5000`.
- The API lives in a **sibling directory, not this repo**: `../rentora_studio_server` (Express 5 + MongoDB, listens on port 5000). Run and change it there.
- `mongodb` is a dependency here but is not yet imported anywhere in `src/` — the intended split (server-side API vs. direct DB access from Next route handlers) is not established yet; prefer the Express API via `NEXT_PUBLIC_API_URL`.
