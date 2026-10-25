# ShopNest — Agent Guidelines & Repository Architecture

Multi-tenant E-Commerce SaaS platform built with React 19, TypeScript, Vite, and Tailwind CSS v4.

## Development Server

A Vite development server runs on `$PORT` (default 8443).
- Preview URL: Accessible through the preview panel or browser
- Hot reload: Changes to source files are reflected immediately
- Type checking: Run `npx tsc --noEmit` to verify TypeScript types
- Production build: Run `npm run build` to verify the bundle

## Modular Architecture (`src/`)

The frontend follows a domain-driven, feature-based modular architecture:

```
src/
├── main.tsx                      # Entry point mounting App into #root
├── App.tsx                       # Lean root router with route-level code splitting
├── index.css                     # Global styles, Tailwind imports, CSS design tokens
├── app/
│   └── layouts/
│       ├── SellerLayout.tsx      # Seller dashboard shell (sidebar, navigation, header)
│       └── AdminLayout.tsx       # Super Admin layout
├── components/
│   ├── ui/
│   │   ├── Icon.tsx              # SVG icon system
│   │   ├── Status.tsx            # Dot-based status pills (green, amber, blue, purple, gray)
│   │   └── Badge.tsx             # Management badges with status slugification
│   └── shared/
│       ├── OrderTable.tsx        # Shared order table with action dispatch
│       ├── NotFound.tsx          # 404 page shell
│       └── ComingSoon.tsx        # Placeholder for scheduled workspaces
├── features/
│   ├── home/                     # Public landing page (ShopNestHome.tsx)
│   ├── auth/                     # Authentication screens (AuthPage.tsx)
│   ├── onboarding/               # 6-step store setup wizard (Onboarding.tsx)
│   ├── dashboard/                # Seller metrics, sales charts (Overview.tsx, Metric.tsx)
│   ├── seller/                   # Products, categories, inventory, orders, customers, storefront
│   ├── themes/                   # Theme gallery and live visual customizer (ThemeStudio.tsx)
│   ├── subscriptions/            # Manual payment submission and billing history (BillingAdmin.tsx)
│   ├── admin/                    # Super Admin verification queue (AdminApp.tsx)
│   └── storefront/               # Customer storefronts, cart, checkout, tracking
├── hooks/
│   └── useRoute.ts               # Custom URL router hook (pushState / popstate)
├── repositories/                 # Client-side data stores (localStorage adapters)
│   ├── commerceStore.ts          # Products and orders persistence
│   └── themeStore.ts             # Theme configs and theme definitions
├── constants/
│   └── index.ts                  # Navigation items, routes, mock seed data, image assets
├── types/
│   └── index.ts                  # Centralized TypeScript interfaces and types
└── utils/
    └── format.ts                 # Formatting utilities: money() [৳], formatNumber, slugify
```

## Core Architectural Rules

1. **Routing**: Use `useRoute()` from `src/hooks/useRoute.ts`. Navigate using `go("/path")`. Never introduce heavy third-party routing libraries unless requested.
2. **Code Splitting**: Route-level sub-applications (CustomerStorefront, SellerManagement, ThemeStudio, BillingAdmin, AdminApp) are lazy-loaded via `React.lazy()` with `<Suspense>` boundaries.
3. **Currency & Formatting**: Always format monetary values using `money(amount)` from `src/utils/format.ts`. Never inline string formatting like `'৳' + n`.
4. **State & Storage**: Client state persists in `localStorage` through store functions in `src/repositories/` (`getCommerceProducts`, `saveCommerceProducts`, `getCommerceOrders`, `saveCommerceOrder`, `getStoreThemeConfig`, `saveStoreThemeConfig`).
5. **Types**: Shared types belong in `src/types/index.ts`. All TypeScript code must compile cleanly with `npx tsc --noEmit`.
6. **String Quotes & JSX**:
   - Use double quotes for strings containing apostrophes (`"We're ready"`).
   - Ensure all JSX tags are closed and properly indented.
   - Default exports are used for major page and feature components.

## Technical Documentation Reference

Refer to the comprehensive guides in `docs/` and `project-planning/`:
- `docs/ARCHITECTURE.md` — High-level system architecture and data flow
- `docs/FRONTEND_STRUCTURE.md` — Directory structure and file conventions
- `docs/ROUTES.md` — Complete route catalogue across all roles
- `docs/STATE_AND_PERSISTENCE.md` — LocalStorage schemas and state transitions
- `docs/DATA_MODELS.md` — Complete TypeScript interfaces
- `docs/DESIGN_SYSTEM.md` — Design tokens, color palettes, and typography
- `docs/BUSINESS_FLOWS.md` — Seller, customer, and admin workflows
- `docs/TESTING.md` — Manual regression checklists and test commands
- `project-planning/TASK_TRACKER.md` — Live task status tracker
- `project-planning/CURRENT_STATUS.md` — Project milestone snapshot
