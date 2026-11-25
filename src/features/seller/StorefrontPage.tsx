import React, { useState } from "react"
import { Icon } from "../../components/ui/Icon"
import { Status } from "../../components/ui/Status"
import { getStoreThemeConfig, saveStoreThemeConfig, themeDefinitions } from "../../repositories/themeStore"
import { getStoreSettings } from "../../repositories/settingsStore"
import { canCallProtectedApi } from "../../services/backendSync"
import { shopnestApi } from "../../services/shopnestApi"
import { getActiveStoreSlug } from "../../services/apiClient"

export function StorefrontPage({
  onAction,
  go,
}: {
  onAction: (m: string) => void
  go: (p: string) => void
}) {
  const activeSlug = getActiveStoreSlug()
  const [config, setConfig] = useState(() => getStoreThemeConfig(activeSlug))
  const settings = getStoreSettings()
  const activeTheme = themeDefinitions.find((t) => t.id === config.themeId) || themeDefinitions[0]
  const storeSlug = activeSlug === "demo" ? "trendora" : activeSlug

  const handlePublish = () => {
    const next = { ...config, storeSlug: activeSlug, status: "Published" as const }
    saveStoreThemeConfig(next)
    if (activeSlug !== "demo") {
      saveStoreThemeConfig({ ...next, storeSlug: "demo" })
    }
    setConfig(next)
    if (canCallProtectedApi()) {
      void shopnestApi.themes
        .publish()
        .then(() => onAction(`${activeTheme.title} published to your storefront`))
        .catch((err) =>
          onAction(err instanceof Error ? err.message : "Failed to publish theme to server."),
        )
      return
    }
    onAction(`${activeTheme.title} published to your storefront`)
  }

  return (
    <div className="content">
      <div className="section-title">
        <div>
          <h2>Storefront</h2>
          <p>Your live storefront, theme, and publishing controls.</p>
        </div>
        <button className="primary" onClick={handlePublish}>
          <Icon name="check" />Publish changes
        </button>
      </div>

      <section className="storefront-layout">
        <div className="card theme-info">
          <div className="theme-kicker">Current theme</div>
          <h3>{activeTheme.title}</h3>
          <p>{activeTheme.description}</p>
          <div className="theme-meta">
            <span>
              <Status tone={settings.maintenanceMode ? "amber" : config.status === "Published" ? "green" : "gray"}>
                {settings.maintenanceMode ? "Maintenance" : config.status}
              </Status>
            </span>
            <span>{activeTheme.label}</span>
          </div>
          <button className="primary wide" onClick={() => go("/seller/customizer")}>
            <Icon name="palette" />Customize theme
          </button>
          <button className="secondary wide" onClick={() => go("/seller/themes")}>
            Browse themes
          </button>
          <hr />
          <h4>Store address</h4>
          <div className="domain">
            <span>{storeSlug}.shopnest.app</span>
            <button
              aria-label="Copy store URL"
              onClick={() => {
                navigator.clipboard?.writeText(`https://${storeSlug}.shopnest.app`)
                onAction("Store URL copied")
              }}
            >
              <Icon name="copy" />
            </button>
          </div>
        </div>

        <div className="browser card">
          <div className="browser-bar">
            <i /><i /><i />
            <span>{storeSlug}.shopnest.app</span>
          </div>
          <div className="shop-preview">
            <div className="shop-nav">
              <strong>{config.logo || settings.storeName.toUpperCase()}</strong>
              <span>{activeTheme.categories.join("　 ")}</span>
              <div>Search　 Bag</div>
            </div>
            <div className="shop-hero">
              <img
                src={activeTheme.heroImage}
                alt={`${settings.storeName} storefront preview`}
              />
              <div>
                <small>{activeTheme.label.toUpperCase()}</small>
                <h3>{config.heroTitle || activeTheme.hero}</h3>
                <p>{config.heroText || activeTheme.accent}</p>
                <button onClick={() => go(`/store/${activeSlug}`)}>Explore the collection</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StorefrontPage
