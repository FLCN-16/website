# React Doctor False Positives

## `react-doctor/server-auth-actions`
- File: `actions/contact.ts` — `submitContact` is an intentionally public contact form; auth is not needed and would block public submissions.

## `react-doctor/only-export-components`
- Files: `components/ui/button.tsx`, `components/ui/badge.tsx`, `components/ui/button-group.tsx`, `components/ui/navigation-menu.tsx`, `components/ui/tabs.tsx`, `components/ui/toggle.tsx` — shadcn/ui co-locates variant helpers (e.g. `buttonVariants`) with their component in the same file. Variants are only imported within `components/ui/` itself. Splitting them would diverge from the shadcn/ui convention.

## `react-doctor/nextjs-no-redirect-in-try-catch`
- File: `app/(site)/layout.tsx:63` — `redirect()` is inside a try block but the catch already calls `unstable_rethrow(err)` as its first statement, which is the canonical fix. No further action needed.

## `react-doctor/server-after-nonblocking`
- File: `actions/contact.ts` — `console.error` and `console.warn` are cheap synchronous calls used for developer debugging; deferring them with `after()` provides no measurable benefit.

## `deslop/unused-file`
- Entire `components/ui/` directory — deslop's static import graph analysis fails to trace through Next.js path aliases (`@/components/ui/...`). `button.tsx` alone has 10+ consumers. All flagged files are actively used.

## `deslop/unused-dependency` and `deslop/unused-dev-dependency`
- `package.json` — dependency analysis likely conflicts with the monorepo workspace setup; verify manually before removing any package.

## `react-doctor/no-danger`
- File: `components/writing/richtext-converters.tsx` — the `code` converter injects server-side PrismJS-highlighted HTML via `dangerouslySetInnerHTML`. PrismJS escapes `<` and `&` in the source (no element injection is possible — see `lib/__tests__/highlight-code.test.ts`), and code content is authored by the site owner through the CMS. Emitting the `.token.*` markup that `app/globals.css` styles is the standard pattern for server-rendered syntax highlighting and cannot be expressed without raw HTML. Runs server-only, so Prism never reaches the client.
