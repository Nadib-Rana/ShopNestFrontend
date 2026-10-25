# ShopNest — Known Issues

> Last updated: 2026-10-26
> Distinguishes confirmed issues from suspected issues.

---

## TypeScript Errors (Confirmed — Pre-existing)

### KI-001 — `item.count` Property Missing on Nav Union Type
- **File:** `src/App.tsx` line 134
- **Error:** `Property 'count' does not exist on type '{ readonly label: "Overview"; ... }'`
- **Severity:** Medium — TypeScript error, not a runtime crash. The `count` property only exists on the "Orders" nav item. Current rendering uses `item.count &&` which is safe at runtime (undefined is falsy) but TypeScript cannot verify it.
- **Status:** Confirmed. Fix: use `'count' in item && item.count` or cast the nav type properly.

### KI-002 — `replaceAll` Not in tsconfig `lib` Target
- **Files:** `src/BillingAdmin.tsx`, `src/CustomerStorefront.tsx`, `src/SellerManagement.tsx`
- **Error:** `Property 'replaceAll' does not exist on type 'string'. Do you need to change your target library?`
- **Severity:** Low — TypeScript-only error. Vite/esbuild does not enforce tsconfig lib, and replaceAll is available in all modern browsers. The build succeeds.
- **Status:** Confirmed. Fix: add `"ES2021"` or `"ES2022"` to `compilerOptions.lib` in `tsconfig.json`.

---

## Code Quality Issues (Confirmed)

### KI-003 — Compressed Single-Line Code
- **Files:** All source files
- **Issue:** Nearly every function and component is written on a single line. This severely reduces readability and makes debugging difficult.
- **Severity:** High (maintainability) — no functional impact.
- **Status:** Confirmed. Reformatting is part of Phase 2/3.

### KI-004 — Duplicate `money()` Formatter
- **Files:** `src/App.tsx`, `src/SellerManagement.tsx`, `src/BillingAdmin.tsx`, `src/CustomerStorefront.tsx`
- **Issue:** Four separate identical definitions of `const money = (n: number) => '৳' + n.toLocaleString()`
- **Severity:** Medium — maintenance risk (inconsistency if one changes).
- **Status:** Confirmed. Fix: extract to `src/utils/format.ts` or similar.

### KI-005 — Duplicate Badge/Status Components
- **Files:** `src/App.tsx` (Status), `src/SellerManagement.tsx` (Badge), `src/BillingAdmin.tsx` (Badge)
- **Issue:** Three separate badge-style indicator components with similar purpose but different class names.
- **Severity:** Medium — maintenance risk.
- **Status:** Confirmed. Fix: extract to shared component.

### KI-006 — Duplicate Product Image Arrays
- **Files:** `src/commerceStore.ts` (productImages[]), `src/CustomerStorefront.tsx` (images[])
- **Issue:** Same Unsplash image URLs appear in both files.
- **Severity:** Low.
- **Status:** Confirmed.

---

## Incomplete Features (Confirmed)

### KI-007 — Shipping & Delivery Page Not Implemented
- **Route:** `/seller/shipping`
- **Status:** Shows "Coming Soon" (ComingSoon component).
- **Severity:** Medium.

### KI-008 — Analytics Page Not Implemented
- **Route:** `/seller/analytics`
- **Status:** Shows "Coming Soon".
- **Severity:** Medium.

### KI-009 — Store Settings Page Not Implemented
- **Route:** `/seller/settings`
- **Status:** Shows "Coming Soon".
- **Severity:** Medium.

### KI-010 — Admin Sections Are Static Data Only
- **Routes:** `/admin/sellers`, `/admin/stores`, `/admin/subscriptions`, `/admin/plans`, `/admin/themes`, `/admin/domains`, `/admin/settings`, `/admin/audit-log`
- **Status:** All show read-only static list with disabled Create button and disabled edit buttons.
- **Severity:** Medium — this is an expected prototype limitation, clearly labelled.

---

## Security Limitations (Confirmed — By Design)

### KI-011 — No Real Authentication
- **Detail:** Auth forms simulate navigation. Anyone can navigate to `/seller/overview` or `/admin/overview` directly without credentials.
- **Severity:** High — production blocker. Frontend-only authentication is not a security boundary.
- **Status:** Known. Requires Phase 8 (backend auth).

### KI-012 — No Real Tenant Isolation
- **Detail:** The "demo" store slug is hardcoded. Any visitor can access any store slug at `/store/<slug>`.
- **Severity:** High — production blocker. Requires Phase 9 (multi-tenancy).
- **Status:** Known.

### KI-013 — localStorage as Database
- **Detail:** All data (products, orders, theme config, payments) is in localStorage. Data is browser-local, clears on private mode, and is accessible to any script.
- **Severity:** High — production blocker. Requires Phase 14 (backend integration).
- **Status:** Known. Clearly documented as a prototype limitation in the UI.

---

## Build Warnings (Confirmed — Benign)

### KI-014 — Vite Native Config Warnings
- **Detail:** Two warnings about `__dirname` and JSON import without type attribute in vite.config.ts.
- **Severity:** Low — do not affect build output. Related to Figma Make plugin usage.
- **Status:** Confirmed benign. Not fixed to avoid modifying Figma Make config (see DEC-007).

---

## Suspected Issues (Not Yet Confirmed)

### KI-015 — Product Images Show Same Image for Multiple Views
- **Detail:** `ProductDetails` in CustomerStorefront.tsx renders the same `product.image` URL for the main image and both alternate/detail crops.
- **Severity:** Low — UX issue, no functional impact.
- **Status:** Suspected. Needs visual verification.

### KI-016 — AdjustDialog `Field` Component Usage
- **Detail:** In `AdjustDialog` (SellerManagement.tsx), a `Field` component is used with a `value` prop but the field component uses `defaultValue`. Changes to the text field in the dialog may not be captured correctly.
- **Severity:** Medium — could cause stock note to not be saved.
- **Status:** Suspected. Needs verification.
