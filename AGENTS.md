# AGENTS.md — Formal Complaint Ghostwriter

Instructions for AI assistants and developers working on this project.

## What this app is

A writing assistant that helps a UC Berkeley MDes graduate student draft a formal
complaint letter to the MDes Program Office about workload and scheduling. A chat
panel gathers the student's own account of the problem; a document panel builds the
letter draft.

The project owner is a design student, not a terminal user. Explain shell commands
in plain language before running them, and say when something fails rather than
quietly working around it.

## The most important rule in this codebase

`api/_gemini.ts` contains `SYSTEM_INSTRUCTION`, and its central constraint is:

> **Never state anything about the user that they have not said.**

The system prompt describes the *category* of problem that students in high-workload
programs face. That background is **not** a record of what the current user has told
us. The model starts every conversation knowing nothing about the person. It may
*ask* whether workload has affected their health; it must never *assert* that it has.
This applies to chat replies, the confirmation summary, the letter draft, and the
list of unresolved items — every output, with no exceptions.

If you edit the prompt, the model config, or anything about how user input is
summarized, preserve this rule. A plausible-sounding sentence the user never said is
the single worst failure this app can produce: it would put fabricated claims about a
real person into a real letter to a real university office. Treat any change that
could weaken this as requiring the owner's explicit sign-off.

## Running it

Requires **Node 22** (installed here via nvm) and **npm**.

```bash
npm install          # install dependencies
npm run dev          # start on http://localhost:3000
npm run lint         # TypeScript check — tsc --noEmit, must pass clean
npm run build        # production build into dist/
```

`npm run dev` runs `server.ts` through `tsx`: an Express server that mounts Vite as
middleware, so the API and the front end share one port (3000). There is no separate
Vite dev server to start.

### Use npm, not Bun

A `bun.lock` file is committed because the project was originally generated with Bun,
but this machine is set up with **npm** and `package-lock.json`. Don't mix the two.

Bun tolerated a dependency conflict that npm correctly rejects: `package.json` pinned
`esbuild@^0.25.0` while Vite 8 requires esbuild 0.27/0.28, and Bun simply installed
both. That unused `esbuild` devDependency has been **removed** — it was never imported
anywhere, and Vite bundles its own copy. Do not add it back. If `npm install` ever
fails on peer dependencies again, fix the actual version conflict rather than reaching
for `--legacy-peer-deps`.

## The secret

One environment variable: `GEMINI_API_KEY`.

It must live in a file named exactly **`.env`** in the project root. Both `server.ts`
and `api/_gemini.ts` call `dotenv.config()` with no arguments, which reads `.env` and
**ignores `.env.local`**. A key placed in `.env.local` is silently not found, and the
app fails with "GEMINI_API_KEY environment variable is not set" — a confusing error
with an unrelated-looking cause.

`.gitignore` excludes `.env*` (but keeps `.env.example`). Never commit a real key,
never print one into terminal output or chat, and never paste one into a web form.
`.env.example` documents the variables and is the only env file that belongs in Git.

For deployment, set `GEMINI_API_KEY` in the host's own environment settings
(Vercel project settings), not in a committed file.

## Layout

```
server.ts              Express + Vite dev server for local use (port 3000)
api/_gemini.ts         Shared Gemini logic: model config, SYSTEM_INSTRUCTION,
                       processChatRequest, formatErrorMessage. The core of the app.
api/chat.ts            Serverless handler for POST /api/chat
api/fill-placeholder.ts  Replaces a [bracketed placeholder] in the draft
api/model-info.ts      Serverless handler for GET /api/model-info
src/App.tsx            Top-level app state
src/components/        ChatPanel, DocumentPanel, Header, and the modals
src/data/sampleJourneys.ts  Example conversations
src/types.ts           Shared TypeScript types
vercel.json            Build config and SPA rewrites (leaves /api/* alone)
```

`api/*.ts` files are Vercel serverless functions in production. `server.ts` re-implements
the same routes for local development. **Business logic belongs in `api/_gemini.ts`** so
both paths share it — if you add a route, wire it up in both places or the app will work
locally and 404 in production.

## Conventions

- **Imports of local files need explicit `.js` extensions**, even though the sources are
  `.ts` — e.g. `from './api/_gemini.js'`. This is required by ES modules with
  `"type": "module"`. A previous commit existed solely to fix missing extensions.
- Models are configured at the top of `api/_gemini.ts`: `PRIMARY_MODEL` with a
  `FALLBACK_MODELS` chain, plus `MODEL_INFO` which the UI displays. If you change the
  model, update `MODEL_INFO` to match or the UI will report the wrong one.
- Tailwind CSS v4 via `@tailwindcss/vite`. No `tailwind.config.js`; configuration is in
  `src/index.css`.
- **Do not modify the `hmr` / `watch` block in `vite.config.ts`.** It is deliberately
  gated on `DISABLE_HMR` to stop flickering during agent edits, and carries a comment
  saying so.
- Run `npm run lint` before declaring work finished. It currently passes clean.

## Browser testing

Playwright with Chromium is installed (`@playwright/test`). There is no
`playwright.config.ts` and no committed test suite yet — browser checks so far have been
ad-hoc scripts against `http://localhost:3000`. If you add a real suite, add the config
and a `test` script to `package.json`.

Note that exercising the chat end to end spends real Gemini API quota on the owner's key.
Prefer checking that the UI renders and that `/api/model-info` responds when you only
need to confirm the app is alive.

## Deployment

The Vercel CLI is installed but **not logged in**, and nothing has been deployed. Deploying
this app publishes a tool built around one student's complaint against their own program —
treat going public as the owner's decision alone. Don't run `vercel deploy` without being
asked directly.
