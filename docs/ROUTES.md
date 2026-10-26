# ShopNest — Route Inventory

> Last updated: 2026-10-26
> All routes are from the actual inspected codebase.

## Routing System
Custom client-side routing using `window.history.pushState` and the `popstate` event. Implemented in `src/App.tsx` (`useRoute` hook). No routing library is used.

Route matching is done by string comparison and `startsWith` in the root `App` component.

---

## Public Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | `ShopNestHome` | Landing page with nav to login, signup, demo store, themes |
| `/themes` | `PublicThemesPage` | Public theme gallery & live preview with registration gating |
| `/login` | `AuthPage` | Login form |
| `/signup` | `AuthPage` | Registration form |
| `/forgot-password` | `AuthPage` | Password recovery form |
| `/reset-password` | `AuthPage` | New password form |
| `/verify` | `AuthPage` | 6-digit code verification form |

---

## Onboarding Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/onboarding/welcome` | `Onboarding → OnboardingIntro` | Welcome step |
| `/onboarding/business` | `Onboarding → OnboardingBusiness` | Business details form |
| `/onboarding/store` | `Onboarding → OnboardingStore` | Store address / subdomain |
| `/onboarding/theme` | `Onboarding → OnboardingTheme` | Starting theme selection |
| `/onboarding/branding` | `Onboarding → OnboardingBrand` | Logo upload, brand color, tagline |
| `/onboarding/complete` | `Onboarding → OnboardingComplete` | Review and launch |

---

## Seller Dashboard Routes

All seller routes render within the `App` component with the sidebar layout.

| Path | Component | Description |
|------|-----------|-------------|
| `/seller/overview` | `Overview` | Dashboard: metrics, sales chart, orders |
| `/seller/products` | `SellerManagement` | Product list with search and filter |
| `/seller/products/new` | `SellerManagement → ProductForm` | New product form |
| `/seller/products/edit` | `SellerManagement → ProductForm` | Edit product form (loads products[0] as mock) |
| `/seller/products/:id` | `SellerManagement → ProductDetails` | Product detail view |
| `/seller/categories` | `SellerManagement → Categories` | Category list with CRUD |
| `/seller/inventory` | `SellerManagement → Inventory` | Stock levels and adjustment |
| `/seller/orders` | `SellerManagement → Orders` | Order list with filter and export |
| `/seller/orders/:id` | `SellerManagement → OrderDetails` | Order detail with status update |
| `/seller/customers` | `SellerManagement → Customers` | Customer list |
| `/seller/customers/:id` | `SellerManagement → CustomerDetails` | Customer detail with order history |
| `/seller/storefront` | `Storefront` | Storefront overview with publish |
| `/seller/themes` | `ThemeStudio` (gallery mode) | Theme gallery |
| `/seller/customizer` | `ThemeStudio` (customizer mode) | Live theme customizer (locked to active store theme) |
| `/seller/shipping` | `ShippingPage` | Interactive shipping zones (Inside/Outside Dhaka) & courier status (Steadfast, Pathao, RedX) |
| `/seller/subscription` | `SellerBilling` | Subscription plans |
| `/seller/subscription/pay` | `SellerBilling` | Manual payment form |
| `/seller/subscription/review` | `SellerBilling` | Payment review step |
| `/seller/subscription/confirmation` | `SellerBilling` | Submission confirmed |
| `/seller/subscription/history` | `SellerBilling` | Payment history list |
| `/seller/subscription/PAY-xxxx` | `SellerBilling` | Individual payment detail |
| `/seller/analytics` | `AnalyticsPage` | Sales performance, gross revenue, order volume, AOV, top products, payment breakdown |
| `/seller/settings` | `ComingSoon` | Store settings (scheduled for Phase 7) |

---

## Customer Storefront Routes

All storefront routes are handled by `CustomerStorefront`. The `slug` identifies the store.

| Path | Component | Description |
|------|-----------|-------------|
| `/store/:slug` | `Home` | Store homepage with hero and products |
| `/store/:slug/products` | `Catalog` | All products with filter/sort |
| `/store/:slug/products/:id` | `ProductDetail` | Product detail with variant selector |
| `/store/:slug/search` | `Catalog` | Search results |
| `/store/:slug/categories/:category` | `Catalog` | Filtered by category |
| `/store/:slug/cart` | `Cart` | Shopping cart |
| `/store/:slug/checkout` | `Checkout` | Delivery details + payment method |
| `/store/:slug/order-confirmation/:id` | `Confirmation` | Order confirmed |
| `/store/:slug/track-order` | `Tracking` | Order tracking by ID + phone |
| `/store/:slug/about` | `Policy` | About page |
| `/store/:slug/contact` | `Policy` | Contact page |
| `/store/:slug/shipping-policy` | `Policy` | Shipping policy |
| `/store/:slug/returns` | `Policy` | Returns and refunds |
| `/store/:slug/privacy` | `Policy` | Privacy policy |
| `/store/:slug/terms` | `Policy` | Terms and conditions |
| `/store/:slug/preview` | `CustomerStorefront` | Theme preview mode (adds preview banner) |

**Known store slugs:**
| Slug | Theme | Store name |
|------|-------|------------|
| `demo` | fashion | Trendora (uses customized theme config) |
| `solecraft` | shoes | SoleCraft |
| `nova` | electronics | NOVA |
| `bloom` | beauty | Bloom |
| `dailybasket` | grocery | DailyBasket |
| `haven` | decor | Haven |
| `form` | furniture | FORM |
| `market` | retail | Nest Market |

---

## Super Admin Routes

All admin routes are handled by `AdminApp`.

| Path | Component | Description |
|------|-----------|-------------|
| `/admin` | `AdminApp → AdminOverview` | Platform overview |
| `/admin/overview` | `AdminApp → AdminOverview` | Overview with metrics and charts |
| `/admin/payments` | `AdminApp → AdminPayments` | Payment verification queue |
| `/admin/payments/:id` | `AdminApp → AdminPayments` | Payment detail with approve/reject |
| `/admin/sellers` | `AdminApp → AdminSection` | Static seller list |
| `/admin/stores` | `AdminApp → AdminSection` | Static store list |
| `/admin/subscriptions` | `AdminApp → AdminSection` | Static subscription list |
| `/admin/plans` | `AdminApp → AdminSection` | Static plan list |
| `/admin/themes` | `AdminApp → AdminSection` | Static theme list |
| `/admin/domains` | `AdminApp → AdminSection` | Static domain list |
| `/admin/settings` | `AdminApp → AdminSection` | Static platform settings |
| `/admin/audit-log` | `AdminApp → AdminSection` | Static audit log |

---

## Not Found
Any unrecognized path renders `NotFound` with a 404 message and home button.
