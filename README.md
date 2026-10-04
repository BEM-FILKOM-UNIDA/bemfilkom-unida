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
| `bun run build` | Production build → `.output/` |
| `bun run preview` | Serve the production build locally |
| `bun run generate-routes` | Regenerate `routeTree.gen.ts` (rarely needed — the dev server does it) |
| `bunx tsc --noEmit` | Type check — **run before every push** |

Use `PORT=8080 bun run dev` if port 3000 is taken. Stop the server with `Ctrl+C`.

---

## Production build

```bash
bun run build                                  # → .output/ (self-contained Node server)
node .output/server/index.mjs                  # serve it, defaults to :3000
PORT=8080 node .output/server/index.mjs        # or pick a port
```

`.output/` is fully self-contained — copy it to any Node-compatible host (VPS, Render, Railway, Fly.io) and run
the command above. Presets for Vercel / Netlify / Cloudflare: <https://v3.nitro.build/deploy>.

---

## Team workflow

1. **Branch:** `git checkout -b feat/about-page`
2. **Build your page** — create the route file in `routes/`, put reusable parts in `components/`,
   static content in `data/`. One folder per person to avoid conflicts (see `docs/ARCHITECTURE.md`).
3. **Verify before pushing:**
   ```bash
   bunx tsc --noEmit && bun run build
   ```
4. **Commit & open a PR.**

Conventions that are easy to break:

- `routes/*.tsx` is one file per page and holds only composition — extract anything reused into `components/`.
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
