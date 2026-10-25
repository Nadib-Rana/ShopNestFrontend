import React from "react"
import { Icon } from "../../components/ui/Icon"
import { Status } from "../../components/ui/Status"

export function StorefrontPage({
  onAction,
  go,
}: {
  onAction: (m: string) => void
  go: (p: string) => void
}) {
  return (
    <div className="content">
      <div className="section-title">
        <div>
          <h2>Storefront</h2>
          <p>Your live storefront, theme, and publishing controls.</p>
        </div>
        <button
          className="primary"
          onClick={() => {
            localStorage.setItem("shopnest-store-published", new Date().toISOString())
            onAction("Storefront publish state updated locally")
          }}
        >
          <Icon name="check" />Publish changes
        </button>
      </div>

      <section className="storefront-layout">
        <div className="card theme-info">
          <div className="theme-kicker">Current theme</div>
          <h3>Store theme</h3>
          <p>Manage the selected theme and local storefront presentation.</p>
          <div className="theme-meta">
            <span><Status tone="green">Published</Status></span>
            <span>Local prototype state</span>
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
            <span>trendora.shopnest.app</span>
            <button
              aria-label="Copy store URL"
              onClick={() => {
                navigator.clipboard?.writeText("https://trendora.shopnest.app")
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
            <span>trendora.shopnest.app</span>
          </div>
          <div className="shop-preview">
            <div className="shop-nav">
              <strong>TRENDORA</strong>
              <span>New in　 Shop　 Collections　 Our story</span>
              <div>Search　 Bag</div>
            </div>
            <div className="shop-hero">
              <img
                src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=1400&q=85"
                alt="Trendora boutique clothing collection"
              />
              <div>
                <small>THE SUMMER EDIT</small>
                <h3>Ease, in every thread.</h3>
                <p>Considered essentials for sunlit days and slow evenings.</p>
                <button onClick={() => go("/store/demo")}>Explore the collection</button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default StorefrontPage
