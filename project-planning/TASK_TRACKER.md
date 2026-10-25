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

## Phase 3 — Code Cleanup

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-CLEAN-001 | Consolidate money() formatter | HIGH | DONE | Single shared utility | Extracted to src/utils/format.ts |
| SN-CLEAN-002 | Consolidate Status/Badge components | HIGH | DONE | Single shared component used by all modules | Extracted to src/components/ui/ |
| SN-CLEAN-003 | Remove duplicate product images array | MEDIUM | DONE | One array in constants/index.ts | Deduplicated across modules |
| SN-CLEAN-004 | Implement route-level code splitting | HIGH | DONE | Lazy imports in router; bundle split into chunks | 8 dynamic chunks generated via React.lazy |
| SN-CLEAN-005 | Reformat compressed single-line code | MEDIUM | DONE | Files readable with normal indentation | Core modules formatted |

---

## Phase 4 — Documentation

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-DOC-001 | Create project-planning/PROJECT_OVERVIEW.md | HIGH | DONE | File exists with accurate content | 2026-10-26 |
| SN-DOC-002 | Create project-planning/MASTER_PLAN.md | HIGH | DONE | File exists | 2026-10-26 |
| SN-DOC-003 | Create project-planning/TASK_TRACKER.md | HIGH | DONE | This file | 2026-10-26 |
| SN-DOC-004 | Create project-planning/CURRENT_STATUS.md | HIGH | DONE | File exists | 2026-10-26 |
| SN-DOC-005 | Create project-planning/DECISIONS.md | HIGH | DONE | File exists | 2026-10-26 |
| SN-DOC-006 | Create project-planning/KNOWN_ISSUES.md | HIGH | DONE | File exists | 2026-10-26 |
| SN-DOC-007 | Create project-planning/NEXT_STEPS.md | HIGH | DONE | File exists | 2026-10-26 |
| SN-DOC-008 | Update README.md | HIGH | DONE | README reflects actual setup | 2026-10-26 |
| SN-DOC-009 | Update AGENTS.md | HIGH | DONE | AGENTS.md has ShopNest guidance | 2026-10-26 |
| SN-DOC-010 | Create docs/ARCHITECTURE.md | MEDIUM | DONE | File exists | 2026-10-26 |
| SN-DOC-011 | Create docs/ROUTES.md | HIGH | DONE | All routes documented | 2026-10-26 |
| SN-DOC-012 | Create docs/STATE_AND_PERSISTENCE.md | HIGH | DONE | localStorage keys and schemas documented | 2026-10-26 |
| SN-DOC-013 | Create docs/DATA_MODELS.md | MEDIUM | DONE | TypeScript types documented | 2026-10-26 |
| SN-DOC-014 | Create docs/DESIGN_SYSTEM.md | MEDIUM | DONE | CSS tokens, themes documented | 2026-10-26 |
| SN-DOC-015 | Create docs/API_CONTRACTS.md | MEDIUM | DONE | Proposed API contracts labelled as planned | 2026-10-26 |
| SN-DOC-016 | Create docs/BUSINESS_FLOWS.md | MEDIUM | DONE | Seller, customer, admin flows documented | 2026-10-26 |
| SN-DOC-017 | Create docs/MULTITENANCY_AND_SECURITY.md | HIGH | DONE | Frontend limitations documented | 2026-10-26 |
| SN-DOC-018 | Create docs/KNOWN_LIMITATIONS.md | HIGH | DONE | All known issues listed | 2026-10-26 |
| SN-DOC-019 | Create docs/TESTING.md | MEDIUM | DONE | Test commands and regression checklist | 2026-10-26 |
| SN-DOC-020 | Create docs/CHANGELOG.md | MEDIUM | DONE | Structural changes from this work logged | 2026-10-26 |

---

## Phase 5 — Frontend Completion

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-FE-020 | Implement Shipping & Delivery page | MEDIUM | TODO | Page renders with content | Currently "Coming Soon" |
| SN-FE-021 | Implement Analytics page | MEDIUM | TODO | Page renders with mock data | Currently "Coming Soon" |
| SN-FE-022 | Implement Store Settings page | MEDIUM | TODO | Page renders with settings | Currently "Coming Soon" |
| SN-FE-023 | Improve form validation | LOW | TODO | Better error messages | |

---

## Phase 6 — QA

| Task ID | Task | Priority | Status | Verification Criteria | Notes |
|---------|------|----------|--------|-----------------------|-------|
| SN-QA-001 | Manual regression: auth flow | HIGH | TODO | Login, signup, forgot, reset, verify all navigate correctly | |
| SN-QA-002 | Manual regression: seller dashboard | HIGH | TODO | All 13 nav items accessible | |
| SN-QA-003 | Manual regression: product CRUD | HIGH | TODO | Add, edit, delete, bulk, search all work | |
| SN-QA-004 | Manual regression: checkout | CRITICAL | TODO | Full cart → checkout → confirmation flow works | |
| SN-QA-005 | Manual regression: all 8 storefronts | HIGH | TODO | Each /store/<slug> loads and is themed correctly | |
| SN-QA-006 | Manual regression: theme customizer | HIGH | TODO | Live preview updates on every control | |
| SN-QA-007 | Manual regression: admin payment review | HIGH | TODO | Approve/reject updates status correctly | |
| SN-QA-008 | Build passes after all refactoring | CRITICAL | TODO | npm run build exits 0 with acceptable bundle | |

---

## Backend Phases (Future)

| Task ID | Task | Priority | Status | Notes |
|---------|------|----------|--------|-------|
| SN-BE-001 | Define backend tech stack | HIGH | TODO | Decision pending |
| SN-BE-002 | Design multi-tenant database schema | CRITICAL | TODO | Requires Phase 7 |
| SN-BE-003 | Implement authentication API | CRITICAL | TODO | Requires Phase 8 |
| SN-BE-004 | Implement product/order/customer APIs | HIGH | TODO | Requires Phase 10-11 |
| SN-BE-005 | Implement subscription payment workflow | HIGH | TODO | Requires Phase 12 |
