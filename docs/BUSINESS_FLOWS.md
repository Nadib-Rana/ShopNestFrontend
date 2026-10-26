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
  → "Preview" → /store/:slug/preview (sets shopnest_preview_return = '/seller/themes')
  → "Customize Active Theme" / "Use theme" → navigates to /seller/customizer

/seller/customizer
  → Isolated to Active Store Theme: Controls are scoped to current store theme only
  → Top bar: Store name, active theme badge, device switcher (Desktop, Tablet, Mobile), Save Draft, Publish
  → Left panel: Theme-specific controls
    - General: Logo text, tagline, announcement bar
    - Colors: Theme-tailored color pickers (primary, secondary, background, accent)
    - Typography: Curated theme font pairing (e.g. Syne/Inter, Outfit, Playfair, Cormorant)
    - Hero & Banner: Title, subtitle, CTA button text, background image
    - Sections: Category grid, promo cards, testimonial stories, newsletter toggles
    - Layout: Column density, grid styles, header & footer variations
  → Right panel: Live Interactive Preview
    - Independent viewport scrolling: Outer frame has fixed height with overflow-hidden;
      inner preview container has independent vertical scrolling (`overflow-y: auto`)
    - Smooth responsive resizing across Desktop (100%), Tablet (768px), and Mobile (375px)
    - Reflects all live edits synchronously
  → Preview Return Memory: Clicking "Close preview" reads `sessionStorage['shopnest_preview_return']`
    and reliably returns the seller to /seller/customizer or /seller/themes
  → "Save draft" → persists configuration as "Draft"
  → "Publish" → persists configuration as "Published" → active immediately on live storefront
```

## 8. Public Theme Discovery & Registration Gating Flow

```
/themes
  → Accessible publicly without requiring authentication
  → Displays public ShopNest navigation (Features, How it works, Pricing, Themes, Login, Start Free Trial)
  → 8 theme cards with category tags, descriptions, live feature pills
  → Click "Preview":
      → Saves `shopnest_preview_return = '/themes'` in sessionStorage
      → Navigates to `/store/:slug/preview`
      → Clicking "Close preview" returns directly to `/themes`
  → Click "Use Theme":
      → Auth check: calls `isUserRegistered()` (inspects localStorage for `shopnest-user` or `shopnest-token`)
      → IF REGISTERED:
          → Saves theme ID to store configuration
          → Navigates to `/seller/customizer`
      → IF NOT REGISTERED:
          → Saves `pending_theme_selection` in localStorage
          → Redirects to `/signup` with message prompting seller registration
          → Theme is auto-applied upon completing onboarding
```

## 9. Storefront Mobile Experience & Drawer Navigation

```
/store/:slug (Mobile Viewport < 768px)
  → Responsive theme header displays brand logo, quick cart badge, and hamburger toggle button (`#store-mobile-toggle`)
  → Tapping hamburger triggers slide-in mobile navigation drawer (`#store-mobile-drawer`):
      - Store brand header with close button (`#store-mobile-drawer-close`)
      - Navigation links: Home, All Products, Categories, Track Order, Policies
      - Category shortcuts with theme-specific styling
      - Quick cart summary with one-tap checkout access
  → Tapping backdrop or close button dismisses drawer smoothly
```

## 10. Shipping & Logistics Management Flow

```
/seller/shipping
  → Delivery Zones & Pricing:
      - Inside Dhaka: Flat rate (৳60), 24-48h delivery window
      - Outside Dhaka: Flat rate (৳120), 48-72h delivery window
      - Free Shipping Threshold: Configurable order value minimum (e.g. ৳3,000)
      - Cash on Delivery (COD): Toggle availability per zone
  → Courier Integrations:
      - Steadfast Courier: API status, live tracking sync toggle, merchant code
      - Pathao Logistics: API status, webhook integration toggle, secret token
      - RedX Delivery: API status, auto-booking toggle
  → Save Changes: Persists shipping configuration to localStorage
```

## 11. Business Analytics Flow

```
/seller/analytics
  → Time Range Filter: Today, 7 Days, 30 Days, 90 Days
  → Key Performance Indicators:
      - Gross Sales Revenue (৳) with period-over-period percentage delta
      - Total Orders count with completed vs pending breakdown
      - Average Order Value (AOV)
      - Store Conversion Rate (%)
  → Interactive SVG Sales Chart: Day-by-day revenue visualization
  → Payment Channel Breakdown: bKash, Nagad, Cash on Delivery, Credit/Debit Cards
  → Top Products Leaderboard: Ranked by unit sales and gross revenue
```
