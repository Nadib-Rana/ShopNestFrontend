import React from "react"
import type { StatusProps } from "../../types"

export function Status({ children, tone = "green" }: StatusProps) {
  return (
    <span className={`status ${tone}`}>
      <span className="status-dot" />
      {children}
    </span>
  )
}

export default Status
