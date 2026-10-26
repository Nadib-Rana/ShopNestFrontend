import type { ReactNode } from "react"

export interface NavItem {
  label: string
  icon: string
  count?: string
}

export type SellerRouteKey =
  | "Overview"
  | "Products"
  | "Categories"
  | "Inventory"
  | "Orders"
  | "Customers"
  | "Storefront"
  | "Themes"
  | "Design customizer"
  | "Shipping & delivery"
  | "Subscription"
  | "Analytics"
  | "Store settings"

export interface OrderItem {
  id: number
  name: string
  variant: string
  quantity: number
  price: number
}

export interface CommerceOrder {
  id: string
  store: string
  customer: string
  phone: string
  email: string
  address: string
  city: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  total: number
  payment: string
  status: string
  date: string
}

export interface CommerceProduct {
  id: number
  name: string
  sku: string
  category: string
  price: number
  sale: number
  stock: number
  status: string
  color: string
  sizes: string
  image: string
  description: string
}

export interface ThemeDefinition {
  id: string
  slug: string
  name: string
  title: string
  label: string
  description: string
  hero: string
  accent: string
  categories: string[]
  heroImage: string
  categoryImages: string[]
  promoTitle: string
}

export interface StoreThemeConfig {
  storeSlug: string
  themeId: string
  logo: string
  logoImage?: string
  primary: string
  secondary: string
  background: string
  text: string
  font: string
  heroTitle: string
  heroText: string
  heroButtonText?: string
  announcementText?: string
  showCategories: boolean
  categoriesHeading?: string
  showPromo: boolean
  promoBadge?: string
  promoTitle?: string
  promoSubtitle?: string
  showTrustRow?: boolean
  showTestimonials: boolean
  testimonialText?: string
  testimonialAuthor?: string
  grid: number
  productSectionTitle?: string
  secondaryProductSectionTitle?: string
  cardRadius?: string
  cardActionText?: string
  cardShowBadge?: boolean
  cardShowDetails?: boolean
  cardShowPrice?: boolean
  header: "Centered" | "Compact" | "Split" | string
  footer: "Expanded" | "Minimal" | string
  footerAbout?: string
  footerCopyright?: string
  newsletterHeading?: string
  newsletterButtonText?: string
  showNewsletter?: boolean
  status: "Draft" | "Published"

  // Theme-specific customization options
  fashionLookbookTitle?: string
  fashionCollectionStyle?: string
  shoesDropTag?: string
  shoesBadgeText?: string
  shoesHighlightSizes?: boolean
  techWarrantyText?: string
  techDealTitle?: string
  techShowSpecs?: boolean
  beautyRitualNote?: string
  beautyCampaignTitle?: string
  beautyShowRoutine?: boolean
  groceryDeliveryArea?: string
  groceryOfferTag?: string
  groceryShowQuantity?: boolean
  decorQuote?: string
  decorRoomFocus?: string
  decorShowTextures?: boolean
  furnitureSubtitle?: string
  furnitureMaterialNote?: string
  furnitureLayout?: string
  retailCategoryTag?: string
  retailReturnBadge?: string
  retailDealHighlight?: string
}

export interface BadgeProps {
  children: ReactNode
  tone?: string
  className?: string
}

export interface StatusProps {
  children: ReactNode
  tone?: "green" | "amber" | "blue" | "purple" | "gray" | string
}

export interface IconProps {
  name: string
  size?: number
  className?: string
}
