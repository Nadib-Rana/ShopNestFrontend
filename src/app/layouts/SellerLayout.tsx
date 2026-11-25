import React, { useEffect, useRef, useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { navItems, sellerRoutes } from "../../constants"
import { getCommerceOrders } from "../../repositories/commerceStore"
import { getStoreSettings } from "../../repositories/settingsStore"
import { clearRegisteredUser, getRegisteredUser } from "../../utils/auth"
import { getActiveStoreSlug } from "../../services/apiClient"
import type { NavItem } from "../../types"

export interface SellerLayoutProps {
  children: React.ReactNode
  path: string
  go: (to: string) => void
  toast: string
  active: string
}

export function SellerLayout({ children, path, go, toast, active }: SellerLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const searchInputRef = useRef<HTMLInputElement | null>(null)

  const settings = getStoreSettings()
  const user = getRegisteredUser()
  const activeSlug = getActiveStoreSlug()
  const displayDomain = `${activeSlug === "demo" ? "trendora" : activeSlug}.shopnest.app`
  const storeName = settings.storeName || "Trendora Fashion"
  const storeInitials = storeName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "SN"
  const ownerName = user?.name || user?.email?.split("@")[0] || "Saif Rahman"
  const ownerInitials = ownerName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("") || "SR"
  const liveOrderCount = getCommerceOrders().length + 3

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        searchInputRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const q = searchTerm.trim().toLowerCase()
    if (!q) return
    if (q.startsWith("sn-") || q.includes("order")) {
      go("/seller/orders")
    } else if (q.includes("customer")) {
      go("/seller/customers")
    } else {
      go("/seller/products")
    }
    setSearchTerm("")
  }

  const handleLogout = () => {
    clearRegisteredUser()
    go("/login")
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><span /></span>
          <strong>ShopNest</strong>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>×</button>
        </div>
        <button
          type="button"
          className="store-switcher"
          onClick={() => {
            go("/seller/settings")
            setMobileOpen(false)
          }}
        >
          <div className="store-avatar">{storeInitials}</div>
          <div>
            <strong>{storeName}</strong>
            <span>{displayDomain}</span>
          </div>
          <Icon name="arrow" size={15} />
        </button>
        <nav>
          <p className="nav-label">Workspace</p>
          {navItems.slice(0, 6).map((item: NavItem) => (
            <button
              key={item.label}
              className={active === item.label ? "active" : ""}
              onClick={() => {
                go(sellerRoutes[item.label])
                setMobileOpen(false)
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.label === "Orders" && <em>{liveOrderCount}</em>}
            </button>
          ))}
          <p className="nav-label">Store management</p>
          {navItems.slice(6, 11).map((item: NavItem) => (
            <button
              key={item.label}
              className={active === item.label ? "active" : ""}
              onClick={() => {
                go(sellerRoutes[item.label])
                setMobileOpen(false)
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
          <p className="nav-label">Insights & settings</p>
          {navItems.slice(11).map((item: NavItem) => (
            <button
              key={item.label}
              className={active === item.label ? "active" : ""}
              onClick={() => {
                go(sellerRoutes[item.label])
                setMobileOpen(false)
              }}
            >
              <Icon name={item.icon} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <button onClick={() => window.location.href = "mailto:support@shopnest.example?subject=ShopNest prototype support"}>
            <Icon name="help" />
            <span>Help & support</span>
          </button>
          <button type="button" onClick={handleLogout}>
            <Icon name="arrow" size={15} />
            <span>Log out</span>
          </button>
          <div className="profile">
            <div className="avatar">{ownerInitials}</div>
            <div>
              <strong>{ownerName}</strong>
              <span>Store owner</span>
            </div>
            <Icon name="dots" />
          </div>
        </div>
      </aside>

      {mobileOpen && (
        <button
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <main className={active === "Design customizer" ? "customizer-layout-main" : ""}>
        {active !== "Design customizer" && (
          <header>
            <div className="header-left">
              <button
                className="mobile-toggle"
                aria-label="Open navigation"
                onClick={() => setMobileOpen(true)}
              >
                <Icon name="menu" />
              </button>
              <form className="search-field" onSubmit={handleGlobalSearch}>
                <Icon name="search" />
                <input
                  ref={searchInputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search orders, products, customers... (⌘K)"
                  aria-label="Search ShopNest"
                />
              </form>
            </div>
            <div className="header-actions">
              <button
                className="icon-button"
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((v) => !v)}
              >
                <Icon name="bell" />
                <i />
              </button>
              <button className="preview-button" onClick={() => go(`/store/${activeSlug}`)}>
                <Icon name="external" />View store
              </button>
            </div>
            {notificationsOpen && (
              <div className="notification-popover">
                <div>
                  <strong>Notifications</strong>
                  <button onClick={() => setNotificationsOpen(false)}>Close</button>
                </div>
                <button onClick={() => go("/seller/orders")}>
                  <span>New order received</span>
                  <small>Order SN-1048 is ready to process.</small>
                </button>
                <button onClick={() => go("/seller/inventory")}>
                  <span>Low stock warning</span>
                  <small>Everyday Canvas Tote has 6 units left.</small>
                </button>
                <button onClick={() => go("/seller/subscription/history")}>
                  <span>Payment update</span>
                  <small>Review your latest subscription submission.</small>
                </button>
              </div>
            )}
          </header>
        )}

        {children}
      </main>

      {toast && (
        <div className="toast">
          <span><Icon name="check" /></span>
          {toast}
        </div>
      )}
    </div>
  )
}

export default SellerLayout
