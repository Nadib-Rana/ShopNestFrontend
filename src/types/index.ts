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
  primary: string
  secondary: string
  background: string
  text: string
  font: string
  heroTitle: string
  heroText: string
  showCategories: boolean
  showPromo: boolean
  showTestimonials: boolean
  grid: number
  header: string
  footer: string
  status: "Draft" | "Published"
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
