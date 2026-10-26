import React from "react"
import { Icon } from "../../components/ui/Icon"
import { Status } from "../../components/ui/Status"

export function ShopNestHome({ go }: { go: (path: string) => void }) {
  return (
    <div className="welcome-page">
      <header className="public-nav">
        <div className="auth-logo">
          <span className="brand-mark"><span /></span>
          <strong>ShopNest</strong>
        </div>
        <nav>
          <button onClick={() => go("/store/demo")}>Product</button>
          <button onClick={() => go("/themes")}>Themes</button>
          <button onClick={() => go("/signup")}>Pricing</button>
          <button onClick={() => window.location.href = "mailto:support@shopnest.example"}>Help</button>
        </nav>
        <div>
          <button className="text-button" onClick={() => go("/login")}>Log in</button>
          <button className="primary" onClick={() => go("/signup")}>Start free trial</button>
        </div>
      </header>

      <main className="welcome-main">
        <Status tone="purple">Built for businesses in Bangladesh</Status>
        <h1>Launch your online store.<br />Grow your business.</h1>
        <p>Create a beautiful storefront, manage products, and receive customer orders from one simple platform. Start free for seven days—no developer required.</p>
        <div>
          <button className="primary" onClick={() => go("/signup")}>
            Start your free trial <Icon name="arrow" />
          </button>
          <button className="secondary" onClick={() => go("/store/demo")}>
            View demo store
          </button>
        </div>
        <div className="welcome-proof">
          <span><Icon name="check" />No credit card</span>
          <span><Icon name="check" />7-day free trial</span>
          <span><Icon name="check" />Cancel anytime</span>
        </div>
      </main>
    </div>
  )
}

export default ShopNestHome
