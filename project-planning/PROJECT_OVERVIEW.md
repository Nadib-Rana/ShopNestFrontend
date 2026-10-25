# ShopNest — Project Overview

> **Last updated:** 2026-10-26
> **Status:** Frontend prototype — no backend exists

---

## What is ShopNest?

ShopNest is a multi-tenant e-commerce Software-as-a-Service (SaaS) platform targeted at independent business owners in Bangladesh. The platform is designed so merchants can create and manage their own online storefronts without needing developer skills, while a super admin manages the platform, approves subscriptions, and oversees all stores.

---

## Product Goals

- Allow business owners ("sellers") to create a public-facing storefront in minutes.
- Provide sellers with tools to manage products, categories, inventory, orders, and customers.
- Provide multiple storefront themes (fashion, shoes, electronics, beauty, grocery, home decor, furniture, general retail).
- Allow sellers to customize theme colors, typography, hero content, and layout sections.
- Handle subscription billing via manual payment submission and admin verification.
- Provide a Super Admin panel for platform oversight.
- Support multi-tenant architecture where each store is isolated.

---

## Intended Users

| User type | Description |
|-----------|-------------|
| **Seller / Store Owner** | Creates store, manages catalog and orders, chooses theme, submits subscription payment |
| **Customer** | Browses storefront, views products, adds to cart, checks out as guest |
| **Super Admin** | Manages sellers, verifies payments, approves subscriptions, manages themes and domains |

---

## Main Business Workflows (Verified in Codebase)

### Seller Journey
1. Visit landing page (`/`) → Start free trial → Sign up
2. Verify email code → Multi-step onboarding (business info, store address, theme, branding)
3. Enter seller dashboard → Manage products, categories, inventory
4. View and update orders
5. Manage customers
6. Browse themes → Customize theme with live preview
7. Publish storefront
8. Submit manual subscription payment → Await admin approval

### Customer Journey
1. Visit storefront (`/store/<slug>`)
2. Browse products → Filter by category, price, stock
3. View product detail → Select variant → Add to bag
4. Review cart → Proceed to checkout
5. Fill delivery details → Review order → Place order
6. View order confirmation → Track order by ID and phone

### Super Admin Journey
1. Login to `/admin` panel
2. View platform overview (metrics, recent submissions)
3. Review payment queue → Approve or reject payment submissions
4. Manage sellers, stores, subscriptions, plans, themes, domains, audit log

---

## Implemented Features (Verified from Actual Source Code)

| Feature | Source File | Notes |
|---------|------------|-------|
| Landing page | App.tsx — ShopNestHome | Public marketing page |
| Auth screens | App.tsx — AuthPage | Login, signup, forgot, reset, verify — frontend only |
| Seller onboarding | App.tsx — Onboarding | 6-step wizard |
| Seller dashboard shell | App.tsx — App | Sidebar nav, header, notification panel |
| Seller overview | App.tsx — Overview | Revenue chart, order donut, metrics, recent orders |
| Product management | SellerManagement.tsx | List, add, edit, delete, bulk actions, search, filter |
| Category management | SellerManagement.tsx | CRUD via modal dialogs |
| Inventory management | SellerManagement.tsx | Stock view, adjust dialog, movement history |
| Order management | SellerManagement.tsx | List, tabs, filter, detail, status update, CSV export |
| Customer management | SellerManagement.tsx | List, search, detail with order history |
| Storefront overview | App.tsx — Storefront | Theme preview, publish, domain display |
| Theme gallery | ThemeStudio.tsx | 8 theme cards with preview and apply |
| Theme customizer | ThemeStudio.tsx | Live preview, colors, fonts, sections, device tabs |
| Subscription & billing | BillingAdmin.tsx — SellerBilling | Plans, manual payment form, history |
| Customer storefronts | CustomerStorefront.tsx | 8 themed storefronts |
| Product listing | CustomerStorefront.tsx | Grid, filters, sort, search, category |
| Product detail | CustomerStorefront.tsx | Variant selection, add to bag, buy now |
| Shopping cart | CustomerStorefront.tsx | Line items, quantity, shipping calc |
| Guest checkout | CustomerStorefront.tsx | Delivery form, review, place order |
| Order confirmation | CustomerStorefront.tsx | Order summary |
| Order tracking | CustomerStorefront.tsx | Search by order + phone |
| Policy pages | CustomerStorefront.tsx | About, contact, shipping, returns, privacy, terms |
| Super Admin panel | BillingAdmin.tsx — AdminApp | Overview, payment review queue, 9 admin sections |

---

## Existing Technical Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 |
| Language | TypeScript 5.7 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 + custom CSS in src/index.css |
| State management | React local state (useState) |
| Routing | Custom: window.history.pushState + popstate |
| Persistence | localStorage (products, cart, orders, theme config, payments) |
| Fonts | Google Fonts: DM Sans, Manrope |
| Images | Unsplash CDN (external dependency) |
| Platform | Figma Make (custom Vite plugins) |

---

## Current Architecture

```
src/
  main.tsx               — React entry point (11 lines)
  App.tsx                — Root router + seller shell + page components (359 lines, 38 KB)
  SellerManagement.tsx   — Products + categories + inventory + orders + customers (104 lines, 27 KB)
  BillingAdmin.tsx       — Seller billing + super admin panel (58 lines, 17 KB)
  CustomerStorefront.tsx — All 8 storefronts + cart + checkout + tracking (141 lines, 33 KB)
  ThemeStudio.tsx        — Theme gallery + customizer (19 lines, 7 KB)
  commerceStore.ts       — localStorage helpers: products and orders
  themeStore.ts          — localStorage helpers: theme config + 8 theme definitions
  index.css              — ALL styling for every section (219 lines, 102 KB)
  vite-env.d.ts          — Vite types
```

---

## Current Limitations

| Limitation | Detail |
|-----------|--------|
| No backend | All data is in-memory or localStorage |
| No real authentication | Auth forms navigate without verification |
| No real payment | Subscription payment is simulated |
| localStorage as database | Data lost on browser clear; no cross-device sync |
| Compressed code | Nearly all logic is on single lines |
| TS lib target | tsconfig does not include ES2021; replaceAll causes TS errors (build passes via Vite) |
| Hardcoded persona | "Saif Rahman" / "Trendora Fashion" hardcoded throughout |
| No image upload | File inputs present but files not persisted |

---

## Long-term Direction

1. Real backend (API layer)
2. Real authentication and session management
3. True multi-tenant isolation per store
4. Real payment gateway or verified manual payment workflow
5. Media storage
6. Real-time notifications
7. Analytics with real data
8. Custom domain support
