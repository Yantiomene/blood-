# Blood+ 🩸

## Problem Statement: 🆘

In many African hospitals, the availability of blood for patients in need is a critical challenge. Hospitals often lack sufficient blood stocks, leading to delays in emergency situations or the burden of purchasing replacement blood falling on the patient's family. There is a need for a reliable and efficient system to connect blood donors with those in need and ensure a timely and accessible supply of blood in local communities.

## Solution - Features: 💡

### User Registration and Profile Management: 👤
- Allow users to register as blood donors or recipients.
- Collect and manage user profiles with relevant information such as blood type, location, and contact details.

### Blood Donation Requests: 🤲
- Enable hospitals or individuals to create blood donation requests specifying the blood type and quantity required.
- Provide a platform for users to browse and respond to donation requests.

### Real-time Location-Based Matching: 🕛
- Utilize GPS technology to match blood donors with nearby donation requests.
- Provide notifications to eligible donors when a matching request is posted in their vicinity.

### Secure Communication: 🔐
- Implement a secure messaging system to facilitate communication between donors and recipients.
- Maintain privacy by allowing users to choose whether to share contact details.

### Blood Donation History: 📜
- Keep track of users' donation history to recognize and appreciate regular donors.
- Allow users to view their contribution to the community's blood supply.

### Verification and Ratings: ✰ ✰ ✰
- Implement a verification system to ensure the credibility of donors and recipients.
- Allow users to rate and provide feedback based on their experience with donors and donation requests.

## Technology Stack:

### Backend: 🚀
- **Node.js:** Server-side JavaScript runtime.
- **Express:** Web application framework for Node.js.
- **PostgreSQL:** Relational database for data storage.
- **PostGIS:** Spatial database extender for PostgreSQL.
- **Google Maps API:** Integration for real-time location-based matching.
- **Gmail API:** Utilized for email sending service.

### Frontend: ⚛️
- **Next.js:** React framework for building server-rendered applications.
- **React:** JavaScript library for building user interfaces.

## Getting Started:

### Backend Setup:

1. Install Node.js and npm.
2. Install PostgreSQL and PostGIS extension.
3. Clone the backend repository.
4. Install dependencies: `npm install`.
5. Set up the database and run migrations: `knex migrate:latest`.
6. Configure Google Maps API key and Gmail API credentials.
7. Start the development server: `npm run dev`

### Frontend Setup:

1. Clone the frontend repository.
2. Install Node.js and npm.
3. Install dependencies: `npm install`.
4. Start the development server: `npm run dev`.

## Contributors:

- Yaninthé Tiomene - ([@Yantiomene](https://github.com/Yantiomene), [LinkedIn](https://www.linkedin.com/in/yaninthe-tiomene), [X](https://twitter.com/YanTiomene))

- Esmond Adjei - ([@esmond-adjei](https://github.com/esmond-adjei), [LinkedIn](https://www.linkedin.com/in/esmond-adjei), [X](https://twitter.com/x_jei))

- Gregory Slippi-Mensah - ([@Greg_Pro77](https://github.com/Greg-Pro77), [LinkedIn](#), [GHMatrix](#))


## Refactor Plan (Proposal) ✅

This plan aims to refactor the entire codebase (backend and frontend) while preserving all current features and improving readability, consistency, security, performance, and developer experience. It is organized into phases with clear deliverables and acceptance criteria.

### Objectives
- Preserve functional parity while improving code quality and reliability.
- Standardize architecture, naming, and conventions across backend and frontend.
- Strengthen security (auth, data validation, CSRF, CORS, secrets, rate-limiting).
- Improve performance (queries, indexes, caching, bundling).
- Enhance test coverage, CI/CD, and observability.

### Guiding Principles
- Functional parity first; refactors must not break existing flows.
- Small, incremental changes shipped behind feature flags when necessary.
- Consistent patterns: folder structure, naming, error handling, logging.
- Security by default: principle of least privilege, zero-trust for inputs.
- Measurable outcomes: each phase has explicit acceptance criteria.

### Scope Overview
- Backend (Node.js/Express/PostgreSQL/Knex/Redis/Nodemailer)
- Frontend (Next.js App Router + Redux where needed)
- Messaging (REST + authenticated WebSocket consolidation)
- Database schema (migrations hygiene, constraints, indexes)
- Tooling: linting/formatting, tests, CI/CD, logging/monitoring

---

## Testing Gates After Each Step

To ensure reliability and prevent regressions, every step within each phase must be validated by tests before advancing to the next step.
- For each deliverable implemented, add or update unit tests and integration tests that verify the behavior.
- Characterization tests should be added when refactoring legacy areas without existing coverage.
- No step is considered complete until its tests pass locally and in CI, and coverage does not regress on critical paths.
- Where applicable, include minimal E2E smoke tests for cross-cutting flows.

---

## Phase 0 — Baseline Audit & Current-State Tests

Deliverables
- Run existing backend tests and document pass/fail results; fix broken test harness or environment issues if needed.
- Create baseline characterization tests for core flows: authentication, donation requests, blogs, messaging/conversations.
- Database readiness: run migrations on a fresh database; prepare/dev seeds where appropriate.
- Spin up the Next.js client; exercise primary flows manually; log API/CSR/SSR issues (CORS/cookies/auth redirects).
- Generate baseline coverage report and a short status document summarizing what works/what doesn’t.

Acceptance Criteria
- A baseline test matrix (pass/fail) and coverage summary are recorded in the repo (e.g., docs/ or README appendix).
- The app boots locally with documented envs; migrations succeed on a fresh DB.
- Known blockers are captured as issues/tasks with prioritization.
- CI runs and reports the baseline tests.
- Testing Gate: Baseline tests for working features are established and passing before Phase 1 begins.

### Baseline Test Matrix (Phase 0)

Metadata
- Date: 2025-09-19
- Environment: local
- Commit/Tag: N/A (local working copy)
- DB Migration Version: latest
- Seed Data Version: backend/seeds (01_users_seed.js et al.)
- Test Runner(s): Backend (Jest/Supertest)
- Coverage Snapshot: Backend Unit: —, Backend Integration: —, Frontend Unit: —, Frontend Integration: —, E2E: —

Legend (Status)
- Pass = ✅
- Fail = ❌
- Blocked = ⛔
- N/A = —

Section A — Backend: Auth & User
A1. Register user
- Endpoint(s): POST /api/auth/register
- Pre-conditions: Fresh DB; email not registered
- Steps: Call with valid payload
- Expected: 201 + user created; hashed password in DB; token/cookie if applicable
- Test Type: Integration
- Status: ✅
- Notes/Issue: Implemented and tested via POST /api/register; email sending mocked in test; Redis uses in-memory client under NODE_ENV=test.

A2. Login user (valid)
- Endpoint(s): POST /api/auth/login
- Pre-conditions: User exists/verified
- Steps: Valid credentials
- Expected: 200 + token/cookie set (secure flags per env)
- Test Type: Integration
- Status: ✅
- Notes/Issue: Implemented and tested via POST /api/login; cookie returned and re-used.

A3. Login user (invalid)
- Endpoint(s): POST /api/auth/login
- Steps: Wrong password
- Expected: 401 + safe error message; no token/cookie
- Test Type: Integration
- Status: —
- Notes/Issue: Not covered yet in baseline tests.

A4. Logout
- Endpoint(s): POST /api/auth/logout
- Pre-conditions: Logged in
- Expected: 200 + token invalidated (Redis if used) and cookie cleared
- Test Type: Integration
- Status: —
- Notes/Issue: Not covered yet in baseline tests.

A5. Get profile (auth required)
- Endpoint(s): GET /api/users/me
- Pre-conditions: Logged in
- Expected: 200 + correct user data (no secrets)
- Test Type: Integration
- Status: ✅
- Notes/Issue: Implemented and tested via GET /api/profile with auth cookie.

A6. CSRF/CORS behavior (if cookies used)
- Endpoint(s): Mutating routes (POST/PUT/DELETE)
- Pre-conditions: Browser-like client; cross-origin
- Expected: CORS headers correct; CSRF token required if applicable
- Test Type: Integration/E2E
- Status: —
- Notes/Issue: Not covered yet; to be verified.

Section B — Backend: Donation Requests
B1. Create donation request
- Endpoint(s): POST /api/donations
- Pre-conditions: Authenticated user; valid payload
- Expected: 201 + record created; validated bloodType/quantity constraints
- Test Type: Integration
- Status: ✅
- Notes/Issue: Implemented and tested via POST /api/donationRequest; payload includes [lon, lat] location; seed user authenticated.

B2. List donation requests
- Endpoint(s): GET /api/donations
- Expected: 200 + array; pagination if applicable
- Test Type: Integration
- Status: ✅
- Notes/Issue: Implemented and tested via GET /api/donationRequest.

B3. Update donation request (owner)
- Endpoint(s): PUT /api/donations/:id
- Pre-conditions: Request owned by user
- Expected: 200 + updated resource; respects validation
- Test Type: Integration
- Status: ✅
- Notes/Issue: Implemented and tested via PUT /api/donationRequest/:id.

B4. Delete donation request (owner)
- Endpoint(s): DELETE /api/donations/:id
- Expected: 200/204 + resource removed; cascade rules honored
- Test Type: Integration
- Status: —
- Notes/Issue: Not covered yet in baseline tests.

B5. Validation errors
- Endpoint(s): POST/PUT /api/donations
- Steps: Invalid bloodType/quantity/required fields
- Expected: 400 + detailed errors (no stack)
- Test Type: Integration
- Status: —
- Notes/Issue: Not covered yet in baseline tests.

Section C — Backend: Blogs
C1. List blogs
- Endpoint(s): GET /api/blogs
- Expected: 200 + array; sort/pagination if applicable
- Test Type: Integration
- Status: —
- Notes/Issue: Not covered yet in baseline tests.

C2. Create blog (authorized role)
- Endpoint(s): POST /api/blogs
- Pre-conditions: Auth with author/admin privileges
- Expected: 201 + blog created; image handling if present
- Test Type: Integration
- Status: —
- Notes/Issue: Not covered yet in baseline tests.

C3. Update blog (authorized)
- Endpoint(s): PUT /api/blogs/:id
- Expected: 200 + updated blog
- Test Type: Integration
- Status: —
- Notes/Issue: Not covered yet in baseline tests.

C4. Delete blog (authorized)
- Endpoint(s): DELETE /api/blogs/:id
- Expected: 200/204 + removed
- Test Type: Integration
- Status: —
- Notes/Issue: Not covered yet in baseline tests.

Section D — Backend: Messaging & Conversations
D1. Create message (new conversation auto-create)
- Endpoint(s): POST /api/messages
- Pre-conditions: Valid senderId/receiverId; auth
- Expected: 201 + message created; conversationId created/linked correctly
- Test Type: Integration
- Status:
- Notes/Issue:

D2. Fetch conversation by participants
- Endpoint(s): GET /api/messages/conversation?senderId=&receiverId=
- Expected: 200 + conversation found/created as per logic
- Test Type: Integration
- Status:
- Notes/Issue:

D3. Get messages by conversationId
- Endpoint(s): GET /api/messages?conversationId=
- Expected: 200 + ordered messages
- Test Type: Integration
- Status:
- Notes/Issue:

D4. Update/Delete message (ownership/permissions)
- Endpoint(s): PUT/DELETE /api/messages/:id
- Expected: 200 + updated or 204 delete; permission checks enforced
- Test Type: Integration
- Status:
- Notes/Issue:

Section E — Backend: WebSocket (if currently active)
E1. Connect with auth
- Event(s): WS connect/handshake
- Pre-conditions: Valid token/cookie available
- Expected: Connection accepted; unauth rejected
- Test Type: Integration/E2E
- Status:
- Notes/Issue:

E2. Send/receive message event
- Event(s): message/send, message/receive
- Expected: Server acknowledges; routes to proper room/recipient
- Test Type: Integration/E2E
- Status:
- Notes/Issue:

Section F — Backend: DB & Ops
F1. Migrations up on fresh DB
- Command: knex migrate:latest
- Expected: Success; schema matches design; no dangling/failed objects
- Test Type: Ops
- Status:
- Notes/Issue:

F2. Migrations down/up cycles
- Command: knex migrate:down then up
- Expected: Clean reversibility for recent migrations
- Test Type: Ops
- Status:
- Notes/Issue:

F3. Constraints & indexes
- Check: UNIQUE(email), CHECK(bloodType, quantity>0), FKs, indexes on hot queries
- Expected: Present and effective; query plans avoid full scans on hot paths
- Test Type: Integration/Ops
- Status:
- Notes/Issue:

F4. Transactions for multi-step operations
- Example: create conversation + first message
- Expected: All-or-nothing behavior
- Test Type: Integration
- Status:
- Notes/Issue:

Section G — Frontend: Next.js Core Flows
G1. Login flow
- Steps: Submit valid credentials in client/app/components/LoginForm
- Expected: Redirect to dashboard; auth state stored; cookie/token behavior correct
- Test Type: Frontend Integration/E2E
- Status:
- Notes/Issue:

G2. Protected route guard
- Steps: Navigate to dashboard when unauthenticated
- Expected: Redirect to login or show restricted access
- Test Type: Frontend Integration/E2E
- Status:
- Notes/Issue:

G3. Donation: create/list/update/delete via UI
- Steps: Perform CRUD via UI
- Expected: Reflects API results; validation errors surfaced clearly
- Test Type: Frontend Integration/E2E
- Status:
- Notes/Issue:

G4. Blogs: list/create/update/delete (if permitted)
- Steps: Perform respective actions in UI
- Expected: Displays updates; handles errors gracefully
- Test Type: Frontend Integration/E2E
- Status:
- Notes/Issue:

G5. Messaging UI
- Steps: Send message; view conversation
- Expected: Real-time updates or polling; correct rendering
- Test Type: Frontend Integration/E2E
- Status:
- Notes/Issue:

G6. SSR/CSR/hydration sanity
- Steps: Load pages with/without auth
- Expected: No hydration warnings; correct SSR/CSR behavior
- Test Type: Frontend Integration
- Status:
- Notes/Issue:

Section H — Cross-Cutting & Security
H1. CORS policy
- Steps: Cross-origin requests from Next dev server to backend
- Expected: Allowed origins only; credentials policy correct
- Test Type: Integration
- Status:
- Notes/Issue:

H2. Rate limiting for auth endpoints
- Steps: Repeated invalid login attempts
- Expected: 429 after threshold; reset behavior documented
- Test Type: Integration
- Status:
- Notes/Issue:

H3. Secret redaction in logs
- Steps: Trigger errors; inspect logs
- Expected: No secrets/PII leaked
- Test Type: Integration
- Status:
- Notes/Issue:

Section I — CI & Tooling
I1. CI pipeline runs tests on PR
- Expected: Lint/tests/coverage jobs run; status reported
- Test Type: CI
- Status:
- Notes/Issue:

I2. Coverage thresholds enforced (initial baseline)
- Expected: Coverage reported; baseline thresholds recorded (even if low)
- Test Type: CI
- Status:
- Notes/Issue:

Known Blockers (to be captured during Phase 0)
- Blocker:
- Impact:
- Owner:
- Issue Link:

---

## Phase 1 — Foundations and Safety Nets

Deliverables
- Adopt code style and quality gates: ESLint + Prettier + EditorConfig across repo.
- Introduce commit conventions (Conventional Commits) and PR templates.
- Add basic CI (install, lint, type-check if applicable, run tests).
- Establish environment management: .env.example accuracy, validation at startup.

Acceptance Criteria
- CI runs on PR and main; failing lint/tests block merges.
- All packages install without peer/engine conflicts.
- App boots locally with documented envs.
- Testing Gate: Unit and integration tests for Phase 1 changes exist and pass locally and in CI.

---

## Phase 2 — Security Hardening

Backend
- JWT cookie settings enforced: HttpOnly, Secure (prod), SameSite (lax/strict), short-lived.
- Optional: shift to Authorization: Bearer for APIs to reduce CSRF surface; if staying with cookies, add CSRF protection (CSRF tokens for state-changing endpoints).
- Add helmet, compression, express-rate-limit, and robust CORS with explicit origins.
- Validate all inputs with express-validator schemas; centralize validation error handling.
- Parameterize ALL SQL; prefer Knex query builder.
- Secrets handling: never log secrets; structured logging with redaction.
- Token invalidation via Redis for logout/password reset/verification changes.

Frontend
- Align axios with credentials policy and CORS; finish cookie/token handling in API utilities.
- Add route protection using Next middleware for authenticated pages.

Acceptance Criteria
- Auth flows pass with cookies configured securely and/or Bearer tokens.
- CSRF protection verified on mutating endpoints.
- Rate-limited login/verification/reset endpoints with friendly error responses.
- Testing Gate: Unit and integration tests for Phase 2 security changes exist and pass locally and in CI.

---

## Phase 3 — Database Integrity and Performance

Schema & Migrations
- Normalize migration names; ensure down() completeness and reliability.
- Constraints: UNIQUE (email), CHECK constraints (blood types, positive quantities).
- Relationships: ON DELETE/UPDATE policies consistent (cascade where appropriate).
- Indexes: FKs (userId, hospitalId), query filters (status, bloodType), conversations (senderId, receiverId), geospatial where used.
- Consider PostGIS for proximity queries; otherwise, add appropriate lat/long storage and indexes.

Operational
- Wrap multi-step writes in transactions (e.g., create conversation + first message).
- Seed data reviewed and isolated from production; separate dev-only seeds.

Acceptance Criteria
- Migration up/down works cleanly on a fresh DB.
- Key queries show improved performance; no full scans on hot paths.
- Testing Gate: Unit and integration tests for DB constraints/indexes/transactions exist and pass locally and in CI.

---

## Phase 4 — Backend Architecture and Consistency

- Standardize folder structure: controllers, services, repositories (DB), routes, middlewares, utils.
- Introduce a service layer where business logic is currently mixed in controllers.
- Centralize error handling (error classes + error middleware), consistent API error format.
- Logging: adopt pino or winston with request correlation IDs; redact PII/secrets.
- Email utilities hardened: timeouts, retries/backoff, safe templates, no secret leakage.
- Geo utilities: timeouts, rate limiting/backoff, optional caching in Redis.
- WebSockets: remove root-level adhoc server; integrate authenticated WebSocket in backend app; authorize connections (JWT) and scope to conversation rooms.

Acceptance Criteria
- Controllers become thin; business logic covered by services with tests.
- Global error shape and logging format consistent across endpoints.
- WebSocket connects only with valid auth and dispatches to proper handlers.
- Testing Gate: Unit and integration tests for refactored services/controllers/middlewares exist and pass locally and in CI.

---

## Phase 5 — Frontend Refactor (Next.js App Router)

Routing & Structure
- Migrate any app/pages patterns to proper App Router structure (e.g., app/blog/page.tsx).
- Remove legacy CRA frontend or archive it if no longer used; keep a single canonical client.
- Shared UI primitives and layout patterns; accessible forms and components.

State & Data
- Keep Redux only where truly necessary; consider server components or SWR/React Query for fetching.
- API client normalization: baseURL per env, interceptors for auth errors, typed responses.

UX & Accessibility
- Consistent error/loading states, toasts/alerts, keyboard navigation, aria labels.

Acceptance Criteria
- All current user flows work in the Next app (login, profile, donation requests, blogs, messaging).
- No reliance on app/pages; route protection via middleware verified.
- Testing Gate: Unit and integration tests (and smoke E2E where needed) for frontend flows exist and pass locally and in CI.

---

## Phase 6 — Testing Strategy

- Unit tests for services, utils, validators.
- Integration tests for controllers/routes (auth, donation, blog, messaging).
- E2E smoke tests for critical flows (login, create donation, respond to request, message).
- Add contract tests for API clients where valuable.

Acceptance Criteria
- Coverage thresholds agreed and met (e.g., 70%+ critical paths).
- CI runs test matrix and reports coverage.
- Testing Gate: Test suites and coverage thresholds enforced in CI with no regressions.

---

## Phase 7 — Observability & Performance

- Structured logs with levels and request IDs.
- Basic metrics (request duration, error rates); consider OpenTelemetry for tracing later.
- Performance: DB query optimization, caching of expensive ops (geocoding), frontend bundle analysis and code-splitting where needed.

Acceptance Criteria
- Key dashboards/logs available; p95 latency improves on hot endpoints.
- Testing Gate: Performance tests/metrics baselines established with measurable improvements.

---

## Phase 8 — Documentation & Developer Experience

- Update README(s) for backend and frontend: environment setup, scripts, endpoints, workflows.
- Add ADRs or short docs for architectural decisions (auth strategy, sockets, DB design).
- Scripts for local dev (seed, reset db), and Makefile or npm scripts for common tasks.

Acceptance Criteria
- New contributors can set up and run the app with minimal friction.
- Testing Gate: Docs lint/build checks pass; example scripts verified by CI where applicable.

---

## Decommissioning Legacy Code

- Remove root-level WebSocket server and EJS views if not required.
- Remove or archive legacy React app in /frontend if Next.js app is canonical.
- Update docs and scripts to reference only the supported app.

---

## Rollout & Backward Compatibility

- Feature flags/toggles for risky changes.
- Staged rollout: deploy backend changes first (non-breaking), then frontend.
- Data migration plan with backups and rollback steps for schema changes.

---

## Risks & Mitigations
- CSRF/CORS misconfigurations: use staging environment and integration tests.
- Data migration errors: practice on a copy; verified up/down; backups.
- Auth/session regressions: maintain dual support (old/new) briefly if needed.

---

## Proposed Timeline (Indicative)
- Week 0: Phase 0 (Baseline audit and current-state tests)
- Weeks 1–2: Phase 1–2 (Foundations, Security) with step-by-step testing gates
- Weeks 3–4: Phase 3–4 (DB, Backend Architecture) with testing gates
- Weeks 5–6: Phase 5 (Frontend Refactor) with testing gates
- Weeks 7–8: Phase 6–7 (Testing, Observability), decommission legacy

---

## Validation Checklist (for your approval)
- [ ] Cookie/Token strategy and CSRF approach
- [ ] DB constraints/indexes scope (including PostGIS decision)
- [ ] WebSocket consolidation plan and auth model
- [ ] Frontend App Router migration and legacy removal
- [ ] Testing levels and coverage targets
- [ ] CI/CD scope and environments

If this plan looks good, we’ll start with Phase 1–2 and submit incremental PRs for your review. You can check off the validation items you approve, and we’ll adapt as needed.
