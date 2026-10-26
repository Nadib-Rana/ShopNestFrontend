# ShopNest — Known Issues & Resolutions

> **Last updated:** 2026-10-26
> Canonical register of verified bugs, structural limitations, and resolutions.

---

## Resolved Issues ✅

### KI-001 — `item.count` Property Missing on Nav Union Type
- **File:** `src/App.tsx`
- **Error:** `Property 'count' does not exist on type '{ readonly label: "Overview"; ... }'`
- **Resolution:** Added optional `count?: string` to `NavItem` in `src/types/index.ts`. Type-checking is now clean.
- **Status:** RESOLVED (2026-10-26).

### KI-002 — `replaceAll` Not in tsconfig `lib` Target
- **Files:** `src/BillingAdmin.tsx`, `src/CustomerStorefront.tsx`, `src/SellerManagement.tsx`
- **Error:** `Property 'replaceAll' does not exist on type 'string'.`
- **Resolution:** Updated `compilerOptions.lib` in `tsconfig.json` to `["ES2022", "DOM", "DOM.Iterable"]`.
- **Status:** RESOLVED (2026-10-26).

### KI-003 — Compressed Single-Line Code in Monolithic Files
- **Files:** Legacy root files
- **Resolution:** Decomposed into feature modules under `src/features/` and components under `src/components/` with clean formatting and indentation.
- **Status:** RESOLVED (2026-10-26).

### KI-004 — Duplicate `money()` Formatter
- **Files:** `App.tsx`, `SellerManagement.tsx`, `BillingAdmin.tsx`, `CustomerStorefront.tsx`
- **Resolution:** Consolidated into single shared utility `money()` in `src/utils/format.ts`.
- **Status:** RESOLVED (2026-10-26).

### KI-005 — Duplicate Badge/Status Components
- **Resolution:** Extracted unified `Badge` (`src/components/ui/Badge.tsx`) and `Status` (`src/components/ui/Status.tsx`) primitives.
- **Status:** RESOLVED (2026-10-26).

### KI-006 — Duplicate Product Image Arrays
- **Resolution:** Deduplicated into `src/constants/index.ts`.
- **Status:** RESOLVED (2026-10-26).

### KI-007 — Shipping & Delivery Workspace Not Implemented
- **Route:** `/seller/shipping`
- **Resolution:** Implemented full interactive workspace `src/features/seller/ShippingPage.tsx` with delivery zones (Inside/Outside Dhaka), courier partners (Pathao, Steadfast, RedX, Paperfly), free delivery thresholds, and cash-on-delivery options.
- **Status:** RESOLVED (2026-10-26).

### KI-008 — Analytics Workspace Not Implemented
- **Route:** `/seller/analytics`
- **Resolution:** Implemented full interactive workspace `src/features/seller/AnalyticsPage.tsx` with revenue metrics, average order value, sales timeline charts, top product breakdowns, and traffic channel distributions.
- **Status:** RESOLVED (2026-10-26).

### KI-009 — Theme Customizer Live Preview Pane Not Scrolling
- **Files:** `src/features/themes/ThemeStudio.tsx`, `src/app/layouts/SellerLayout.tsx`, `src/index.css`
- **Issue:** Right-side preview pane (`.live-preview`) was constrained by `align-items: stretch` and `overflow: hidden`, while inner `<main>` tag inherited global `main { margin-left: 254px }`. Content below the fold was clipped and could not be scrolled down.
- **Resolution:** Changed `<main className="preview-stage">` to `<div>`, set `.preview-stage` to `overflow-y: auto`, `.live-preview` to `overflow: visible` with `align-self: flex-start`, and hidden redundant seller layout header when on `/seller/customizer`.
- **Status:** RESOLVED (2026-10-26).

### KI-010 — Storefront Navigation Hidden on Mobile Devices
- **Files:** `src/features/storefront/CustomerStorefront.tsx`, `src/CustomerStorefront.tsx`, `src/index.css`
- **Issue:** On mobile viewports (≤ 600px), theme navigation headers had `display: none` without any mobile toggle button, leaving mobile shoppers with no way to browse categories or search.
- **Resolution:** Built mobile hamburger toggle button (`store-mobile-toggle`) and full slide-out drawer (`store-mobile-drawer`) featuring live search, all categories, quick links, and cart badge across all 8 themes.
- **Status:** RESOLVED (2026-10-26).

---

## Active Architectural Limitations (Documented by Design)

### LIM-001 — Client-Side LocalStorage Persistence Only
- **Context:** The application currently runs entirely in the browser without a live backend database.
- **Impact:** Clearing browser data resets store state to defaults. Multi-device sync is not yet available.
- **Future Resolution:** Phase 7+ backend integration (PostgreSQL + Prisma + REST API).

### LIM-002 — Prototype Notice & Simulated Checkout
- **Context:** Order placement is simulated client-side. No payment gateway webhook integration is active in frontend-only mode.
- **Impact:** Confirmed in `docs/BUSINESS_FLOWS.md` and visible to users via prototype notices.
