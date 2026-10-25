import React from "react"
import { Icon } from "../ui/Icon"

export function ComingSoon({ title }: { title: string }) {
  return (
    <div className="content">
      <div className="empty-state card">
        <div className="metric-icon">
          <Icon name="settings" size={24} />
        </div>
        <h2>{title}</h2>
        <p>This workspace is included in the ShopNest product architecture and ready for the next implementation pass.</p>
        <button className="primary" disabled title="This module is not implemented">
          Not available yet
        </button>
      </div>
    </div>
  )
}

export default ComingSoon
