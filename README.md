# ShopNest — Multi-tenant E-Commerce SaaS Platform

ShopNest is a modern, responsive, multi-tenant e-commerce platform designed for merchants and independent brands in Bangladesh. It features a seller administration workspace, interactive theme customizer, customer-facing storefronts with cart and guest checkout, order tracking, and a manual payment verification workflow for bKash, Nagad, and Rocket mobile banking.

---

## Key Features

- **Merchant Portal**: Full workspace for catalog management, stock tracking, order fulfillment, customer profiles, and analytics.
- **Visual Theme Studio**: 8 industry-tailored storefront themes (Fashion, Shoes, Electronics, Beauty, Grocery, Home Decor, Furniture, Retail) with live customization of colors, typography, logos, and layout structure.
- **Customer Storefronts**: Responsive, accessible buyer experience featuring instant search, category filtering, cart management, single-page guest checkout, and real-time order tracking.
- **Manual Payment Verification**: Sellers submit mobile financial service (MFS) transaction IDs for subscription plans; super-admin dashboard enables approval, rejection, or info requests.
- **Local Persistence & Zero Backend Dependency**: Runs entirely client-side using `localStorage` with reactive updates, enabling offline prototyping and rapid feature testing.

---

## Tech Stack

- **Runtime**: React 19, TypeScript 5.7
- **Styling**: Tailwind CSS v4, custom CSS design tokens
- **Build Tool**: Vite 8 with route-level code splitting
- **Formatting**: oxfmt

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Installation
```bash
# Install dependencies
npm install
```

### Development
```bash
# Start development server with hot-reload
npm run dev
```

### Quality & Type Checking
```bash
# Verify TypeScript compile safety (zero errors)
npx tsc --noEmit
```

### Production Build
```bash
# Build optimized production bundle with dynamic chunk splitting
npm run build
```

---

## Application Routes

| Route | Role | Description |
|---|---|---|
| `/` | Public | ShopNest landing page with marketing highlights |
| `/login`, `/signup` | Auth | Authentication, onboarding entry |
| `/onboarding/*` | Seller | 6-step merchant onboarding wizard |
| `/seller/overview` | Seller | Sales dashboard, metrics, and recent orders |
| `/seller/products` | Seller | Product catalog and inventory management |
| `/seller/orders` | Seller | Order processing and status transitions |
| `/seller/storefront` | Seller | Storefront overview and publish controls |
| `/seller/themes` | Seller | Theme gallery selector |
| `/seller/customizer` | Seller | Live visual theme customization studio |
| `/seller/subscription` | Seller | Subscription plans and manual payment flow |
| `/store/demo` | Customer | Live storefront for Trendora Fashion |
| `/store/:slug` | Customer | Storefronts for all 8 niche themes |
| `/store/:slug/cart` | Customer | Shopping cart and item quantity controls |
| `/store/:slug/checkout`| Customer | Single-page checkout with COD and MFS payment |
| `/store/:slug/track` | Customer | Order status timeline and tracking |
| `/admin/payments` | Super Admin| Manual payment verification and review queue |

---

## Documentation

Full architectural specifications and development plans are available in the repository:
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System architecture and data flow
- [`docs/FRONTEND_STRUCTURE.md`](docs/FRONTEND_STRUCTURE.md) — Modular directory structure
- [`docs/ROUTES.md`](docs/ROUTES.md) — Full route specification
- [`docs/STATE_AND_PERSISTENCE.md`](docs/STATE_AND_PERSISTENCE.md) — LocalStorage schema definitions
- [`docs/DATA_MODELS.md`](docs/DATA_MODELS.md) — TypeScript interfaces and schemas
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — Typography, color tokens, and components
- [`docs/BUSINESS_FLOWS.md`](docs/BUSINESS_FLOWS.md) — Core user journey flows
- [`docs/API_CONTRACTS.md`](docs/API_CONTRACTS.md) — Planned backend REST API contracts
- [`docs/NESTJS_BACKEND_BLUEPRINT.md`](docs/NESTJS_BACKEND_BLUEPRINT.md) — Complete NestJS backend architecture, Prisma schema, multi-tenancy & courier blueprint
- [`docs/TESTING.md`](docs/TESTING.md) — Automated Vitest test suite and manual regression checklists
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md) — Codebase refactoring changelog
- [`project-planning/MASTER_PLAN.md`](project-planning/MASTER_PLAN.md) — 16-phase development roadmap
- [`project-planning/TASK_TRACKER.md`](project-planning/TASK_TRACKER.md) — Granular task status tracker
- [`project-planning/CURRENT_STATUS.md`](project-planning/CURRENT_STATUS.md) — Milestone snapshot

---

## License

Private repository. All rights reserved.
