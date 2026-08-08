# CLAUDE.md

`codereview-fe` — frontend for the PCCTH automated code review system. Pure SPA, no SSR.
Backend is `pccth_code_review_service` at `http://localhost:8080` (OpenAPI spec at `/v3/api-docs`).

Stack: React 18, Vite 8, TypeScript 6, Tailwind CSS v4, TanStack Query 5, react-router 7, Vitest 4, i18next, axios, STOMP/SockJS, lucide-react.

---

## 1. Commands and definition of done

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on port **5173 only** — the backend allows CORS for that port and no other |
| `npm run build` | `tsc -b && vite build` — a type error breaks the build |
| `npm run preview` | Serve the built output |
| `npm run lint` | ESLint, including the architecture boundary rules |
| `npm test` | `vitest run` |
| `npm run test:watch` | Vitest in watch mode |

**Never report work as done before all four of these pass:**

```
npx tsc -b        0 errors
npm test          all green
npm run lint      0 errors
npm run build     succeeds
```

Warnings are acceptable only if you can state why each one is correct to leave.

For refactors that must not change the UI, prove it instead of assuming it: drive the app with Playwright and diff the DOM class tree before and after. All styling lives in Tailwind class names, so an identical class tree means identical UI.

---

## 2. The one architectural rule

Imports flow in one direction only.

```
shared  ->  features  ->  pages  ->  app
```

A lower layer must never know about a higher one.

| Layer | May import | Must never import |
| --- | --- | --- |
| `components/` `lib/` `types/` `config/` | each other | `features/` `pages/` `app/` |
| `features/<x>/` | shared layer, own feature | `pages/` `app/`, **any other feature** |
| `pages/` | shared layer, any feature | `app/` |
| `app/` | everything | — |

The single exception: **`import type` across features is allowed.** TypeScript erases it at compile time, so it adds no runtime coupling. This is why cross-feature enforcement uses `@typescript-eslint/no-restricted-imports` (which supports `allowTypeImports`) rather than `import-x/no-restricted-paths` (which does not).

ESLint enforces all of the above. When you hit the wall, these are the only correct moves:

| Situation | Correct fix | Never do this |
| --- | --- | --- |
| Shared code in `lib/` needs something from `features/` | It is not shared code. **Move it up into `app/`.** | Add an `eslint-disable` |
| Feature A needs feature B at runtime | Compose them in `pages/` or `app/`, or push the shared part down into the shared layer | Import B from A |
| Feature A needs only a type from B | `import type` — allowed | Duplicate the type |

**Never create barrel files** (an `index.ts` that re-exports a whole folder). Vite cannot tree-shake through them and the bundle grows. Always import the real file directly.

`@` is aliased to `./src`. Always import as `@/features/...`, never with long relative paths.

---

## 3. What each folder is responsible for

```
src/
  app/          Top layer. The only place allowed to wire multiple features together.
  pages/        One route = one file. Layout and hook calls only.
  features/     Most of the code. One folder per business concern.
  components/   Cross-feature UI.
  config/       Environment values.
  lib/          Cross-feature non-UI code.
  types/        Types shared across layers.
  locales/      i18next translation files (en, th).
  styles/       Theme tokens, CSS variables, animations.
  assets/       Images and logos imported by code.
```

### `app/` — composition layer

| Path | Responsibility |
| --- | --- |
| `app/main.tsx` | Entry point. Loads theme and language, then renders. |
| `app/App.tsx` | Wraps every provider (query client, toast, router). |
| `app/router.tsx` | Every route in one place. |
| `app/guards/` | Route gates: is the user logged in, does the role match. |
| `app/layouts/` | The shell shown after login (sidebar, topbar). |
| `app/providers/` | `AuthProvider` — app-wide session. |
| `app/realtime/` | `useAppRealtimeSync` — bridges STOMP events into the query cache. |
| `app/shell/` | `GlobalCommandSearch` — cross-feature search in the topbar. |

Anything that must know about several features at once belongs here — not in `lib/`, not in `components/`.

### `pages/` — assembly only

A page lays out components and calls hooks. Nothing else. If a page grows a real calculation, move it to `features/<name>/lib/`. Pages must not call `api/` directly.

### `features/<name>/` — one business concern each

Current features: `analytics` `auth` `issue` `notification` `report` `repository` `scan` `security` `setting` `user`.

| Subfolder | Responsibility | Rule |
| --- | --- | --- |
| `api/` | Functions that call the backend | Must not know React |
| `hooks/` | Wrap `api/` with TanStack Query, own loading/error/cache | The only thing pages call |
| `components/` | UI used only by this feature | Module level, never declared inside another component |
| `lib/` | Pure calculation, no UI | Tests live here, next to the file |
| `types.ts` | Shape of this feature's data | — |

Everything about one concern stays in one folder. To understand scanning, `features/scan/` is the whole story.

### `components/`, `lib/`, `types/`, `config/` — the shared layer

| Path | Responsibility |
| --- | --- |
| `components/ui/` | Presentational primitives with no business knowledge |
| `components/common/` | Shared buttons, form fields, modals |
| `components/charts/` | Charts |
| `lib/api-client.ts` | The axios instance. Every HTTP call goes through it |
| `lib/realtime/` | STOMP/SockJS client and the `useRealtimeTopic` hook |
| `lib/auth/` | `token-store.ts`, `auth-context.ts` |
| `lib/format-date.ts` | The only date formatter |
| `types/` | Types the shared layer needs but cannot import from a feature |
| `config/env.ts` | The only file allowed to read `import.meta.env` |

Code starts inside a feature. It moves up into the shared layer **only when a second feature actually needs it** — never because it might be reused later.

---

## 4. Hard rules

1. **Never** call `axios.get` / `axios.post` / `fetch` in a component. Go through `lib/api-client.ts`. Importing `axios` in a component is acceptable for exactly one thing: `axios.isAxiosError()` in an error handler.
2. **Never** construct a STOMP client by hand. Use `useRealtimeTopic` from `lib/realtime/`.
3. **Never** read `import.meta.env` outside `config/env.ts`.
4. **Never** format a date by hand. Use `lib/format-date.ts`. It returns `null` when there is no value — the caller adds `?? '—'`. `formatDateTimeShort` omits the year and is used on the dashboard only.
5. **Never** hardcode user-visible text. Every string goes through i18next, in both `en` and `th`.
6. **Never** use `any`. TypeScript is strict and `consistent-type-imports` is enforced.
7. **Never** add another icon library. `lucide-react` only.
8. **Always** handle both the loading state and the error state wherever data is fetched.
9. **Always** declare components at module level. A component defined inside another function remounts on every render.
10. **Always** derive state during render. Do not sync values with `useEffect` + `setState`.
11. **Never** write explanatory comments. Well-named code documents itself; comment-heavy code reads as machine-generated. Put the explanation in chat or in the README instead.

---

## 5. Codebase landmines

**Tailwind v4, CSS-first.** There is no `tailwind.config.js` anywhere. The theme lives in `src/styles/index.css`. Colors are declared as plain CSS custom properties under `:root` and `.dark` (`--bg --surface --border --primary --critical --major ...`), then mapped into the `@theme inline` block. Add a new color by following that two-step pattern; do not declare it directly as a `@theme` token. Dark mode is `@custom-variant dark (&:where(.dark, .dark *))`, toggled by a `.dark` class on `<html>`.

**react-router 7 in data mode.** `createBrowserRouter` in `src/app/router.tsx`. This is not framework mode — there are no Remix-style loaders or actions. Register a new route with the `lazyRoute('ExportName', () => import('@/pages/X'))` helper. The path inside `import()` **must be a string literal** or Vite cannot split the chunk. The build currently produces 118 chunks; if that number drops sharply, code splitting has been broken.

**Vitest config is embedded in `vite.config.ts`,** not a separate file. `include` is `['src/**/*.test.ts']` — **`.tsx` files are not run.** `TZ` is pinned to `Asia/Bangkok`. Tests cover pure logic only and live beside the file inside a feature's `lib/`. There are no component tests yet; adding them requires changing `include` and setting up a jsdom environment first.

**Similar-looking i18n keys can hold different text.** `SCAN.STATUS_PASS` is "Pass" but `DETAIL_REPO.PASSED` is "Passed" (they differ in English, not in Thai). When merging duplicate components, do not merge their keys — give the shared component a label override prop instead.

**Files use CRLF line endings.** A codemod whose `.replace()` spans lines will silently fail to match. Normalize `\r\n` to `\n` before transforming.

**Public routes cannot be tested while logged in.** `AuthBoundary` redirects them to `/dashboard`. Use a logged-out browser context.

**`react-hooks/set-state-in-effect` is set to `warn`,** not error, because some pre-existing patterns cannot be converted without changing render timing. Do not silence it and do not let new violations in.

---

## 6. Working agreement

- **Never touch git unless explicitly asked.** No commits, no pushes, no branch switching — the user does that.
- **Never commit `CLAUDE.md`.**
- **Never delete root config files:** `package.json`, `vite.config.ts`, `tsconfig*.json`, `.env`, `eslint.config.js`.
- **Never run `rm -rf`, `del /s`, or `git reset --hard`** without explicit permission.
- For a large change, back up `src/` first, then work in small steps and run the full green gate after each one.
- The user comes from Angular. Explaining React concepts by comparing them to the Angular code they wrote themselves lands much faster than explaining them abstractly.
- Reply in Thai.
- Report results honestly. If a test fails, say so and show the output. If a step was skipped, say it was skipped.
