# BEM FILKOM UNIDA

Website for BEM FILKOM UNIDA — built with [TanStack Start](https://tanstack.com/start) (full-stack React,
SSR) + [Bun](https://bun.sh) + [Tailwind CSS](https://tailwindcss.com).

Full architecture and folder conventions: **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**.

---

## Requirements

- **[Bun](https://bun.sh) 1.3+** — the only required runtime. Install: `curl -fsSL https://bun.sh/install | bash`
- Git

Check your Bun version:

```bash
bun --version   # expect 1.3.x
```

---

## Run the app (everyday development)

```bash
bun install     # once, or after someone changed package.json
bun run dev     # dev server with hot reload → http://localhost:3000
```

The dev server watches all files — save a file and the browser updates instantly. TanStack Devtools sits in
the bottom-right corner in dev mode only.

---

## All commands

| Command | What it does |
| --- | --- |
| `bun install` | Install dependencies |
| `bun run dev` | Dev server with HMR on port 3000 |
| `bun run build` | Production build → Cloudflare Worker output in `.output/` |
| `bun run preview` | Run the built worker locally (`wrangler dev`) |
| `bun run deploy` | Deploy to Cloudflare Workers (needs Cloudflare credentials) |
| `bun run generate-routes` | Regenerate `routeTree.gen.ts` (rarely needed — the dev server does it) |
| `bunx tsc --noEmit` | Type check — **run before every push** |
| `bun test` | Unit tests (Bun's built-in runner, no framework) |

Use `PORT=8080 bun run dev` if port 3000 is taken. Stop the server with `Ctrl+C`.

---

## Deploy to Cloudflare

The build targets **Cloudflare Workers** (Nitro preset `cloudflare_module`), worker name `bemfilkom-unida`.
Worker + account id live in `wrangler.jsonc`; Nitro merges that file into the deploy config it writes to
`.output/server/wrangler.json`.

```bash
bun run build            # → .output/ (worker + static assets)
bun run preview          # run the built worker locally
bun run deploy           # deploy to Cloudflare (needs wrangler login)
```

**CI/CD (GitHub Actions)**

| Workflow | Trigger | What it does |
| --- | --- | --- |
| `.github/workflows/ci.yml` | push/PR to `main` or `develop` | `bun install --frozen-lockfile`, type check, `bun test`, build |
| `.github/workflows/deploy.yml` | push to `main`, or manual dispatch | same checks, then `wrangler deploy` |

One-time setup in **GitHub → Settings → Secrets and variables → Actions → New repository secret**:

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token with *Workers Scripts: Edit* + *Account Settings: Read* for this account |
| `CLOUDFLARE_ACCOUNT_ID` | `4f6695fda7842bc1cf05ca3702af861f` (same as in `wrangler.jsonc`) |

Day to day: feature branch → PR → `develop` → CI. Nothing deploys from `develop`.
Only a push to `main` deploys, so the live site stays untouched until the team merges on purpose.

---

## Branch model

| Branch | Purpose | Deploys? |
| --- | --- | --- |
| `develop` | **All day-to-day work.** Every page, component, and fix lands here first | No |
| `main` | **Production.** Currently the live site | Yes, on push |

Rules while the site is under development:

- Never push to `main` and never merge `develop` into it — `develop` is the integration branch.
- Feature work still branches off `develop` (`feat/about-page` → PR → `develop`) so six people avoid conflicts.
- Merging to `main` is a deliberate launch step: it replaces the live site with the new one. Nothing else
  triggers a deploy.
- Recommended: protect `main` in GitHub (Settings → Branches) with "require PR + passing checks" so a
  production deploy can never happen from a stray push.

## Team workflow

1. **Branch:** `git checkout -b feat/about-page`
2. **Build your page** — create the route file in `routes/` and put its sections in
   `components/sections/<page>/` (`components/sections/about/` for `/about`), static content in `data/`. One
   folder per person to avoid conflicts (see `docs/ARCHITECTURE.md`).
3. **Verify before pushing:**
   ```bash
   bunx tsc --noEmit && bun test && bun run build
   ```
   All three must pass — CI runs the same three, and a red build blocks the deploy.
4. **Commit & open a PR.**

Conventions that are easy to break:

- `routes/*.tsx` is one file per page and holds only composition — extract anything reused into `components/`.
- `components/sections/<page>/` holds one page's sections only; a section two pages share belongs in
  `components/ui/`.
- Navigate with `<Link>` from `@tanstack/react-router`, never `<a href>`.
- Add new menu links to `data/nav.ts`; navbar and footer both read from it.
- Never edit `routeTree.gen.ts` — it is generated.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Could not resolve entry for router entry: router in .../src` | `srcDirectory: '.'` was lost in `vite.config.ts`, or `tsr.config.json` no longer points at `./routes` |
| Port 3000 already in use | `PORT=8080 bun run dev`, or kill the other process |
| `bun install` fails after pulling | Delete `node_modules` + `bun.lock`, then `bun install` |
| Page 404 after adding a route file | Dev server writes `routeTree.gen.ts` automatically — restart `bun run dev` if it did not |
| Types error after editing config | Re-run `bunx tsc --noEmit`; confirm `#/*` alias still maps to `./*` in `tsconfig.json` and `package.json` |

---

## Learn more

- [TanStack Start](https://tanstack.com/start) · [TanStack Router](https://tanstack.com/router)
- [Tailwind CSS](https://tailwindcss.com) · [Bun](https://bun.sh)
