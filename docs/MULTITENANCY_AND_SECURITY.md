# ShopNest — Multi-Tenancy and Security

> Last updated: 2026-10-26

## ⚠️ IMPORTANT: Frontend Cannot Enforce Security

**The current ShopNest codebase is a frontend-only prototype. It has no backend, no server-side authentication, no database, and no tenant isolation at the data layer. All claims of "security" or "isolation" in this document refer to future backend requirements, not current capabilities.**

---

## Current Security State (Prototype)

| Concern | Current State |
|---------|--------------|
| Authentication | None — anyone can navigate to `/seller/overview` or `/admin` |
| Authorization | None — route guards are frontend-only and trivially bypassed |
| Tenant isolation | None — all stores share the same localStorage |
| Payment security | None — payment submission is frontend simulation only |
| Session management | None |
| Data encryption | None |
| Input sanitization | Minimal — FormData read as strings |

---

## Future Backend Requirements

### Tenant Identification
- Each store must be identified by a unique subdomain (`trendora.shopnest.app`) or store slug
- Tenant ID must be derived server-side, not from user input
- All API requests must include tenant context in authenticated headers or session

### Store Ownership
- A seller can only manage stores they created
- Server must verify store ownership on every authenticated request
- A seller must not be able to read or write another seller's products, orders, or settings

### Server-Side Authorization
Every API endpoint must verify:
1. The request carries a valid session or token
2. The authenticated user has the required role for the action
3. The resource being accessed belongs to the authenticated tenant

### Data Isolation
- Products, categories, orders, customers, and theme config must be scoped per store in the database
- SQL queries must include `WHERE store_id = ?` or equivalent
- Cross-tenant data leakage must be prevented at the query layer

### Role-Based Permissions

| Role | Permissions |
|------|------------|
| SuperAdmin | Read/write all resources, approve payments, manage plans/themes/domains |
| SellerOwner | Read/write their own store, products, orders, customers, theme, subscription |
| Customer (guest) | Browse public storefront, create orders, track own orders by ID+phone |

### Authentication
- Password hashing: bcrypt with appropriate work factor
- Token: JWT with short expiry + refresh token, or server-side sessions
- Email verification: server-generated codes, not frontend-simulated
- Password reset: time-limited server-generated tokens

### Subscription Entitlement Checks
- Store access must be gated by a valid, active subscription
- Subscription status must be checked server-side on every seller API request
- Expired subscriptions must restrict access at the API layer, not just the frontend
- Frontend "expiry" notices are UX only — the backend enforces access

### Payment Verification
- Manual payment submission must create a server-side record
- Admin approval must update subscription status in the database
- No subscription must be activated without explicit admin approval
- Transaction IDs must be deduplicated server-side
- Approved payments must only be set by SuperAdmin role

### Domain Verification
- Custom domain configuration must be verified by the server (DNS records)
- Subdomain routing must be handled by the server, not the frontend
- SSL certificates for custom domains require server-side provisioning

### Audit Logging
- All admin actions (approve/reject payment, suspend store) must be logged server-side
- Log entries must be immutable
- Logs must include timestamp, actor, action, and affected resource

### Sensitive Data Handling
- Seller phone numbers and email addresses must not be exposed to other tenants
- Customer delivery addresses must only be accessible to the store that received the order
- Payment transaction IDs must only be visible to the submitting seller and platform admins

---

## What Frontend Route Guards Can and Cannot Do

**Can do:**
- Redirect unauthenticated users to the login page (UX improvement)
- Show/hide UI elements based on role (UX improvement)
- Prevent accidental navigation to the wrong area

**Cannot do:**
- Prevent a determined user from accessing any route by modifying the URL
- Enforce data access control
- Validate payment information
- Provide real isolation between tenants

All actual security enforcement must happen at the API/server layer.
