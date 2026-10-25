import React from "react"
import { Icon } from "../ui/Icon"

export function NotFound({ go }: { go: (path: string) => void }) {
  return (
    <div className="prototype-shell">
      <div className="auth-logo">
        <span className="brand-mark"><span/></span>
        <strong>ShopNest</strong>
      </div>
      <div className="empty-state card">
        <span className="eyebrow">404 · PAGE NOT FOUND</span>
        <h1>We couldn’t find that page.</h1>
        <p>Check the address or return to a known ShopNest workspace.</p>
        <button className="primary" onClick={() => go("/")}>Return home</button>
      </div>
    </div>
  )
}

export default NotFound
