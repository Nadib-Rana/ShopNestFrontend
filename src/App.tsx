import React, { Suspense, lazy, useEffect, useState } from "react"
import { useRoute } from "./hooks/useRoute"
import { sellerRoutes } from "./constants"
import { SellerLayout } from "./app/layouts/SellerLayout"
import { NotFound } from "./components/shared/NotFound"
import { ComingSoon } from "./components/shared/ComingSoon"
import { ShopNestHome } from "./features/home/ShopNestHome"
import { AuthPage } from "./features/auth/AuthPage"
import { Onboarding } from "./features/onboarding/Onboarding"
import { Overview } from "./features/dashboard/Overview"
import { StorefrontPage } from "./features/seller/StorefrontPage"

// Route-level code splitting for heavy sub-applications
const SellerManagement = lazy(() => import("./features/seller/SellerManagement"))
const CustomerStorefront = lazy(() => import("./features/storefront/CustomerStorefront"))
const ThemeStudio = lazy(() => import("./features/themes/ThemeStudio"))
const PublicThemesPage = lazy(() => import("./features/themes/PublicThemesPage"))
const ShippingPage = lazy(() => import("./features/seller/ShippingPage"))
const AnalyticsPage = lazy(() => import("./features/seller/AnalyticsPage"))
const SettingsPage = lazy(() => import("./features/seller/SettingsPage"))
const BillingAdminModule = lazy(() => import("./features/subscriptions/BillingAdmin").then(m => ({ default: m.SellerBilling })))
const AdminAppModule = lazy(() => import("./features/subscriptions/BillingAdmin").then(m => ({ default: m.AdminApp })))

function RouteLoader() {
  return (
    <div className="content" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "240px" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px", color: "var(--text-muted, #71717a)" }}>
        <div style={{ width: "24px", height: "24px", borderRadius: "50%", border: "2px solid #e4e4e7", borderTopColor: "var(--primary, #4b4bc7)", animation: "spin 0.8s linear infinite" }} />
        <span style={{ fontSize: "14px" }}>Loading workspace...</span>
      </div>
    </div>
  )
}

export default function App() {
  const { path, go } = useRoute()
  const [toast, setToast] = useState("")

  const active =
    Object.entries(sellerRoutes)
      .sort((a, b) => b[1].length - a[1].length)
      .find(([, route]) => path.startsWith(route))?.[0] || "Overview"

  const title = active === "Subscription" ? "Subscription & billing" : active

  useEffect(() => {
    const label = path.startsWith("/seller") ? `${title} · ShopNest` : "ShopNest · Build your store"
    document.title = label
  }, [path, title])

  const notify = (message: string) => {
    setToast(message)
    window.setTimeout(() => setToast(""), 2400)
  }

  // Public Landing Page
  if (path === "/") {
    return <ShopNestHome go={go} />
  }

  // Public Themes Gallery
  if (path === "/themes") {
    return (
      <Suspense fallback={<RouteLoader />}>
        <PublicThemesPage go={go} notify={notify} />
      </Suspense>
    )
  }

  // Authentication Flows
  if (["/login", "/signup", "/forgot-password", "/reset-password", "/verify"].includes(path)) {
    return <AuthPage path={path} go={go} />
  }

  // Onboarding Wizard
  if (path.startsWith("/onboarding")) {
    return <Onboarding path={path} go={go} />
  }

  // Super Admin Platform
  if (path.startsWith("/admin")) {
    return (
      <Suspense fallback={<RouteLoader />}>
        <AdminAppModule path={path} go={go} />
      </Suspense>
    )
  }

  // Customer Facing Storefront
  if (path.startsWith("/store/")) {
    return (
      <Suspense fallback={<RouteLoader />}>
        <CustomerStorefront path={path} go={go} />
      </Suspense>
    )
  }

  // Fallback 404 for unknown non-seller paths
  if (!path.startsWith("/seller")) {
    return <NotFound go={go} />
  }

  // Seller Dashboard Workspaces
  return (
    <SellerLayout path={path} go={go} toast={toast} active={active}>
      <Suspense fallback={<RouteLoader />}>
        {active === "Overview" && (
          <Overview onAction={notify} setActive={(value) => go(sellerRoutes[value])} />
        )}
        {["Products", "Categories", "Inventory", "Orders", "Customers"].includes(active) && (
          <SellerManagement path={path} go={go} notify={notify} />
        )}
        {active === "Storefront" && (
          <StorefrontPage onAction={notify} go={go} />
        )}
        {["Themes", "Design customizer"].includes(active) && (
          <ThemeStudio path={path} go={go} notify={notify} />
        )}
        {active === "Shipping & delivery" && (
          <ShippingPage notify={notify} />
        )}
        {active === "Analytics" && (
          <AnalyticsPage notify={notify} />
        )}
        {active === "Subscription" && (
          <BillingAdminModule path={path} go={go} notify={notify} />
        )}
        {active === "Store settings" && (
          <SettingsPage notify={notify} />
        )}
        {!["Overview", "Products", "Categories", "Inventory", "Orders", "Customers", "Storefront", "Themes", "Design customizer", "Subscription", "Shipping & delivery", "Analytics", "Store settings"].includes(active) && (
          <ComingSoon title={active} />
        )}
      </Suspense>
    </SellerLayout>
  )
}
