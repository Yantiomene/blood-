# Engineering Rules and Conventions

Status: Default standards to be used moving forward (subject to future ADRs if changes are needed).

## 1) Architecture & General Principles
- Preserve feature parity while refactoring; prefer incremental, backward-compatible changes.
- Layered backend: routes -> controllers -> services -> repositories (DB) -> db client.
- Single source of truth for config via environment variables and a validated config module.
- Security by default: least privilege, deny by default, validate every input, never trust client data.
- Consistency over cleverness: prefer readable, tested code to micro-optimizations.

## 2) Backend Standards (Node/Express)
- Runtime: Node LTS. Use ES modules or CommonJS consistently (follow existing project setting).
- Structure: src/{routes,controllers,services,repositories,middlewares,utils,db,validators}
- Controllers: thin orchestrators; no business logic or SQL. Return normalized API responses.
- Services: business logic, transactions, cross-entity workflows.
- Repositories: all DB access via Knex/parameterized queries only; no string interpolation.
- Middlewares: auth, validation, error handler, rate limit.
- Errors: throw typed errors with code; global error middleware maps to response format.
- Logging: pino (JSON) or equivalent; include requestId (correlation ID). Redact secrets and PII.

### 2.1 Authentication & Authorization
- Auth model: Authorization: Bearer <access_token> for API requests.
- Tokens: access token TTL 15m; refresh token TTL 7d with rotation and reuse detection.
- Refresh token delivery: HttpOnly, Secure (prod), SameSite=Lax cookie, Path=/api/auth/refresh.
- Token storage: sign with server secret; store refresh token family/metadata in Redis for revocation and reuse detection.
- Logout/password reset/email change: revoke active tokens (Redis blacklist/rotation).
- Scopes/roles: use role-based checks via middleware (e.g., requireRole('admin')).

### 2.2 CSRF, CORS, Cookies
- With Bearer access tokens, CSRF risk is minimized for API calls. Any endpoint that relies on cookies (e.g., refresh) MUST require an X-CSRF-Token header with a rotating CSRF token.
- Cookies: HttpOnly; Secure in production; SameSite=Lax; minimal scope (path restricted). No sensitive data in non-HttpOnly cookies.
- CORS: Allowlist origins from env (ALLOWED_ORIGINS). credentials: true only if cookies are used; expose minimal headers. Allowed methods: GET,POST,PUT,PATCH,DELETE,OPTIONS.

### 2.3 Validation & Sanitization
- Validate all inputs using express-validator or zod-based middleware. Reject on first failure with consistent error shape.
- Sanitize strings (trim, escape where appropriate). Enforce schema-level constraints (see DB section).

### 2.4 API Conventions
- Base path: /api/v1
- Resource naming: plural nouns (e.g., /users, /donation-requests, /blogs, /messages, /conversations).
- Pagination: query params page (1-based), pageSize (default 20, max 100). Response meta: { total, page, pageSize }.
- Filtering/sorting: q (search), sort (field), order (asc|desc). Validate allowed fields.
- Idempotency: for sensitive POST endpoints (e.g., payments in future), support Idempotency-Key header.
- Response envelope:
  - Success: { success: true, data, meta? }
  - Error: { success: false, error: { code, message, details? } }
- HTTP statuses: 200/201 success; 400 validation; 401 unauth; 403 forbidden; 404 not found; 409 conflict; 429 rate limited; 500 internal.

### 2.5 Rate Limiting & Security Headers
- Global and route-specific rate limits (e.g., login/verify/reset tighter limits).
- Helmet for security headers; compression for responses; disable x-powered-by.
- No secrets or tokens logged; redact Authorization, Set-Cookie, password, token, apiKey.

### 2.6 WebSocket (Realtime)
- Single, integrated WS server within backend app; remove root-level adhoc server.
- Connection: client sends an initial auth message with access token (Bearer) within 5s; unauth -> disconnect.
- Authorization: verify JWT; join rooms by convention (e.g., conv:<conversationId>).
- Message schema: { type: string, data: any, ts: number, requestId?: string }.
- Server acks with { type: 'ack', requestId } for critical actions; errors: { type: 'error', code, message }.

## 3) Database Standards (PostgreSQL + Knex)
- Naming: snake_case; tables plural (users, donation_requests, conversations, messages, blogs).
- Primary keys: id bigserial; foreign keys with ON DELETE CASCADE where appropriate (messages, conversations), and RESTRICT where data must persist.
- Timestamps: created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now() with triggers or app-level updates.
- Constraints:
  - users.email UNIQUE (lowercased); enforce format at app layer.
  - donation_requests: quantity > 0; blood_type CHECK in allowed set.
  - Non-null constraints for required fields.
- Indexes:
  - FKs (e.g., donation_requests.user_id, messages.conversation_id).
  - Common filters: donation_requests(status, blood_type), conversations(sender_id, receiver_id).
  - Text search indexes where necessary (blogs.title/content if search needed).
- Migrations:
  - File name: yyyymmddHHMMSS_action_table.js (e.g., 20240409120000_create_conversations_table.js).
  - Provide both up and down; never modify a migration that has shipped—create a new migration.
  - Seeds: dev-only seeds isolated; never run seeds in production.
- Transactions: wrap multi-step writes (e.g., create conversation + first message) in a single transaction.
- Geospatial:
  - Preferred: PostGIS for proximity queries with GiST indexes.
  - Fallback: store lat/long; use bounding-box + Haversine; note reduced accuracy/perf.

## 4) Frontend Standards (Next.js App Router)
- Directory: client/app is the canonical frontend; remove/retire legacy frontend/.
- Routing: use App Router. Pages live under app/[route]/page.tsx. Avoid app/pages legacy pattern.
- Data fetching:
  - Prefer Server Components for read-heavy routes.
  - For client-side data, use SWR/React Query; minimize Redux to cross-cutting or complex flows only.
- Auth:
  - Send access tokens via Authorization header; refresh via cookie-based endpoint.
  - Protect routes with Next middleware (redirect unauthenticated to login).
- UI & Styling: Tailwind CSS; shared components under app/components; follow accessible patterns (labels, roles, focus states).
- Forms: react-hook-form + zod schema validation; user-friendly error messages.
- Error/Loading states: standardized skeletons/spinners and toast notifications.
- Environment config: use next.config and public env vars for non-secrets only.

## 5) Testing & Quality
- Test pyramid:
  - Unit: services/utils/validators (Jest).
  - Integration: controllers/routes with Supertest; DB via test schema.
  - E2E smoke: core user flows (Playwright or Cypress).
- Coverage: target ≥70% on critical paths; do not block on snapshot-only tests.
- Test data: factories/fixtures; isolate side effects; use transactions/rollbacks per test.
- Linting/Formatting: ESLint + Prettier mandatory; CI must fail on violations.

## 6) CI/CD & Environments
- CI steps: install, lint, build (if required), test (unit+integration), report coverage.
- Branching: feature/*, fix/*, chore/*; PR to develop/main via review; squash merges recommended.
- Commits: Conventional Commits (feat, fix, chore, refactor, docs, test, perf, ci, build, revert).
- Envs: .env.example authoritative; runtime validation on boot (fail fast on missing/invalid).
- Secrets: never committed; use environment store (e.g., 1Password/Vault) in real deployments.

## 7) Performance & Caching
- DB performance: avoid N+1; prefer joins; add appropriate indexes; analyze queries.
- Caching: Redis for hot reads (e.g., geocoding results) with TTL; cache-bust on writes.
- API responses: gzip/br compression; ETags/Cache-Control for public static content.

## 8) Logging, Monitoring, and Privacy
- Structured logs with levels (info, warn, error), requestId, userId (if authenticated).
- Redact sensitive fields: password, tokens, authorization, cookies, apiKey, secret.
- Error reporting: central handler logs stack traces (non-prod: include stack in logs, not in API response).
- PII handling: log only necessary metadata; avoid storing PII in logs.

## 9) Documentation & ADRs
- Keep README(s) updated with setup, scripts, and endpoints.
- The root README.md MUST be updated immediately whenever significant or breaking changes are made (e.g., features, architecture, environment variables, scripts, or API endpoints). Treat the README as a living document and include README updates in the same PR as the change. (Repo root: /Users/macbookpro/Documents/ALX_SE/blood-/README.md)
- Record key architectural decisions via short ADRs in docs/adrs/ (numbered, dated).

## 10) Decommissioning Legacy
- Remove root-level WebSocket server and EJS views; integrate WS in backend app.
- Archive or remove legacy React app under frontend/; client/ is canonical.

---

Any deviation from these rules requires an ADR and reviewer approval. These conventions guide the upcoming refactor and all future contributions.