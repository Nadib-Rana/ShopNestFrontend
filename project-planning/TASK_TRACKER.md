# ShopNest — Task Tracker

> **Single source of truth for task-level status.**
> Last updated: 2026-10-26

## Status Legend
- `TODO` — Not started
- `IN_PROGRESS` — Currently being worked on
- `DONE` — Complete and verified
- `BLOCKED` — Cannot proceed; reason recorded in Notes
- `NEEDS_VERIFICATION` — Implementation exists but not verified

## Priority Legend
- `CRITICAL` — Blocking other work or breaks core functionality
- `HIGH` — Important for project quality or developer clarity
- `MEDIUM` — Should be done in current phase
- `LOW` — Nice to have

---

## Phase 1 — Repository Audit

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-AUD-001 | Inspect repository structure | CRITICAL | DONE | All source files identified | Completed 2026-10-26 |
| SN-AUD-002 | Identify framework and dependencies | HIGH | DONE | package.json inspected | React 19, Vite 8, Tailwind v4 |
| SN-AUD-003 | Record baseline build | CRITICAL | DONE | Build output captured | 355KB JS / 104KB CSS |
| SN-AUD-004 | Run TypeScript check | HIGH | DONE | Error list captured | 14 pre-existing errors |
| SN-AUD-005 | Identify existing routes | HIGH | DONE | Routes documented | See docs/ROUTES.md |
| SN-AUD-006 | Identify localStorage usage | HIGH | DONE | Keys and schemas identified | See docs/STATE_AND_PERSISTENCE.md |
| SN-AUD-007 | Identify duplicate code | MEDIUM | DONE | Duplicates listed | money(), Badge, Status, image arrays |

---

## Phase 2 — Frontend Modular Refactoring

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-FE-001 | Create modular src/ directory structure | CRITICAL | DONE | Directories created | Completed 2026-10-26 |
| SN-FE-002 | Extract shared Icon component | HIGH | DONE | Icon.tsx created, imported in App.tsx | |
| SN-FE-003 | Extract shared Status/Badge components | HIGH | DONE | ui/Status.tsx, ui/Badge.tsx created | |
| SN-FE-004 | Extract useRoute hook | HIGH | DONE | hooks/useRoute.ts created | |
| SN-FE-005 | Extract types to types/ directory | HIGH | DONE | types/index.ts created | |
| SN-FE-006 | Extract constants to constants/ directory | MEDIUM | DONE | constants/index.ts created | |
| SN-FE-007 | Extract seller layout to layouts/ | HIGH | DONE | layouts/SellerLayout.tsx created | |
| SN-FE-008 | Extract public home page | HIGH | DONE | features/home/ShopNestHome.tsx | |
| SN-FE-009 | Extract auth pages | HIGH | DONE | features/auth/AuthPage.tsx | |
| SN-FE-010 | Extract onboarding | HIGH | DONE | features/onboarding/Onboarding.tsx | |
| SN-FE-011 | Extract seller overview/dashboard | HIGH | DONE | features/dashboard/Overview.tsx | |
| SN-FE-012 | Extract storefront management page | HIGH | DONE | features/seller/StorefrontPage.tsx | |
| SN-FE-013 | Extract subscription page | HIGH | DONE | features/subscriptions/ | |
| SN-FE-014 | Reorganize App.tsx as lean router | HIGH | DONE | App.tsx reduced to routing only | |
| SN-FE-015 | Fix tsconfig lib target (replaceAll errors) | MEDIUM | DONE | tsc --noEmit shows 0 errors | |
| SN-FE-016 | Fix item.count type error in nav | MEDIUM | DONE | No TS error on nav rendering | |
| SN-FE-017 | Verify build still passes after refactoring | CRITICAL | DONE | npm run build exits 0 | Verified 2026-10-26 (402ms) |

---

## Phase 3 — Code Cleanup & Optimization

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-CLEAN-001 | Consolidate money() formatter | HIGH | DONE | Single shared utility | Extracted to src/utils/format.ts |
| SN-CLEAN-002 | Consolidate Status/Badge components | HIGH | DONE | Single shared component used by all modules | Extracted to src/components/ui/ |
| SN-CLEAN-003 | Remove duplicate product images array | MEDIUM | DONE | One array in constants/index.ts | Deduplicated across modules |
| SN-CLEAN-004 | Implement route-level code splitting | HIGH | DONE | Lazy imports in router; bundle split into chunks | 10 dynamic chunks generated via React.lazy |
| SN-CLEAN-005 | Reformat compressed single-line code | MEDIUM | DONE | Files readable with normal indentation | Core modules formatted |

---

## Phase 4 — Documentation

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-DOC-001 | Create project-planning/PROJECT_OVERVIEW.md | HIGH | DONE | File exists with accurate content | 2026-10-26 |
| SN-DOC-002 | Create project-planning/MASTER_PLAN.md | HIGH | DONE | File exists | 2026-10-26 |
| SN-DOC-003 | Create project-planning/TASK_TRACKER.md | HIGH | DONE | This file | Updated 2026-10-26 |
| SN-DOC-004 | Create project-planning/CURRENT_STATUS.md | HIGH | DONE | File exists | Updated 2026-10-26 |
| SN-DOC-005 | Create project-planning/DECISIONS.md | HIGH | DONE | File exists | Updated 2026-10-26 |
| SN-DOC-006 | Create project-planning/KNOWN_ISSUES.md | HIGH | DONE | File exists | Updated 2026-10-26 |
| SN-DOC-007 | Create project-planning/NEXT_STEPS.md | HIGH | DONE | File exists | Updated 2026-10-26 |
| SN-DOC-008 | Update README.md | HIGH | DONE | README reflects actual setup | 2026-10-26 |
| SN-DOC-009 | Update AGENTS.md | HIGH | DONE | AGENTS.md has ShopNest guidance | 2026-10-26 |
| SN-DOC-010 | Create docs/ARCHITECTURE.md | MEDIUM | DONE | File exists | 2026-10-26 |
| SN-DOC-011 | Create docs/ROUTES.md | HIGH | DONE | All routes documented | Updated 2026-10-26 |
| SN-DOC-012 | Create docs/STATE_AND_PERSISTENCE.md | HIGH | DONE | localStorage keys and schemas documented | 2026-10-26 |
| SN-DOC-013 | Create docs/DATA_MODELS.md | MEDIUM | DONE | TypeScript types documented | 2026-10-26 |
| SN-DOC-014 | Create docs/DESIGN_SYSTEM.md | MEDIUM | DONE | CSS tokens, themes documented | 2026-10-26 |
| SN-DOC-015 | Create docs/API_CONTRACTS.md | MEDIUM | DONE | Proposed API contracts labelled as planned | 2026-10-26 |
| SN-DOC-016 | Create docs/BUSINESS_FLOWS.md | MEDIUM | DONE | Seller, customer, admin flows documented | Updated 2026-10-26 |
| SN-DOC-017 | Create docs/MULTITENANCY_AND_SECURITY.md | HIGH | DONE | Frontend limitations documented | 2026-10-26 |
| SN-DOC-018 | Create docs/KNOWN_LIMITATIONS.md | HIGH | DONE | All known issues listed | 2026-10-26 |
| SN-DOC-019 | Create docs/TESTING.md | MEDIUM | DONE | Test commands and regression checklist | Updated 2026-10-26 |
| SN-DOC-020 | Create docs/CHANGELOG.md | MEDIUM | DONE | Structural changes from this work logged | Updated 2026-10-26 |

---

## Phase 5 — Themes, Customization & Workspaces

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-FE-020 | Implement Shipping & Delivery page | MEDIUM | DONE | Page renders with courier rules & rates | Implemented in src/features/seller/ShippingPage.tsx |
| SN-FE-021 | Implement Analytics page | MEDIUM | DONE | Page renders with sales chart & AOV | Implemented in src/features/seller/AnalyticsPage.tsx |
| SN-THM-001 | 8 Distinct Storefront Themes | CRITICAL | DONE | All 8 themes have unique hero/products/cards | Trendora, SoleCraft, NOVA, Bloom, Grocery, Decor, Forma, OmniStore |
| SN-THM-002 | Theme Customizer Controls & Preview | HIGH | DONE | Customizer controls reflect in preview | Header layouts, footer layouts, drop tags, warranty notes, promo titles |
| SN-THM-003 | Public Themes Gallery & Auth Check | HIGH | DONE | /themes page with smart auth redirect | Unregistered goes to /signup, registered goes to /seller/customizer |
| SN-THM-004 | Isolated Active Theme Customizer | HIGH | DONE | Customizer edits and preview only active theme | Prevents cross-theme overwrite |
| SN-THM-005 | Preview Return Route Memory | MEDIUM | DONE | Close preview returns to caller route | Uses shopnest_preview_return |
| SN-UI-001 | Customizer Preview Scrolling Fix | HIGH | DONE | Right preview pane scrolls top to bottom | Resolved flex-stretch and double-main margin issues |
| SN-UI-002 | Mobile Responsive Navigation | HIGH | DONE | Hamburger toggle + slideout drawer | Works on all 8 themes & PublicNav |
| SN-FE-022 | Implement Store Settings page | LOW | TODO | Page renders store preferences | Currently placeholder |

---

## Phase 6 — Automated Testing & QA

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-TST-001 | Vitest Test Runner Setup | CRITICAL | DONE | npm test executes via Vitest & jsdom | Configured in vite.config.ts & src/test/setup.ts |
| SN-TST-002 | Automated Unit & Integration Tests | HIGH | DONE | 30/30 tests pass | Tests for format, useRoute, ui components, onboarding, theme customization |
| SN-QA-001 | Build Verification | CRITICAL | DONE | npm run build exits 0 with 0 errors | Bundle clean (490ms) |
| SN-QA-002 | Type Check Verification | CRITICAL | DONE | npx tsc --noEmit reports 0 errors | ES2022 lib enabled |

---

## Backend Phases (Future Roadmap)

| Task ID | Task | Priority | Status | Notes |
|---------|------|----------|--------|-------|
| SN-BE-001 | Define backend tech stack | HIGH | TODO | Node.js / Express or NestJS with Prisma |
| SN-BE-002 | Design multi-tenant database schema | CRITICAL | TODO | PostgreSQL with tenant_id / schema isolation |
| SN-BE-003 | Implement authentication API | CRITICAL | TODO | JWT, refresh tokens, role-based guards |
| SN-BE-004 | Implement product/order/customer APIs | HIGH | TODO | REST endpoints conforming to docs/API_CONTRACTS.md |
| SN-BE-005 | Implement subscription payment workflow | HIGH | TODO | bKash, Nagad, manual slip upload verification |
