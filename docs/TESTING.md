# ShopNest — Testing

> Last updated: 2026-10-26

## Automated Tests

**Fully Configured & Passing.** ShopNest features an automated test suite powered by **Vitest 4**, **jsdom**, and **@testing-library/react**:

- **Runner**: `vitest run` (executed via `npm test`)
- **Environment**: jsdom with `@testing-library/jest-dom/vitest` matchers and `localStorage`/`sessionStorage` mocks
- **Coverage**: 7 test suites, 30 automated unit and integration tests

### Test Suite Inventory

| Test File | Target Feature | Tests |
|-----------|---------------|-------|
| `src/utils/format.test.ts` | Currency formatting (`money()`), number formatting, slug generation | 5 |
| `src/repositories/commerceStore.test.ts` | LocalStorage commerce store persistence & order management | 4 |
| `src/features/storefront/CustomerStorefront.test.tsx` | 8 distinct storefront themes, product cards, category grids, mobile drawer | 6 |
| `src/features/themes/ThemeStudio.test.tsx` | Active theme customizer isolation, control rendering, preview updates | 4 |
| `src/features/themes/PublicThemesPage.test.tsx` | Public theme gallery, preview links, registration check gating | 4 |
| `src/features/seller/ShippingPage.test.tsx` | Shipping zones (Dhaka/Outside), COD toggles, courier integration status | 4 |
| `src/features/seller/AnalyticsPage.test.tsx` | Business KPIs (Revenue, Orders, AOV), date filter tabs, payment breakdown | 3 |

---

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm test` | Run all 30 automated Vitest unit and integration tests |
| `npm run dev` | Start development server on port 8443 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npx tsc --noEmit` | Type-check without building (0 errors) |

---

## Current Verification Results (2026-10-26)

| Check | Result |
|-------|--------|
| `npm test` | ✅ 7/7 test files passed, 30/30 tests passed |
| `npx tsc --noEmit` | ✅ 0 errors (strict TypeScript clean) |
| `npm run build` | ✅ Success (~490ms, zero bundle warnings) |

---

## Manual Regression Checklist

Run this checklist after any significant change to verify no regressions.

### A — Authentication and Onboarding

- [ ] Navigate to `/` — landing page loads
- [ ] Click "Start your free trial" → navigates to `/signup`
- [ ] Fill signup form with invalid email → error shown
- [ ] Fill signup form with valid data → navigates to `/verify`
- [ ] Fill 6-digit code wrong (< 6 chars) → error shown
- [ ] Fill 6-digit code correct → navigates to `/onboarding/welcome`
- [ ] Click through all 6 onboarding steps
- [ ] Change subdomain to reserved name ("shop") → error shown
- [ ] Complete onboarding → navigates to `/seller/overview`
- [ ] Navigate to `/login` → fill valid email/password → navigates to `/seller/overview`
- [ ] Navigate to `/forgot-password` → submit → "Check your inbox" shown
- [ ] Click "Continue prototype" → navigates to `/reset-password` → submit → navigates to `/login`

### B — Seller Dashboard Navigation

- [ ] All 13 sidebar nav items are clickable and navigate to expected routes
- [ ] Active nav item shows highlighted/active state
- [ ] Browser Back returns to previous section
- [ ] Mobile menu button opens sidebar on small screens

### C — Product Management

- [ ] `/seller/products` loads with 4 default products
- [ ] Search "Linen" → filters to 1 result
- [ ] Click "Add product" → navigates to product form
- [ ] Save product form without name → validation error shown
- [ ] Save product form with valid data → product added to list
- [ ] Click checkbox on a product → bulk actions bar appears
- [ ] Bulk delete → confirmation dialog appears → confirm → product deleted
- [ ] Click product row → navigates to product detail

### D — Categories, Inventory, Orders, Customers

- [ ] `/seller/categories` — 4 categories listed
- [ ] Create a category → appears in list
- [ ] Delete a category → confirmation → removed from list
- [ ] `/seller/inventory` — total units shown, adjust button works
- [ ] `/seller/orders` — 3+ orders listed, tabs filter by status
- [ ] Click order → order detail page loads with items and timeline
- [ ] Update order status → status changes in list
- [ ] Export CSV → file downloads
- [ ] `/seller/customers` — 3 customers listed
- [ ] Click customer → detail page loads with order history

### E — Storefront and Theme

- [ ] `/seller/storefront` — preview image and publish button visible
- [ ] "Customize theme" → navigates to `/seller/customizer`
- [ ] "Browse themes" → navigates to `/seller/themes`
- [ ] `/seller/themes` — 8 theme cards visible
- [ ] Click "Preview" on any theme → navigates to `/store/<slug>/preview`
- [ ] Close preview → navigates back to theme gallery
- [ ] Click "Use theme" → theme applied → customizer reflects new theme
- [ ] `/seller/customizer` — all controls functional (color picker, font, toggles)
- [ ] Live preview updates on every control change
- [ ] Device tabs switch preview width
- [ ] "Publish" → success notification shown
- [ ] "Reset" → confirmation → settings restored

### F — Subscription and Billing

- [ ] `/seller/subscription` — 3 plan cards visible
- [ ] Click "Choose Quarterly" → navigates to payment form
- [ ] Submit form without Transaction ID → validation error
- [ ] Submit valid form → review step shown
- [ ] Confirm → navigates to confirmation page
- [ ] View payment history → 3 payments listed with statuses
- [ ] Click payment → detail page with status, reason for rejected

### G — Customer Storefronts (verify all 8 slugs)

- [ ] `/store/demo` — fashion theme with customized colors
- [ ] `/store/solecraft` — shoes theme, sport header
- [ ] `/store/nova` — electronics theme, technical header
- [ ] `/store/bloom` — beauty theme, editorial header
- [ ] `/store/dailybasket` — grocery theme, delivery header
- [ ] `/store/haven` — home decor theme
- [ ] `/store/form` — furniture theme
- [ ] `/store/market` — retail theme with all-categories nav
- [ ] Unknown slug → "This store isn't available" shown

### H — Cart, Checkout, Tracking

- [ ] Add product to cart (must select variant first)
- [ ] Selecting without variant → error shown
- [ ] Cart shows correct quantity and pricing
- [ ] Increase/decrease quantity → totals update
- [ ] Remove item → disappears from cart
- [ ] Free shipping applies above ৳3,000
- [ ] Fill checkout with invalid phone → error shown
- [ ] Complete checkout → navigates to order confirmation
- [ ] Order confirmation shows correct order ID and total
- [ ] "Track this order" → tracking page loads with order pre-filled
- [ ] Change order number/phone → search shows "not found"

### I — Admin

- [ ] Navigate to `/admin` → admin overview loads
- [ ] Payment queue shows 3 submissions
- [ ] Click "Under Review" payment → detail shows
- [ ] Approve payment → status changes to Approved
- [ ] Reject payment with reason → status changes to Rejected
- [ ] All admin nav items navigate correctly
- [ ] "Seller view" button → navigates to `/seller/overview`

### J — Public Themes & Registration Gating

- [ ] Navigate to `/themes` → gallery renders 8 theme cards with tags & descriptions
- [ ] Click "Preview" on any theme → opens `/store/:slug/preview` with preview banner
- [ ] Click "Close preview" → returns to `/themes` (verifying preview memory)
- [ ] As an unregistered user, click "Use theme" → redirected to `/signup` with notification
- [ ] As an authenticated seller, click "Use theme" → theme saved and redirected to `/seller/customizer`

### K — Shipping & Logistics Workspace

- [ ] Navigate to `/seller/shipping` → interactive delivery zones render
- [ ] Change Inside Dhaka flat rate (৳60) and Outside Dhaka (৳120) → saves configuration
- [ ] Toggle COD on/off → reflected in settings
- [ ] Toggle Courier connections (Steadfast, Pathao, RedX) → status reflects active connection

### L — Business Analytics Workspace

- [ ] Navigate to `/seller/analytics` → metric cards (Revenue, Orders, AOV, Conversion) render
- [ ] Switch date filter tabs (Today, 7D, 30D, 90D) → metric values dynamically recalculate
- [ ] SVG Sales Trend chart renders with axes and gradient area
- [ ] Payment breakdown lists bKash, Nagad, COD, Card distribution
- [ ] Top products leaderboard renders ranked units sold

### M — Mobile Storefront & Navigation Drawer

- [ ] Resize viewport to mobile width (< 768px) on any of the 8 storefront themes
- [ ] Mobile header displays hamburger menu button (`#store-mobile-toggle`)
- [ ] Click hamburger button → navigation drawer opens smoothly (`#store-mobile-drawer`)
- [ ] Drawer displays store brand, nav links, category quick links, and cart summary
- [ ] Click close button or backdrop → drawer dismisses cleanly

### N — General

- [ ] Notification bell opens popover with 3 items
- [ ] Notification items navigate to correct pages
- [ ] 404 page shown for unknown routes
- [ ] "Return home" on 404 → navigates to `/`
- [ ] Page title updates correctly for each section

