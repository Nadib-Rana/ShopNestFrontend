# ShopNest — Architectural and Business Decisions

> Significant decisions that affect architecture, business rules, dependencies, or workflows.
> Last updated: 2026-10-26

---

## DEC-001 — Preserve Flat Source Structure (Defer Mass Reorganization)
- **Date:** 2026-10-26
- **Decision:** Phase 2 modular refactoring created the new directory structure alongside the existing files, moving code incrementally.
- **Reason:** Existing code was a working frontend prototype. Incremental migration avoided regressions.
- **Status:** Complete

---

## DEC-002 — Keep Custom Client-Side Router
- **Date:** 2026-10-26
- **Decision:** Retain the minimal `window.history.pushState` + `popstate` router in `src/hooks/useRoute.ts`.
- **Reason:** Avoids adding a heavy third-party dependency while preserving seamless deep linking and store preview flows.
- **Status:** Active

---

## DEC-003 — Use localStorage as Persistence Layer (Frontend Only Phase)
- **Date:** 2026-10-26
- **Decision:** Retain localStorage for all client data stores in `src/repositories/` until Phase 7 backend implementation.
- **Status:** Active until backend database integration

---

## DEC-004 — Preserve All 8 Storefront Themes
- **Date:** 2026-10-26
- **Decision:** All 8 storefront theme identities (Fashion, Shoes, Electronics, Beauty, Grocery, Decor, Furniture, Retail) are preserved as distinct theme variants with unique layouts, hero sections, promo stories, and theme-specific controls.
- **Status:** Complete & Active

---

## DEC-005 — Fix Pre-existing TypeScript Errors
- **Date:** 2026-10-26
- **Decision:** Updated `tsconfig.json` compiler `lib` to `ES2022` and strongly typed `NavItem` with optional `count?: string`.
- **Status:** Complete (0 errors reported)

---

## DEC-006 — Route-Level Code Splitting via React.lazy
- **Date:** 2026-10-26
- **Decision:** Wrap heavy feature modules (`CustomerStorefront`, `SellerManagement`, `ThemeStudio`, `BillingAdmin`, `PublicThemesPage`, `ShippingPage`, `AnalyticsPage`) with `React.lazy()` and `<Suspense>`.
- **Result:** Decreased initial JS payload from 355 KB to 272 KB raw.
- **Status:** Complete & Active

---

## DEC-007 — Automated Testing with Vitest
- **Date:** 2026-10-26
- **Decision:** Configure Vitest with `jsdom` and `@testing-library/react` for fast, lightweight in-memory testing.
- **Reason:** Provides instant feedback on critical flows (onboarding, theme customization, router navigation, formatting utilities) without adding external runtime dependencies.
- **Status:** Complete (30 tests passing via `npm test`)

---

## DEC-008 — Public Themes Gallery & Smart Auth Registration Gating
- **Date:** 2026-10-26
- **Decision:** Add dedicated `/themes` public route accessible from marketing navigation. Clicking "Use theme" checks `isUserRegistered()`:
  - If unregistered, redirects to `/signup` so visitors sign up first.
  - If registered seller, immediately applies the theme and takes them to `/seller/customizer`.
- **Status:** Complete & Active

---

## DEC-009 — Isolated Active Theme Customizer
- **Date:** 2026-10-26
- **Decision:** Lock `/seller/customizer` to only edit and preview the seller's currently active store theme.
- **Reason:** Prevents sellers from accidentally editing options belonging to inactive themes, ensuring clean isolation and zero data collisions.
- **Status:** Complete & Active

---

## DEC-010 — Preview Navigation Context Memory
- **Date:** 2026-10-26
- **Decision:** Store the caller's origin path in `localStorage` under `shopnest_preview_return` before navigating to `/store/:slug/preview`.
- **Reason:** Guarantees that clicking "Close Preview" returns sellers to `/seller/themes` and public visitors to `/themes`.
- **Status:** Complete & Active

---

## DEC-011 — Mobile-First Storefront Drawer Navigation
- **Date:** 2026-10-26
- **Decision:** Implement a sleek hamburger toggle (`☰`) and full slide-out drawer menu (`store-mobile-drawer`) on mobile viewports for all 8 themes, rather than overflowing horizontal button rows.
- **Reason:** Provides clean, accessible navigation, real-time product search, and cart access without display overflow on small mobile screens.
- **Status:** Complete & Active
