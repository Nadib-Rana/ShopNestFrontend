import type { NavItem } from "../types"

export const sellerRoutes: Record<string, string> = {
  Overview: "/seller/overview",
  Products: "/seller/products",
  Categories: "/seller/categories",
  Inventory: "/seller/inventory",
  Orders: "/seller/orders",
  Customers: "/seller/customers",
  Storefront: "/seller/storefront",
  Themes: "/seller/themes",
  "Design customizer": "/seller/customizer",
  "Shipping & delivery": "/seller/shipping",
  Subscription: "/seller/subscription",
  Analytics: "/seller/analytics",
  "Store settings": "/seller/settings",
}

export const navItems: NavItem[] = [
  { label: "Overview", icon: "grid" },
  { label: "Products", icon: "box" },
  { label: "Categories", icon: "grid" },
  { label: "Inventory", icon: "chart" },
  { label: "Orders", icon: "orders", count: "8" },
  { label: "Customers", icon: "users" },
  { label: "Storefront", icon: "store" },
  { label: "Themes", icon: "palette" },
  { label: "Design customizer", icon: "palette" },
  { label: "Shipping & delivery", icon: "truck" },
  { label: "Subscription", icon: "card" },
  { label: "Analytics", icon: "chart" },
  { label: "Store settings", icon: "settings" },
]

export const defaultMockOrders = [
  { id: "#SN-1048", name: "Nusrat Jahan", initials: "NJ", date: "May 24, 10:32 AM", total: "৳3,840", payment: "Paid", status: "Processing" },
  { id: "#SN-1047", name: "Arif Hasan", initials: "AH", date: "May 24, 9:14 AM", total: "৳2,250", payment: "COD", status: "Confirmed" },
  { id: "#SN-1046", name: "Samira Akter", initials: "SA", date: "May 23, 8:46 PM", total: "৳5,690", payment: "Paid", status: "Shipped" },
  { id: "#SN-1045", name: "Rafiul Islam", initials: "RI", date: "May 23, 4:12 PM", total: "৳1,450", payment: "COD", status: "Pending" },
]

export const defaultMockProducts = [
  { name: "Linen Summer Shirt", sku: "LSS-401", price: "৳1,850", stock: 24, color: "sand" },
  { name: "Classic Pleated Trouser", sku: "CPT-209", price: "৳2,250", stock: 12, color: "slate" },
  { name: "Everyday Canvas Tote", sku: "ECT-118", price: "৳950", stock: 6, color: "sage" },
  { name: "Relaxed Cotton Tee", sku: "RCT-310", price: "৳1,150", stock: 0, color: "cream" },
]

export const productImages = [
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1555529771-835f59fc5efe?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=900&q=80",
]
