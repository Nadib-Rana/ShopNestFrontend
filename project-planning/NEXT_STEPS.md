# ShopNest — Next Steps

> Short, actionable list of future tasks in dependency order.
> Last updated: 2026-10-26

---

## Completed in Current Iteration (Phases 1 - 4) ✅
- **Phase 1 (Audit)**: Discovered architecture, routes, schemas, and baseline metrics.
- **Phase 2 (Modular Refactoring)**:
  - Extracted shared utilities (`src/utils/format.ts`), UI primitives (`src/components/ui/`), shared components (`src/components/shared/`), constants (`src/constants/index.ts`), types (`src/types/index.ts`), router hook (`src/hooks/useRoute.ts`), layouts (`src/app/layouts/SellerLayout.tsx`), and feature modules (`src/features/`).
  - Streamlined `src/App.tsx` into a lean, declarative root router.
  - Resolved all 14 TypeScript compilation errors (0 errors now reported by `tsc --noEmit`).
- **Phase 3 (Code Cleanup & Code Splitting)**:
  - Consolidated duplicate `money()` formatters and Badge/Status elements.
  - Implemented dynamic `React.lazy()` route splitting, reducing initial JS bundle from 355 KB to 259 KB.
- **Phase 4 (Technical Documentation)**:
  - Completed all 12 documents in `docs/` and 7 tracking documents in `project-planning/`.
  - Authored comprehensive `README.md` and updated `AGENTS.md` with domain architectural guidance.

---

## Upcoming Recommended Tasks (Phase 5: Frontend Completion)

### 1. SN-FE-NEW-01 — Implement Shipping & Delivery Workspace
- **Route:** `/seller/shipping`
- **Scope:** Convert coming soon placeholder into interactive shipping rules manager (e.g., Inside Dhaka vs Outside Dhaka shipping rates, delivery courier selection).

### 2. SN-FE-NEW-02 — Implement Analytics Workspace
- **Route:** `/seller/analytics`
- **Scope:** Implement detailed revenue trends, average order value (AOV), sales breakdown by category, and customer retention metrics.

### 3. SN-FE-NEW-03 — Component Unit Testing Setup
- **Scope:** Configure Vitest and React Testing Library to execute automated tests against `useRoute`, `format.ts`, and core UI components.

### 4. SN-BE-001 — Backend API Contract Implementation
- **Scope:** Prepare Node.js/Express or NestJS backend scaffolding conforming to `docs/API_CONTRACTS.md` and `docs/DATA_MODELS.md`.
