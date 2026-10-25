# ShopNest — Business Flows

> Last updated: 2026-10-26
> Documents actual flows verifiable in the prototype.

## 1. Seller Signup and Onboarding

```
/signup
  → Fill: name, email, password, confirm password
  → [Validation] email must contain @, password ≥ 8 chars
  → Navigate to /verify

/verify
  → Enter 6-digit code
  → [Validation] must be exactly 6 characters
  → Navigate to /onboarding/welcome

/onboarding/welcome   → "Let's bring your store to life" intro
/onboarding/business  → Business name, category, owner, phone, description
/onboarding/store     → Store name, subdomain (validates: ≥3 chars, alphanum, not reserved)
/onboarding/theme     → Choose from 3 themes: Modern Atelier, Nordic Home, Pulse Market
/onboarding/branding  → Upload logo (preview only), pick brand color, add tagline
/onboarding/complete  → Review summary → "Enter seller dashboard"
  → Navigate to /seller/overview
```

## 2. Product Management Flow

```
/seller/products
  → View product list (loaded from localStorage, or seed data)
  → Search: filters by name, SKU, category
  → Select checkbox: enables bulk set-active or bulk-delete
  → Click product row: /seller/products/:id (Product Detail)
  → Click "Add product": /seller/products/new

/seller/products/new
  → Form: name, description, category, SKU, images (preview only), price, sale, stock, sizes, colors, status
  → [Validation] name + SKU + valid price required
  → Save: product added to localStorage → back to list

/seller/products/:id
  → View product details
  → "Edit product" → /seller/products/edit (loads products[0] as mock for prototype)
```

## 3. Order Lifecycle (Seller Side)

```
Customer places order at /store/demo/checkout
  → Order saved to localStorage (shopnest-commerce-orders)

/seller/orders
  → Orders from localStorage + 3 seed orders
  → Filter by status tab
  → Search by order or customer
  → "Export CSV" → downloads orders.csv

/seller/orders/:id
  → View items, customer, delivery, payment, timeline
  → "Update status" → status dialog
  → Choose: Pending → Confirmed → Processing → Shipped → Delivered → Returned
  → Status updated in localStorage
  → "Cancel order" → confirmation → status → Cancelled
```

## 4. Customer Shopping Flow

```
/store/:slug
  → Theme-specific homepage: hero image, category sections, product grid, promo

/store/:slug/products
  → All products with sidebar filters (category, price range, stock)
  → Sort: Featured, Price low to high
  → Click product: /store/:slug/products/:id

/store/:slug/products/:id
  → Product name, description, price, SKU, stock
  → Choose variant (size/color combination required)
  → Set quantity (max = stock)
  → "Add to bag" → added to localStorage cart
  → "Buy now" → add + navigate to checkout

/store/:slug/cart
  → Cart items with images, quantities, remove button
  → Order summary: subtotal, shipping (free above ৳3,000), total
  → "Proceed to checkout"

/store/:slug/checkout (delivery details)
  → Form: name, phone, email, address, city, area, delivery method, payment method, notes
  → [Validation] phone must be 11 digits starting with 01; email must contain @ if provided
  → "Review order" → order review screen

/store/:slug/checkout (review)
  → Shows delivery and payment summary
  → "Place demo order" → order created in localStorage → cart cleared
  → Navigate to /store/:slug/order-confirmation/:id

/store/:slug/order-confirmation/:id
  → Order ID, customer name, delivery details, total, payment method
  → "Track this order" → /store/:slug/track-order

/store/:slug/track-order
  → Enter order ID + phone
  → If found: show status timeline (Pending → Confirmed → Processing → Shipped → Out for delivery → Delivered)
  → Status reflects whatever the seller last set
```

## 5. Subscription and Manual Payment Flow

```
/seller/subscription
  → View 3 plans: Monthly ৳500, Quarterly ৳1,350, Yearly ৳4,800
  → Trial progress bar showing 2/7 days used
  → "Choose [plan]" → /seller/subscription/pay

/seller/subscription/pay
  → Form: plan selection, payment provider, transaction ID, sender account, amount, date
  → Aside: step-by-step payment instructions
  → [Validation] transaction ID must be unique (not already submitted)
  → "Review submission" → review card

/seller/subscription/review
  → Shows: plan, transaction ID, sender, amount, date, status "Under Review"
  → "Edit details" → back to form
  → "Submit for verification" → payment created in localStorage → navigate to confirmation

/seller/subscription/confirmation
  → "Your payment is awaiting manual review"
  → "View payment status" → /seller/subscription/history

/seller/subscription/history
  → List of all seller's payment submissions with status

/seller/subscription/:payment-id
  → Payment detail: status, amount, transaction ID, plan
  → If Rejected: shows rejection reason + "Submit a new payment" button
```

## 6. Admin Payment Verification Flow

```
/admin/payments
  → List all submissions across all sellers
  → Filter by status (All, Under Review, Approved, Rejected, Requires More Information)
  → Search by transaction ID, seller name, store name

/admin/payments/:id
  → Payment detail view (same as seller view)
  → Decision panel: Approve / Reject / Request more info
  → Approve: modal confirms → payment status → Approved
  → Reject: modal requires reason text → status → Rejected
  → More info: modal requires message → status → Requires More Information
  → Status updates in localStorage (visible to seller in history)
```

## 7. Theme Selection and Customization

```
/seller/themes
  → 8 theme cards, each showing visual preview and description
  → "Preview" → /store/:slug/preview (adds preview banner)
  → "Use theme" → applies theme defaults to the customizer config

/seller/customizer
  → Left panel: controls
    - Theme selector
    - Logo text
    - Colors: primary, secondary, background, text (color pickers)
    - Typography: font family (Modern, Editorial, Friendly)
    - Hero: title and description text areas
    - Homepage sections: categories, promo, testimonials (toggles)
    - Product grid: 2/3/4 columns
    - Header style: Centered, Compact, Split
    - Footer style: Expanded, Minimal
  → Right panel: live preview (scales with device tab)
    - Desktop, Tablet, Mobile tabs change preview width
    - Preview reflects all control changes instantly
  → "Save draft" → saves config with status "Draft"
  → "Publish" → saves config with status "Published" → visible in /store/demo
  → "Reset" → confirmation → restores theme defaults
```
