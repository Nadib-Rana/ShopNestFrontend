import React, { useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { navItems, sellerRoutes } from "../../constants"
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

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <span className="brand-mark"><span /></span>
          <strong>ShopNest</strong>
          <button className="mobile-close" onClick={() => setMobileOpen(false)}>×</button>
        </div>
        <div className="store-switcher">
          <div className="store-avatar">TF</div>
          <div>
            <strong>Trendora Fashion</strong>
            <span>trendora.shopnest.app</span>
          </div>
          <Icon name="arrow" size={15} />
        </div>
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
              {item.count && <em>{item.count}</em>}
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
          <div className="profile">
            <div className="avatar">SR</div>
            <div>
              <strong>Saif Rahman</strong>
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
              <div className="search-field">
                <Icon name="search" />
                <input
                  placeholder="Search orders, products, customers... (⌘K)"
                  aria-label="Search ShopNest"
                />
              </div>
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
              <button className="preview-button" onClick={() => go("/store/demo")}>
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
