# ShopNest — Architecture

> Last updated: 2026-10-26

## Overview

ShopNest is a single-page React application (SPA) bundled with Vite. It uses a custom client-side router and localStorage for all persistence. No backend exists.

---

## High-Level Architecture

```
Browser
  └── index.html (Vite shell)
        └── src/main.tsx (React root mount)
              └── src/App.tsx (Router + Seller Dashboard Shell)
                    ├── ShopNestHome           (Landing page)
                    ├── AuthPage               (Auth screens)
                    ├── Onboarding             (6-step wizard)
                    ├── AdminApp               (Super Admin)  ← BillingAdmin.tsx
                    ├── CustomerStorefront     (Public storefronts)  ← CustomerStorefront.tsx
                    └── Seller Dashboard Shell
                          ├── Overview         (Dashboard)
                          ├── SellerManagement ← SellerManagement.tsx
                          │     ├── Products
                          │     ├── Categories
                          │     ├── Inventory
                          │     ├── Orders
                          │     └── Customers
                          ├── Storefront page
                          ├── ThemeStudio      ← ThemeStudio.tsx
                          └── SellerBilling    ← BillingAdmin.tsx
```

---

## Routing Architecture

```
Router (useRoute hook in App.tsx)
  ↓
path = window.location.pathname
  ↓
Match:
  /                    → ShopNestHome
  /login|/signup|...   → AuthPage
  /onboarding/*        → Onboarding
  /admin/*             → AdminApp
  /store/*             → CustomerStorefront
  /seller/*            → Seller Dashboard (sidebar + header + content)
  else                 → NotFound
```

Route changes happen via `window.history.pushState`. The `popstate` event re-renders the app on browser Back/Forward. Direct URL navigation and page refresh also work because there is no server — Vite dev server serves `index.html` for all paths.

> **Note:** In production, the web server must be configured to serve `index.html` for all routes (SPA fallback).

---

## State Architecture

No global state management library (no Redux, Zustand, Jotai). All state is local to components:

- **Route state** — the current path string in `useRoute`
- **UI state** — `mobileOpen`, `notificationsOpen`, `toast`, `dialog` — local to the component that owns them
- **Form state** — managed by `FormData` on submit (uncontrolled inputs)
- **Feature state** — products, orders, categories, payments — local `useState` in parent components
- **Persisted state** — read from localStorage on component mount; written back on change

---

## Data Access Architecture

```
src/commerceStore.ts  →  Products and orders (localStorage)
src/themeStore.ts     →  Theme config and definitions (localStorage)
BillingAdmin.tsx      →  Payments (localStorage, local to file)
CustomerStorefront.tsx →  Cart (localStorage, local to file)
```

All localStorage access is synchronous. There is no async data layer.

---

## Build Architecture

```
Vite 8 + React plugin + Tailwind CSS v4 plugin
  └── Input: src/main.tsx
  └── Tailwind: @import 'tailwindcss' in src/index.css
  └── Custom Figma Make plugins:
        - figmaSiteConfiguration (reads .figma/make/site.json)
        - figmaErrorOverlayReplay
        - figmaReactRefreshBoundaryFallback
        - figmaMakeKitPlugin
        - figmaLinkedPackageSourcemaps
  └── Output: dist/
        - index.html
        - assets/index-[hash].js   (bundled React + app code)
        - assets/index-[hash].css  (Tailwind + custom styles)
        - robots.txt
```

**Baseline bundle (2026-10-26):**
- JS: 355 KB raw, 102 KB gzip
- CSS: 104 KB raw, 21 KB gzip

---

## Current Architecture Problems

| Problem | Impact |
|---------|--------|
| All app logic in 8 flat files | Hard to navigate and maintain |
| No feature module boundaries | Changes in one area can accidentally affect others |
| Entire app bundled as single JS chunk | Unnecessary code loaded on landing page |
| All CSS in one 102 KB file | Every section's CSS loaded globally |
| Compressed single-line code | Extremely difficult to read and debug |

---

## Target Architecture (Phase 2)

```
src/
  app/
    router/       — useRoute hook and route resolution
    layouts/      — SellerLayout, AdminLayout, StorefrontLayout
    providers/    — Future: context providers

  components/
    ui/           — Icon, Status, Badge, Field (reusable primitives)
    shared/       — OrderTable, Confirm dialog, Toolbar (reusable modules)

  features/
    home/         — ShopNestHome
    auth/         — AuthPage, Field
    onboarding/   — Onboarding and steps
    dashboard/    — Seller Overview, Metric, charts
    seller/       — Products, Categories, Inventory, Orders, Customers, Storefront
    themes/       — ThemeStudio, ThemeGallery, ThemeCustomizer
    subscriptions/ — SellerBilling, payment flows
    storefront/   — CustomerStorefront, Cart, Checkout, Tracking
    admin/        — AdminApp, AdminOverview, AdminPayments, AdminSection

  hooks/          — useRoute, future hooks
  services/       — Future: API service interfaces
  repositories/   — commerceStore, themeStore
  utils/          — format.ts (money formatter, etc.)
  constants/      — navItems, sellerRoutes, storeSlugs
  types/          — All TypeScript types and interfaces
  styles/         — Per-feature CSS or CSS custom properties
  assets/         — Static assets
```
