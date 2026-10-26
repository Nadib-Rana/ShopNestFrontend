# ShopNest — Complete NestJS Backend Architecture & Implementation Blueprint

> **Target Framework:** NestJS (v11+) with TypeScript  
> **Database:** PostgreSQL (with Prisma ORM or TypeORM)  
> **Cache & Queues:** Redis & BullMQ  
> **Audience:** Backend Engineers implementing the ShopNest SaaS server  
> **Status:** Production-Ready Architectural Blueprint  
> **Last updated:** 2026-10-26

---

## 1. Executive Architecture Overview

ShopNest is a multi-tenant e-commerce SaaS platform tailored for Bangladeshi e-commerce merchants and international storefronts. The frontend is built in React 19 + Vite and currently runs client-side with typed `localStorage` repositories.

This document serves as the **authoritative step-by-step master specification** for constructing the production NestJS backend so that the React frontend can seamlessly migrate from `localStorage` adapters to RESTful APIs.

```
                    ┌────────────────────────────────────────────────────────┐
                    │                   Cloudflare DNS / Edge                 │
                    │   shopnest.app | *.shopnest.app | custombrand.com.bd   │
                    └───────────────────────────┬────────────────────────────┘
                                                │ (HTTPS)
                                                ▼
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    NestJS API Gateway                                      │
│                                                                                            │
│   ├── TenantInterceptor (Subdomain / Custom Domain Resolution)                             │
│   ├── JwtAuthGuard & RolesGuard (RBAC: Super Admin, Seller Owner, Seller Staff, Customer)   │
│   ├── RateLimiter (Throttler for /auth, /checkout, /track-order)                           │
│   └── GlobalValidationPipe (class-validator DTO validation)                                │
└───────────────────────────┬────────────────────────────────────┬───────────────────────────┘
                            │                                    │
               ┌────────────▼───────────┐           ┌────────────▼───────────┐
               │  Core Feature Modules  │           │ Background & Services  │
               │                        │           │                        │
               │  • Auth & Onboarding   │           │  • BullMQ Task Queue   │
               │  • Tenants & Domains   │           │    - SMS Notifications │
               │  • Storefront Public   │           │    - Courier Sync      │
               │  • Catalog & Inventory │           │    - Email Receipts    │
               │  • Orders & Tracking   │           │  • S3 / Cloudinary     │
               │  • Shipping & Couriers │           │  • Payment Webhooks    │
               │  • Billing & Manual Tx │           └────────────┬───────────┘
               │  • Settings & Danger   │                        │
               │  • Super Admin Queue   │                        │
               └────────────┬───────────┘                        │
                            │                                    │
                            ▼                                    ▼
       ┌────────────────────────────────────────┐   ┌────────────────────────────┐
       │     PostgreSQL Database (Prisma)       │   │    Redis Cache & Queue     │
       │  (Row-Level Security / tenant_id key)  │   │  (Sessions, BullMQ, Rate)  │
       └────────────────────────────────────────┘   └────────────────────────────┘
```

---

## 2. Multi-Tenancy Architecture (Shared Database with Discriminator)

For cost-efficiency, high scalability, and seamless cross-tenant super-admin queries, ShopNest uses a **Shared Database with Tenant Discriminator (`store_id` / `tenant_id`)**.

### 2.1 Tenant Resolution Pipeline

1. **Incoming Request Identification:**
   - **Storefront requests:** Identified via Host header:
     - Subdomain: `trendora.shopnest.app` -> slug `trendora`.
     - Custom domain: `shop.trendorabd.com` -> mapped via `DomainMapping` table.
     - Path parameter fallback (dev mode): `/store/:slug`.
   - **Seller Dashboard requests:** Identified via JWT token payload (`req.user.storeId`) or explicit header `X-Store-ID`.
   - **Super Admin requests:** Bypasses tenant filtering (can inspect all stores).

2. **AsyncLocalStorage Tenant Context:**
   NestJS utilizes Node.js `AsyncLocalStorage` via a custom `TenantMiddleware` to store the active `storeId`.

```typescript
// src/common/tenant/tenant.context.ts
import { AsyncLocalStorage } from "async_hooks";

export interface TenantContext {
  storeId: string;
  storeSlug: string;
}

export const tenantStorage = new AsyncLocalStorage<TenantContext>();

export function getActiveStoreId(): string | undefined {
  return tenantStorage.getStore()?.storeId;
}
```

3. **Prisma Client Multi-Tenant Extension:**
   All queries on tenant-scoped models (`Product`, `Order`, `Category`, `ShippingRule`, `StoreSettings`) automatically inject `{ where: { storeId } }` on find, and `{ data: { storeId } }` on create:

```typescript
// src/database/prisma-tenant.extension.ts
import { Prisma } from '@prisma/client';
import { getActiveStoreId } from '../common/tenant/tenant.context';

export const tenantExtension = Prisma.defineExtension((client) => {
  return client.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const storeId = getActiveStoreId();
          const tenantModels = ['Product', 'Category', 'Order', 'Customer', 'ShippingRule', 'StoreSettings'];

          if (storeId && tenantModels.includes(model)) {
            if (['findUnique', 'findFirst', 'findMany', 'count'].includes(operation)) {
              args.where = { ...args.where, storeId };
            }
            if (['create', 'createMany'].includes(operation)) {
              if (args.data) args.data.storeId = storeId;
            }
          }
          return query(args);
        },
      },
    },
  });
});
```

---

## 3. Complete Database Schema (Prisma Schema Reference)

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------
// USER & AUTHENTICATION
// -------------------------------------------------------------

enum UserRole {
  SUPER_ADMIN
  SELLER_OWNER
  SELLER_STAFF
  CUSTOMER
}

model User {
  id               String            @id @default(uuid())
  email            String            @unique
  passwordHash     String
  name             String
  phone            String?
  role             UserRole          @default(SELLER_OWNER)
  isVerified       Boolean           @default(false)
  verificationCode String?
  verificationExpiry DateTime?
  resetToken       String?
  resetTokenExpiry DateTime?
  storeId          String?
  store            Store?            @relation(fields: [storeId], references: [id])
  createdAt        DateTime          @default(now())
  updatedAt        DateTime          @updatedAt

  paymentsReviewed SubscriptionPayment[] @relation("AdminReviewer")
}

// -------------------------------------------------------------
// STORE & TENANT IDENTITY
// -------------------------------------------------------------

enum StoreStatus {
  TRIAL
  ACTIVE
  RESTRICTED
  SUSPENDED
  MAINTENANCE
}

model Store {
  id              String         @id @default(uuid())
  name            String
  slug            String         @unique // e.g. "trendora"
  customDomain    String?        @unique // e.g. "trendorabd.com"
  status          StoreStatus    @default(TRIAL)
  trialStartsAt   DateTime       @default(now())
  trialEndsAt     DateTime
  category        String         // Fashion, Shoes, Electronics, etc.
  
  users           User[]
  settings        StoreSettings?
  themeConfig     ThemeConfig?
  products        Product[]
  categories      Category[]
  orders          Order[]
  customers       Customer[]
  shippingRules   ShippingRule[]
  courierAccounts CourierAccount[]
  subscriptions   SubscriptionPayment[]

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}

// -------------------------------------------------------------
// STORE SETTINGS & BUSINESS DETAILS
// -------------------------------------------------------------

model StoreSettings {
  id                     String   @id @default(uuid())
  storeId                String   @unique
  store                  Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  legalBusinessName      String?
  tagline                String?
  supportEmail           String
  phone                  String
  businessAddress        String?
  city                   String   @default("Dhaka")
  postalCode             String?
  tradeLicenseNumber     String?
  tinNumber              String?
  
  currency               String   @default("BDT (৳)")
  timezone               String   @default("Asia/Dhaka (GMT+6)")
  defaultLanguage        String   @default("en") // "en" | "bn"
  
  whatsappNumber         String?
  facebookUrl            String?
  instagramHandle        String?
  
  allowGuestCheckout     Boolean  @default(true)
  requirePhoneVerification Boolean @default(true)
  smsOrderNotification   Boolean  @default(true)
  emailOrderNotification Boolean  @default(true)
  lowStockAlert          Boolean  @default(true)
  lowStockThreshold      Int      @default(5)
  
  maintenanceMode        Boolean  @default(false)
  maintenanceMessage     String?  @default("We are updating our store. Please check back shortly!")

  createdAt              DateTime @default(now())
  updatedAt              DateTime @updatedAt
}

// -------------------------------------------------------------
// THEME & CUSTOMIZATION ENGINE
// -------------------------------------------------------------

model ThemeConfig {
  id                    String   @id @default(uuid())
  storeId               String   @unique
  store                 Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  activeThemeId         String   @default("fashion") // fashion, shoes, electronics, beauty, grocery, decor, furniture, retail
  primaryColor          String   @default("#171717")
  secondaryColor        String   @default("#f5f5f5")
  backgroundColor       String   @default("#ffffff")
  textColor             String   @default("#111827")
  accentColor           String?
  
  fontHeading           String   @default("Syne")
  fontBody              String   @default("Inter")
  
  heroTitle             String?
  heroDescription       String?
  heroCtaText           String?  @default("Shop Collection")
  heroImageUrl          String?
  
  showCategories        Boolean  @default(true)
  showPromoBanner       Boolean  @default(true)
  showTestimonials      Boolean  @default(true)
  showNewsletter        Boolean  @default(true)
  
  productGridColumns    Int      @default(4)
  headerStyle           String   @default("Split") // "Centered" | "Compact" | "Split"
  footerStyle           String   @default("Expanded") // "Expanded" | "Minimal"
  
  // Theme-specific properties
  fashionBadge          String?
  fashionPromoTitle     String?
  shoesDropTag          String?
  shoesTechNote         String?
  shoesShowPerformance Boolean  @default(true)
  electronicsWarranty   String?
  electronicsSpecHighlight String?
  beautyRoutineTitle    String?
  groceryDeliveryArea   String?
  groceryOfferTag       String?
  decorRoomFocus        String?
  furnitureSubtitle     String?
  retailDealHighlight   String?

  publishedAt           DateTime?
  updatedAt             DateTime @updatedAt
}

// -------------------------------------------------------------
// CATALOG: PRODUCTS, CATEGORIES, INVENTORY
// -------------------------------------------------------------

model Category {
  id          String     @id @default(uuid())
  storeId     String
  store       Store      @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  name        String
  slug        String
  description String?
  imageUrl    String?
  parentId    String?
  parent      Category?  @relation("SubCategories", fields: [parentId], references: [id])
  children    Category[] @relation("SubCategories")
  products    Product[]

  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@unique([storeId, slug])
}

enum ProductStatus {
  ACTIVE
  DRAFT
  ARCHIVED
}

model Product {
  id             String          @id @default(uuid())
  storeId        String
  store          Store           @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  name           String
  slug           String
  sku            String
  description    String?
  price          Decimal         @db.Decimal(12, 2)
  salePrice      Decimal?        @db.Decimal(12, 2)
  stockQuantity  Int             @default(0)
  status         ProductStatus   @default(ACTIVE)
  
  color          String?
  sizes          String[]        @default([])
  images         String[]        @default([])
  
  categoryId     String?
  category       Category?       @relation(fields: [categoryId], references: [id], onDelete: SetNull)
  variants       ProductVariant[]
  orderItems     OrderItem[]

  createdAt      DateTime        @default(now())
  updatedAt      DateTime        @updatedAt

  @@unique([storeId, sku])
  @@unique([storeId, slug])
}

model ProductVariant {
  id             String   @id @default(uuid())
  productId      String
  product        Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  sku            String
  name           String   // e.g. "Large / Midnight Navy"
  size           String?
  color          String?
  priceOverride  Decimal? @db.Decimal(12, 2)
  stockQuantity  Int      @default(0)
  
  orderItems     OrderItem[]

  @@unique([productId, sku])
}

// -------------------------------------------------------------
// ORDERS, CHECKOUT & CUSTOMERS
// -------------------------------------------------------------

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
}

enum PaymentMethod {
  COD
  BKASH
  NAGAD
  CARD
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
}

model Customer {
  id           String    @id @default(uuid())
  storeId      String
  store        Store     @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  name         String
  phone        String
  email        String?
  address      String?
  city         String?
  ordersCount  Int       @default(0)
  totalSpent   Decimal   @default(0) @db.Decimal(14, 2)

  orders       Order[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt

  @@unique([storeId, phone])
}

model Order {
  id               String        @id @default(uuid())
  orderNumber      String        // e.g. "#SN-1048"
  storeId          String
  store            Store         @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  customerId       String?
  customer         Customer?     @relation(fields: [customerId], references: [id], onDelete: SetNull)
  
  customerName     String
  customerPhone    String
  customerEmail    String?
  deliveryAddress  String
  city             String
  area             String?
  deliveryNotes    String?
  
  items            OrderItem[]
  subtotal         Decimal       @db.Decimal(12, 2)
  shippingCost     Decimal       @db.Decimal(12, 2)
  discount         Decimal       @default(0) @db.Decimal(12, 2)
  total            Decimal       @db.Decimal(12, 2)
  
  paymentMethod    PaymentMethod @default(COD)
  paymentStatus    PaymentStatus @default(UNPAID)
  orderStatus      OrderStatus   @default(PENDING)
  
  courierProvider  String?       // "Steadfast" | "Pathao" | "RedX"
  courierTrackingId String?
  consignmentId    String?

  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@unique([storeId, orderNumber])
}

model OrderItem {
  id               String          @id @default(uuid())
  orderId          String
  order            Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId        String?
  product          Product?        @relation(fields: [productId], references: [id], onDelete: SetNull)
  variantId        String?
  variant          ProductVariant? @relation(fields: [variantId], references: [id], onDelete: SetNull)
  
  productName      String
  variantName      String?
  unitPrice        Decimal         @db.Decimal(12, 2)
  quantity         Int
  totalPrice       Decimal         @db.Decimal(12, 2)
}

// -------------------------------------------------------------
// SHIPPING, RATES & COURIER LOGISTICS
// -------------------------------------------------------------

model ShippingRule {
  id               String   @id @default(uuid())
  storeId          String
  store            Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  name             String
  zone             String   // "Inside Dhaka" | "Outside Dhaka" | "Sub-Dhaka"
  rate             Decimal  @db.Decimal(10, 2)
  estimatedDays    String
  conditionType    String   // "all" | "min_price" | "weight"
  minOrderValue    Decimal? @db.Decimal(10, 2)
  enabled          Boolean  @default(true)

  createdAt        DateTime @default(now())
}

model CourierAccount {
  id               String   @id @default(uuid())
  storeId          String
  store            Store    @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  provider         String   // "STEADFAST" | "PATHAO" | "REDX"
  apiKey           String
  apiSecret        String?
  merchantCode     String?
  isLiveSync       Boolean  @default(true)
  isDefault        Boolean  @default(false)
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt

  @@unique([storeId, provider])
}

// -------------------------------------------------------------
// SUBSCRIPTIONS & MANUAL PAYMENT VERIFICATION
// -------------------------------------------------------------

enum SubscriptionStatus {
  UNDER_REVIEW
  APPROVED
  REJECTED
  REQUIRES_MORE_INFO
}

model SubscriptionPayment {
  id               String             @id @default(uuid())
  referenceId      String             @unique // e.g. "PAY-2048"
  storeId          String
  store            Store              @relation(fields: [storeId], references: [id], onDelete: Cascade)
  
  planId           String             // "monthly" | "quarterly" | "yearly"
  planName         String
  amount           Decimal            @db.Decimal(10, 2)
  periodDays       Int                // 30, 90, 365
  
  provider         String             // "bKash" | "Nagad" | "Bank Transfer"
  transactionId    String             @unique
  senderPhone      String
  paymentDate      DateTime
  
  status           SubscriptionStatus @default(UNDER_REVIEW)
  rejectionReason  String?
  reviewerId       String?
  reviewer         User?              @relation("AdminReviewer", fields: [reviewerId], references: [id])
  reviewedAt       DateTime?

  createdAt        DateTime           @default(now())
  updatedAt        DateTime           @updatedAt
}

// -------------------------------------------------------------
// AUDIT LOG
// -------------------------------------------------------------

model AuditLog {
  id          String   @id @default(uuid())
  actorId     String
  actorEmail  String
  storeId     String?
  action      String   // e.g. "PAYMENT_APPROVED", "THEME_PUBLISHED", "PRODUCT_DELETED"
  entity      String   // "Order", "Product", "Payment"
  entityId    String
  metadata    Json?
  timestamp   DateTime @default(now())
}
```

---

## 4. NestJS Application Modular Directory Structure

```
shopnest-backend/
├── prisma/
│   ├── schema.prisma                  # Prisma schema above
│   ├── migrations/                    # Automated database migrations
│   └── seed.ts                        # Seed data (Trendora, NOVA, SoleCraft, admin)
│
├── src/
│   ├── main.ts                        # Application bootstrap, Swagger, Pipes, CORS
│   ├── app.module.ts                  # Root module importing all feature modules
│   │
│   ├── common/                        # Shared cross-cutting concerns
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   ├── tenant.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   ├── filters/
│   │   │   ├── all-exceptions.filter.ts
│   │   │   └── prisma-exception.filter.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── tenant.guard.ts
│   │   ├── interceptors/
│   │   │   ├── transform-response.interceptor.ts
│   │   │   ├── logging.interceptor.ts
│   │   │   └── tenant-resolver.interceptor.ts
│   │   ├── middleware/
│   │   │   └── tenant.middleware.ts
│   │   └── tenant/
│   │       └── tenant.context.ts
│   │
│   ├── config/                        # Environment config & Joi validation
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── courier.config.ts
│   │
│   ├── database/                      # Prisma service & multi-tenant extension
│   │   ├── prisma.service.ts
│   │   └── prisma-tenant.extension.ts
│   │
│   └── modules/                       # Domain feature modules
│       ├── auth/                      # Authentication & 6-digit verification
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── auth.module.ts
│       │   ├── dto/
│       │   │   ├── signup.dto.ts
│       │   │   ├── verify-code.dto.ts
│       │   │   ├── login.dto.ts
│       │   │   └── forgot-password.dto.ts
│       │   └── strategies/
│       │       ├── jwt.strategy.ts
│       │       └── refresh-token.strategy.ts
│       │
│       ├── tenants/                   # Subdomain & Custom domain routing
│       │   ├── tenants.controller.ts
│       │   ├── tenants.service.ts
│       │   └── tenants.module.ts
│       │
│       ├── stores/                    # Store creation & onboarding
│       │   ├── stores.controller.ts
│       │   ├── stores.service.ts
│       │   └── stores.module.ts
│       │
│       ├── store-settings/            # Store settings workspace API
│       │   ├── store-settings.controller.ts
│       │   ├── store-settings.service.ts
│       │   └── dto/update-settings.dto.ts
│       │
│       ├── themes/                    # 8 themes configuration & live studio
│       │   ├── themes.controller.ts
│       │   ├── themes.service.ts
│       │   └── dto/update-theme.dto.ts
│       │
│       ├── catalog/                   # Products, Categories, Stock adjustments
│       │   ├── products/
│       │   ├── categories/
│       │   └── inventory/
│       │
│       ├── orders/                    # Order placement, status updates, CSV
│       │   ├── orders.controller.ts
│       │   ├── orders.service.ts
│       │   └── dto/
│       │       ├── create-order.dto.ts
│       │       └── update-status.dto.ts
│       │
│       ├── customers/                 # Customer profiles & order histories
│       │   ├── customers.controller.ts
│       │   └── customers.service.ts
│       │
│       ├── shipping/                  # Zones, flat rates, and pickup rules
│       │   ├── shipping.controller.ts
│       │   └── shipping.service.ts
│       │
│       ├── couriers/                  # Steadfast, Pathao, RedX API adapters
│       │   ├── couriers.controller.ts
│       │   ├── couriers.service.ts
│       │   ├── adapters/
│       │   │   ├── steadfast.adapter.ts
│       │   │   ├── pathao.adapter.ts
│       │   │   └── redx.adapter.ts
│       │   └── webhooks/
│       │       └── courier-webhook.controller.ts
│       │
│       ├── billing/                   # Subscription plans & manual verification
│       │   ├── billing.controller.ts
│       │   ├── billing.service.ts
│       │   └── dto/submit-payment.dto.ts
│       │
│       ├── analytics/                 # KPIs, sales charts, AOV, top products
│       │   ├── analytics.controller.ts
│       │   └── analytics.service.ts
│       │
│       ├── admin/                     # Super Admin queue & approval actions
│       │   ├── admin.controller.ts
│       │   ├── admin.service.ts
│       │   └── dto/decision-payment.dto.ts
│       │
│       └── notifications/             # SMS (Greenweb/SSL) & Email (Resend)
│           ├── sms.service.ts
│           └── email.service.ts
│
├── test/                             # E2E test suites (Supertest)
├── docker-compose.yml                 # Local Postgres, Redis, PgAdmin
├── Dockerfile                         # Production multi-stage Docker build
└── package.json
```

---

## 5. Complete API Route Catalogue

### 5.1 Authentication (`/v1/auth`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/v1/auth/signup` | Register new seller account & dispatch 6-digit code | Public |
| `POST` | `/v1/auth/verify` | Verify 6-digit code; returns JWT tokens | Public |
| `POST` | `/v1/auth/login` | Authenticate seller or super admin | Public |
| `POST` | `/v1/auth/refresh` | Refresh expired access token | Public |
| `POST` | `/v1/auth/forgot-password` | Request password reset email | Public |
| `POST` | `/v1/auth/reset-password` | Reset password using verified token | Public |
| `GET` | `/v1/auth/me` | Fetch authenticated user profile and store details | Bearer JWT |

### 5.2 Public Storefront (`/v1/storefront/:slug`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/v1/storefront/:slug` | Store metadata, theme config, hero content | Public |
| `GET` | `/v1/storefront/:slug/products` | Paginated product list with search, category, price filter | Public |
| `GET` | `/v1/storefront/:slug/products/:productId` | Product detail view with active variants and stock | Public |
| `GET` | `/v1/storefront/:slug/categories` | Store product categories | Public |
| `GET` | `/v1/storefront/:slug/shipping-rates` | Active shipping rates calculated by delivery area | Public |
| `POST` | `/v1/storefront/:slug/checkout` | Place order (supports guest checkout and Bangladeshi phone) | Public |
| `GET` | `/v1/storefront/:slug/orders/:orderId/track` | Track order by order number + customer phone | Public |

### 5.3 Public Themes Marketplace (`/v1/themes`)

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/v1/themes` | List all 8 official store themes with meta & presets | Public |
| `GET` | `/v1/themes/:themeId` | Detailed theme preset metadata and color schemes | Public |

### 5.4 Seller Dashboard Management (`/v1/seller`)

*All routes require `Bearer <jwt_token>` and `RolesGuard(SELLER_OWNER, SELLER_STAFF)`.*

#### Products & Catalog
- `GET /v1/seller/products` — List store products with pagination & search
- `POST /v1/seller/products` — Create new product with variants & images
- `GET /v1/seller/products/:id` — Get product detail
- `PATCH /v1/seller/products/:id` — Update product details
- `DELETE /v1/seller/products/:id` — Delete product
- `POST /v1/seller/products/bulk-status` — Bulk activate / deactivate
- `POST /v1/seller/products/bulk-delete` — Bulk delete products

#### Categories & Inventory
- `GET /v1/seller/categories` — List store categories
- `POST /v1/seller/categories` — Create category
- `DELETE /v1/seller/categories/:id` — Delete category
- `GET /v1/seller/inventory` — Stock levels across all SKUs
- `PATCH /v1/seller/inventory/adjust` — Adjust stock quantity for SKU

#### Orders & Customers
- `GET /v1/seller/orders` — Filterable order list (status tabs, search, pagination)
- `GET /v1/seller/orders/:id` — Detailed order view with items & status timeline
- `PATCH /v1/seller/orders/:id/status` — Update order status (Pending → Shipped → Delivered)
- `POST /v1/seller/orders/:id/courier-book` — Dispatch to Steadfast / Pathao
- `GET /v1/seller/orders/export-csv` — Stream CSV download of filtered orders
- `GET /v1/seller/customers` — List store customers with purchase metrics
- `GET /v1/seller/customers/:id` — Customer detail with order history

#### Storefront & Theme Studio
- `GET /v1/seller/theme-config` — Get active theme configuration
- `PATCH /v1/seller/theme-config` — Update draft theme settings (colors, hero, layout)
- `POST /v1/seller/theme-config/publish` — Publish draft theme to live storefront
- `POST /v1/seller/theme-config/switch` — Switch active store theme preset

#### Shipping & Logistics
- `GET /v1/seller/shipping` — Get shipping zones, rates, and courier status
- `PUT /v1/seller/shipping` — Save shipping rates (Inside/Outside Dhaka, thresholds)
- `POST /v1/seller/shipping/rules` — Create custom shipping rule
- `DELETE /v1/seller/shipping/rules/:id` — Delete shipping rule
- `PUT /v1/seller/shipping/couriers` — Save courier API credentials (Steadfast/Pathao)

#### Store Settings
- `GET /v1/seller/settings` — Get store settings (profile, legal, alerts, maintenance)
- `PUT /v1/seller/settings` — Save updated store settings
- `POST /v1/seller/settings/reset` — Reset settings to initial defaults

#### Subscription Billing
- `GET /v1/seller/subscription` — Current subscription status, trial expiry, available plans
- `POST /v1/seller/subscription/submit-payment` — Submit manual transaction ID & payment details
- `GET /v1/seller/subscription/history` — List seller's past payment submissions
- `GET /v1/seller/subscription/:paymentId` — View status of specific payment submission

#### Analytics
- `GET /v1/seller/analytics?range=7d|30d|90d|year` — Revenue KPIs, AOV, sales charts, payment channels, and top product rankings

### 5.5 Super Admin Platform (`/v1/admin`)

*All routes require `Bearer <jwt_token>` and `RolesGuard(SUPER_ADMIN)`.*

- `GET /v1/admin/overview` — Platform metrics (registered sellers, active stores, revenue)
- `GET /v1/admin/payments` — Filterable manual payment verification queue
- `GET /v1/admin/payments/:id` — Payment verification record
- `POST /v1/admin/payments/:id/decision` — Approve or reject payment with reason (activates subscription)
- `GET /v1/admin/sellers` — Complete seller directory
- `GET /v1/admin/stores` — All merchant stores with status
- `PATCH /v1/admin/stores/:id/status` — Suspend or reactivate store
- `GET /v1/admin/audit-log` — Platform audit trail

---

## 6. Courier Integrations (Bangladesh Logistics)

### 6.1 Steadfast Courier API Implementation Pattern

```typescript
// src/modules/couriers/adapters/steadfast.adapter.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SteadfastAdapter {
  private readonly baseUrl = 'https://portal.steadfast.com.bd/api/v1';

  async createOrder(credentials: { apiKey: string; apiSecret: string }, payload: {
    invoice: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    codAmount: number;
    note?: string;
  }) {
    try {
      const response = await axios.post(`${this.baseUrl}/create_order`, {
        invoice: payload.invoice,
        recipient_name: payload.recipientName,
        recipient_phone: payload.recipientPhone,
        recipient_address: payload.recipientAddress,
        cod_amount: payload.codAmount,
        note: payload.note || 'ShopNest Order',
      }, {
        headers: {
          'Api-Key': credentials.apiKey,
          'Secret-Key': credentials.apiSecret,
          'Content-Type': 'application/json',
        },
      });

      return {
        consignmentId: response.data.consignment.consignment_id,
        trackingCode: response.data.consignment.tracking_code,
        status: response.data.consignment.status,
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.message || 'Failed to create Steadfast parcel',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async trackParcel(credentials: { apiKey: string; apiSecret: string }, trackingCode: string) {
    const response = await axios.get(`${this.baseUrl}/status_by_trackingcode/${trackingCode}`, {
      headers: {
        'Api-Key': credentials.apiKey,
        'Secret-Key': credentials.apiSecret,
      },
    });
    return response.data;
  }
}
```

### 6.2 Pathao Courier API Integration Pattern

```typescript
// src/modules/couriers/adapters/pathao.adapter.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PathaoAdapter {
  private readonly baseUrl = 'https://api-hermes.pathao.com/aladdin/api/v1';

  async createParcel(token: string, payload: {
    storeId: number;
    merchantOrderId: string;
    recipientName: string;
    recipientPhone: string;
    recipientAddress: string;
    recipientCity: number;
    recipientZone: number;
    amountToCollect: number;
  }) {
    const response = await axios.post(`${this.baseUrl}/orders`, {
      store_id: payload.storeId,
      merchant_order_id: payload.merchantOrderId,
      recipient_name: payload.recipientName,
      recipient_phone: payload.recipientPhone,
      recipient_address: payload.recipientAddress,
      recipient_city: payload.recipientCity,
      recipient_zone: payload.recipientZone,
      delivery_type: 48, // Standard delivery
      item_type: 2, // Parcel
      special_instruction: 'Handle with care',
      item_quantity: 1,
      item_weight: 0.5,
      amount_to_collect: payload.amountToCollect,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      consignmentId: response.data.data.consignment_id,
      deliveryFee: response.data.data.delivery_fee,
    };
  }
}
```

---

## 7. SMS Gateway Integration (Bangladeshi Mobile Verification & Order Alerts)

Validates 11-digit Bangladeshi mobile numbers (`^01[3-9]\d{8}$`) and dispatches OTP codes or order notifications using Greenweb, Reve, or SSL Wireless:

```typescript
// src/modules/notifications/sms.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  validateBangladeshiPhone(phone: string): string {
    const sanitized = phone.replace(/[^0-9]/g, '');
    let normalized = sanitized;
    if (sanitized.startsWith('8801')) normalized = sanitized.slice(2);
    if (!/^01[3-9]\d{8}$/.test(normalized)) {
      throw new Error(`Invalid Bangladeshi phone number: ${phone}`);
    }
    return normalized;
  }

  async sendSms(to: string, message: string): Promise<boolean> {
    const validPhone = this.validateBangladeshiPhone(to);
    
    // In development/test mode:
    if (process.env.NODE_ENV !== 'production') {
      this.logger.log(`[DEV SMS SIMULATED] To: ${validPhone} | Msg: ${message}`);
      return true;
    }

    try {
      await axios.post(process.env.SMS_GATEWAY_URL!, {
        token: process.env.SMS_API_TOKEN,
        to: validPhone,
        message,
      });
      return true;
    } catch (error) {
      this.logger.error(`SMS dispatch failed: ${error.message}`);
      return false;
    }
  }
}
```

---

## 8. Frontend-to-Backend Migration Guide

When you are ready to connect the React frontend to this NestJS backend, follow this straightforward strategy:

1. **Environment Variable Configuration:**
   Add `VITE_API_BASE_URL` to frontend `.env`:
   ```bash
   VITE_API_BASE_URL=https://api.shopnest.app/v1
   ```

2. **HTTP API Client (`src/services/apiClient.ts`):**
   Create an Axios or Fetch wrapper that automatically attaches the JWT token from `localStorage['shopnest-token']` and handles refresh tokens on `401 Unauthorized`.

3. **Repository Swap (Zero Component Rewrite):**
   The frontend is already architected with clean repository files in `src/repositories/`:
   - `src/repositories/commerceStore.ts` -> replace local state with `apiClient.get('/seller/products')` & `apiClient.get('/seller/orders')`.
   - `src/repositories/themeStore.ts` -> replace local state with `apiClient.get('/seller/theme-config')` & `apiClient.patch('/seller/theme-config')`.
   - `src/repositories/shippingStore.ts` -> replace local state with `apiClient.get('/seller/shipping')` & `apiClient.put('/seller/shipping')`.
   - `src/repositories/settingsStore.ts` -> replace local state with `apiClient.get('/seller/settings')` & `apiClient.put('/seller/settings')`.

All React components will immediately function with live database persistence without changing any UI or JSX code!

---

## 9. Implementation Roadmap & Checklist

| Step | Phase | Key Milestone | Verification |
|---|---|---|---|
| **1** | **Setup** | Initialize NestJS 11 CLI project with TypeScript & ESLint | `nest new shopnest-backend` |
| **2** | **Database** | Setup PostgreSQL + Prisma schema above & run initial migration | `npx prisma migrate dev --name init` |
| **3** | **Seed** | Seed 8 themes, demo products, admin user, and Trendora store | `npx prisma db seed` |
| **4** | **Auth Module** | JWT Authentication, refresh tokens, 6-digit signup OTP verification | Postman signup & login tests pass |
| **5** | **Tenant Engine** | Host header / subdomain extraction middleware & AsyncLocalStorage context | Requests correctly scoped by `storeId` |
| **6** | **Catalog & Storefront** | CRUD for products, categories, variants, and public storefront endpoints | Products filterable by slug and category |
| **7** | **Checkout & Orders** | Public order placement with phone validation, order status pipeline | Order created, tracking number generated |
| **8** | **Shipping & Couriers** | Shipping zones & Steadfast/Pathao consignment booking | Parcels created via sandbox credentials |
| **9** | **Billing & Admin** | Subscription plan selection, manual payment slip review queue | Super Admin approve/reject updates store status |
| **10** | **Analytics & Settings** | Revenue calculation aggregations & store profile settings | Accurate numbers matching sales receipts |
