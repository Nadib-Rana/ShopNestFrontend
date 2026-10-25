# ShopNest — Frontend Structure

> Last updated: 2026-10-26

## Current Structure (Before Phase 2 Refactoring)

```
src/
├── main.tsx                 — React entry point (11 lines)
├── App.tsx                  — Root router + seller dashboard + page components (359 lines, 38 KB)
├── SellerManagement.tsx     — Products, categories, inventory, orders, customers (104 lines, 27 KB)
├── BillingAdmin.tsx         — Seller billing + super admin panel (58 lines, 17 KB)
├── CustomerStorefront.tsx   — All 8 storefronts + cart + checkout + tracking (141 lines, 33 KB)
├── ThemeStudio.tsx          — Theme gallery + live customizer (19 lines, 7 KB)
├── commerceStore.ts         — localStorage: products and orders
├── themeStore.ts            — localStorage: theme config + 8 theme definitions
├── index.css                — ALL styles (219 lines, 102 KB)
└── vite-env.d.ts            — Vite type declarations
```

---

## Target Structure (Phase 2)

```
src/
├── main.tsx                          — Entry point (unchanged)
├── App.tsx                           — Lean router only
├── index.css                         — Tailwind import + design tokens
│
├── app/
│   ├── router/
│   │   └── useRoute.ts               — Custom routing hook
│   └── layouts/
│       ├── SellerLayout.tsx          — Sidebar + header + main
│       └── AdminLayout.tsx           — Admin sidebar + main
│
├── components/
│   ├── ui/
│   │   ├── Icon.tsx                  — SVG icon component
│   │   ├── Status.tsx                — Status badge (green/amber/blue/purple/gray)
│   │   └── Badge.tsx                 — Management badge (active/draft/etc)
│   └── shared/
│       ├── OrderTable.tsx            — Reusable order table rows
│       ├── Confirm.tsx               — Reusable confirmation dialog
│       └── Toolbar.tsx               — Search + filter toolbar
│
├── features/
│   ├── home/
│   │   └── ShopNestHome.tsx          — Landing page
│   ├── auth/
│   │   └── AuthPage.tsx              — All auth screens
│   ├── onboarding/
│   │   └── Onboarding.tsx            — 6-step onboarding wizard
│   ├── dashboard/
│   │   ├── Overview.tsx              — Seller dashboard overview
│   │   └── Metric.tsx                — Metric card component
│   ├── seller/
│   │   ├── ProductsPage.tsx          — Product list
│   │   ├── ProductForm.tsx           — Add/edit product form
│   │   ├── ProductDetails.tsx        — Product detail view
│   │   ├── CategoriesPage.tsx        — Category management
│   │   ├── InventoryPage.tsx         — Inventory management
│   │   ├── OrdersPage.tsx            — Order list
│   │   ├── OrderDetails.tsx          — Order detail view
│   │   ├── CustomersPage.tsx         — Customer list
│   │   ├── CustomerDetails.tsx       — Customer detail view
│   │   └── StorefrontPage.tsx        — Seller storefront overview
│   ├── themes/
│   │   ├── ThemeGallery.tsx          — Theme gallery grid
│   │   ├── ThemeCustomizer.tsx       — Live customizer
│   │   └── ThemeCard.tsx             — Single theme card
│   ├── subscriptions/
│   │   ├── SellerBilling.tsx         — Subscription overview
│   │   └── PaymentFlow.tsx           — Payment form + review + confirmation
│   ├── storefront/
│   │   ├── CustomerStorefront.tsx    — Storefront router
│   │   ├── StoreHome.tsx             — Storefront homepage
│   │   ├── Catalog.tsx               — Product listing/catalog
│   │   ├── ProductDetail.tsx         — Storefront product detail
│   │   ├── Cart.tsx                  — Shopping cart
│   │   ├── Checkout.tsx              — Checkout form + review
│   │   ├── Confirmation.tsx          — Order confirmed
│   │   ├── Tracking.tsx              — Order tracking
│   │   ├── Policy.tsx                — Policy pages
│   │   └── headers/
│   │       ├── HeaderFashion.tsx
│   │       ├── HeaderShoes.tsx
│   │       └── ... (one per theme)
│   └── admin/
│       ├── AdminApp.tsx              — Admin router + layout
│       ├── AdminOverview.tsx         — Admin dashboard
│       ├── AdminPayments.tsx         — Payment review queue
│       └── AdminSection.tsx          — Generic static section
│
├── hooks/
│   └── useRoute.ts                   — (moved from app/router/)
│
├── repositories/
│   ├── commerceStore.ts              — Products + orders (localStorage)
│   └── themeStore.ts                 — Theme config (localStorage)
│
├── utils/
│   └── format.ts                     — money() formatter and other utilities
│
├── constants/
│   └── index.ts                      — navItems, sellerRoutes, storeSlugs
│
├── types/
│   └── index.ts                      — Shared TypeScript types
│
└── styles/
    └── (per-feature CSS if extracted)
```

---

## Where to Add New Files

| New feature type | Location |
|-----------------|----------|
| New seller page | `src/features/seller/` |
| New storefront page | `src/features/storefront/` |
| New admin section | `src/features/admin/` |
| New reusable UI component | `src/components/ui/` |
| New shared page-level component | `src/components/shared/` |
| New custom hook | `src/hooks/` |
| New localStorage repository | `src/repositories/` |
| New API service (future) | `src/services/` |
| New TypeScript types | `src/types/index.ts` |
| New constants | `src/constants/index.ts` |
| New utility function | `src/utils/` |
