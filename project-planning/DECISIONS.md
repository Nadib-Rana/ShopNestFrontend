# ShopNest — Architectural and Business Decisions

> Significant decisions that affect architecture, business rules, dependencies, or workflows.
> Trivial code edits are not recorded here.

---

## DEC-001 — Preserve Flat Source Structure (Defer Mass Reorganization)

- **Date:** 2026-10-26
- **Decision:** Phase 2 modular refactoring will create the new directory structure alongside the existing files, moving code incrementally. The entire app will not be rewritten or rebuilt from scratch.
- **Reason:** The existing code is a working frontend prototype. Rebuilding it risks introducing regressions and discarding working behavior. An incremental approach allows verification at each step.
- **Alternatives considered:** Full rewrite into feature modules from blank files — rejected because it would require re-implementing all existing UI.
- **Consequences:** Refactoring takes longer but is safer. Both old and new file paths may coexist temporarily during migration.
- **Status:** Active

---

## DEC-002 — Keep Custom Client-Side Router

- **Date:** 2026-10-26
- **Decision:** Retain the existing `window.history.pushState` + `popstate` router implemented in App.tsx. Do not replace it with React Router or another routing library.
- **Reason:** The router is minimal but functional. Adding React Router would introduce a new dependency, require refactoring all navigation calls, and risk breaking storefront theme preview routes and admin routes.
- **Alternatives considered:** React Router v6, TanStack Router — rejected for this phase.
- **Consequences:** The routing system remains custom. Route parameters are parsed manually with `path.split('/')`. If routing complexity increases significantly in future, migration to React Router should be reconsidered.
- **Status:** Active

---

## DEC-003 — Use localStorage as Persistence Layer (Frontend Only Phase)

- **Date:** 2026-10-26
- **Decision:** Retain localStorage for all persistence (products, cart, orders, theme config, payments) until a real backend is implemented.
- **Reason:** A backend does not exist. Adding fake network calls or a mock server would not add real value and would increase complexity. localStorage is appropriate for a prototype.
- **Alternatives considered:** IndexedDB, in-memory only, fake API server — rejected for now.
- **Consequences:** Data is not persisted across devices or browser clears. No production security. This is clearly documented as a limitation and not hidden from users (the UI already contains "prototype only" notices).
- **Status:** Active until Phase 14 (backend integration)

---

## DEC-004 — Preserve All 8 Storefront Themes

- **Date:** 2026-10-26
- **Decision:** All 8 storefront theme identities (fashion, shoes, electronics, beauty, grocery, home decor, furniture, general retail) will be preserved as distinct theme variants. They will not be collapsed into a single generic layout.
- **Reason:** The distinct headers, hero sections, navigation structures, and product displays for each theme are a core product differentiator. Collapsing them would damage the demo value of the prototype.
- **Alternatives considered:** Single shared layout with theme tokens — rejected because header structures differ significantly per theme.
- **Consequences:** CustomerStorefront.tsx must handle 8 theme branches. The theme-specific header components may be extracted into separate files.
- **Status:** Active

---

## DEC-005 — Fix Pre-existing TypeScript Errors

- **Date:** 2026-10-26
- **Decision:** Fix the 14 pre-existing TypeScript errors as part of Phase 2.
  - `item.count` — add optional chaining (`item.count` → `'count' in item && item.count`)
  - `replaceAll` — update tsconfig.json `lib` to include `"ES2021"` or `"ES2022"`
- **Reason:** These errors indicate genuine type unsafety. The `item.count` error references a property that only exists on one nav item and accessing it unsafely could cause runtime issues. The `replaceAll` errors indicate the tsconfig target is out of sync with actual runtime usage.
- **Alternatives considered:** Suppress errors with `// @ts-ignore` — rejected as it hides real problems.
- **Consequences:** TypeScript check becomes clean. No behavioral changes expected.
- **Status:** TODO (Phase 2)

---

## DEC-006 — Do Not Add a Testing Framework in This Phase

- **Date:** 2026-10-26
- **Decision:** No automated testing framework (Vitest, Jest, Playwright, Cypress) will be installed or configured in this refactoring phase.
- **Reason:** The existing codebase has no tests. Installing a testing framework would require significant additional setup and would not provide immediate value during refactoring. A manual regression checklist is more practical for this phase.
- **Alternatives considered:** Vitest (preferred for Vite projects) — deferred to Phase 6.
- **Consequences:** Regression verification relies on manual testing. Future work should add Vitest as part of Phase 6.
- **Status:** Active — testing framework deferred

---

## DEC-007 — Figma Make Platform Compatibility

- **Date:** 2026-10-26
- **Decision:** The vite.config.ts Figma Make plugins (figmaSiteConfiguration, figmaErrorOverlayReplay, figmaReactRefreshBoundaryFallback, figmaMakeKitPlugin, figmaLinkedPackageSourcemaps) will NOT be modified.
- **Reason:** The project runs inside Figma Make. These plugins provide dev server features, error overlay behavior, and sourcemap support needed by the platform. Modifying them could break the development environment.
- **Alternatives considered:** Extracting to a separate plugin file — not necessary.
- **Consequences:** vite.config.ts remains as-is. The two Vite native config warnings (`__dirname`, JSON import) are pre-existing and harmless.
- **Status:** Active
