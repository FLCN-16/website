## graphify

A knowledge graph of this codebase lives in `graphify-out/graph.json` (693 nodes, 794 edges, 96 communities as of 2026-05-28).

**When to use it:**
- Before answering any question about how the codebase works, what calls what, or where something is defined — check the graph first.
- When the user asks "how does X work?", "what uses Y?", "trace the flow through Z" — run `graphify query "<question>"` immediately using the existing graph (no rebuild needed).
- After significant code changes, run `/graphify --update` to keep the graph current.

**How to query:**
```bash
graphify query "your question here"          # BFS — broad context, nearest neighbors
graphify query "your question here" --dfs    # DFS — trace a specific chain
```

**Key god nodes (most connected):**
- `Payload CMS Config` (17 edges) — hub for all collections, plugins, storage
- `CACHE_TAGS` (14 edges) — drives all Next.js on-demand revalidation
- `getPayloadClient` (14 edges) — thin wrapper used across data layer
- `lib/data` (10 edges) — cached data fetchers entry point
- `Button Component` (16 edges) — UI primitive referenced everywhere

**Communities to know:**
- `Payload CMS Collections & Actions` — all CMS collections + server actions
- `Data Fetching & Cache Layer` — CACHE_TAGS + getCached* fetchers
- `Next.js App Routes` — admin panel, API routes, page routes
- `SEO & Server Actions` — sitemaps, robots, talent inquiry flow
- `Cloudflare R2 Media Storage` — S3 plugin + image loader
