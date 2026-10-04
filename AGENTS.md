# AGENTS.md

BEM FILKOM UNIDA website — TanStack Start (SSR) + React 19 + TypeScript + Tailwind v4 + Bun.

**Read `docs/ARCHITECTURE.md` before any structural change.** It is the source of truth for folder
conventions, routing, and runtime behaviour. This file is only the short list of what breaks the build.

## Ground rules

- **There is no `src/`.** All code lives in the project root: `routes/`, `components/`, `data/`, `hooks/`,
  `lib/`, `router.tsx`, `styles.css`.
- **No comments in source files.** No `//`, no `/* */`, no JSX comments. Explain intent in
  `docs/ARCHITECTURE.md` or the PR description.
- **All prose in English** — code identifiers, comments, docs, UI copy (except proper nouns like the
  organisation's registered name).
- **No semicolons** at end of lines, 2-space indent, single quotes.

## Never break these

| Rule | Why |
| --- | --- |
| `tanstackStart({ srcDirectory: '.' })` in `vite.config.ts` | Otherwise: `Could not resolve entry for router entry: router in .../src` |
| `routesDirectory` / `generatedRouteTree` in `tsr.config.json` | Router generator writes to the wrong path |
| `#/*` and `@/*` alias → `./*` in **both** `tsconfig.json` and `package.json` | Types and runtime resolution disagree |
| Never edit `routeTree.gen.ts` | Generated output; manual edits are lost |

## Conventions

- One file per page in `routes/`; a page holds only composition (`<Hero />`, `<About />`).
- Anything reused by two or more pages → `components/` (UI), `components/layout/` (frame), `data/` (content),
  `lib/` (pure functions), `hooks/` (React hooks). Used once → keep it in the page.
- Navigate with `<Link>` from `@tanstack/react-router`, never `<a href>`.
- New menu entry → add to `data/nav.ts`; navbar and footer both read from it.
- Styles are Tailwind utility classes in `className`. No new CSS files.
- Adding a route file: the dev server regenerates the route tree. `bun run generate-routes` if it did not.

## Verify before claiming done

```bash
bunx tsc --noEmit && bun run build
```

Both must pass. There is no linter and no test suite in this repo yet.

## Stack references (only when needed)

- Routing, loaders, search params: <https://tanstack.com/router>
- Server functions (`createServerFn`), API route handlers, SSR: <https://tanstack.com/start>
- Deployment (Nitro): <https://v3.nitro.build/deploy>
