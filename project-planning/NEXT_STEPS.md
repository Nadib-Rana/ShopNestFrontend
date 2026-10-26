# ShopNest — Next Steps

> Actionable list of future tasks in priority and dependency order.
> Last updated: 2026-10-26

---

## Completed in Recent Iterations (Phases 1 — 6) ✅
1. **Repository Audit & Modular Refactoring:** Decomposed monolithic legacy files into `src/features/`, `src/components/`, `src/repositories/`, `src/utils/`, and `src/hooks/`.
2. **TypeScript & Bundling Optimization:** 0 compilation errors via `ES2022` lib target, lazy route splitting across 10 dynamic chunks.
3. **8 Distinct Storefront Themes:** Fully customized visual identities, hero banners, product cards, category grids, and promo stories for Fashion, Shoes, Electronics, Beauty, Grocery, Decor, Furniture, and Retail.
4. **Header & Footer Customization Engine:** Functional Centered/Compact/Split headers and Expanded/Minimal footers connected live to customizer and storefronts.
5. **Public Theme Discovery (`/themes`):** Gallery with live preview and smart registration check (redirects to `/signup` or navigates to `/seller/customizer`).
6. **Active Theme Isolation & Preview Memory:** Customizer locks access to the active theme, and preview close button returns to `/seller/themes` or `/themes`.
7. **Seller Workspaces:** Implemented interactive `ShippingPage.tsx` (`/seller/shipping`) and `AnalyticsPage.tsx` (`/seller/analytics`).
8. **UI Scrolling & Mobile Responsiveness:** Fixed live preview vertical scrolling on desktop/tablet/mobile, and added mobile hamburger drawer navigation with search for all themes.
9. **Automated Testing Suite:** 30 unit & integration tests passing with Vitest and React Testing Library (`npm test`).

---

## Upcoming Recommended Tasks (Phase 7: Backend Scaffolding & Settings)

### 1. SN-FE-022 — Implement Store Settings Workspace
- **Route:** `/seller/settings`
- **Scope:** Replace placeholder with interactive store profile (store name, currency selector, logo upload, email, contact phone, social media links).

### 2. SN-BE-001 — Backend Tech Stack & Architecture Initialization
- **Scope:** Initialize Node.js/TypeScript backend service (NestJS or Express) with structured controllers, services, and middlewares matching `docs/ARCHITECTURE.md`.

### 3. SN-BE-002 — Multi-Tenant Database Schema Design
- **Scope:** Implement PostgreSQL schema via Prisma ORM for Tenants, Users, Stores, Products, Orders, Categories, and ThemeConfigs conforming to `docs/DATA_MODELS.md`.

### 4. SN-BE-003 — Authentication & JWT Guard Service
- **Scope:** Build registration, login, token refresh, and role-based access control (SuperAdmin, SellerOwner, SellerStaff, Customer).
