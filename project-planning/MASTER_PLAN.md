# ShopNest — Master Development Plan

> **Last updated:** 2026-10-26
> All phases reflect the actual project state discovered during repository audit.

---

## Phase Dependencies Overview

```
Phase 1 (Audit) → Phase 2 (Refactor) → Phase 3 (Cleanup) → Phase 4 (Documentation)
Phase 4 → Phase 5 (Frontend completion) → Phase 6 (Testing)
Phase 6 → Phase 7 (Backend planning) → Phase 8 (Auth) → Phase 9 (Multi-tenancy)
Phase 9 → Phase 10 (Product APIs) → Phase 11 (Order APIs) → Phase 12 (Payments)
Phase 12 → Phase 13 (Store customization) → Phase 14 (Integration)
Phase 14 → Phase 15 (Security testing) → Phase 16 (Production)
```

---

## Phase 1 — Repository Audit ✅ COMPLETE

**Goal:** Understand the existing codebase before any changes.

- [x] Inspect complete repository structure
- [x] Identify framework, language, build system
- [x] Locate entry point, routing, components, stores
- [x] Inspect all source files
- [x] Identify existing TypeScript errors
- [x] Run baseline production build
- [x] Record baseline metrics

**Baseline (2026-10-26):**
- Build: SUCCESS (Vite, 387ms)
- Bundle: JS 355 KB raw / 102 KB gzip; CSS 104 KB raw / 21 KB gzip
- Type check: 14 errors (pre-existing — not caused by refactoring)
  - `item.count` missing on nav union type (App.tsx:134)
  - `replaceAll` not in tsconfig lib target (multiple files) — build passes regardless

---

## Phase 2 — Frontend Modular Refactoring 🔄 IN PROGRESS

**Goal:** Reorganize the flat src/ directory into a feature-based modular structure.

### 2.1 Create modular directory structure
- [ ] Create `src/app/` (router, providers, layouts)
- [ ] Create `src/components/ui/` (shared UI primitives)
- [ ] Create `src/components/shared/` (reusable page components)
- [ ] Create feature directories for each domain area

### 2.2 Extract and reorganize files
- [ ] Extract routing logic from App.tsx → `src/app/router/`
- [ ] Extract Icon component → `src/components/ui/Icon.tsx`
- [ ] Extract Status/Badge component → `src/components/ui/`
- [ ] Extract seller sidebar layout → `src/app/layouts/SellerLayout.tsx`
- [ ] Extract public landing → `src/features/home/`
- [ ] Extract auth pages → `src/features/auth/`
- [ ] Extract onboarding → `src/features/onboarding/`
- [ ] Extract seller dashboard → `src/features/dashboard/`
- [ ] Extract products/categories/inventory/orders/customers → `src/features/seller/`
- [ ] Extract theme gallery/customizer → `src/features/themes/`
- [ ] Extract billing → `src/features/subscriptions/`
- [ ] Extract storefront → `src/features/storefront/`
- [ ] Extract admin → `src/features/admin/`

### 2.3 Split oversized components
- [ ] Extract individual page components from SellerManagement.tsx
- [ ] Extract individual page components from CustomerStorefront.tsx
- [ ] Extract storefront header variants into separate files
- [ ] Split index.css into per-feature CSS modules or scoped files

### 2.4 Fix TypeScript errors
- [ ] Fix `item.count` type error in App.tsx nav (add optional chaining)
- [ ] Update tsconfig.json lib to include ES2021 for `replaceAll`

---

## Phase 3 — Code Cleanup and Performance Optimization

**Goal:** Remove duplication, improve readability, and optimize bundle.

- [ ] Reformat compressed single-line components into readable multi-line code
- [ ] Remove duplicate `money()` formatter functions (exists in 3 files)
- [ ] Remove duplicate `Badge`/`Status` components (exists in App.tsx, SellerManagement.tsx, BillingAdmin.tsx)
- [ ] Remove duplicate product image arrays (exists in commerceStore.ts and CustomerStorefront.tsx)
- [ ] Implement route-level code splitting (lazy load seller, admin, storefront separately)
- [ ] Compare before/after bundle sizes

---

## Phase 4 — Technical Documentation

**Goal:** Create accurate, complete documentation of the final codebase state.

- [ ] Update README.md with setup, dev commands, current limitations
- [ ] Update AGENTS.md with ShopNest-specific architecture guidance
- [ ] Create docs/ARCHITECTURE.md
- [ ] Create docs/FRONTEND_STRUCTURE.md
- [ ] Create docs/ROUTES.md
- [ ] Create docs/DESIGN_SYSTEM.md
- [ ] Create docs/DATA_MODELS.md
- [ ] Create docs/STATE_AND_PERSISTENCE.md
- [ ] Create docs/API_CONTRACTS.md (proposed, not implemented)
- [ ] Create docs/BUSINESS_FLOWS.md
- [ ] Create docs/TESTING.md
- [ ] Create docs/MULTITENANCY_AND_SECURITY.md
- [ ] Create docs/KNOWN_LIMITATIONS.md
- [ ] Create docs/ROADMAP.md
- [ ] Create docs/CHANGELOG.md

---

## Phase 5 — Frontend Functionality Completion

**Goal:** Complete incomplete features and fix broken interactions.

- [ ] Shipping & Delivery page (currently shows "Coming Soon")
- [ ] Analytics page (currently shows "Coming Soon")
- [ ] Store settings page (currently shows "Coming Soon")
- [ ] Fully functional theme preview per storefront slug
- [ ] Password strength indicator on auth forms
- [ ] Verified form validation improvements
- [ ] Order history for customers (visible in customer storefront account)

---

## Phase 6 — Frontend Regression Testing

**Goal:** Verify all existing workflows still function after refactoring.

- [ ] Authentication and onboarding flow end-to-end
- [ ] Seller dashboard: all sections accessible
- [ ] Products: CRUD, bulk actions, search
- [ ] Categories: CRUD
- [ ] Inventory: stock adjustment
- [ ] Orders: filter, detail, status update, CSV export
- [ ] Customers: list, detail
- [ ] Storefronts: all 8 themes accessible
- [ ] Cart: add, update, remove
- [ ] Checkout: full flow to confirmation
- [ ] Order tracking: by ID + phone
- [ ] Theme gallery and customizer
- [ ] Subscription: plan selection, payment form, history
- [ ] Admin: overview, payment review, approve/reject
- [ ] Browser Back/Forward navigation
- [ ] Direct URL navigation
- [ ] Responsive layouts on mobile

---

## Phase 7 — Backend Architecture and Database Planning

**Goal:** Design the data layer, API structure, and multi-tenant schema.

- [ ] Choose backend technology (Node.js/Express, Next.js API, or equivalent)
- [ ] Design database schema for multi-tenant stores
- [ ] Define tenant isolation strategy
- [ ] Plan API versioning and base URL structure
- [ ] Design authentication and session strategy

**Dependency:** Phases 2-6 must be complete.

---

## Phase 8 — Authentication and Authorization

**Goal:** Implement real authentication replacing frontend simulation.

- [ ] JWT or session-based authentication
- [ ] Role definitions: SuperAdmin, SellerOwner, Customer (guest)
- [ ] Protected route enforcement on the backend
- [ ] Password hashing (bcrypt)
- [ ] Email verification flow
- [ ] Password reset flow

---

## Phase 9 — Multi-Tenant Architecture

**Goal:** True isolation between stores at the data and API layer.

- [ ] Tenant identification by subdomain or store slug
- [ ] Server-side store ownership verification
- [ ] Data scoping per tenant
- [ ] Tenant-specific theme and configuration isolation

---

## Phase 10 — Product, Category, and Inventory APIs

- [ ] Product CRUD API (per store)
- [ ] Category management API
- [ ] Inventory tracking API
- [ ] Image upload and media storage

---

## Phase 11 — Order and Checkout APIs

- [ ] Order creation from checkout
- [ ] Order status updates
- [ ] Customer order lookup (tracking)
- [ ] Order history per store

---

## Phase 12 — Subscription and Manual Payment Workflows

- [ ] Manual payment submission API
- [ ] Admin payment approval workflow
- [ ] Subscription status enforcement
- [ ] Store expiry on subscription lapse

---

## Phase 13 — Store Customization and Domain Integration

- [ ] Theme config persistence via API (replace localStorage)
- [ ] Custom domain verification workflow
- [ ] SSL/TLS for custom domains

---

## Phase 14 — Frontend-Backend Integration

- [ ] Replace all localStorage calls with API calls
- [ ] Implement loading and error states throughout
- [ ] Handle API authentication headers
- [ ] Handle session expiry gracefully

---

## Phase 15 — Security and Acceptance Testing

- [ ] Server-side authorization testing
- [ ] Tenant isolation verification
- [ ] Payment verification security review
- [ ] Frontend XSS prevention
- [ ] CSRF protection
- [ ] Acceptance test scenarios for all user journeys

---

## Phase 16 — Deployment and Production Readiness

- [ ] CI/CD pipeline
- [ ] Environment configuration (dev, staging, production)
- [ ] Domain and DNS setup
- [ ] Production database setup
- [ ] Monitoring and error tracking
- [ ] Backup and recovery procedures
- [ ] GDPR/PDPA compliance review
