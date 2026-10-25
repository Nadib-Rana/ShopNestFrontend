# ShopNest — Proposed API Contracts

> ⚠️ **ALL APIs IN THIS DOCUMENT ARE PLANNED. NONE ARE IMPLEMENTED.**
> Last updated: 2026-10-26

This document defines the proposed API boundaries for future backend integration.

---

## Base URL Convention
```
https://api.shopnest.app/v1/
```

## Authentication Header (future)
```
Authorization: Bearer <jwt_token>
```

---

## Authentication API

### POST /auth/signup
```json
// Request
{ "name": "Saif Rahman", "email": "saif@example.com", "password": "..." }
// Response 201
{ "message": "Verification code sent" }
```

### POST /auth/verify
```json
// Request
{ "email": "saif@example.com", "code": "123456" }
// Response 200
{ "token": "...", "refreshToken": "..." }
```

### POST /auth/login
```json
// Request
{ "email": "saif@example.com", "password": "..." }
// Response 200
{ "token": "...", "refreshToken": "...", "seller": { "id": "...", "name": "...", "storeSlug": "trendora" } }
```

### POST /auth/forgot-password
```json
// Request
{ "email": "saif@example.com" }
// Response 200
{ "message": "Reset link sent" }
```

---

## Store API (Seller)

### POST /stores
Create a store during onboarding.
```json
// Request
{
  "name": "Trendora Fashion",
  "slug": "trendora",
  "category": "fashion",
  "owner": "Saif Rahman",
  "phone": "+880 1XXX-XXXXXX"
}
// Response 201
{ "store": { "id": "...", "slug": "trendora", "status": "trial" } }
```

### GET /stores/:slug
Get store settings (seller-owned stores only).

### PATCH /stores/:slug
Update store settings.

---

## Product API

### GET /stores/:slug/products
```json
// Response 200
{
  "products": [
    { "id": 1, "name": "Linen Summer Shirt", "sku": "LSS-401", "price": 1850, "sale": 1650, "stock": 24, "status": "Active", ... }
  ]
}
```

### POST /stores/:slug/products
Create a product.

### PATCH /stores/:slug/products/:id
Update a product.

### DELETE /stores/:slug/products/:id
Delete a product.

---

## Order API

### GET /stores/:slug/orders
List orders for a store (seller authenticated).

### GET /stores/:slug/orders/:id
Get order detail.

### PATCH /stores/:slug/orders/:id
Update order status.

### POST /stores/:slug/orders (public)
Place an order (guest checkout).
```json
// Request
{
  "customer": "Nusrat Jahan",
  "phone": "01712345678",
  "email": "nusrat@example.com",
  "address": "Dhanmondi",
  "city": "Dhaka",
  "items": [{ "productId": 1, "variant": "Sand / M", "quantity": 1 }],
  "payment": "Cash on delivery"
}
// Response 201
{ "order": { "id": "SN-123456", "status": "Pending", "total": 1970, ... } }
```

### GET /orders/track (public)
```
GET /orders/track?id=SN-123456&phone=01712345678
```

---

## Theme Config API

### GET /stores/:slug/theme
Get the published theme configuration.

### PUT /stores/:slug/theme
Save theme configuration (seller authenticated).

---

## Subscription API

### GET /subscriptions/plans (public)
List available plans.

### POST /subscriptions/payments
Submit a manual payment.
```json
// Request
{
  "storeSlug": "trendora",
  "planId": "quarterly",
  "transactionId": "TXN8A4K29P",
  "senderPhone": "01XXX XXX 448",
  "amount": 1350,
  "paymentDate": "2025-05-24"
}
// Response 201
{ "payment": { "id": "PAY-2048", "status": "Under Review" } }
```

### GET /subscriptions/payments (seller authenticated)
List seller's payment submissions.

---

## Admin API

### GET /admin/payments
List all payment submissions (SuperAdmin only).

### PATCH /admin/payments/:id
Approve, reject, or request more info.
```json
// Request
{ "decision": "approve" | "reject" | "more", "reason": "optional message" }
// Response 200
{ "payment": { "id": "PAY-2048", "status": "Approved" } }
```

### GET /admin/sellers
List all sellers.

### PATCH /admin/sellers/:id
Suspend or activate a seller.

---

## Error Response Format (proposed)
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number must be 11 digits",
    "field": "phone"
  }
}
```
