import React from "react"

export function PublicNav({
  go,
  active,
}: {
  go: (path: string) => void
  active?: "Product" | "Themes" | "Pricing" | "Help"
}) {
  return (
    <header className="public-nav">
      <div className="auth-logo" style={{ cursor: "pointer" }} onClick={() => go("/")}>
        <span className="brand-mark"><span /></span>
        <strong>ShopNest</strong>
      </div>
      <nav>
        <button className={active === "Product" ? "active" : ""} onClick={() => go("/store/demo")}>Product</button>
        <button className={active === "Themes" ? "active" : ""} onClick={() => go("/themes")}>Themes</button>
        <button className={active === "Pricing" ? "active" : ""} onClick={() => go("/signup")}>Pricing</button>
        <button className={active === "Help" ? "active" : ""} onClick={() => { window.location.href = "mailto:support@shopnest.example" }}>Help</button>
      </nav>
      <div>
        <button className="text-button" onClick={() => go("/login")}>Log in</button>
        <button className="primary" onClick={() => go("/signup")}>Start free trial</button>
      </div>
    </header>
  )
}

export default PublicNav
