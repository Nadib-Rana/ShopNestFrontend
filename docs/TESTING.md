# ShopNest — Testing

> Last updated: 2026-10-26

## Automated Tests
**None exist.** The project has no testing framework installed.

**Recommendation:** Add Vitest in Phase 6 for unit tests of utility functions and repository functions.

---

## Available Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server on port 8443 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npx tsc --noEmit` | Type-check without building |

---

## Baseline Results (2026-10-26 — Before Refactoring)

| Check | Result |
|-------|--------|
| `npm run build` | ✅ Success (387ms) |
| `npx tsc --noEmit` | ⚠️ 14 pre-existing errors |
| Automated tests | ❌ None exist |

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

### J — General

- [ ] Notification bell opens popover with 3 items
- [ ] Notification items navigate to correct pages
- [ ] 404 page shown for unknown routes
- [ ] "Return home" on 404 → navigates to `/`
- [ ] Page title updates correctly for each section
