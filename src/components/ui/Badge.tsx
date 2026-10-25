import React from "react"
import type { BadgeProps } from "../../types"

export function Badge({ children, tone = "", className = "" }: BadgeProps) {
  const toneClass = tone || String(children).toLowerCase().replace(/\s+/g, "-")
  return (
    <span className={`mg-badge ${toneClass} ${className}`.trim()}>
      <i />
      {children}
    </span>
  )
}

export default Badge
