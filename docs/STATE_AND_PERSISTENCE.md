# ShopNest — State and Persistence

> Last updated: 2026-10-26

## Overview

ShopNest uses React local state (`useState`) for UI state and the browser's `localStorage` API for persistence. There is no backend, database, or server-side session.

---

## localStorage Keys

| Key | Set In | Read In | Schema |
|-----|--------|---------|--------|
| `shopnest-commerce-products` | `commerceStore.ts` | `commerceStore.ts`, `SellerManagement.tsx` | `CommerceProduct[]` |
| `shopnest-commerce-orders` | `commerceStore.ts` | `commerceStore.ts`, `CustomerStorefront.tsx`, `SellerManagement.tsx` | `CommerceOrder[]` |
| `shopnest-store-theme-configs` | `themeStore.ts` | `themeStore.ts`, `CustomerStorefront.tsx`, `ThemeStudio.tsx` | `Record<string, StoreThemeConfig>` |
| `shopnest-prototype-payments` | `BillingAdmin.tsx` | `BillingAdmin.tsx` | `Payment[]` |
| `shopnest-cart` | `CustomerStorefront.tsx` | `CustomerStorefront.tsx` | `CartItem[]` |
| `shopnest-store-published` | `App.tsx` | Not read back | ISO timestamp string |

---

## Data Schemas (Actual TypeScript Types)

### CommerceProduct
```typescript
type CommerceProduct = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  sale: number;
  stock: number;
  status: string;
  color: string;
  sizes: string;
  image: string;
  description: string;
}
```

### CommerceOrder
```typescript
type CommerceOrder = {
  id: string;
  store: string;
  customer: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  items: {
    id: number;
    name: string;
    variant: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: string;
  status: string;
  date: string;
}
```

### StoreThemeConfig
```typescript
type StoreThemeConfig = {
  storeSlug: string;
  themeId: string;
  logo: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  font: string;
  heroTitle: string;
  heroText: string;
  showCategories: boolean;
  showPromo: boolean;
  showTestimonials: boolean;
  grid: number;
  header: string;
  footer: string;
  status: "Draft" | "Published";
}
```

### Payment (BillingAdmin.tsx)
```typescript
type PaymentStatus = "Under Review" | "Approved" | "Rejected" | "Requires More Information"
type Payment = {
  id: string;
  transaction: string;
  sender: string;
  amount: number;
  plan: string;
  period: string;
  date: string;
  status: PaymentStatus;
  reason?: string;
  seller: string;
  store: string;
}
```

### CartItem (CustomerStorefront.tsx)
```typescript
type CartItem = {
  product: CommerceProduct;
  quantity: number;
  variant: string;
}
```

---

## Commerce Data Flow

```
Seller adds product → saved to localStorage (shopnest-commerce-products)
                            ↓
Customer visits /store/demo → reads from localStorage
                            ↓
Customer adds to cart → saved to localStorage (shopnest-cart)
                            ↓
Customer places order → order saved to localStorage (shopnest-commerce-orders)
                            ↓
Seller opens /seller/orders → reads from localStorage (includes seeded + placed orders)
                            ↓
Seller updates order status → updates localStorage
                            ↓
Customer tracks order → reads from localStorage by order ID + phone
```

---

## Shared Repository Functions

### commerceStore.ts
```typescript
getCommerceProducts(): CommerceProduct[]    // reads localStorage or returns seed data
saveCommerceProducts(products)              // writes to localStorage
getCommerceOrders(): CommerceOrder[]        // reads localStorage or returns []
saveCommerceOrder(order)                    // appends to localStorage (deduplicates)
updateCommerceOrder(id, status)             // updates status of matching order
```

### themeStore.ts
```typescript
getStoreThemeConfig(storeSlug): StoreThemeConfig    // reads localStorage or returns defaults
saveStoreThemeConfig(config)                         // writes to localStorage (keyed by storeSlug)
themeDefaults(themeId, storeSlug): StoreThemeConfig  // generates default config from theme definition
```

---

## Limitations

| Limitation | Impact |
|-----------|--------|
| localStorage is browser-local | Data does not sync across devices or browsers |
| No data migration | Schema changes between prototype versions could silently corrupt stored data |
| No user isolation | All localStorage data is accessible to any JavaScript on the page |
| Cart survives session | Cart from one store visit persists until cleared |
| localStorage quota | Modern browsers allow 5-10 MB; large product catalogs could exceed this |
| Private browsing | localStorage is cleared when private browsing window closes |

---

## Cross-Feature Data Relationships

The seller product management and customer storefront share the same `shopnest-commerce-products` key. Changes made in the seller dashboard (adding a product, changing stock) are visible immediately in the demo storefront (`/store/demo`) because both read from the same localStorage entry.

The order placed at checkout is saved to `shopnest-commerce-orders`, which is also read by the seller's Orders page. This creates a working end-to-end prototype loop without a backend.

**Important:** This prototype relationship MUST NOT be broken during refactoring.
