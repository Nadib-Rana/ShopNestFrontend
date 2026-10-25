# ShopNest — Known Limitations

> Last updated: 2026-10-26
> See project-planning/KNOWN_ISSUES.md for bugs. This file covers structural limitations.

## 1. No Backend
ShopNest has no server, database, or API. All data is local to the browser session. None of the functionality described in the UI as "sending" or "receiving" actually transmits data anywhere.

## 2. Authentication is Simulated
Login, signup, and verification forms navigate to the next page without any real credential verification. Anyone can access `/seller/overview` or `/admin` directly.

## 3. localStorage Limitations
- Data is lost when the browser's localStorage is cleared
- Data is not shared across browsers or devices  
- localStorage has a 5-10 MB quota per origin
- Private/incognito browsing mode clears localStorage when the window closes

## 4. Hardcoded Seller Persona
The seller "Saif Rahman" and store "Trendora Fashion" are hardcoded throughout the prototype. The admin persona "Maliha Ahmed" is hardcoded. There is no multi-user login.

## 5. Image Uploads Do Not Persist
File inputs on the product form, category form, and branding step accept files for visual preview in the session. Files are not uploaded to any server and are lost on page refresh.

## 6. Three Pages Not Implemented
- Shipping & Delivery (`/seller/shipping`) — shows "Coming Soon"
- Analytics (`/seller/analytics`) — shows "Coming Soon"  
- Store Settings (`/seller/settings`) — shows "Coming Soon"

## 7. Admin Sections Are Presentation-Only
Eight admin sections (Sellers, Stores, Subscriptions, Plans, Themes, Domains, Settings, Audit Log) show static data. Create and edit actions are disabled.

## 8. Payment Verification Is Not Real
Manual payment submission does not notify anyone and does not activate any subscription. The payment appears in the admin queue in localStorage.

## 9. Orders Are Not Real
Orders placed at checkout are saved to localStorage. No real order fulfillment, inventory reservation, or customer notification occurs.

## 10. Custom Domains
Domain management in the admin panel is static data only. No DNS verification, SSL provisioning, or actual custom domain routing is implemented.

## 11. Newsletter Signup
The newsletter signup in the storefront footer simulates a successful submission without sending any email.

## 12. Product Edit Uses First Product
The "Edit product" button on any product navigates to `/seller/products/edit` but always loads `products[0]` as the editable item. This is a known prototype shortcut.

## 13. Compressed Code Reduces Maintainability
All source files use minimal whitespace and single-line functions. This makes the code difficult to read and debug.

## 14. No Automated Tests
There are no unit tests, integration tests, or end-to-end tests. Regression prevention currently depends on manual testing.

## 15. Unsplash Images Depend on External CDN
All product and hero images are loaded from Unsplash CDN. If Unsplash is unavailable or rate-limits the requests, images will not load.
