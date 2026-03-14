# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Server (run from `server/`)
```bash
docker compose up -d          # Start PostgreSQL (port 5434)
npm run dev                   # Start Express dev server (port 3000, nodemon)
npm run db:migrate            # npx prisma migrate dev
npm run db:generate           # npx prisma generate
npm run db:studio             # npx prisma studio
```

### Client (run from `client/`)
```bash
npm run dev                   # Start Vite dev server (port 5173)
npm run build                 # TypeScript check + Vite production build
npm run lint                  # ESLint (flat config)
```

### Environment
- Server `.env`: PORT, DATABASE_URL, JWT_SECRET, JWT_EXPIRES_IN, DB_USER, DB_PASSWORD, DB_NAME
- Client `.env`: VITE_API_BACKEND_URL (default: http://localhost:3000)
- No test framework is configured

## Architecture

### Monorepo: `server/` + `client/`

**Server** — Node.js + Express 5, CommonJS modules, Prisma 6 + PostgreSQL

- Entry: `server/src/index.js` → `server/src/router.js`
- Module pattern: `server/src/modules/<name>/<name>.{routes,controller,usecase}.js`
  - Routes define endpoints, controller handles req/res, usecase contains business logic
- Auth middleware (`server/src/middlewares/auth.middleware.js`) applied to all routes except `health` and `auth`
- Prisma singleton: `server/src/lib/prisma.js`
- Cron job: `server/src/cron/overdue-checker.js` — marks ACTIVE loans as OVERDUE daily at midnight
- 11 modules: health, auth, users, authors, categories, books, book-copies, borrowers, loans, penalties

**Client** — React 19 + Vite + TypeScript + MUI + Tailwind v4

- Entry: `client/src/main.tsx` → `client/src/router.tsx` (lazy-loaded routes)
- Feature-based structure:
  - `components/<feature>/` — UI components (Main list view, Form dialog, hooks/)
  - `hook/<domain>/` — TanStack Query hooks (queries + mutations)
  - `pages/<domain>/` — Page-level components
- API layer: `client/src/shared/services/http-client.ts` (generic HttpClient class) → `client/src/shared/services/api.backend.ts` (configured instance with 401 redirect)
- Auth: JWT stored in localStorage, `client/src/context/AuthContext.tsx` for state
- Forms: react-hook-form + zodResolver for validation
- Server state: TanStack Query with invalidateQueries on mutations + react-hot-toast for feedback

## Key Domain Rules

- **Roles**: ADMIN, LIBRARIAN
- **BorrowerType**: STUDENT (7-day loan), TEACHER (15-day loan)
- **BookCopy inventoryCode**: Auto-generated as `PREFIX-NNN` from category prefix (3-char uppercase)
- **Borrower code**: Auto-generated as `EST-NNN` (student) or `DOC-NNN` (teacher)
- **Loans**: Use `inventoryCode` + `borrowerIdentifier` (id or code) to create
- **Late returns**: Auto-create Penalty and suspend borrower; resolving last penalty reactivates borrower
- **LoanStatus**: ACTIVE → RETURNED | OVERDUE | LOST
- **CopyCondition**: NEW, GOOD, FAIR, DAMAGED
- Default admin credentials: admin@schoolibrary.com / password123
