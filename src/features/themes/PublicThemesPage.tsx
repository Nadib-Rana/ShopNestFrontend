import React, { useState } from "react"
import { themeDefinitions, themeDefaults, saveStoreThemeConfig } from "../../repositories/themeStore"
import { isUserRegistered } from "../../utils/auth"
import { Status } from "../../components/ui/Status"
import { PublicNav } from "../../components/shared/PublicNav"

export function PublicThemesPage({ go, notify }: { go: (path: string) => void; notify?: (msg: string) => void }) {
  const [filter, setFilter] = useState("all")
  const registered = isUserRegistered()

  const handleUseTheme = (themeId: string) => {
    if (!isUserRegistered()) {
      try {
        localStorage.setItem("shopnest_pending_theme", themeId)
      } catch {
        // ignore
      }
      go("/signup")
      return
    }

    const next = themeDefaults(themeId, "demo")
    saveStoreThemeConfig(next)
    notify?.(`${themeDefinitions.find((t) => t.id === themeId)?.title} applied!`)
    go("/seller/customizer")
  }

  const handlePreview = (slug: string) => {
    try {
      localStorage.setItem("shopnest_preview_return", "/themes")
    } catch {
      // ignore
    }
    go(`/store/${slug}/preview`)
  }

  const categories = [
    { id: "all", label: "All Themes" },
    { id: "fashion", label: "Fashion" },
    { id: "shoes", label: "Shoes" },
    { id: "electronics", label: "Electronics" },
    { id: "beauty", label: "Beauty" },
    { id: "grocery", label: "Grocery" },
    { id: "decor", label: "Home Decor" },
    { id: "furniture", label: "Furniture" },
    { id: "retail", label: "General Retail" },
  ]

  const filteredThemes = filter === "all"
    ? themeDefinitions
    : themeDefinitions.filter((t) => t.id === filter)

  return (
    <div className="welcome-page">
      <PublicNav go={go} active="Themes" />

      {/* Hero Banner */}
      <main style={{ maxWidth: "1180px", margin: "0 auto", padding: "40px 24px 80px", width: "100%", flex: 1 }}>
        <div style={{ textAlign: "center", maxWidth: "680px", margin: "0 auto 40px" }}>
          <Status tone="purple">Theme Store</Status>
          <h1 style={{ font: "700 clamp(32px, 4vw, 48px) var(--font-display)", color: "#101828", margin: "16px 0 12px", lineHeight: 1.15 }}>
            Pick a foundation.<br />Make it uniquely yours.
          </h1>
          <p style={{ color: "#667085", fontSize: "16px", lineHeight: 1.6 }}>
            Browse 8 distinct storefront architectures tailored for Bangladeshi merchants. Experience authentic headers, typography, and merchandising.
          </p>
        </div>

        {/* Filter Chips */}
        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap", marginBottom: "36px" }}>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setFilter(c.id)}
              style={{
                border: filter === c.id ? "1px solid #4b4bc7" : "1px solid #e4e7ec",
                background: filter === c.id ? "#f4f3ff" : "#fff",
                color: filter === c.id ? "#4b4bc7" : "#475467",
                fontWeight: filter === c.id ? 700 : 500,
                fontSize: "12px",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Theme Cards Grid */}
        <div className="theme-gallery-grid">
          {filteredThemes.map((item) => (
            <article className="theme-gallery-card" key={item.id}>
              <div className={`theme-card-visual visual-${item.id}`}>
                <div className="tc-head">
                  <b>{item.name}</b>
                  <span>Shop　Story　Bag</span>
                </div>
                <div className="tc-hero">
                  <small>{item.label}</small>
                  <strong>{item.hero}</strong>
                  <i />
                </div>
                <div className="tc-products">
                  <i /><i /><i />
                </div>
              </div>
              <div className="theme-card-info">
                <div>
                  <span>{item.label}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <div>
                  <button className="secondary" onClick={() => handlePreview(item.slug)}>
                    Preview
                  </button>
                  <button className="primary" onClick={() => handleUseTheme(item.id)}>
                    Use theme
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      {/* Public Footer */}
      <footer style={{ borderTop: "1px solid #eaecf0", padding: "30px 24px", textAlign: "center", color: "#667085", fontSize: "12px" }}>
        <p>© 2025 ShopNest. Multi-tenant e-commerce platform for Bangladesh.</p>
      </footer>
    </div>
  )
}

export default PublicThemesPage
