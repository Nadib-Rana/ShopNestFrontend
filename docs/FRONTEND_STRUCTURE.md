# ShopNest — Frontend Structure

> Last updated: 2026-10-26

## Current Implemented Structure

```
src/
├── main.tsx                          — React entry point
├── App.tsx                           — Root router with lazy route code-splitting
├── index.css                         — Tailwind imports + design tokens + theme styling
│
├── app/
│   └── layouts/
│       ├── SellerLayout.tsx          — Seller dashboard shell (sidebar, topbar, navigation)
│       └── AdminLayout.tsx           — Super Admin shell
│
├── components/
│   ├── ui/
│   │   ├── Icon.tsx                  — Centralized SVG icon library
│   │   ├── Status.tsx                — Colored status pill badges
│   │   └── Badge.tsx                 — Management badges
│   └── shared/
│       ├── OrderTable.tsx            — Shared order table with status badge rendering
│       ├── NotFound.tsx              — 404 page shell
│       └── ComingSoon.tsx            — Placeholder for scheduled workspaces
│
├── features/
│   ├── home/
│   │   └── ShopNestHome.tsx          — Public landing page
│   ├── auth/
│   │   └── AuthPage.tsx              — Complete auth suite (login, signup, verify, forgot/reset password)
│   ├── onboarding/
│   │   └── Onboarding.tsx            — 6-step seller onboarding wizard
│   ├── dashboard/
│   │   ├── Overview.tsx              — Seller dashboard metrics and recent orders
│   │   └── Metric.tsx                — Reusable metric card
│   ├── seller/
│   │   ├── SellerManagement.tsx      — Products, categories, inventory, orders, customers
│   │   ├── ShippingPage.tsx          — Shipping zones & courier integration workspace
│   │   ├── AnalyticsPage.tsx         — Business revenue, order volume, AOV, and charts
│   │   ├── SettingsPage.tsx           — Store profile, legal, checkout, notifications, maintenance
│   │   └── Storefront.tsx            — Storefront overview & domain management
│   ├── themes/
│   │   ├── ThemeStudio.tsx           — Theme gallery & live customizer (active theme isolated)
│   │   └── PublicThemesPage.tsx      — Public theme marketplace with registration gating
│   ├── subscriptions/
│   │   └── BillingAdmin.tsx          — Seller billing, plan selection, manual payment proof
│   ├── storefront/
│   │   └── CustomerStorefront.tsx    — Multi-theme customer storefront (8 themes, cart, checkout, tracking, drawer)
│   └── admin/
│       └── AdminApp.tsx              — Super Admin verification queue & platform controls
│
├── hooks/
│   └── useRoute.ts                   — Custom history API router hook
│
├── repositories/
│   ├── commerceStore.ts              — Products & orders localStorage adapter
│   ├── shippingStore.ts              — Shipping rules and couriers persistence
│   ├── settingsStore.ts              — Store profile & preferences persistence
│   └── themeStore.ts                 — Theme configuration & 8 theme definitions
│
├── constants/
│   └── index.ts                      — Navigation items, routes, mock seed data, image assets
│
├── types/
│   └── index.ts                      — Centralized TypeScript interfaces and types
│
├── utils/
│   └── format.ts                     — money() currency formatting [৳], formatNumber, slugify
│
└── test/
    └── setup.ts                      — Vitest + jsdom global environment setup
```

---

## Where to Add New Files

| New feature type | Location |
|-----------------|----------|
| New seller page | `src/features/seller/` |
| New storefront feature | `src/features/storefront/` |
| New theme component | `src/features/themes/` |
| New admin section | `src/features/admin/` |
| New reusable UI component | `src/components/ui/` |
| New shared page-level component | `src/components/shared/` |
| New custom hook | `src/hooks/` |
| New localStorage repository | `src/repositories/` |
| New API service (future) | `src/services/` |
| New TypeScript types | `src/types/index.ts` |
| New constants | `src/constants/index.ts` |
| New utility function | `src/utils/` |
| Unit / integration tests | Adjacent to source file as `*.test.tsx` or in `src/test/` |
