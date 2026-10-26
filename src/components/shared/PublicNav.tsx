import React from "react"

export function PublicNav({
  go,
  active,
}: {
  go: (path: string) => void
  active?: "Product" | "Themes" | "Pricing" | "Help"
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <header className="public-nav">
      <div className="auth-logo" style={{ cursor: "pointer" }} onClick={() => go("/")}>
        <span className="brand-mark"><span /></span>
        <strong>ShopNest</strong>
      </div>
      <nav className={`public-nav-links ${open ? "mobile-open" : ""}`}>
        <button className={active === "Product" ? "active" : ""} onClick={() => { setOpen(false); go("/store/demo"); }}>Product</button>
        <button className={active === "Themes" ? "active" : ""} onClick={() => { setOpen(false); go("/themes"); }}>Themes</button>
        <button className={active === "Pricing" ? "active" : ""} onClick={() => { setOpen(false); go("/signup"); }}>Pricing</button>
        <button className={active === "Help" ? "active" : ""} onClick={() => { setOpen(false); window.location.href = "mailto:support@shopnest.example"; }}>Help</button>
        <div className="public-mobile-actions">
          <button className="text-button" onClick={() => { setOpen(false); go("/login"); }}>Log in</button>
          <button className="primary" onClick={() => { setOpen(false); go("/signup"); }}>Start free trial</button>
        </div>
      </nav>
      <div className="public-nav-right">
        <button className="text-button public-desktop-only" onClick={() => go("/login")}>Log in</button>
        <button className="primary public-desktop-only" onClick={() => go("/signup")}>Start free trial</button>
        <button
          className="public-mobile-toggle"
          aria-label="Toggle navigation menu"
          onClick={() => setOpen(prev => !prev)}
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  )
}

export default PublicNav
