# ShopNest — Design System

> Last updated: 2026-10-26

## Typography

| Token | Value |
|-------|-------|
| `--font-sans` | DM Sans (400, 500, 600, 700) |
| `--font-display` | Manrope (600, 700) — used for headings, brand mark |

## Color Tokens (Tailwind v4 `@theme`)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-50` | `#f0f1ff` | Active nav background, light accents |
| `--color-brand-100` | `#e2e4ff` | Metric icon background |
| `--color-brand-500` | `#5b5ce2` | Brand accent, chart stroke, active indicators |
| `--color-brand-600` | `#4b4bc7` | Primary buttons, active nav text |
| `--color-brand-700` | `#3f3fa9` | Button hover |
| `--color-ink` | `#172033` | Primary text |
| `--color-muted` | `#667085` | Secondary text, labels |
| `--color-canvas` | `#f5f6f8` | Page background |
| `--color-line` | `#e6e8ec` | Borders, dividers |

## Status Colors

| Status | Text | Background |
|--------|------|------------|
| green | `#16845a` | `#eaf8f2` |
| purple | `#5b5ce2` | `#f0f0ff` |
| blue | `#3478ca` | `#edf5ff` |
| amber | `#ae690d` | `#fff5e5` |
| gray | `#677182` | `#f1f3f5` |

## Storefront CSS Custom Properties

Each storefront theme supports these overridable custom properties:

| Property | Default (fashion) | Description |
|----------|------------------|-------------|
| `--store-accent` | `#755b46` | Primary brand color |
| `--store-soft` | `#eae2d7` | Secondary/soft color |
| `--store-bg` | `#f7f5f0` | Page background |
| `--store-text` | `#24201c` | Primary text |
| `--store-grid` | `4` | Product grid columns |

## Component Reference

### `.card`
White card with border and subtle shadow. Used across all modules.
```css
background: white; border: 1px solid var(--color-line); border-radius: 13px; box-shadow: 0 1px 2px rgba(16,24,40,.02);
```

### `.primary` (button)
Brand-colored primary CTA button.
```css
background: var(--color-brand-600); color: white; border-radius: 9px; font-weight: 600; box-shadow: 0 5px 12px rgba(75,75,199,.18);
```

### `.secondary` (button)
Outlined button for secondary actions.

### `.status`
Inline status badge with colored dot. Tones: green, purple, blue, amber, gray.

### `mg-badge` (SellerManagement)
Status badge in the management module. Uses `mg-badge active`, `mg-badge draft`, `mg-badge low-stock`.

### `ba-badge` (BillingAdmin)
Status badge in the billing and admin module.

## 8 Storefront Theme Palette

| Theme ID | Primary | Secondary | Background | Text |
|----------|---------|-----------|------------|------|
| fashion | `#755b46` | `#eae2d7` | `#f7f5f0` | `#24201c` |
| shoes | `#f4511e` | `#e4e4df` | `#f4f4f1` | `#111111` |
| electronics | `#1769e0` | `#e5edfa` | `#f5f7fa` | `#12203a` |
| beauty | `#a35669` | `#f2e2e4` | `#fbf5f4` | `#4c3035` |
| grocery | `#3d842f` | `#e5f0dc` | `#f8faf4` | `#25321f` |
| decor | `#8a674e` | `#e8dfd2` | `#f5f1eb` | `#3e372f` |
| furniture | `#35564a` | `#dce3de` | `#eeeae3` | `#1d211f` |
| retail | `#6657d8` | `#e9e7fb` | `#f6f7fb` | `#20263a` |

## Responsive Breakpoints

The application uses CSS breakpoints defined in `src/index.css`:

| Breakpoint | CSS | Usage |
|-----------|-----|-------|
| Mobile | `@media(max-width:768px)` | Sidebar collapses, mobile menu appears |
| Tablet | `@media(max-width:1100px)` | Metric grid reduces columns |

## CSS File Organization (Current — src/index.css)

The entire 102 KB CSS file is organized in this order:
1. Google Fonts import
2. Tailwind import + `@theme` tokens
3. `@layer base` — resets
4. Seller sidebar and header styles
5. Dashboard/overview styles
6. Management module styles (`.mg-*`)
7. Billing/Admin styles (`.ba-*`)
8. Storefront styles (`.customer-store`, `.store-*`)
9. Theme-specific styles (`.theme-fashion`, `.theme-shoes`, etc.)
10. Auth and onboarding styles
11. ThemeStudio styles
