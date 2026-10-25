# ShopNest — Data Models

> Last updated: 2026-10-26
> All types are sourced from the actual inspected codebase.

## CommerceProduct
```typescript
// commerceStore.ts
export type CommerceProduct = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;       // base price in BDT
  sale: number;        // sale price (0 = no sale)
  stock: number;       // units available
  status: string;      // "Active" | "Draft" | "Archived"
  color: string;       // color name(s), comma-separated
  sizes: string;       // size options, comma-separated
  image: string;       // URL to product image
  description: string;
}
```

## CommerceOrder
```typescript
// commerceStore.ts
export type CommerceOrder = {
  id: string;          // e.g. "SN-123456"
  store: string;       // store slug
  customer: string;    // full name
  phone: string;
  email: string;
  address: string;
  city: string;
  items: {
    id: number;        // product id
    name: string;
    variant: string;   // e.g. "Sand / M"
    quantity: number;
    price: number;     // price at time of order
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: string;     // "Cash on delivery" | "Store mobile payment"
  status: string;      // "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Returned"
  date: string;        // localized date string
}
```

## ThemeDefinition
```typescript
// themeStore.ts
export type ThemeDefinition = {
  id: string;           // "fashion" | "shoes" | "electronics" | "beauty" | "grocery" | "decor" | "furniture" | "retail"
  slug: string;         // URL slug for /store/<slug> route
  name: string;         // Store brand name
  title: string;        // Display title e.g. "Fashion Store"
  label: string;        // Category label e.g. "Fashion & Clothing"
  description: string;  // Theme description
  hero: string;         // Hero headline
  accent: string;       // Hero subtitle
  categories: string[]; // 3 category labels
  heroImage: string;    // Hero background image URL
  categoryImages: string[]; // 3 category image URLs
  promoTitle: string;   // Promotional section headline
}
```

## StoreThemeConfig
```typescript
// themeStore.ts
export type StoreThemeConfig = {
  storeSlug: string;
  themeId: string;
  logo: string;          // Logo text (no file upload in prototype)
  primary: string;       // CSS color hex
  secondary: string;     // CSS color hex
  background: string;    // CSS color hex
  text: string;          // CSS color hex
  font: string;          // "Modern" | "Editorial" | "Friendly"
  heroTitle: string;
  heroText: string;
  showCategories: boolean;
  showPromo: boolean;
  showTestimonials: boolean;
  grid: number;          // 2 | 3 | 4 columns
  header: string;        // "Centered" | "Compact" | "Split"
  footer: string;        // "Expanded" | "Minimal"
  status: "Draft" | "Published";
}
```

## Payment (BillingAdmin.tsx — local type)
```typescript
type PaymentStatus = "Under Review" | "Approved" | "Rejected" | "Requires More Information"
type Payment = {
  id: string;            // "PAY-xxxx"
  transaction: string;   // transaction reference from payment provider
  sender: string;        // sender phone number
  amount: number;
  plan: string;          // "Monthly" | "Quarterly" | "Yearly"
  period: string;        // "30 days" | "90 days" | "365 days"
  date: string;          // human-readable date string
  status: PaymentStatus;
  reason?: string;       // rejection or more-info reason
  seller: string;        // seller full name
  store: string;         // store display name
}
```

## Local Types (SellerManagement.tsx)
```typescript
type Category = {
  id: number;
  name: string;
  parent: string;    // "—" for top-level
  products: number;  // count
  status: string;    // "Active" | "Hidden"
  color: string;     // CSS class name for color
}

type Order = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  total: number;
  status: string;
  payment: string;
  date: string;
  items: string[];   // formatted item strings
}
```

## CartItem (CustomerStorefront.tsx — local type)
```typescript
type CartItem = {
  product: CommerceProduct;
  quantity: number;
  variant: string;   // e.g. "Cream / S"
}
```

---

## Subscription Plans (Hardcoded)

```typescript
const plans = [
  { id: "monthly",   name: "Monthly",   price: 500,  period: "30 days",  saving: 0,    recommended: false },
  { id: "quarterly", name: "Quarterly", price: 1350, period: "90 days",  saving: 150,  recommended: true },
  { id: "yearly",    name: "Yearly",    price: 4800, period: "365 days", saving: 1200, recommended: false },
]
```

## Seed / Default Data

**Default products (4):** Linen Summer Shirt, Classic Pleated Trouser, Everyday Canvas Tote, Relaxed Cotton Tee (fashion / Trendora store)

**Seed orders (3):** Nusrat Jahan, Arif Hasan, Samira Akter

**Seed categories (4):** Shirts, Trousers, Accessories, T-shirts

**Seed payments (3):** PAY-2048 (Under Review), PAY-2047 (Approved), PAY-2046 (Rejected)

**Themed product data:** 7 non-fashion themes × 4 products each = 28 additional products (defined in CustomerStorefront.tsx, not persisted)
