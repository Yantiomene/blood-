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

---

## Phase 6 — Testing Strategy

- Unit tests for services, utils, validators.
- Integration tests for controllers/routes (auth, donation, blog, messaging).
- E2E smoke tests for critical flows (login, create donation, respond to request, message).
- Add contract tests for API clients where valuable.

Acceptance Criteria
- Coverage thresholds agreed and met (e.g., 70%+ critical paths).
- CI runs test matrix and reports coverage.

---

## Phase 7 — Observability & Performance

- Structured logs with levels and request IDs.
- Basic metrics (request duration, error rates); consider OpenTelemetry for tracing later.
- Performance: DB query optimization, caching of expensive ops (geocoding), frontend bundle analysis and code-splitting where needed.

Acceptance Criteria
- Key dashboards/logs available; p95 latency improves on hot endpoints.

---

## Phase 8 — Documentation & Developer Experience

- Update README(s) for backend and frontend: environment setup, scripts, endpoints, workflows.
- Add ADRs or short docs for architectural decisions (auth strategy, sockets, DB design).
- Scripts for local dev (seed, reset db), and Makefile or npm scripts for common tasks.

Acceptance Criteria
- New contributors can set up and run the app with minimal friction.

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
- Weeks 1–2: Phase 1–2 (Foundations, Security)
- Weeks 3–4: Phase 3–4 (DB, Backend Architecture)
- Weeks 5–6: Phase 5 (Frontend Refactor)
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
