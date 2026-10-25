# ShopNest — Changelog

> Structural and meaningful changes to the codebase. Not every trivial edit.
> Last updated: 2026-10-26

---

## [1.1.0] — 2026-10-26 — Phase 2 & 3 Modular Architecture & Optimization

### Added (Code Structure)
- `src/types/index.ts` — Centralized TypeScript interfaces (NavItem, CommerceOrder, CommerceProduct, ThemeDefinition, StoreThemeConfig, UI props).
- `src/utils/format.ts` — Consolidated `money()` currency formatter (`৳`), `formatNumber()`, and `slugify()`.
- `src/constants/index.ts` — Shared `navItems`, `sellerRoutes`, mock orders, mock products, and deduplicated `productImages`.
- `src/hooks/useRoute.ts` — Extracted client-side URL routing hook.
- `src/components/ui/Icon.tsx` — Isolated SVG icon library.
- `src/components/ui/Status.tsx` — Status dot badge component.
- `src/components/ui/Badge.tsx` — Management status badge component.
- `src/components/shared/OrderTable.tsx` — Reusable order table component.
- `src/components/shared/NotFound.tsx` — Reusable 404 page component.
- `src/components/shared/ComingSoon.tsx` — Modular placeholder component.
- `src/app/layouts/SellerLayout.tsx` — Extracted seller shell layout with sidebar navigation, header, and search.
- `src/features/home/ShopNestHome.tsx` — Modular landing page.
- `src/features/auth/AuthPage.tsx` — Modular authentication screen.
- `src/features/onboarding/Onboarding.tsx` — Modular 6-step store setup wizard.
- `src/features/dashboard/Overview.tsx` & `Metric.tsx` — Modular seller overview dashboard.
- `src/features/seller/StorefrontPage.tsx` — Modular seller storefront management screen.
- `src/features/seller/SellerManagement.tsx` — Modular catalog and customer management.
- `src/features/themes/ThemeStudio.tsx` — Modular theme studio and visual customizer.
- `src/features/subscriptions/BillingAdmin.tsx` — Modular subscription and manual payment flow.
- `src/features/admin/AdminApp.tsx` — Modular super admin panel.
- `src/features/storefront/CustomerStorefront.tsx` — Modular customer storefront with cart, checkout, and order tracking.
- `src/repositories/` — Client storage adapters for commerce and theme state.

### Changed & Optimized
- `src/App.tsx` — Converted from a 359-line monolithic file to a lean router coordinating lazy-loaded sub-applications.
- **Route-level Code Splitting**: Implemented `React.lazy()` and `<Suspense>` boundaries.
  - Reduced initial JavaScript bundle from 355 KB raw / 102 KB gzip down to 259.50 KB raw / 79.45 KB gzip (~96 KB initial payload reduction).
  - Generated 8 dynamic, on-demand code chunks.
- **TypeScript Error Elimination**:
  - Upgraded `compilerOptions.lib` to `["ES2022", "DOM", "DOM.Iterable"]` in `tsconfig.json`.
  - Added optional property `count?: string` to `NavItem`.
  - Result: Reduced TypeScript compile errors from 14 to **0 errors**.
- **Code Duplication Removal**:
  - Replaced 4 duplicate `money()` formatters across `App.tsx`, `SellerManagement.tsx`, `BillingAdmin.tsx`, and `CustomerStorefront.tsx` with single import from `src/utils/format.ts`.
  - Consolidated duplicate `Badge` and `Status` components into `src/components/ui/`.

---

## [1.0.0] — 2026-10-26 — Phase 1 & 4 Project Audit & Comprehensive Documentation

### Added (Documentation)
- `project-planning/PROJECT_OVERVIEW.md` — Product overview, goals, tech stack, limitations
- `project-planning/MASTER_PLAN.md` — 16-phase development roadmap
- `project-planning/TASK_TRACKER.md` — Canonical task-level status register
- `project-planning/CURRENT_STATUS.md` — Concise current-state snapshot
- `project-planning/DECISIONS.md` — Architectural decision record (7 decisions)
- `project-planning/KNOWN_ISSUES.md` — Confirmed bugs and suspected issues
- `project-planning/NEXT_STEPS.md` — Actionable tasks in dependency order
- `docs/ARCHITECTURE.md` — System architecture diagrams and data flows
- `docs/FRONTEND_STRUCTURE.md` — Directory structure and modular file conventions
- `docs/ROUTES.md` — Route inventory across all roles
- `docs/DESIGN_SYSTEM.md` — Color tokens, typography, component reference, theme palettes
- `docs/DATA_MODELS.md` — TypeScript interfaces for all data entities
- `docs/STATE_AND_PERSISTENCE.md` — LocalStorage keys, schemas, and limitations
- `docs/API_CONTRACTS.md` — Proposed future REST API contracts
- `docs/BUSINESS_FLOWS.md` — Seller, customer, and admin workflows
- `docs/MULTITENANCY_AND_SECURITY.md` — Frontend security constraints and future backend requirements
- `docs/KNOWN_LIMITATIONS.md` — Structural limitations
- `docs/TESTING.md` — Manual testing and regression checklists
- `README.md` — Comprehensive project guide and route catalog
- `AGENTS.md` — AI developer guide and architectural standards
